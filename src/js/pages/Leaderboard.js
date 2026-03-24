import '../../css/pages/Leaderboard.css';
import { API_BASE, getUser, logout, authFetch } from '../auth.js';
import { confirmLogout } from '../logout-confirm.js';
import { ensureGlobalStarfield } from '../global-starfield.js';

export default function Leaderboard(container) {
  container.innerHTML = `
    

    <div class="lb-root">
      <div class="lb-glow"></div>

      <!-- ===== NAVBAR ===== -->
      <nav class="lb-nav">
        <div class="lb-nav-inner">

          <!-- Logo -->
          <a href="/" data-link class="lb-logo">Bloodwave</a>

          <!-- Desktop Center Links -->
          <div class="lb-links">
            <a href="/main" data-link class="lb-link"><span>Matches</span></a>
            <a href="/stats" data-link class="lb-link"><span>Stats</span></a>
            <a href="/leaderboard" data-link class="lb-link active"><span>Leaderboard</span></a>
            <a href="/achievements" data-link class="lb-link"><span>Achievements</span></a>
          </div>

          <!-- Right: avatar + hamburger -->
          <div class="lb-right">

            <!-- Profile Avatar + dropdown (desktop) -->
            <div class="lb-avatar-wrap">
              <button class="lb-avatar" id="lb-avatar-btn" aria-label="Profile menu" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
              <div class="lb-avatar-dropdown" id="lb-avatar-dropdown" role="menu">
                <div class="lb-dd-header">
                  <div class="lb-dd-username" id="lb-dd-username">—</div>
                  <div class="lb-dd-role">Member</div>
                </div>
                <a href="/user-panel" data-link class="lb-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />
                  </svg>
                  Profile
                </a>
                <a href="/android-download" data-link class="lb-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />
                  </svg>
                  Installation
                </a>
                <div class="lb-dd-divider"></div>
                <button class="lb-dd-item logout" id="lb-dd-logout" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <!-- Hamburger (mobile) -->
            <button class="lb-hamburger" id="lb-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="lb-bar"></span>
              <span class="lb-bar"></span>
              <span class="lb-bar"></span>
            </button>
          </div>

        </div>

        <!-- Mobile Dropdown -->
        <div class="lb-mobile-menu" id="lb-mobile-menu">
          <div class="lb-mobile-menu-inner">
            <a href="/main" data-link class="lb-mobile-link">Matches</a>
            <a href="/stats" data-link class="lb-mobile-link">Stats</a>
            <a href="/leaderboard" data-link class="lb-mobile-link">Leaderboard</a>
            <a href="/achievements" data-link class="lb-mobile-link">Achievements</a>
            <div class="lb-mobile-divider"></div>
            <div class="lb-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="lb-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="lb-mobile-username">—</span>
            </div>
            <div class="lb-mobile-divider"></div>
            <a href="/user-panel" data-link class="lb-mobile-link">Profile</a>
            <a href="/android-download" data-link class="lb-mobile-link">Installation</a>
            <button class="lb-mobile-logout" id="lb-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- ===== CONTENT ===== -->
      <main class="lb-content">
        <div class="lb-inner">

          <!-- Header -->
          <div class="lb-header">
            <div class="lb-ornament">
              <div class="lb-ornament-line"></div>
              <div class="lb-ornament-diamond"></div>
              <div class="lb-ornament-line"></div>
            </div>
            <h1 class="lb-title">Global Leaderboard</h1>
            <p class="lb-subtitle">Worldwide&nbsp;&nbsp;rankings</p>
          </div>

          <!-- Leaderboard Grid -->
          <div class="lb-grid" id="lb-grid">
            <div class="lb-loading">Loading leaderboard...</div>
          </div>

        </div>
      </main>
    </div>
  `;

  // ========== CANVAS ANIMATION ==========
  function initLbCanvas() {
    const canvas = document.getElementById('lb-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    let stars = [];

    function measure() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < 85; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.3 + 0.3,
          opacity: Math.random() * 0.6 + 0.2,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
        });
      }
    }

    function anim() {
      // Full clear each frame so stars remain points without motion trails.
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgb(8,6,6)';
      ctx.fillRect(0, 0, W, H);

      stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = W;
        if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H;
        if (s.y > H) s.y = 0;

        const glowRadius = s.r * 6;
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
        glow.addColorStop(0, `rgba(212,175,55,${Math.min(1, s.opacity * 0.75)})`);
        glow.addColorStop(0.35, `rgba(212,175,55,${s.opacity * 0.35})`);
        glow.addColorStop(1, 'rgba(212,175,55,0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,230,150,${Math.min(1, s.opacity + 0.2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(anim);
    }

    measure();
    initStars();
    anim();

    window.addEventListener('resize', () => {
      measure();
      initStars();
    });
  }

  // ========== NAVBAR SETUP ==========
  const user = getUser();
  document.getElementById('lb-dd-username').textContent = user?.username || '—';
  document.getElementById('lb-mobile-username').textContent = user?.username || '—';
  refreshNavbarUsername();

  async function refreshNavbarUsername() {
    try {
      const res = await authFetch(`${API_BASE}/api/User/me`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) return;

      const userData = await res.json();
      const liveDisplayName = userData?.username ?? userData?.email ?? user?.username ?? '—';

      const ddUsernameEl = document.getElementById('lb-dd-username');
      const mobileUsernameEl = document.getElementById('lb-mobile-username');
      if (ddUsernameEl) ddUsernameEl.textContent = liveDisplayName;
      if (mobileUsernameEl) mobileUsernameEl.textContent = liveDisplayName;
    } catch {
      // Keep cached display name on fetch failure.
    }
  }

  const hamburger = document.getElementById('lb-hamburger');
  const mobileMenu = document.getElementById('lb-mobile-menu');
  let mobileMenuOpen = false;

  hamburger?.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;
    hamburger.classList.toggle('open', mobileMenuOpen);
    hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));
    mobileMenu.style.maxHeight = mobileMenuOpen ? mobileMenu.scrollHeight + 'px' : '0';
  });

  mobileMenu?.querySelectorAll('.lb-mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenuOpen = false;
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      mobileMenu.style.maxHeight = '0';
    });
  });

  // Avatar dropdown
  const avatarBtn = document.getElementById('lb-avatar-btn');
  const avatarDropdown = document.getElementById('lb-avatar-dropdown');
  avatarBtn?.addEventListener('click', () => {
    avatarDropdown.classList.toggle('open');
    avatarBtn.setAttribute('aria-expanded', String(avatarDropdown.classList.contains('open')));
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lb-avatar-wrap')) {
      avatarDropdown?.classList.remove('open');
      avatarBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  const doLogout = async () => {
    const confirmed = await confirmLogout();
    if (!confirmed) return;

    await logout();
    if (window.router?.navigate) {
      window.router.navigate('/login');
      return;
    }
    window.location.href = '/login';
  };

  document.getElementById('lb-dd-logout')?.addEventListener('click', doLogout);
  document.getElementById('lb-mobile-logout')?.addEventListener('click', doLogout);

  // ========== FETCH LEADERBOARD DATA ==========
  async function loadLeaderboard() {
    try {
      const currentUserContext = await resolveCurrentUserContext(user);

      const response = await authFetch(`${API_BASE}/api/Match`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const matches = await response.json();

      const grid = document.getElementById('lb-grid');
      grid.innerHTML = '';

      const leaderboardRows = buildLeaderboardRows(matches, currentUserContext);

      if (!leaderboardRows.length) {
        grid.innerHTML = '<div class="lb-empty">No players yet</div>';
        return;
      }

      // Maps for post-fetch username hydration and YOU fallback matching.
      const userIdToUsernameEl = new Map();
      const userIdToCardEl = new Map();
      const userIdToYouBadgeEl = new Map();

      leaderboardRows.forEach((entry, index) => {
        const card = document.createElement('div');
        card.className = 'lb-card';
        if (index < 3) card.classList.add(`lb-rank-${index + 1}`);
        if (entry.isCurrentUser) card.classList.add('lb-card-you');

        const medal = index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

        card.innerHTML = `
          <div class="lb-card-corner lb-card-corner--tl"></div>
          <div class="lb-card-corner lb-card-corner--tr"></div>
          <div class="lb-card-corner lb-card-corner--bl"></div>
          <div class="lb-card-corner lb-card-corner--br"></div>
          <div class="lb-card-body">
            <div class="lb-card-rank">${medal}</div>
            <div class="lb-card-username-wrap">
              <div class="lb-card-username" data-user-id="${entry.userId}">Loading…</div>
              <span class="lb-you-badge ${entry.isCurrentUser ? '' : 'is-hidden'}">YOU</span>
            </div>
            <div class="lb-card-sep"></div>
            <div class="lb-card-stats">
              <div class="lb-stat">
                <span class="lb-stat-label">Level</span>
                <span class="lb-stat-value js-lb-count" data-type="int" data-target="${entry.level || 0}">${entry.level || 0}</span>
              </div>
              <div class="lb-stat">
                <span class="lb-stat-label">Run Time</span>
                <span class="lb-stat-value js-lb-count" data-type="time-hm" data-target="${Math.max(0, Math.round(entry.runTimeMs || 0))}">${formatTime(entry.runTimeMs || 0)}</span>
              </div>
            </div>
          </div>
        `;

        // Add click event to navigate to player's matches
        card.addEventListener('click', () => {
          window.router?.navigate(`/main?userId=${encodeURIComponent(entry.userId)}`);
        });

        grid.appendChild(card);
        userIdToUsernameEl.set(entry.userId, card.querySelector('.lb-card-username'));
        userIdToCardEl.set(entry.userId, card);
        userIdToYouBadgeEl.set(entry.userId, card.querySelector('.lb-you-badge'));
      });

      // Fetch usernames for all unique userIds
      const userIdList = Array.from(userIdToUsernameEl.keys());
      await Promise.all(userIdList.map(async (userId) => {
        try {
          const res = await authFetch(`${API_BASE}/api/User/name?id=${encodeURIComponent(userId)}`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) throw new Error('User not found');
          const data = await res.json();
          const username = data?.username || `User #${userId}`;
          const el = userIdToUsernameEl.get(userId);
          if (el) el.textContent = username;

          // Fallback: if ID-based match failed (or was unavailable), match by username.
          if (!leaderboardRows.find((row) => row.userId === userId)?.isCurrentUser && isSameUsername(username, currentUserContext?.username)) {
            const cardEl = userIdToCardEl.get(userId);
            const badgeEl = userIdToYouBadgeEl.get(userId);
            if (cardEl) cardEl.classList.add('lb-card-you');
            if (badgeEl) badgeEl.classList.remove('is-hidden');
          }
        } catch {
          const el = userIdToUsernameEl.get(userId);
          if (el) el.textContent = `User #${userId}`;
        }
      }));

      animateLbStats(grid);
    } catch (error) {
      console.error('Leaderboard error:', error);
      document.getElementById('lb-grid').innerHTML = '<div class="lb-empty">Failed to load leaderboard</div>';
    }
  }

  function normalizeRunTimeMs(rawTime) {
    const numeric = Number(rawTime);
    if (!Number.isFinite(numeric) || numeric < 0) return 0;

    // Backend currently sends milliseconds. Keep a fallback for second-based values.
    if (numeric < 10000) return numeric * 1000;
    return numeric;
  }

  function compareByRank(a, b) {
    if (b.level !== a.level) return b.level - a.level;
    if (a.runTimeMs !== b.runTimeMs) return a.runTimeMs - b.runTimeMs;
    return a.username.localeCompare(b.username);
  }

  function resolveUsername(matchEntry, currentUser) {
    if (matchEntry?.username) return String(matchEntry.username);
    if (matchEntry?.user?.username) return String(matchEntry.user.username);

    const userId = Number(matchEntry?.userId);
    if (currentUser?.id === userId && currentUser?.username) {
      return currentUser.username;
    }

    return `User #${userId || 'Unknown'}`;
  }

  function resolveCurrentUserId(currentUser) {
    const candidates = [currentUser?.id, currentUser?.userId, currentUser?.playerId, currentUser?.Id, currentUser?.UserId, currentUser?.PlayerId];
    for (const candidate of candidates) {
      const parsed = Number(candidate);
      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
      }
    }

    return null;
  }

  function normalizeUsername(value) {
    if (!value) return '';
    return String(value).trim().toLowerCase();
  }

  function isSameUsername(left, right) {
    const leftNorm = normalizeUsername(left);
    const rightNorm = normalizeUsername(right);
    return Boolean(leftNorm) && Boolean(rightNorm) && leftNorm === rightNorm;
  }

  async function resolveCurrentUserContext(cachedUser) {
    const fallback = {
      id: resolveCurrentUserId(cachedUser),
      username: cachedUser?.username || cachedUser?.email || null,
    };

    try {
      const res = await authFetch(`${API_BASE}/api/User/me`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return fallback;

      const me = await res.json();
      const meContext = {
        id: resolveCurrentUserId(me),
        username: me?.username || me?.email || fallback.username,
      };

      return {
        id: meContext.id ?? fallback.id,
        username: meContext.username,
      };
    } catch {
      return fallback;
    }
  }

  function buildLeaderboardRows(matches, currentUser) {
    if (!Array.isArray(matches)) return [];

    const currentUserId = resolveCurrentUserId(currentUser);
    const bestByUserId = new Map();

    matches.forEach((matchEntry) => {
      const userId = Number(matchEntry?.userId);
      if (!Number.isFinite(userId)) return;

      const candidate = {
        userId,
        username: resolveUsername(matchEntry, currentUser),
        level: Number(matchEntry?.level) || 0,
        runTimeMs: normalizeRunTimeMs(matchEntry?.time),
        isCurrentUser: currentUserId !== null && userId === currentUserId,
      };

      const existing = bestByUserId.get(userId);
      if (!existing || compareByRank(candidate, existing) < 0) {
        bestByUserId.set(userId, candidate);
      }
    });

    return Array.from(bestByUserId.values()).sort(compareByRank);
  }

  function formatTime(timeMs) {
    const totalSeconds = Math.max(0, Math.round(Number(timeMs || 0) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  function animateLbStats(container) {
    const valueEls = container.querySelectorAll('.js-lb-count');
    if (!valueEls.length) return;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const formatInt = (value) => Math.round(value).toLocaleString('en-US');

    valueEls.forEach((el, index) => {
      const type = el.dataset.type || 'int';
      const targetValue = Number(el.dataset.target);
      if (!Number.isFinite(targetValue)) return;

      const startDelay = 140 + index * 48;
      const duration = type === 'time-hm' ? 980 : 860;
      const startValue = 0;

      const render = (value) => {
        if (type === 'time-hm') {
          el.textContent = formatTime(value);
          return;
        }
        el.textContent = formatInt(value);
      };

      el.classList.add('is-counting');
      render(startValue);

      const run = () => {
        const startTs = performance.now();

        const step = (now) => {
          const progress = Math.min(1, (now - startTs) / duration);
          const eased = easeOutCubic(progress);
          const current = startValue + (targetValue - startValue) * eased;
          render(current);

          if (progress < 1) {
            requestAnimationFrame(step);
            return;
          }

          render(targetValue);
          el.classList.remove('is-counting');
        };

        requestAnimationFrame(step);
      };

      window.setTimeout(run, startDelay);
    });
  }

  // ========== INIT ==========
  ensureGlobalStarfield();
  loadLeaderboard();
}
