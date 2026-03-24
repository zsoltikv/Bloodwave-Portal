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

          <section class="mn-player-stats" id="mn-player-stats" aria-live="polite"></section>
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
  const playerStatsPanel = container.querySelector('#mn-player-stats');
  let selectedMatchId = null;

  function renderPlayerStats() {
    if (!playerStatsPanel) return;

    if (!playerStatsPanel.dataset.ready) {
      playerStatsPanel.innerHTML = getEmbeddedStatsMarkup();
      reorderEmbeddedStatCards(playerStatsPanel);
      playerStatsPanel.dataset.ready = 'true';
    }

    const aggregateStats = aggregateMappedMatchStats(matches);
    applyEmbeddedStatsToCards(playerStatsPanel, aggregateStats);
    renderEmbeddedStatsVisuals(playerStatsPanel, aggregateStats);
    animateEmbeddedStats(playerStatsPanel);
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

    renderPlayerStats();

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
      renderMatches();
    } catch {
      matches = [];
      selectedMatchId = null;
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

function getEmbeddedStatsMarkup() {
  const icon = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  `;

  const statCard = (name, stat, type, unit, initialText = '0') => `
    <div class="st-card">
      <div class="st-card-corner st-card-corner--tl"></div>
      <div class="st-card-corner st-card-corner--tr"></div>
      <div class="st-card-corner st-card-corner--bl"></div>
      <div class="st-card-corner st-card-corner--br"></div>
      <div class="st-card-body">
        <div class="st-card-icon">${icon}</div>
        <div class="st-card-name">${name}</div>
        <div class="st-card-sep"></div>
        <div class="st-card-value js-st-count" data-stat="${stat}" data-type="${type}" data-target="0">${initialText}</div>
        <div class="st-card-unit">${unit}</div>
      </div>
    </div>
  `;

  return `
    <div class="st-sections">
      <section class="st-stat-section">
        <div class="st-section-head">
          <h2 class="st-section-title">Core Totals</h2>
          <p class="st-section-subtitle">Overall lifetime volume</p>
        </div>
        <div class="st-grid st-grid--section">
          ${statCard('Damage Dealt', 'damage', 'int', 'total damage')}
          ${statCard('Damage Taken', 'damage-taken', 'int', 'total damage received')}
          ${statCard('Enemies Killed', 'kills', 'int', 'eliminations')}
          ${statCard('Time Lived', 'time-lived', 'time-hm', 'total survival time', '0h 0m')}
          ${statCard('Matches Played', 'matches', 'int', 'total games')}
          ${statCard('Coins Collected', 'coins', 'int', 'total coins')}
        </div>
      </section>

      <section class="st-stat-section">
        <div class="st-section-head">
          <h2 class="st-section-title">Per Match Efficiency</h2>
          <p class="st-section-subtitle">Average output and pace</p>
        </div>
        <div class="st-grid st-grid--section">
          ${statCard('Avg Damage / Match', 'avg-damage-match', 'int', 'damage per game')}
          ${statCard('Avg Kills / Match', 'avg-kills-match', 'int', 'kills per game')}
          ${statCard('Avg Coins / Match', 'avg-coins-match', 'int', 'coins per game')}
          ${statCard('Avg Kills / Minute', 'avg-kills-minute', 'int', 'kills per minute')}
          ${statCard('Avg Damage / Minute', 'avg-damage-minute', 'int', 'damage per minute')}
          ${statCard('Avg Survival / Match', 'avg-survival-match', 'time-hms', 'time per game', '0h 0m 0s')}
        </div>
      </section>

      <section class="st-stat-section">
        <div class="st-section-head">
          <h2 class="st-section-title">Peak Records</h2>
          <p class="st-section-subtitle">Best single-run highlights</p>
        </div>
        <div class="st-grid st-grid--section">
          ${statCard('Best Match Damage', 'best-damage', 'int', 'top single-match damage')}
          ${statCard('Best Match Kills', 'best-kills', 'int', 'top single-match kills')}
          ${statCard('Best Match Survival', 'best-survival', 'time-hms', 'longest single match', '0h 0m 0s')}
          ${statCard('Highest Level Reached', 'highest-level', 'int', 'all-time best level')}
          ${statCard('Best Match Coins', 'best-coins', 'int', 'top single-match coins')}
          ${statCard('Best Match Score', 'best-score', 'int', 'top weighted run score')}
        </div>
      </section>

      <section class="st-stat-section">
        <div class="st-section-head">
          <h2 class="st-section-title">Run Shape And Stability</h2>
          <p class="st-section-subtitle">Session length distribution and consistency</p>
        </div>
        <div class="st-grid st-grid--section">
          ${statCard('Short Match Ratio', 'short-match-ratio', 'int', 'under 2 min (%)')}
          ${statCard('Long Match Ratio', 'long-match-ratio', 'int', 'over 10 min (%)')}
          ${statCard('Performance Volatility', 'performance-volatility', 'int', 'lower = more stable (%)')}
        </div>
      </section>
    </div>

    <section class="st-viz" aria-label="Visual analytics">
      <div class="st-viz-head">
        <div class="st-viz-line"></div>
        <h2 class="st-viz-title">Visual Analytics</h2>
        <div class="st-viz-line"></div>
      </div>

      <div class="st-viz-grid">
        <article class="st-viz-card st-viz-card--ratio">
          <h3 class="st-viz-card-title">Match Duration Split</h3>
          <div class="st-ratio-track" id="st-ratio-track" role="img" aria-label="Short, normal and long match ratio">
            <span class="st-ratio-segment short" id="st-ratio-short"></span>
            <span class="st-ratio-segment normal" id="st-ratio-normal"></span>
            <span class="st-ratio-segment long" id="st-ratio-long"></span>
          </div>
          <div class="st-ratio-legend">
            <div class="st-ratio-item"><span class="dot short"></span><span>Short (&lt;2m)</span><strong id="st-ratio-short-label">0%</strong></div>
            <div class="st-ratio-item"><span class="dot normal"></span><span>Normal</span><strong id="st-ratio-normal-label">0%</strong></div>
            <div class="st-ratio-item"><span class="dot long"></span><span>Long (&gt;10m)</span><strong id="st-ratio-long-label">0%</strong></div>
          </div>
        </article>

        <article class="st-viz-card st-viz-card--bars">
          <h3 class="st-viz-card-title">Per Match Performance</h3>
          <div class="st-bars" id="st-bars">
            <div class="st-bar-row">
              <span class="st-bar-label">Damage</span>
              <div class="st-bar-track"><span class="st-bar-fill damage" id="st-bar-damage"></span></div>
              <span class="st-bar-value" id="st-bar-damage-value">0</span>
            </div>
            <div class="st-bar-row">
              <span class="st-bar-label">Kills</span>
              <div class="st-bar-track"><span class="st-bar-fill kills" id="st-bar-kills"></span></div>
              <span class="st-bar-value" id="st-bar-kills-value">0</span>
            </div>
            <div class="st-bar-row">
              <span class="st-bar-label">Coins</span>
              <div class="st-bar-track"><span class="st-bar-fill coins" id="st-bar-coins"></span></div>
              <span class="st-bar-value" id="st-bar-coins-value">0</span>
            </div>
          </div>
        </article>

        <article class="st-viz-card st-viz-card--gauge">
          <h3 class="st-viz-card-title">Stability Gauge</h3>
          <div class="st-gauge" id="st-gauge" role="img" aria-label="Performance stability gauge">
            <div class="st-gauge-inner">
              <div class="st-gauge-value" id="st-gauge-value">0</div>
              <div class="st-gauge-unit">volatility %</div>
            </div>
          </div>
          <p class="st-gauge-note" id="st-gauge-note">Very stable</p>
        </article>

        <article class="st-viz-card st-viz-card--timeline">
          <h3 class="st-viz-card-title">Last 10 Matches Timeline</h3>
          <div class="st-timeline-wrap">
            <div class="st-timeline-gridlines"></div>
            <div class="st-timeline-line" id="st-timeline-line"></div>
            <div class="st-timeline-points" id="st-timeline-points" role="img" aria-label="Last ten matches timeline with hover details"></div>
          </div>
          <div class="st-timeline-foot">
            <span>older</span>
            <strong>match flow</strong>
            <span>newer</span>
          </div>
        </article>
      </div>
    </section>
  `;
}

function reorderEmbeddedStatCards(container) {
  const sectionOrders = {
    'Core Totals': ['matches', 'time-lived', 'damage', 'damage-taken', 'kills', 'coins'],
    'Per Match Efficiency': ['avg-survival-match', 'avg-damage-match', 'avg-damage-minute', 'avg-kills-match', 'avg-kills-minute', 'avg-coins-match'],
    'Peak Records': ['best-score', 'highest-level', 'best-survival', 'best-damage', 'best-kills', 'best-coins'],
    'Run Shape And Stability': ['short-match-ratio', 'long-match-ratio', 'performance-volatility'],
  };

  const sections = container.querySelectorAll('.st-stat-section');
  sections.forEach((sectionEl) => {
    const titleEl = sectionEl.querySelector('.st-section-title');
    const gridEl = sectionEl.querySelector('.st-grid--section');
    if (!titleEl || !gridEl) return;

    const desiredOrder = sectionOrders[titleEl.textContent?.trim()];
    if (!Array.isArray(desiredOrder) || !desiredOrder.length) return;

    const cardsByStat = new Map();
    gridEl.querySelectorAll('.st-card').forEach((cardEl) => {
      const valueEl = cardEl.querySelector('.js-st-count[data-stat]');
      if (valueEl?.dataset?.stat) cardsByStat.set(valueEl.dataset.stat, cardEl);
    });

    desiredOrder.forEach((statKey) => {
      const cardEl = cardsByStat.get(statKey);
      if (cardEl) gridEl.appendChild(cardEl);
    });
  });
}

function aggregateMappedMatchStats(mappedMatches) {
  if (!Array.isArray(mappedMatches) || !mappedMatches.length) {
    return {
      damageDealt: 0,
      damageTaken: 0,
      enemiesKilled: 0,
      totalMinutesLived: 0,
      matchesPlayed: 0,
      coinsCollected: 0,
      averageDamagePerMatch: 0,
      averageKillsPerMatch: 0,
      averageCoinsPerMatch: 0,
      averageKillsPerMinute: 0,
      averageDamagePerMinute: 0,
      averageSurvivalSecondsPerMatch: 0,
      bestMatchDamage: 0,
      bestMatchKills: 0,
      bestMatchSurvivalSeconds: 0,
      highestLevelReached: 0,
      bestMatchCoins: 0,
      bestMatchScore: 0,
      shortMatchRatioPercent: 0,
      longMatchRatioPercent: 0,
      performanceVolatilityPercent: 0,
      recentTimelineMatches: [],
    };
  }

  const SHORT_MATCH_THRESHOLD_SECONDS = 2 * 60;
  const LONG_MATCH_THRESHOLD_SECONDS = 10 * 60;

  let totalDamageDealt = 0;
  let totalDamageTaken = 0;
  let totalEnemiesKilled = 0;
  let totalDurationSeconds = 0;
  let totalCoinsCollected = 0;
  let bestMatchDamage = 0;
  let bestMatchKills = 0;
  let bestMatchSurvivalSeconds = 0;
  let highestLevelReached = 0;
  let bestMatchCoins = 0;
  let bestMatchScore = 0;
  let shortMatchesCount = 0;
  let longMatchesCount = 0;
  const performanceScores = [];

  mappedMatches.forEach((match) => {
    const damageDealt = toNonNegativeInt(match?.damageDealt);
    const damageTaken = toNonNegativeInt(match?.damageTaken);
    const enemiesKilled = toNonNegativeInt(match?.enemiesKilled);
    const durationSeconds = toNonNegativeInt(match?.durationSeconds);
    const coinsCollected = toNonNegativeInt(match?.coinsCollected);
    const levelReached = toNonNegativeInt(match?.levelReached);

    totalDamageDealt += damageDealt;
    totalDamageTaken += damageTaken;
    totalEnemiesKilled += enemiesKilled;
    totalDurationSeconds += durationSeconds;
    totalCoinsCollected += coinsCollected;

    bestMatchDamage = Math.max(bestMatchDamage, damageDealt);
    bestMatchKills = Math.max(bestMatchKills, enemiesKilled);
    bestMatchSurvivalSeconds = Math.max(bestMatchSurvivalSeconds, durationSeconds);
    highestLevelReached = Math.max(highestLevelReached, levelReached);
    bestMatchCoins = Math.max(bestMatchCoins, coinsCollected);

    if (durationSeconds < SHORT_MATCH_THRESHOLD_SECONDS) shortMatchesCount += 1;
    if (durationSeconds > LONG_MATCH_THRESHOLD_SECONDS) longMatchesCount += 1;

    const performanceScore = damageDealt + enemiesKilled * 120 + coinsCollected * 4 + levelReached * 250;
    bestMatchScore = Math.max(bestMatchScore, performanceScore);
    performanceScores.push(performanceScore);
  });

  const matchesPlayed = mappedMatches.length;
  const totalDurationMinutes = totalDurationSeconds / 60;

  return {
    damageDealt: totalDamageDealt,
    damageTaken: totalDamageTaken,
    enemiesKilled: totalEnemiesKilled,
    totalMinutesLived: Math.round(totalDurationSeconds / 60),
    matchesPlayed,
    coinsCollected: totalCoinsCollected,
    averageDamagePerMatch: toNonNegativeInt(mnSafeDivide(totalDamageDealt, matchesPlayed)),
    averageKillsPerMatch: toNonNegativeInt(mnSafeDivide(totalEnemiesKilled, matchesPlayed)),
    averageCoinsPerMatch: toNonNegativeInt(mnSafeDivide(totalCoinsCollected, matchesPlayed)),
    averageKillsPerMinute: toNonNegativeInt(mnSafeDivide(totalEnemiesKilled, totalDurationMinutes)),
    averageDamagePerMinute: toNonNegativeInt(mnSafeDivide(totalDamageDealt, totalDurationMinutes)),
    averageSurvivalSecondsPerMatch: toNonNegativeInt(mnSafeDivide(totalDurationSeconds, matchesPlayed)),
    bestMatchDamage,
    bestMatchKills,
    bestMatchSurvivalSeconds,
    highestLevelReached,
    bestMatchCoins,
    bestMatchScore,
    shortMatchRatioPercent: toNonNegativeInt(mnSafeDivide(shortMatchesCount * 100, matchesPlayed)),
    longMatchRatioPercent: toNonNegativeInt(mnSafeDivide(longMatchesCount * 100, matchesPlayed)),
    performanceVolatilityPercent: toNonNegativeInt(mnCalculateCoefficientOfVariationPercent(performanceScores)),
    recentTimelineMatches: buildRecentTimelineFromMappedMatches(mappedMatches),
  };
}

function buildRecentTimelineFromMappedMatches(mappedMatches) {
  if (!Array.isArray(mappedMatches) || !mappedMatches.length) return [];

  return mappedMatches
    .map((match, index) => {
      const parsed = parseBackendDate(match?.playedAt);
      const createdAtTime = parsed && !Number.isNaN(parsed.getTime()) ? parsed.getTime() : index;
      const damage = toNonNegativeInt(match?.damageDealt);
      const kills = toNonNegativeInt(match?.enemiesKilled);
      const coins = toNonNegativeInt(match?.coinsCollected);
      const level = toNonNegativeInt(match?.levelReached);
      const durationSeconds = toNonNegativeInt(match?.durationSeconds);
      const performanceScore = damage + kills * 120 + coins * 4 + level * 250;

      return { damage, kills, coins, level, durationSeconds, performanceScore, createdAtTime };
    })
    .sort((left, right) => left.createdAtTime - right.createdAtTime)
    .slice(-10)
    .map((entry, index) => ({ ...entry, matchNumber: index + 1 }));
}

function applyEmbeddedStatsToCards(container, stats) {
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

function renderEmbeddedStatsVisuals(container, stats) {
  const matchesPlayed = toNonNegativeInt(stats.matchesPlayed);
  const shortRatio = matchesPlayed > 0 ? mnClamp(toNonNegativeInt(stats.shortMatchRatioPercent), 0, 100) : 0;
  const longRatio = matchesPlayed > 0 ? mnClamp(toNonNegativeInt(stats.longMatchRatioPercent), 0, 100) : 0;
  const normalRatio = matchesPlayed > 0 ? mnClamp(100 - shortRatio - longRatio, 0, 100) : 0;

  const shortEl = container.querySelector('#st-ratio-short');
  const normalEl = container.querySelector('#st-ratio-normal');
  const longEl = container.querySelector('#st-ratio-long');
  if (shortEl) shortEl.style.width = `${shortRatio}%`;
  if (normalEl) normalEl.style.width = `${normalRatio}%`;
  if (longEl) longEl.style.width = `${longRatio}%`;

  const shortLabel = container.querySelector('#st-ratio-short-label');
  const normalLabel = container.querySelector('#st-ratio-normal-label');
  const longLabel = container.querySelector('#st-ratio-long-label');
  if (shortLabel) shortLabel.textContent = `${shortRatio}%`;
  if (normalLabel) normalLabel.textContent = `${normalRatio}%`;
  if (longLabel) longLabel.textContent = `${longRatio}%`;

  const avgDamage = toNonNegativeInt(stats.averageDamagePerMatch);
  const avgKills = toNonNegativeInt(stats.averageKillsPerMatch);
  const avgCoins = toNonNegativeInt(stats.averageCoinsPerMatch);
  const damageWeighted = avgDamage;
  const killsWeighted = avgKills * 120;
  const coinsWeighted = avgCoins * 4;
  const weightedBase = Math.max(damageWeighted, killsWeighted, coinsWeighted, 1);

  const damageWidth = mnClamp(Math.round((damageWeighted / weightedBase) * 100), 0, 100);
  const killsWidth = mnClamp(Math.round((killsWeighted / weightedBase) * 100), 0, 100);
  const coinsWidth = mnClamp(Math.round((coinsWeighted / weightedBase) * 100), 0, 100);

  const damageBar = container.querySelector('#st-bar-damage');
  const killsBar = container.querySelector('#st-bar-kills');
  const coinsBar = container.querySelector('#st-bar-coins');
  if (damageBar) damageBar.style.width = `${damageWidth}%`;
  if (killsBar) killsBar.style.width = `${killsWidth}%`;
  if (coinsBar) coinsBar.style.width = `${coinsWidth}%`;

  const damageValue = container.querySelector('#st-bar-damage-value');
  const killsValue = container.querySelector('#st-bar-kills-value');
  const coinsValue = container.querySelector('#st-bar-coins-value');
  if (damageValue) damageValue.textContent = avgDamage.toLocaleString('en-US');
  if (killsValue) killsValue.textContent = avgKills.toLocaleString('en-US');
  if (coinsValue) coinsValue.textContent = avgCoins.toLocaleString('en-US');

  const volatility = mnClamp(toNonNegativeInt(stats.performanceVolatilityPercent), 0, 100);
  const gauge = container.querySelector('#st-gauge');
  if (gauge) gauge.style.setProperty('--volatility', String(volatility));

  const gaugeValue = container.querySelector('#st-gauge-value');
  if (gaugeValue) gaugeValue.textContent = String(volatility);

  const gaugeNote = container.querySelector('#st-gauge-note');
  if (gaugeNote) {
    if (volatility <= 15) gaugeNote.textContent = 'Very stable';
    else if (volatility <= 35) gaugeNote.textContent = 'Stable';
    else if (volatility <= 60) gaugeNote.textContent = 'Swingy';
    else gaugeNote.textContent = 'High variance';
  }

  const timelineLine = container.querySelector('#st-timeline-line');
  const timelinePoints = container.querySelector('#st-timeline-points');
  if (!timelineLine || !timelinePoints) return;

  const timelineMatches = Array.isArray(stats.recentTimelineMatches) ? stats.recentTimelineMatches : [];
  timelinePoints.innerHTML = '';

  if (timelineMatches.length < 2) {
    timelineLine.style.clipPath = 'polygon(0% 65%, 100% 65%, 100% 69%, 0% 69%)';
    return;
  }

  const scores = timelineMatches.map((entry) => toNonNegativeInt(entry.performanceScore));
  const maxScore = Math.max(...scores, 1);
  const minScore = Math.min(...scores, 0);
  const range = Math.max(1, maxScore - minScore);

  const points = timelineMatches.map((entry, index) => ({
    x: (index / (timelineMatches.length - 1)) * 100,
    y: 86 - ((toNonNegativeInt(entry.performanceScore) - minScore) / range) * 72,
    entry,
  }));

  timelineLine.style.clipPath = `polygon(${points.map((point) => `${point.x.toFixed(2)}% ${point.y.toFixed(2)}%`).join(', ')}, 100% 100%, 0% 100%)`;

  points.forEach((point) => {
    const dot = document.createElement('span');
    dot.className = 'st-timeline-point';
    dot.style.left = `${point.x}%`;
    dot.style.top = `${point.y}%`;
    const tooltip =
      `M${point.entry.matchNumber} | Score ${toNonNegativeInt(point.entry.performanceScore).toLocaleString('en-US')} | ` +
      `Dmg ${toNonNegativeInt(point.entry.damage)} | K ${toNonNegativeInt(point.entry.kills)} | ` +
      `C ${toNonNegativeInt(point.entry.coins)} | Lv ${toNonNegativeInt(point.entry.level)} | ` +
      `${formatEmbeddedDurationLabel(point.entry.durationSeconds)}`;
    dot.setAttribute('data-tip', tooltip);
    dot.setAttribute('aria-label', tooltip);
    timelinePoints.appendChild(dot);
  });
}

function animateEmbeddedStats(container) {
  const valueEls = container.querySelectorAll('.js-st-count');
  if (!valueEls.length) return;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function formatInt(value) {
    return Math.round(value).toLocaleString('en-US');
  }

  function formatDecimal(value) {
    return value.toFixed(2);
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

    const startDelay = 140 + index * 55;
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
      if (type === 'decimal') {
        el.textContent = formatDecimal(value);
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

function formatEmbeddedDurationLabel(totalSeconds) {
  const seconds = toNonNegativeInt(totalSeconds);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function mnCalculateCoefficientOfVariationPercent(values) {
  if (!Array.isArray(values) || values.length < 2) return 0;
  const normalized = values.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value >= 0);
  if (normalized.length < 2) return 0;
  const mean = normalized.reduce((sum, value) => sum + value, 0) / normalized.length;
  if (mean <= 0) return 0;
  const variance = normalized.map((value) => Math.pow(value - mean, 2)).reduce((sum, value) => sum + value, 0) / normalized.length;
  return mnSafeDivide(Math.sqrt(variance) * 100, mean);
}

function mnSafeDivide(numerator, denominator) {
  const left = Number(numerator);
  const right = Number(denominator);
  if (!Number.isFinite(left) || !Number.isFinite(right) || right <= 0) return 0;
  return left / right;
}

function mnClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatCount(value) {
  return toNonNegativeInt(value).toLocaleString('en-US');
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
