import { API_BASE, getToken } from './auth.js';

const PING_CHECK_URL = `${API_BASE}/api/Test/ping`;
const SESSION_CHECK_URL = `${API_BASE}/api/User/me`;
const REQUEST_TIMEOUT_MS = 8000;

export async function fetchBackendStatus() {
  const [pingCheck, sessionCheck] = await Promise.all([
    probeEndpoint(PING_CHECK_URL, {
      headers: {
        Accept: 'application/json',
      },
    }),
    probeEndpoint(SESSION_CHECK_URL, {
      headers: buildSessionHeaders(),
    }),
  ]);

  const publicHealthy = isPingEndpointHealthy(pingCheck);
  const sessionHealthy = isSessionEndpointHealthy(sessionCheck);
  const anyReachable = didEndpointRespond(pingCheck) || didEndpointRespond(sessionCheck);

  let tone = 'warn';
  let label = 'Degraded';
  let summary = 'Some backend checks responded, but the server is not fully healthy.';

  if (!anyReachable) {
    tone = 'down';
    label = 'Down';
    summary = 'The dashboard could not reach the backend server. It may be offline or blocked by the network.';
  } else if (publicHealthy && sessionHealthy) {
    tone = 'ok';
    label = 'Operational';
    summary = 'The API and authenticated session endpoint are responding normally.';
  } else if (publicHealthy) {
    summary = 'The API is reachable, but the authenticated session check is failing.';
  } else if (sessionHealthy) {
    summary = 'Authentication is responding, but the general API probe reported an issue.';
  }

  return {
    apiBase: API_BASE,
    apiHost: safeGetHost(API_BASE),
    tone,
    label,
    summary,
    lastCheckedAt: new Date().toISOString(),
    responseTimeMs: getFastestReachableResponseTime(pingCheck, sessionCheck),
    httpSummary: buildHttpSummary(pingCheck, sessionCheck),
    pingCheck: formatPingCheck(pingCheck),
    sessionCheck: formatSessionCheck(sessionCheck),
    serverName: normalizeServerName(pingCheck.payload),
    serverUtc: normalizeServerUtc(pingCheck.payload),
  };
}

