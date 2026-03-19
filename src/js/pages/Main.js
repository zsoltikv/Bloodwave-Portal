import '../../css/pages/Main.css';
import { getUser, logout } from '../auth.js';
import { confirmLogout } from '../logout-confirm.js';
import { ensureGlobalStarfield } from '../global-starfield.js';

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
          </div>

          <!-- Right: avatar + hamburger -->
          <div class="mn-right">

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
          </div>

          <div class="mn-matches-layout">
            <div class="mn-matches-list" id="mn-matches-list" role="listbox" aria-label="Played matches"></div>
            <section class="mn-match-panel" id="mn-match-panel" aria-live="polite"></section>
          </div>
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

  // ── Matches list + details ───────────────────────────────────────────────
  const matches = getMockMatches();
  const matchesList = container.querySelector('#mn-matches-list');
  const matchPanel  = container.querySelector('#mn-match-panel');
  let selectedMatchId = matches[0]?.id ?? null;
  let summaryState = null;
  let summaryAnimRunId = 0;

  function ensureMatchPanelSkeleton() {
    if (!matchPanel) return;
    if (matchPanel.querySelector('.mn-summary-duration')) return;

    matchPanel.innerHTML = `
      <h2 class="mn-panel-title">Run Summary</h2>
      <div class="mn-panel-grid">
        <div class="mn-panel-stat">
          <div class="mn-panel-label">Duration</div>
          <div class="mn-panel-value mn-summary-duration">00:00</div>
        </div>
        <div class="mn-panel-stat">
          <div class="mn-panel-label">Level Reached</div>
          <div class="mn-panel-value mn-summary-level">0</div>
        </div>
        <div class="mn-panel-stat">
          <div class="mn-panel-label">Played At</div>
          <div class="mn-panel-value mn-summary-played-at">-</div>
        </div>
      </div>
      <div class="mn-panel-note">More match data can be shown here later (kills, build, map, rewards, etc.).</div>
    `;
  }

  function triggerValueUpdateAnimation(valueEl) {
    if (!valueEl) return;
    valueEl.classList.remove('is-updating');
    // Force reflow so the same class can retrigger on consecutive clicks.
    void valueEl.offsetWidth;
    valueEl.classList.add('is-updating');
    valueEl.addEventListener('animationend', () => {
      valueEl.classList.remove('is-updating');
    }, { once: true });
  }

  function animateNumericValue(valueEl, fromValue, toValue, formatter, runId) {
    if (!valueEl) return;

    const startValue = Number.isFinite(fromValue) ? fromValue : 0;
    const endValue = Number.isFinite(toValue) ? toValue : 0;

    if (startValue === endValue) {
      valueEl.textContent = formatter(endValue);
      triggerValueUpdateAnimation(valueEl);
      return;
    }

    triggerValueUpdateAnimation(valueEl);

    const delta = Math.abs(endValue - startValue);
    const duration = Math.min(650, Math.max(280, delta * 16));
    const startTs = performance.now();

    const step = (now) => {
      if (runId !== summaryAnimRunId) return;

      const progress = Math.min(1, (now - startTs) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (endValue - startValue) * eased);

      valueEl.textContent = formatter(currentValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  function updatePlayedAtValue(valueEl, nextText) {
    if (!valueEl) return;
    valueEl.textContent = nextText;
    triggerValueUpdateAnimation(valueEl);
  }

  function renderMatchPanel(match) {
    if (!matchPanel) return;

    if (!match) {
      summaryAnimRunId += 1;
      summaryState = null;
      matchPanel.innerHTML = `
        <div class="mn-match-empty">No played matches yet.</div>
      `;
      return;
    }

    ensureMatchPanelSkeleton();

    const durationValueEl = matchPanel.querySelector('.mn-summary-duration');
    const levelValueEl = matchPanel.querySelector('.mn-summary-level');
    const playedAtValueEl = matchPanel.querySelector('.mn-summary-played-at');

    if (!summaryState) {
      durationValueEl.textContent = formatDuration(match.durationSeconds);
      levelValueEl.textContent = String(match.levelReached);
      playedAtValueEl.textContent = formatPlayedAt(match.playedAt);

      summaryState = {
        durationSeconds: match.durationSeconds,
        levelReached: match.levelReached,
        playedAt: match.playedAt,
      };
      return;
    }

    const runId = ++summaryAnimRunId;

    animateNumericValue(
      durationValueEl,
      summaryState.durationSeconds,
      match.durationSeconds,
      formatDuration,
      runId,
    );

    animateNumericValue(
      levelValueEl,
      summaryState.levelReached,
      match.levelReached,
      (value) => String(value),
      runId,
    );

    updatePlayedAtValue(playedAtValueEl, formatPlayedAt(match.playedAt));

    summaryState = {
      durationSeconds: match.durationSeconds,
      levelReached: match.levelReached,
      playedAt: match.playedAt,
    };
  }

  function renderMatches() {
    if (!matchesList) return;

    if (!matches.length) {
      matchesList.innerHTML = '<div class="mn-match-empty">No played matches yet.</div>';
      renderMatchPanel(null);
      return;
    }

    matchesList.innerHTML = matches.map((match) => {
      const isActive = match.id === selectedMatchId;
      return `
        <button
          type="button"
          class="mn-match-item${isActive ? ' active' : ''}"
          data-match-id="${match.id}"
          role="option"
          aria-selected="${String(isActive)}"
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

  renderMatches();

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
  return new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDateString));
}

function getMockMatches() {
  return [
    { id: 'run-001', durationSeconds: 2194, levelReached: 24, playedAt: '2026-03-17T20:43:00' },
    { id: 'run-002', durationSeconds: 1548, levelReached: 19, playedAt: '2026-03-16T22:11:00' },
    { id: 'run-003', durationSeconds: 2872, levelReached: 31, playedAt: '2026-03-15T18:08:00' },
    { id: 'run-004', durationSeconds: 984,  levelReached: 12, playedAt: '2026-03-14T14:30:00' },
    { id: 'run-005', durationSeconds: 311, levelReached: 15, playedAt: '2026-03-13T21:56:00' },
    { id: 'run-005', durationSeconds: 514, levelReached: 23, playedAt: '2026-03-13T21:56:00' },
    { id: 'run-005', durationSeconds: 145, levelReached: 5, playedAt: '2026-03-13T21:56:00' },
    { id: 'run-005', durationSeconds: 2245, levelReached: 6, playedAt: '2026-03-13T21:56:00' },
    { id: 'run-005', durationSeconds: 112, levelReached: 3, playedAt: '2026-03-13T21:56:00' },
  ];
}