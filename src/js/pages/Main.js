import '../../css/pages/Main.css';
import '../../css/pages/Stats.css';
import { API_BASE, getUser, logout, authFetch } from '../auth.js';
import { confirmLogout } from '../logout-confirm.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import swordImg from '../../assets/weapons/sword.png';
import pistolImg from '../../assets/weapons/pistol.png';
import shotgunImg from '../../assets/weapons/shotgun.png';
import orbitingSwordImg from '../../assets/weapons/orbiting_sword.png';
import orbitingIceCrystalImg from '../../assets/weapons/orbiting_ice_crystal.png';
import bloodScytheImg from '../../assets/weapons/blood_scythe.png';
import bloodforgedSigilImg from '../../assets/items/bloodforged_sigil.png';
import cascadeOrbImg from '../../assets/items/cascade_orb.png';
import glassEdgeImg from '../../assets/items/glass_edge.png';
import hasteRuneImg from '../../assets/items/haste_rune.png';
import heartOfAscendanceImg from '../../assets/items/heart_of_ascendance.png';
import hourglassPendantImg from '../../assets/items/hourglass_pendant.png';
import longreachEmblemImg from '../../assets/items/longreach_emblem.png';
import marksmanCoreImg from '../../assets/items/marksman_core.png';
import oathbladeImg from '../../assets/items/oathblade.png';
import orbOfHealthImg from '../../assets/items/orb_of_health.png';
import swiftshotCharmImg from '../../assets/items/swiftshot_charm.png';
import volleyStoneImg from '../../assets/items/volley_stone.png';

const WEAPON_IMAGE_BY_ID = {
  1: swordImg,
  2: pistolImg,
  3: shotgunImg,
  4: orbitingSwordImg,
  5: orbitingIceCrystalImg,
  6: bloodScytheImg,
};
const ITEM_IMAGE_BY_ID = {
  1: bloodforgedSigilImg,
  2: cascadeOrbImg,
  3: glassEdgeImg,
  4: hasteRuneImg,
  5: heartOfAscendanceImg,
  6: hourglassPendantImg,
  7: longreachEmblemImg,
  8: marksmanCoreImg,
  9: oathbladeImg,
  10: orbOfHealthImg,
  11: swiftshotCharmImg,
  12: volleyStoneImg,
};

