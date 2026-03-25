export const API_BASE = 'http://5.38.138.40:5000';

// How many seconds before expiry we proactively refresh (60 s buffer)
const REFRESH_BUFFER_SEC = 60;

// Refresh token cookie lifetime in days
const REFRESH_COOKIE_DAYS = 30;

// ─── Cookie helpers ────────────────────────────────────────────────────────────

function setCookie(name, value, expiresISO, days) {
  let expires = '';
  if (expiresISO) {
    expires = `; expires=${new Date(expiresISO).toUTCString()}`;
  } else if (days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    expires = `; expires=${d.toUTCString()}`;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Strict`;
}

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
}

// ─── Session helpers ───────────────────────────────────────────────────────────
// rememberMe = true  → persistent cookies (survive browser restart)
// rememberMe = false → sessionStorage (guaranteed cleared on browser close,
//                      unlike session cookies which Chrome often restores)

const SESSION_KEYS = ['bw_token', 'bw_refreshToken', 'bw_expiresAt', 'bw_user'];

function saveSession(data, rememberMe = true) {
  // Always clear the other storage first to avoid stale data
  if (rememberMe) {
    SESSION_KEYS.forEach(k => sessionStorage.removeItem(k));
    setCookie('bw_token',        data.token,                    data.expiresAt);
    setCookie('bw_refreshToken', data.refreshToken,             null, REFRESH_COOKIE_DAYS);
    setCookie('bw_expiresAt',    data.expiresAt,                null, REFRESH_COOKIE_DAYS);
    setCookie('bw_user',         JSON.stringify(data.user),     null, REFRESH_COOKIE_DAYS);
    setCookie('bw_remember',     '1',                           null, REFRESH_COOKIE_DAYS);
  } else {
    SESSION_KEYS.forEach(deleteCookie);
    deleteCookie('bw_remember');
    sessionStorage.setItem('bw_token',        data.token);
    sessionStorage.setItem('bw_refreshToken', data.refreshToken);
    sessionStorage.setItem('bw_expiresAt',    data.expiresAt);
    sessionStorage.setItem('bw_user',         JSON.stringify(data.user));
  }
}

function clearSession() {
  SESSION_KEYS.forEach(k => sessionStorage.removeItem(k));
  SESSION_KEYS.forEach(deleteCookie);
  deleteCookie('bw_remember');
}

// Getters: sessionStorage takes precedence (set when rememberMe=false);
// fall back to cookie (set when rememberMe=true).
function _get(key) {
  return sessionStorage.getItem(key) ?? getCookie(key);
}

export function getToken()        { return _get('bw_token'); }
export function getRefreshToken() { return _get('bw_refreshToken'); }
export function getExpiresAt()    { return _get('bw_expiresAt'); }
export function getUser() {
  const raw = _get('bw_user');
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

/** True when a valid session exists in either storage */
export function isLoggedIn() { return !!getToken() || !!getRefreshToken(); }

/** True when the access token is expired or will expire within REFRESH_BUFFER_SEC */
function isTokenExpired() {
  const expiresAt = getExpiresAt();
  if (!expiresAt) return true;
  return Date.now() >= new Date(expiresAt).getTime() - REFRESH_BUFFER_SEC * 1000;
}

// ─── Token refresh ─────────────────────────────────────────────────────────────

export async function refreshSession() {
  const refreshToken = getRefreshToken();
  const expiresAt    = getExpiresAt();
  if (!refreshToken) throw new Error('No refresh token');

  const res  = await fetch(`${API_BASE}/api/Auth/refresh`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ refreshToken, expiresAt }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Token refresh failed');

  // Preserve the original remember-me choice:
  // bw_remember cookie is only set when rememberMe=true
  const rememberMe = !!getCookie('bw_remember');
  saveSession(data, rememberMe);
  return data;
}

/**
 * Ensures a valid, non-expired access token is available.
 * If the token is expired (or about to expire) and a refresh token exists,
 * attempts a silent refresh. Redirects to /login if refresh fails.
 */
export async function ensureValidToken() {
  if (!isTokenExpired()) return;              // token is fine

  if (!getRefreshToken()) {
    clearSession();
    window.router?.navigate('/login');
    throw new Error('Not authenticated');
  }

  try {
    await refreshSession();
  } catch {
    clearSession();
    window.router?.navigate('/login');
    throw new Error('Session expired. Please log in again.');
  }
}

// ─── Auth endpoints ────────────────────────────────────────────────────────────

export async function register(username, email, password) {
  const res  = await fetch(`${API_BASE}/api/user`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Registration failed');

  return data;
}

export async function login(username, password, rememberMe = false) {
  const res  = await fetch(`${API_BASE}/api/user/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Login failed');

  saveSession(data, rememberMe);
  return data;
}

export async function logout() {
  try {
    const token = getToken();
    await fetch(`${API_BASE}/api/user/logout`, {
      method:  'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  } finally {
    clearSession();
    window.router?.navigate('/login');
  }
}

// ─── Authenticated fetch wrapper ───────────────────────────────────────────────
// Proactively refreshes the token if it is about to expire, then attaches it.
// Falls back to a single retry on an unexpected 401.

export async function authFetch(url, options = {}) {
  const skipAutoLogout = options.skipAutoLogout;
  
  // Proactive refresh before the request
  try {
    await ensureValidToken();
  } catch (err) {
    if (skipAutoLogout) {
      // Don't auto-logout for certain critical requests like account deletion
      // Re-throw the error so the caller can handle it
      throw err;
    }
    throw err;
  }

  const makeHeaders = () => ({
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${getToken()}`,
  });

  let res = await fetch(url, { ...options, headers: makeHeaders() });

  if (res.status === 401) {
    // Server still rejected — try one more refresh then retry
    try {
      await refreshSession();
      res = await fetch(url, { ...options, headers: makeHeaders() });
    } catch {
      if (!skipAutoLogout) {
        clearSession();
        window.router?.navigate('/login');
      }
      throw new Error('Session expired. Please log in again.');
    }
  }

  return res;
}