function buildSessionHeaders() {
  const token = getToken();

  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function probeEndpoint(url, options = {}) {
  const controller = new AbortController();
  const startedAt = Date.now();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      ...options,
      signal: controller.signal,
    });

    return {
      url,
      reachable: true,
      ok: response.ok,
      statusCode: response.status,
      statusText: response.statusText || '',
      responseTimeMs: Math.max(1, Date.now() - startedAt),
      ...await readResponsePayload(response),
    };
  } catch (error) {
    return {
      url,
      reachable: false,
      ok: false,
      statusCode: null,
      statusText: '',
      responseTimeMs: null,
      detail: '',
      errorCode: normalizeNetworkError(error),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function readResponsePayload(response) {
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  const raw = (await response.text()).trim();
  if (!raw) {
    return {
      payload: null,
      detail: '',
    };
  }

  if (contentType.includes('application/json')) {
    try {
      const parsed = JSON.parse(raw);
      return {
        payload: parsed,
        detail: normalizePayloadDetail(parsed),
      };
    } catch {
      // Fall back to plain text normalization below.
    }
  }

  return {
    payload: raw,
    detail: normalizeTextDetail(raw),
  };
}

function normalizePayloadDetail(payload) {
  if (typeof payload === 'string') {
    return normalizeTextDetail(payload);
  }

  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const candidates = [
    payload.status,
    payload.message,
    payload.title,
    payload.detail,
    payload.error,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return normalizeTextDetail(candidate);
    }
  }

  return '';
}

function normalizeTextDetail(value) {
  return String(value).replace(/\s+/g, ' ').trim().slice(0, 140);
}

function normalizeNetworkError(error) {
  if (error?.name === 'AbortError') {
    return 'timeout';
  }

  return 'network';
}

function didEndpointRespond(check) {
  return !!check?.reachable && Number.isInteger(check?.statusCode);
}

function isPingEndpointHealthy(check) {
  return didEndpointRespond(check) && check.ok && readPayloadOk(check.payload) !== false;
}

function isSessionEndpointHealthy(check) {
  return !!check?.ok;
}

function formatPingCheck(check) {
  return {
    statusLabel: buildPingStatusLabel(check),
    detail: buildPingDetail(check),
  };
}

function formatSessionCheck(check) {
  return {
    statusLabel: buildSessionStatusLabel(check),
    detail: buildSessionDetail(check),
  };
}

function buildPingStatusLabel(check) {
  if (!didEndpointRespond(check)) {
    return 'Unreachable';
  }

  if (check.statusCode >= 500) {
    return `Server Error (${check.statusCode})`;
  }

  if (check.ok && readPayloadOk(check.payload) !== false) {
    return `Healthy (${check.statusCode})`;
  }

  if (check.ok) {
    return `Unexpected Payload (${check.statusCode})`;
  }

  return `Reachable (${check.statusCode})`;
}

function buildSessionStatusLabel(check) {
  if (!didEndpointRespond(check)) {
    return 'Unreachable';
  }

  if (check.ok) {
    return `Healthy (${check.statusCode})`;
  }

  if (check.statusCode === 401 || check.statusCode === 403) {
    return `Auth Issue (${check.statusCode})`;
  }

  if (check.statusCode >= 500) {
    return `Server Error (${check.statusCode})`;
  }

  return `Unexpected (${check.statusCode})`;
}

function buildPingDetail(check) {
  if (!didEndpointRespond(check)) {
    return check?.errorCode === 'timeout'
      ? 'The API did not answer before the timeout window.'
      : 'The browser could not reach this backend route.';
  }

  if (check.statusCode >= 500) {
    return appendDetail(`The server returned HTTP ${check.statusCode}.`, check.detail);
  }

  if (check.ok && readPayloadOk(check.payload) !== false) {
    return appendDetail('The ping route responded normally.', check.detail);
  }

  if (check.ok) {
    return appendDetail('The ping route responded, but the payload did not confirm an OK state.', check.detail);
  }

  return appendDetail(`The route responded with HTTP ${check.statusCode}.`, check.detail);
}

function buildSessionDetail(check) {
  if (!didEndpointRespond(check)) {
    return check?.errorCode === 'timeout'
      ? 'The authenticated route timed out before it could respond.'
      : 'The browser could not reach the authenticated session route.';
  }

  if (check.ok) {
    return 'The authenticated session probe responded normally.';
  }

  if (check.statusCode === 401 || check.statusCode === 403) {
    return 'The backend is online, but the current login session was rejected.';
  }

  if (check.statusCode >= 500) {
    return appendDetail(`The authenticated route returned HTTP ${check.statusCode}.`, check.detail);
  }

  return appendDetail(`The authenticated route responded with HTTP ${check.statusCode}.`, check.detail);
}

function appendDetail(prefix, detail) {
  if (!detail) return prefix;
  return `${prefix} ${detail}`;
}

function getFastestReachableResponseTime(...checks) {
  const latencies = checks
    .filter(didEndpointRespond)
    .map((check) => Number(check.responseTimeMs))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!latencies.length) return null;
  return Math.min(...latencies);
}

function buildHttpSummary(pingCheck, sessionCheck) {
  return `Ping ${formatHttpStatus(pingCheck)} | Session ${formatHttpStatus(sessionCheck)}`;
}

function formatHttpStatus(check) {
  if (didEndpointRespond(check)) {
    return String(check.statusCode);
  }

  if (check?.errorCode === 'timeout') {
    return 'timeout';
  }

  return 'unreachable';
}

function safeGetHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function readPayloadOk(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  return typeof payload.ok === 'boolean' ? payload.ok : null;
}

function normalizeServerName(payload) {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  return typeof payload.server === 'string' ? payload.server.trim() : '';
}

function normalizeServerUtc(payload) {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  return typeof payload.utc === 'string' ? payload.utc.trim() : '';
}