export default function Main(container) {
  container.innerHTML = `
    

    <div class="mn-root">
      <div class="mn-glow"></div>

      <!-- ===== NAVBAR ===== -->
      <nav class="mn-nav">
        <div class="mn-nav-inner">

          <!-- Logo -->
          <a href="/" data-link class="mn-logo">Bloodwave</a>

          <!-- Desktop Center Links -->
          <div class="mn-links">
            <a href="/main" data-link class="mn-link active"><span>Matches</span></a>
            <a href="/stats" data-link class="mn-link"><span>Stats</span></a>
            <a href="/leaderboard" data-link class="mn-link"><span>Leaderboard</span></a>
            <a href="/achievements" data-link class="mn-link"><span>Achievements</span></a>
          </div>

          <!-- Right: avatar + hamburger -->
          <div class="mn-right">
            <a href="/main" data-link class="mn-nav-link" id="mnBackToDashboard" style="display:none;">Back to Dashboard</a>

            <!-- Profile Avatar + dropdown (desktop) -->
            <div class="mn-avatar-wrap">
              <button class="mn-avatar" id="mn-avatar-btn" aria-label="Profile menu" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
              <div class="mn-avatar-dropdown" id="mn-avatar-dropdown" role="menu">
                <div class="mn-dd-header">
                  <div class="mn-dd-username" id="mn-dd-username">—</div>
                  <div class="mn-dd-role">Member</div>
                </div>
                <a href="/user-panel" data-link class="mn-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />
                  </svg>
                  Profile
                </a>
                <a href="/android-download" data-link class="mn-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />
                  </svg>
                  Installation
                </a>
                <div class="mn-dd-divider"></div>
                <button class="mn-dd-item logout" id="mn-dd-logout" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <!-- Hamburger (mobile) -->
            <button class="mn-hamburger" id="mn-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="mn-bar"></span>
              <span class="mn-bar"></span>
              <span class="mn-bar"></span>
            </button>
          </div>

        </div>

        <!-- Mobile Dropdown -->
        <div class="mn-mobile-menu" id="mn-mobile-menu">
          <div class="mn-mobile-menu-inner">
            <a href="/main" data-link class="mn-mobile-link">Matches</a>
            <a href="/stats" data-link class="mn-mobile-link">Stats</a>
            <a href="/leaderboard" data-link class="mn-mobile-link">Leaderboard</a>
            <a href="/achievements" data-link class="mn-mobile-link">Achievements</a>
            <div class="mn-mobile-divider"></div>
            <div class="mn-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="mn-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="mn-mobile-username">—</span>
            </div>
            <div class="mn-mobile-divider"></div>
            <a href="/user-panel" data-link class="mn-mobile-link">Profile</a>
            <a href="/android-download" data-link class="mn-mobile-link">Installation</a>
            <button class="mn-mobile-logout" id="mn-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- ===== MAIN CONTENT ===== -->
      <main class="mn-content">
        <div class="mn-matches-shell">
          <div class="mn-matches-head">
            <div class="mn-ornament">
              <div class="mn-ornament-line"></div>
              <div class="mn-ornament-diamond"></div>
              <div class="mn-ornament-line"></div>
            </div>
            <h1 class="mn-placeholder-title">Played Matches</h1>
            <p class="mn-placeholder-sub">Select a run to view details</p>
            <p class="mn-viewing-user" id="mn-viewing-user" style="display:none;">
              <span class="mn-viewing-kicker">Viewing</span>
              <span class="mn-viewing-name" id="mn-viewing-name">-</span>
            </p>
          </div>

          <div class="mn-matches-layout">
            <div class="mn-matches-list" id="mn-matches-list" role="listbox" aria-label="Played matches"></div>
            <section class="mn-match-panel" id="mn-match-panel" aria-live="polite"></section>
          </div>

          <section class="mn-player-stats" id="mn-player-stats" hidden></section>
        </div>
      </main>

    </div>
  `;

  // ── Canvas starfield ──────────────────────────────────────────────────────
  ensureGlobalStarfield();

  // ── Populate username ────────────────────────────────────────────────────
  const user = getUser();
  const displayName = user?.username ?? user?.email ?? 'Member';

  const ddUsername     = container.querySelector('#mn-dd-username');
  const mobileUsername = container.querySelector('#mn-mobile-username');
  if (ddUsername)     ddUsername.textContent     = displayName;
  if (mobileUsername) mobileUsername.textContent = displayName;
  refreshNavbarUsername();
  updateNavbarLinksForPlayer(container);

  async function refreshNavbarUsername() {
    try {
      const res = await authFetch(`${API_BASE}/api/User/me`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) return;

      const userData = await res.json();
      const liveDisplayName = userData?.username ?? userData?.email ?? displayName;

      if (ddUsername) ddUsername.textContent = liveDisplayName;
      if (mobileUsername) mobileUsername.textContent = liveDisplayName;
    } catch {
      // Keep cached display name on fetch failure.
    }
  }

  // ── Matches list + details ───────────────────────────────────────────────
  let matches = [];
  const matchesList = container.querySelector('#mn-matches-list');
  const matchPanel  = container.querySelector('#mn-match-panel');
  const playerStatsSection = container.querySelector('#mn-player-stats');
  const viewedPlayerId = getViewedPlayerIdFromQuery();
  let selectedMatchId = null;

  if (playerStatsSection && viewedPlayerId) {
    playerStatsSection.hidden = false;
    renderPlayerStats(playerStatsSection, buildPlayerStats(matches));
  }

  function renderMatchPanel(match) {
    if (!matchPanel) return;

    if (!match) {
      matchPanel.innerHTML = `
        <div class="mn-match-empty">No played matches yet.</div>
      `;
      return;
    }

    const stats = [
      { label: 'Duration', value: formatDuration(match.durationSeconds) },
      { label: 'Level Reached', value: formatCount(match.levelReached) },
      { label: 'Max Health', value: formatCount(match.maxHealth) },
      { label: 'Damage Dealt', value: formatCount(match.damageDealt) },
      { label: 'Damage Taken', value: formatCount(match.damageTaken) },
      { label: 'Enemies Killed', value: formatCount(match.enemiesKilled) },
      { label: 'Coins Collected', value: formatCount(match.coinsCollected) },
      { label: 'Finished At', value: formatPlayedAt(match.playedAt) },
    ];

    matchPanel.innerHTML = `
      <h2 class="mn-panel-title">Run Summary</h2>
      <div class="mn-panel-grid">
        ${stats.map((stat) => `
          <div class="mn-panel-stat">
            <div class="mn-panel-label">${stat.label}</div>
            <div class="mn-panel-value">${stat.value}</div>
          </div>
        `).join('')}
      </div>
      ${renderEntityTable('Weapons', match.weapons, 'weapon')}
      ${renderEntityTable('Items', match.items, 'item')}
    `;
  }

  function renderMatches() {
    if (!matchesList) return;

    if (!matches.length) {
      matchesList.innerHTML = '<div class="mn-match-empty">No played matches yet.</div>';
      renderMatchPanel(null);
      return;
    }

    matchesList.innerHTML = matches.map((match, index) => {
      const isActive = match.id === selectedMatchId;
      const swipeDelayMs = Math.min(index * 55, 440);
      const swipeShiftPx = Math.min(20 + index * 3, 42);
      return `
        <button
          type="button"
          class="mn-match-item${isActive ? ' active' : ''}"
          data-match-id="${match.id}"
          role="option"
          aria-selected="${String(isActive)}"
          style="--mn-row-delay:${swipeDelayMs}ms; --mn-row-shift:${swipeShiftPx}px;"
        >
          <div class="mn-match-meta">
            <span class="mn-match-chip">${formatDuration(match.durationSeconds)}</span>
            <span class="mn-match-chip">Lv ${match.levelReached}</span>
          </div>
          <div class="mn-match-time">${formatPlayedAt(match.playedAt)}</div>
        </button>
      `;
    }).join('');

    renderMatchPanel(matches.find((m) => m.id === selectedMatchId));
  }

  function syncActiveMatchItem(previousSelectedId = null) {
    if (!matchesList) return;

    const items = matchesList.querySelectorAll('.mn-match-item');
    items.forEach((item) => {
      const isActive = item.dataset.matchId === selectedMatchId;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });

    const activeItem = matchesList.querySelector(`.mn-match-item[data-match-id="${selectedMatchId}"]`);
    if (activeItem && previousSelectedId !== selectedMatchId) {
      activeItem.classList.remove('is-activating');
      // Force reflow so animation always retriggers on selection change.
      void activeItem.offsetWidth;
      activeItem.classList.add('is-activating');
      activeItem.addEventListener('animationend', () => {
        activeItem.classList.remove('is-activating');
      }, { once: true });
    }
  }

  matchesList?.addEventListener('click', (e) => {
    const target = e.target.closest('.mn-match-item');
    if (!target) return;

    const prevSelectedId = selectedMatchId;
    selectedMatchId = target.dataset.matchId;
    syncActiveMatchItem(prevSelectedId);
    renderMatchPanel(matches.find((m) => m.id === selectedMatchId));
  });

  if (matchesList) {
    matchesList.innerHTML = '<div class="mn-match-empty">Loading played matches...</div>';
  }
  renderMatchPanel(null);
  loadMatches();

  async function loadMatches() {
    const playerId = resolvePlayerId(user);

    if (!playerId) {
      matches = [];
      selectedMatchId = null;
      renderMatches();
      return;
    }

    try {
      const response = await authFetch(`${API_BASE}/api/Match/player?playerId=${encodeURIComponent(playerId)}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const apiMatches = await parseResponsePayload(response);
      matches = mapApiMatches(apiMatches);
      selectedMatchId = matches[0]?.id ?? null;
      if (playerStatsSection && viewedPlayerId) {
        renderPlayerStats(playerStatsSection, buildPlayerStats(matches));
      }
      renderMatches();
    } catch {
      matches = [];
      selectedMatchId = null;
      if (playerStatsSection && viewedPlayerId) {
        renderPlayerStats(playerStatsSection, buildPlayerStats(matches));
      }
      renderMatches();
    }
  }

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  const hamburger   = container.querySelector('#mn-hamburger');
  const mobileMenu  = container.querySelector('#mn-mobile-menu');
  let menuOpen = false;

  hamburger?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    hamburger.setAttribute('aria-expanded', String(menuOpen));
    mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + 'px' : '0';
  });

  // Close on mobile link click
  mobileMenu?.querySelectorAll('.mn-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.style.maxHeight = '0';
    });
  });

  // ── Desktop avatar dropdown ───────────────────────────────────────────────
  const avatarBtn  = container.querySelector('#mn-avatar-btn');
  const avatarDrop = container.querySelector('#mn-avatar-dropdown');
  let dropOpen = false;

  function openDrop() {
    dropOpen = true;
    avatarDrop.classList.add('open');
    avatarBtn.setAttribute('aria-expanded', 'true');
  }
  function closeDrop() {
    dropOpen = false;
    avatarDrop.classList.remove('open');
    avatarBtn.setAttribute('aria-expanded', 'false');
  }

  avatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropOpen ? closeDrop() : openDrop();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (dropOpen && !avatarDrop.contains(e.target) && e.target !== avatarBtn) {
      closeDrop();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropOpen) closeDrop();
  });

  // ── Logout ───────────────────────────────────────────────────────────────
  const doLogout = async () => {
    const confirmed = await confirmLogout();
    if (!confirmed) return;

    await logout();
    // logout() already navigates to /login
  };

  container.querySelector('#mn-dd-logout')?.addEventListener('click', doLogout);
  container.querySelector('#mn-mobile-logout')?.addEventListener('click', doLogout);
}

/* ======================================================================
   CANVAS — Starry background from Profile
   ====================================================================== */
function initMnCanvas() {
  const canvas = document.getElementById('mn-canvas');
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


function spawnMnParticles() {
  const root = document.querySelector('.mn-root');
  if (!root) return;

  for (let i = 0; i < 18; i++) {
    const p        = document.createElement('div');
    p.className    = 'bw-particle';
    const size     = Math.random() * 2.2 + 0.4;
    const delay    = Math.random() * 20;
    const duration = 18 + Math.random() * 22;
    const drift    = (Math.random() - 0.5) * 90;
    const isRed    = Math.random() < 0.28;
    const isGold   = !isRed && Math.random() < 0.15;
    const col      = isRed  ? 'rgba(192,57,43,0.55)'
                   : isGold ? 'rgba(212,175,55,0.4)'
                   :          'rgba(255,230,210,0.28)';

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:-12px;
      background:${col};
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      --drift:${drift}px;
    `;
    root.appendChild(p);
  }
}

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatPlayedAt(isoDateString) {
  const raw = typeof isoDateString === 'string' ? isoDateString.trim() : '';
  const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw);
  const normalized = raw && !hasTimezone ? `${raw}Z` : raw;
  const parsedDate = new Date(normalized);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Budapest',
  }).format(parsedDate);
}

