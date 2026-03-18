import '../../css/pages/Leaderboard.css';
import { getUser, logout, authFetch } from '../auth.js';
import { confirmLogout } from '../logout-confirm.js';

const API_BASE = 'http://5.38.140.128:5000';

export default function Leaderboard(container) {
  container.innerHTML = `
    

    <div class="lb-root">
      <canvas id="lb-canvas" class="bw-canvas"></canvas>
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
    // Mock data for testing
    const mockLeaderboard = [
      { username: 'ShadowNinja', level: 47, runTime: 3847 },
      { username: 'PhoenixRise', level: 45, runTime: 3652 },
      { username: 'StormBreaker', level: 44, runTime: 3521 },
      { username: 'VoidWalker', level: 42, runTime: 3248 },
      { username: 'IceQueen', level: 41, runTime: 3156 },
      { username: 'ThunderLord', level: 40, runTime: 2987 },
      { username: 'MysticMage', level: 39, runTime: 2845 },
      { username: 'SilentAssassin', level: 38, runTime: 2634 },
      { username: 'NeonGhost', level: 37, runTime: 2521 },
      { username: 'IronFist', level: 36, runTime: 2418 },
      { username: 'VenomStrike', level: 35, runTime: 2305 },
      { username: 'LunarEclipse', level: 34, runTime: 2187 },
      { username: 'DarkSoul', level: 33, runTime: 2056 },
      { username: 'BlazingInferno', level: 32, runTime: 1945 },
      { username: 'CrimsonBlade', level: 31, runTime: 1834 },
    ];

    try {
      // Uncomment when API is ready:
      // const response = await authFetch(`${API_BASE}/leaderboard`);
      // if (!response.ok) throw new Error('Failed to fetch leaderboard');
      // const data = await response.json();

      const grid = document.getElementById('lb-grid');
      grid.innerHTML = '';

      if (!mockLeaderboard || mockLeaderboard.length === 0) {
        grid.innerHTML = '<div class="lb-empty">No players yet</div>';
        return;
      }

      mockLeaderboard.forEach((entry, index) => {
        const card = document.createElement('div');
        card.className = 'lb-card';
        if (index < 3) card.classList.add(`lb-rank-${index + 1}`);

        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

        card.innerHTML = `
          <div class="lb-card-corner lb-card-corner--tl"></div>
          <div class="lb-card-corner lb-card-corner--tr"></div>
          <div class="lb-card-corner lb-card-corner--bl"></div>
          <div class="lb-card-corner lb-card-corner--br"></div>
          <div class="lb-card-body">
            <div class="lb-card-rank">${medal}</div>
            <div class="lb-card-username">${entry.username || 'Unknown'}</div>
            <div class="lb-card-sep"></div>
            <div class="lb-card-stats">
              <div class="lb-stat">
                <span class="lb-stat-label">Level</span>
                <span class="lb-stat-value js-lb-count" data-type="int" data-target="${entry.level || 0}">${entry.level || 0}</span>
              </div>
              <div class="lb-stat">
                <span class="lb-stat-label">Run Time</span>
                <span class="lb-stat-value js-lb-count" data-type="time-hm" data-target="${entry.runTime || 0}">${formatTime(entry.runTime || 0)}</span>
              </div>
            </div>
          </div>
        `;

        grid.appendChild(card);
      });

      animateLbStats(grid);
    } catch (error) {
      console.error('Leaderboard error:', error);
      document.getElementById('lb-grid').innerHTML = '<div class="lb-empty">Failed to load leaderboard</div>';
    }
  }

  function formatTime(seconds) {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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
  initLbCanvas();
  loadLeaderboard();
}
