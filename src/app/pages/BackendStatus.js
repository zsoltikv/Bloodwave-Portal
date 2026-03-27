import '../../styles/pages/BackendStatus.css';
import '../../styles/pages/Main.css';
import { ensureGlobalStarfield } from '../effects/global-starfield.js';
import { fetchBackendStatus } from '../services/backend-status.js';

const AUTO_REFRESH_MS = 60_000;

export default function BackendStatus(container) {
  let backendStatusSnapshot = null;
  let backendStatusLoading = false;
  let backendStatusError = '';
  let backendStatusRequestId = 0;
  let backendStatusTimerId = 0;
  let backendStatusCountdownId = 0;
  let backendStatusNextRefreshAt = 0;

  container.innerHTML = `
    <div class="bw-root bw-bs-root">
      <div class="bw-glow-center"></div>

      <div class="bw-card bw-bs-card">
        <div class="bw-card-inner bw-bs-card-inner">
          <div class="bw-corner bw-corner--tl"></div>
          <div class="bw-corner bw-corner--tr"></div>
          <div class="bw-corner bw-corner--bl"></div>
          <div class="bw-corner bw-corner--br"></div>

          <div class="bw-header bw-bs-header">
            <div class="bw-ornament">
              <div class="bw-ornament-line"></div>
              <div class="bw-ornament-diamond"></div>
              <div class="bw-ornament-line"></div>
            </div>
            <h1 class="bw-title">Backend Status</h1>
            <p class="bw-subtitle">Live API Monitor</p>
          </div>

          <section class="mn-server-status bw-bs-monitor" id="bw-bs-monitor" aria-live="polite"></section>

          <div class="bw-bs-footer-link">
            <a href="/main" data-link class="bw-btn bw-bs-back-btn">
              <div class="bw-btn-shimmer"></div>
              <span class="bw-btn-text">Back to Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  ensureGlobalStarfield();

  const monitorSection = container.querySelector('#bw-bs-monitor');
  renderBackendStatusPanel();

  monitorSection?.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const refreshButton = event.target.closest('#mn-server-refresh');
    if (!refreshButton || backendStatusLoading) return;

    void loadBackendStatus();
  });

  void loadBackendStatus();

  function isActive() {
    return document.body.contains(container);
  }

  function renderBackendStatusPanel() {
    if (!monitorSection) return;

    if (!backendStatusSnapshot) {
      monitorSection.innerHTML = `
        <section class="mn-server-card mn-server-card--loading" aria-busy="true">
          <div class="mn-server-head">
            <div class="mn-server-copy-block">
              <p class="mn-server-kicker">Backend Server</p>
              <h2 class="mn-server-title">Live API Monitor</h2>
            </div>
            <button type="button" class="mn-server-refresh" id="mn-server-refresh" disabled>Checking...</button>
          </div>

          <div class="mn-server-visuals">
            <div class="mn-server-gauge-shell">
              ${renderServerGauge('Checking', 24, 'loading')}
            </div>
            <div class="mn-server-bars">
              ${renderServerBar('Ping', '--', 22, 'loading')}
              ${renderServerBar('Session', '--', 18, 'loading')}
              ${renderServerBar('Latency', '--', 14, 'loading')}
            </div>
          </div>

          <div class="mn-server-chip-row">
            ${renderServerChip('Server', '--')}
            ${renderServerChip('UTC', '--')}
            ${renderServerChip('Base', 'api.bloodwave.site')}
            ${renderServerChip('Checked', '--')}
          </div>
        </section>
      `;
      return;
    }

    const overallMeter = getOverallHealthMeter(backendStatusSnapshot);
    const pingMeter = getStatusMeter(backendStatusSnapshot.pingCheck?.statusLabel);
    const sessionMeter = getStatusMeter(backendStatusSnapshot.sessionCheck?.statusLabel);
    const latencyMeter = getLatencyMeter(backendStatusSnapshot.responseTimeMs);
    const toneClass = `mn-server-card--${backendStatusSnapshot.tone || 'warn'}`;
    const refreshLabel = backendStatusLoading ? 'Checking...' : 'Refresh';
    const liveMessage = backendStatusError
      ? backendStatusError
      : backendStatusLoading
        ? 'Refreshing live feed'
        : 'Auto refresh 60s';

    monitorSection.innerHTML = `
      <section class="mn-server-card ${toneClass}" aria-busy="${String(backendStatusLoading)}">
        <div class="mn-server-head">
          <div class="mn-server-copy-block">
            <p class="mn-server-kicker">Backend Server</p>
            <div class="mn-server-title-row">
              <h2 class="mn-server-title">Live API Monitor</h2>
              <span class="mn-server-badge mn-server-badge--${backendStatusSnapshot.tone || 'warn'}">
                <span class="mn-server-badge-dot" aria-hidden="true"></span>
                ${escapeHtml(backendStatusSnapshot.label || 'Unknown')}
              </span>
            </div>
          </div>
          <button type="button" class="mn-server-refresh" id="mn-server-refresh" ${backendStatusLoading ? 'disabled' : ''}>${refreshLabel}</button>
        </div>

        <div class="mn-server-visuals">
          <div class="mn-server-gauge-shell">
            ${renderServerGauge(backendStatusSnapshot.label || 'Unknown', overallMeter.score, overallMeter.tone)}
          </div>
          <div class="mn-server-bars">
            ${renderServerBar('Ping', backendStatusSnapshot.pingCheck?.statusLabel || 'Unknown', pingMeter.score, pingMeter.tone)}
            ${renderServerBar('Session', backendStatusSnapshot.sessionCheck?.statusLabel || 'Unknown', sessionMeter.score, sessionMeter.tone)}
            ${renderServerBar('Latency', formatResponseTime(backendStatusSnapshot.responseTimeMs), latencyMeter.score, latencyMeter.tone)}
          </div>
        </div>

        <div class="mn-server-chip-row">
          ${renderServerChip('Server', backendStatusSnapshot.serverName || 'Unavailable')}
          ${renderServerChip('UTC', formatBackendUtcClock(backendStatusSnapshot.serverUtc))}
          ${renderServerChip('Base', backendStatusSnapshot.apiHost || 'Unavailable')}
          ${renderServerChip('Checked', formatBackendLocalClock(backendStatusSnapshot.lastCheckedAt))}
        </div>

        <div class="mn-server-legend">
          <span class="mn-server-legend-item">${escapeHtml(backendStatusSnapshot.httpSummary || 'No HTTP details available.')}</span>
          <span class="mn-server-legend-item">${escapeHtml(liveMessage)}</span>
          <span class="mn-server-legend-item mn-server-legend-item--countdown" id="mn-server-countdown">${escapeHtml(formatRefreshCountdown(backendStatusNextRefreshAt))}</span>
        </div>
      </section>
    `;
  }

  function scheduleBackendStatusRefresh() {
    window.clearTimeout(backendStatusTimerId);
    stopBackendStatusCountdown();
    if (!isActive()) return;

    backendStatusNextRefreshAt = Date.now() + AUTO_REFRESH_MS;
    startBackendStatusCountdown();
    backendStatusTimerId = window.setTimeout(() => {
      void loadBackendStatus();
    }, AUTO_REFRESH_MS);
  }

  async function loadBackendStatus() {
    if (!monitorSection || !isActive()) return;

    window.clearTimeout(backendStatusTimerId);
    stopBackendStatusCountdown();
    backendStatusLoading = true;
    backendStatusError = '';
    renderBackendStatusPanel();

    const requestId = ++backendStatusRequestId;

    try {
      const snapshot = await fetchBackendStatus();
      if (requestId !== backendStatusRequestId || !isActive()) return;

      backendStatusSnapshot = snapshot;
    } catch {
      if (requestId !== backendStatusRequestId || !isActive()) return;

      backendStatusError = 'Refresh failed';
    } finally {
      if (requestId !== backendStatusRequestId || !isActive()) return;

      backendStatusLoading = false;
      renderBackendStatusPanel();
      scheduleBackendStatusRefresh();
    }
  }

  function startBackendStatusCountdown() {
    syncBackendStatusCountdown();
    backendStatusCountdownId = window.setInterval(() => {
      syncBackendStatusCountdown();
    }, 1000);
  }

  function stopBackendStatusCountdown() {
    backendStatusNextRefreshAt = 0;
    window.clearInterval(backendStatusCountdownId);
    backendStatusCountdownId = 0;
    syncBackendStatusCountdown();
  }

  function syncBackendStatusCountdown() {
    const countdownEl = container.querySelector('#mn-server-countdown');
    if (!countdownEl) return;

    countdownEl.textContent = formatRefreshCountdown(backendStatusNextRefreshAt);
  }
}

function renderServerGauge(label, score, tone) {
  const normalizedScore = clampMeter(score);

  return `
    <div class="mn-server-gauge mn-server-gauge--${escapeHtml(tone)}" style="--mn-server-progress:${normalizedScore};">
      <div class="mn-server-gauge-core">
        <span class="mn-server-gauge-value">${normalizedScore}%</span>
        <span class="mn-server-gauge-label">${escapeHtml(label)}</span>
      </div>
    </div>
  `;
}

function renderServerBar(label, value, score, tone) {
  const normalizedScore = clampMeter(score);

  return `
    <article class="mn-server-bar mn-server-bar--${escapeHtml(tone)}">
      <div class="mn-server-bar-head">
        <span class="mn-server-bar-label">${escapeHtml(label)}</span>
        <span class="mn-server-bar-value">${escapeHtml(value)}</span>
      </div>
      <div class="mn-server-bar-track">
        <span class="mn-server-bar-fill" style="width:${normalizedScore}%"></span>
      </div>
    </article>
  `;
}

function renderServerChip(label, value) {
  return `
    <div class="mn-server-chip">
      <span class="mn-server-chip-label">${escapeHtml(label)}</span>
      <strong class="mn-server-chip-value">${escapeHtml(value)}</strong>
    </div>
  `;
}

function formatResponseTime(value) {
  const latency = Number(value);
  if (!Number.isFinite(latency) || latency <= 0) return '--';
  return `${Math.round(latency)} ms`;
}

function formatBackendLocalClock(isoDateString) {
  const parsedDate = parseBackendDate(isoDateString);
  if (Number.isNaN(parsedDate.getTime())) return '-';

  return new Intl.DateTimeFormat('hu-HU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Budapest',
  }).format(parsedDate);
}

function formatBackendUtcClock(isoDateString) {
  const parsedDate = parseBackendDate(isoDateString);
  if (Number.isNaN(parsedDate.getTime())) return '--';

  return `${new Intl.DateTimeFormat('hu-HU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
  }).format(parsedDate)} UTC`;
}

function formatRefreshCountdown(nextRefreshAt) {
  const targetTime = Number(nextRefreshAt);
  if (!Number.isFinite(targetTime) || targetTime <= 0) return 'Refresh --s';
  const secondsRemaining = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
  return `Refresh ${secondsRemaining}s`;
}

function getOverallHealthMeter(snapshot) {
  const tone = snapshot?.tone || 'warn';
  if (tone === 'ok') return { score: 100, tone: 'ok' };
  if (tone === 'down') return { score: 18, tone: 'down' };
  return { score: 62, tone: 'warn' };
}

function getStatusMeter(statusLabel) {
  const label = String(statusLabel || '').toLowerCase();
  if (!label) return { score: 12, tone: 'loading' };
  if (label.includes('healthy')) return { score: 100, tone: 'ok' };
  if (label.includes('auth issue') || label.includes('reachable')) return { score: 64, tone: 'warn' };
  if (label.includes('unexpected payload') || label.includes('unexpected')) return { score: 48, tone: 'warn' };
  if (label.includes('server error')) return { score: 24, tone: 'down' };
  if (label.includes('unreachable')) return { score: 10, tone: 'down' };
  return { score: 40, tone: 'warn' };
}

function getLatencyMeter(value) {
  const latency = Number(value);
  if (!Number.isFinite(latency) || latency <= 0) return { score: 10, tone: 'down' };
  if (latency <= 80) return { score: 100, tone: 'ok' };
  if (latency <= 160) return { score: 82, tone: 'ok' };
  if (latency <= 280) return { score: 62, tone: 'warn' };
  if (latency <= 500) return { score: 42, tone: 'warn' };
  return { score: 22, tone: 'down' };
}

function clampMeter(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function parseBackendDate(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw);
  const normalized = raw && !hasTimezone ? `${raw}Z` : raw;
  return new Date(normalized);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