async function parseResponsePayload(response) {
  const raw = await response.text();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function resolvePlayerId(user) {
  // Check if a userId query parameter is provided
  const queryParams = new URLSearchParams(window.location.search);
  const userIdParam = queryParams.get('userId');
  if (userIdParam) {
    const value = Number(userIdParam);
    if (Number.isInteger(value) && value > 0) {
      return value;
    }
  }

  // Fall back to current user's ID
  const candidates = [user?.id, user?.userId, user?.playerId];
  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isInteger(value) && value > 0) {
      return value;
    }
  }

  return null;
}

function getViewedPlayerIdFromQuery() {
  const queryParams = new URLSearchParams(window.location.search);
  const userIdParam = queryParams.get('userId');
  if (!userIdParam) return null;

  const value = Number(userIdParam);
  if (!Number.isInteger(value) || value <= 0) return null;
  return value;
}

function updateNavbarLinksForPlayer(container) {
  const queryParams = new URLSearchParams(window.location.search);
  const userIdParam = queryParams.get('userId');

  if (!userIdParam) return;

  // Back-only navbar in viewed-player mode.
  const navLinks = container.querySelector('.mn-links');
  const backLink = container.querySelector('#mnBackToDashboard');
  const avatarWrap = container.querySelector('.mn-avatar-wrap');
  const hamburger = container.querySelector('#mn-hamburger');
  const mobileMenu = container.querySelector('#mn-mobile-menu');
  const root = container.querySelector('.mn-root');

  if (root) root.classList.add('mn-view-mode');
  if (navLinks) navLinks.style.display = 'none';
  if (avatarWrap) avatarWrap.style.display = 'none';
  if (hamburger) hamburger.style.display = 'none';
  if (mobileMenu) mobileMenu.style.display = 'none';
  if (backLink) {
    backLink.style.display = 'inline-block';
    backLink.setAttribute('href', '/main');
  }

  // Fetch and display viewed player's username
  loadViewedPlayerUsername(userIdParam, container);
}

async function loadViewedPlayerUsername(userId, container) {
  try {
    const res = await authFetch(`${API_BASE}/api/User/name?id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('User not found');
    
    const data = await res.json();
    const username = data?.username || `User #${userId}`;
    
    const viewingEl = container.querySelector('#mn-viewing-user');
    const viewingNameEl = container.querySelector('#mn-viewing-name');
    if (viewingEl && viewingNameEl) {
      viewingNameEl.textContent = username;
      viewingEl.style.display = 'inline-flex';
    }
  } catch {
    const viewingEl = container.querySelector('#mn-viewing-user');
    const viewingNameEl = container.querySelector('#mn-viewing-name');
    if (viewingEl && viewingNameEl) {
      viewingNameEl.textContent = `User #${userId}`;
      viewingEl.style.display = 'inline-flex';
    }
  }
}

function mapApiMatches(apiMatches) {
  if (!Array.isArray(apiMatches)) return [];

  return apiMatches
    .map((match, index) => {
      const playedAt = normalizePlayedAt(match?.createdAt);
      return {
        id: String(match?.id ?? `run-${index + 1}`),
        durationSeconds: normalizeDurationSeconds(match?.time),
        levelReached: toNonNegativeInt(match?.level),
        maxHealth: toNonNegativeInt(match?.maxHealth),
        damageDealt: toNonNegativeInt(match?.damageDealt),
        damageTaken: toNonNegativeInt(match?.damageTaken),
        enemiesKilled: toNonNegativeInt(match?.enemiesKilled),
        coinsCollected: toNonNegativeInt(match?.coinsCollected),
        playedAt,
        weapons: mapMatchEntities(match?.matchWeapons, 'weapon'),
        items: mapMatchEntities(match?.matchItems, 'item'),
      };
    })
    .sort((left, right) => parseBackendDate(right.playedAt).getTime() - parseBackendDate(left.playedAt).getTime());
}

function mapMatchEntities(entities, type) {
  if (!Array.isArray(entities)) return [];

  return entities.map((entry, index) => {
    const entityId = toNonNegativeInt(type === 'weapon' ? entry?.weaponId : entry?.itemId);
    const fallbackName = type === 'weapon' ? `Weapon #${entityId || index + 1}` : `Item #${entityId || index + 1}`;

    return {
      id: toNonNegativeInt(entry?.id),
      entityId,
      name: normalizeEntityName(type === 'weapon' ? entry?.weaponName : entry?.itemName, fallbackName),
      image: type === 'weapon' ? WEAPON_IMAGE_BY_ID[entityId] : ITEM_IMAGE_BY_ID[entityId],
    };
  });
}

function normalizeEntityName(value, fallback) {
  const raw = typeof value === 'string' ? value.trim() : '';
  return raw || fallback;
}

function renderEntityTable(title, entities, type) {
  const rows = Array.isArray(entities) ? entities : [];

  return `
    <section class="mn-summary-section">
      <div class="mn-summary-section-head">
        <h3 class="mn-summary-section-title">${title}</h3>
        <span class="mn-summary-section-count">${formatCount(rows.length)}</span>
      </div>
      ${
        rows.length
          ? `
            <div class="mn-summary-table-wrap">
              <table class="mn-summary-table" aria-label="${title}">
                <thead>
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map((entry) => `
                    <tr>
                      <td>
                        <div class="mn-summary-entity">
                          ${entry.image ? `<img class="mn-summary-entity-image" src="${entry.image}" alt="${escapeHtml(entry.name)}">` : '<div class="mn-summary-entity-fallback">-</div>'}
                        </div>
                      </td>
                      <td>${escapeHtml(entry.name)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `
          : `<div class="mn-summary-empty">No ${type === 'weapon' ? 'weapons' : 'items'} recorded for this run.</div>`
      }
    </section>
  `;
}

function renderPlayerStats(container, stats) {
  if (!container) return;

  const sections = [
    {
      title: 'Core Totals',
      subtitle: 'Overall lifetime volume',
      cards: [
        { stat: 'matches', type: 'int', name: 'Matches Played', unit: 'total games' },
        { stat: 'time-lived', type: 'time-hm', name: 'Time Lived', unit: 'total survival time' },
        { stat: 'damage', type: 'int', name: 'Damage Dealt', unit: 'total damage' },
        { stat: 'damage-taken', type: 'int', name: 'Damage Taken', unit: 'total damage received' },
        { stat: 'kills', type: 'int', name: 'Enemies Killed', unit: 'eliminations' },
        { stat: 'coins', type: 'int', name: 'Coins Collected', unit: 'total coins' },
      ],
    },
    {
      title: 'Per Match Efficiency',
      subtitle: 'Average output and pace',
      cards: [
        { stat: 'avg-survival-match', type: 'time-hms', name: 'Avg Survival / Match', unit: 'time per game' },
        { stat: 'avg-damage-match', type: 'int', name: 'Avg Damage / Match', unit: 'damage per game' },
        { stat: 'avg-damage-minute', type: 'int', name: 'Avg Damage / Minute', unit: 'damage per minute' },
        { stat: 'avg-kills-match', type: 'int', name: 'Avg Kills / Match', unit: 'kills per game' },
        { stat: 'avg-kills-minute', type: 'int', name: 'Avg Kills / Minute', unit: 'kills per minute' },
        { stat: 'avg-coins-match', type: 'int', name: 'Avg Coins / Match', unit: 'coins per game' },
      ],
    },
    {
      title: 'Peak Records',
      subtitle: 'Best single-run highlights',
      cards: [
        { stat: 'best-score', type: 'int', name: 'Best Match Score', unit: 'top weighted run score' },
        { stat: 'highest-level', type: 'int', name: 'Highest Level Reached', unit: 'all-time best level' },
        { stat: 'best-survival', type: 'time-hms', name: 'Best Match Survival', unit: 'longest single match' },
        { stat: 'best-damage', type: 'int', name: 'Best Match Damage', unit: 'top single-match damage' },
        { stat: 'best-kills', type: 'int', name: 'Best Match Kills', unit: 'top single-match kills' },
        { stat: 'best-coins', type: 'int', name: 'Best Match Coins', unit: 'top single-match coins' },
      ],
    },
    {
      title: 'Run Shape And Stability',
      subtitle: 'Session length distribution and consistency',
      cards: [
        { stat: 'short-match-ratio', type: 'int', name: 'Short Match Ratio', unit: 'under 2 min (%)' },
        { stat: 'long-match-ratio', type: 'int', name: 'Long Match Ratio', unit: 'over 10 min (%)' },
        { stat: 'performance-volatility', type: 'int', name: 'Performance Volatility', unit: 'lower = more stable (%)' },
      ],
    },
  ];

  container.innerHTML = `
    <div class="st-sections">
      ${sections.map((section) => `
        <section class="st-stat-section">
          <div class="st-section-head">
            <h2 class="st-section-title">${section.title}</h2>
            <p class="st-section-subtitle">${section.subtitle}</p>
          </div>
          <div class="st-grid st-grid--section">
            ${section.cards.map((card) => `
              <div class="st-card">
                <div class="st-card-corner st-card-corner--tl"></div>
                <div class="st-card-corner st-card-corner--tr"></div>
                <div class="st-card-corner st-card-corner--bl"></div>
                <div class="st-card-corner st-card-corner--br"></div>
                <div class="st-card-body">
                  <div class="st-card-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16" />
                    </svg>
                  </div>
                  <div class="st-card-name">${card.name}</div>
                  <div class="st-card-sep"></div>
                  <div class="st-card-value js-st-count" data-stat="${card.stat}" data-type="${card.type}" data-target="0">0</div>
                  <div class="st-card-unit">${card.unit}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `).join('')}
    </div>
  `;

  applyStatsToCards(container, stats);
  animateStStats(container);
}

function buildPlayerStats(matches) {
  const rows = Array.isArray(matches) ? matches : [];

  let totalDamageDealt = 0;
  let totalDamageTaken = 0;
  let totalEnemiesKilled = 0;
  let totalCoinsCollected = 0;
  let totalDurationSeconds = 0;
  let totalLevelsReached = 0;
  let bestMatchDamage = 0;
  let bestMatchKills = 0;
  let bestMatchSurvivalSeconds = 0;
  let highestLevelReached = 0;
  let bestMatchCoins = 0;
  let bestMatchScore = 0;
  let shortMatchesCount = 0;
  let longMatchesCount = 0;
  const performanceScores = [];

  const SHORT_MATCH_THRESHOLD_SECONDS = 2 * 60;
  const LONG_MATCH_THRESHOLD_SECONDS = 10 * 60;

  rows.forEach((match) => {
    const damageDealt = toNonNegativeInt(match?.damageDealt);
    const damageTaken = toNonNegativeInt(match?.damageTaken);
    const enemiesKilled = toNonNegativeInt(match?.enemiesKilled);
    const coinsCollected = toNonNegativeInt(match?.coinsCollected);
    const durationSeconds = toNonNegativeInt(match?.durationSeconds);
    const levelReached = toNonNegativeInt(match?.levelReached);

    totalDamageDealt += damageDealt;
    totalDamageTaken += damageTaken;
    totalEnemiesKilled += enemiesKilled;
    totalCoinsCollected += coinsCollected;
    totalDurationSeconds += durationSeconds;
    totalLevelsReached += levelReached;

    bestMatchDamage = Math.max(bestMatchDamage, damageDealt);
    bestMatchKills = Math.max(bestMatchKills, enemiesKilled);
    bestMatchSurvivalSeconds = Math.max(bestMatchSurvivalSeconds, durationSeconds);
    highestLevelReached = Math.max(highestLevelReached, levelReached);
    bestMatchCoins = Math.max(bestMatchCoins, coinsCollected);

    if (durationSeconds < SHORT_MATCH_THRESHOLD_SECONDS) {
      shortMatchesCount += 1;
    }
    if (durationSeconds > LONG_MATCH_THRESHOLD_SECONDS) {
      longMatchesCount += 1;
    }

    const performanceScore =
      damageDealt +
      enemiesKilled * 120 +
      coinsCollected * 4 +
      levelReached * 250;
    bestMatchScore = Math.max(bestMatchScore, performanceScore);
    performanceScores.push(performanceScore);
  });

  const matchesPlayed = rows.length;
  const totalDurationMinutes = totalDurationSeconds / 60;

  return {
    matchesPlayed,
    damageDealt: totalDamageDealt,
    damageTaken: totalDamageTaken,
    enemiesKilled: totalEnemiesKilled,
    coinsCollected: totalCoinsCollected,
    totalMinutesLived: Math.round(totalDurationSeconds / 60),
    totalLevelsReached,
    bestMatchDamage,
    bestMatchKills,
    bestMatchSurvivalSeconds,
    highestLevelReached,
    bestMatchCoins,
    bestMatchScore,
    averageDamagePerMatch: toNonNegativeInt(safeDivide(totalDamageDealt, matchesPlayed)),
    averageKillsPerMatch: toNonNegativeInt(safeDivide(totalEnemiesKilled, matchesPlayed)),
    averageCoinsPerMatch: toNonNegativeInt(safeDivide(totalCoinsCollected, matchesPlayed)),
    averageDamagePerMinute: toNonNegativeInt(safeDivide(totalDamageDealt, totalDurationMinutes)),
    averageKillsPerMinute: toNonNegativeInt(safeDivide(totalEnemiesKilled, totalDurationMinutes)),
    averageSurvivalSecondsPerMatch: toNonNegativeInt(safeDivide(totalDurationSeconds, matchesPlayed)),
    shortMatchRatioPercent: toNonNegativeInt(safeDivide(shortMatchesCount * 100, matchesPlayed)),
    longMatchRatioPercent: toNonNegativeInt(safeDivide(longMatchesCount * 100, matchesPlayed)),
    performanceVolatilityPercent: toNonNegativeInt(calculateCoefficientOfVariationPercent(performanceScores)),
  };
}

function applyStatsToCards(container, stats) {
  const setStatTarget = (statKey, value) => {
    const valueEl = container.querySelector(`.js-st-count[data-stat="${statKey}"]`);
    if (!valueEl) return;
    valueEl.dataset.target = String(value);
  };

  setStatTarget('damage', toNonNegativeInt(stats.damageDealt));
  setStatTarget('damage-taken', toNonNegativeInt(stats.damageTaken));
  setStatTarget('kills', toNonNegativeInt(stats.enemiesKilled));
  setStatTarget('time-lived', toNonNegativeInt(stats.totalMinutesLived));
  setStatTarget('matches', toNonNegativeInt(stats.matchesPlayed));
  setStatTarget('coins', toNonNegativeInt(stats.coinsCollected));
  setStatTarget('avg-damage-match', toNonNegativeInt(stats.averageDamagePerMatch));
  setStatTarget('avg-kills-match', toNonNegativeInt(stats.averageKillsPerMatch));
  setStatTarget('avg-coins-match', toNonNegativeInt(stats.averageCoinsPerMatch));
  setStatTarget('avg-kills-minute', toNonNegativeInt(stats.averageKillsPerMinute));
  setStatTarget('avg-damage-minute', toNonNegativeInt(stats.averageDamagePerMinute));
  setStatTarget('avg-survival-match', toNonNegativeInt(stats.averageSurvivalSecondsPerMatch));
  setStatTarget('best-damage', toNonNegativeInt(stats.bestMatchDamage));
  setStatTarget('best-kills', toNonNegativeInt(stats.bestMatchKills));
  setStatTarget('best-survival', toNonNegativeInt(stats.bestMatchSurvivalSeconds));
  setStatTarget('highest-level', toNonNegativeInt(stats.highestLevelReached));
  setStatTarget('best-coins', toNonNegativeInt(stats.bestMatchCoins));
  setStatTarget('best-score', toNonNegativeInt(stats.bestMatchScore));
  setStatTarget('short-match-ratio', toNonNegativeInt(stats.shortMatchRatioPercent));
  setStatTarget('long-match-ratio', toNonNegativeInt(stats.longMatchRatioPercent));
  setStatTarget('performance-volatility', toNonNegativeInt(stats.performanceVolatilityPercent));
}

function formatCount(value) {
  return toNonNegativeInt(value).toLocaleString('en-US');
}

function calculateCoefficientOfVariationPercent(values) {
  if (!Array.isArray(values) || values.length < 2) return 0;

  const normalized = values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0);

  if (normalized.length < 2) return 0;

  const mean = normalized.reduce((sum, value) => sum + value, 0) / normalized.length;
  if (mean <= 0) return 0;

  const variance = normalized
    .map((value) => Math.pow(value - mean, 2))
    .reduce((sum, value) => sum + value, 0) / normalized.length;

  const standardDeviation = Math.sqrt(variance);
  return safeDivide(standardDeviation * 100, mean);
}

function animateStStats(container) {
  const valueEls = container.querySelectorAll('.js-st-count');
  if (!valueEls.length) return;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function formatInt(value) {
    return Math.round(value).toLocaleString('en-US');
  }

  function formatHoursMinutes(totalMinutesFloat) {
    const totalMinutes = Math.max(0, Math.round(totalMinutesFloat));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  function formatHoursMinutesSeconds(totalSecondsFloat) {
    const totalSeconds = Math.max(0, Math.round(totalSecondsFloat));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  valueEls.forEach((el, index) => {
    const type = el.dataset.type || 'int';
    const targetValue = Number(el.dataset.target);
    if (!Number.isFinite(targetValue)) return;

    const startDelay = 120 + index * 55;
    const duration = type === 'int' ? 900 : 780;
    const startValue = 0;

    el.classList.add('is-counting');

    const render = (value) => {
      if (type === 'time-hm') {
        el.textContent = formatHoursMinutes(value);
        return;
      }
      if (type === 'time-hms') {
        el.textContent = formatHoursMinutesSeconds(value);
        return;
      }
      el.textContent = formatInt(value);
    };

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

function safeDivide(numerator, denominator) {
  const left = Number(numerator);
  const right = Number(denominator);
  if (!Number.isFinite(left) || !Number.isFinite(right) || right <= 0) {
    return 0;
  }

  return left / right;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeDurationSeconds(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;

  const nonNegative = Math.max(0, parsed);

  // Backend match time is stored in ms in current API responses.
  // For compatibility with potential legacy second-based values,
  // only convert to seconds when the number is clearly ms-sized.
  if (nonNegative >= 10_000) {
    return Math.round(nonNegative / 1000);
  }

  return Math.round(nonNegative);
}

function toNonNegativeInt(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}

function normalizePlayedAt(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  const parsed = raw ? parseBackendDate(raw) : null;

  if (parsed && !Number.isNaN(parsed.getTime())) {
    return raw;
  }

  return new Date(0).toISOString();
}

function parseBackendDate(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw);
  const normalized = raw && !hasTimezone ? `${raw}Z` : raw;
  return new Date(normalized);
}
