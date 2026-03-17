import '../../css/pages/Main.css';
import { getUser, logout } from '../auth.js';

export default function Main(container) {
  container.innerHTML = `
    

    <div class="mn-root">
      <canvas id="mn-canvas" class="bw-canvas"></canvas>
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
        <div class="mn-placeholder">
          <div class="mn-ornament">
            <div class="mn-ornament-line"></div>
            <div class="mn-ornament-diamond"></div>
            <div class="mn-ornament-line"></div>
          </div>
          <h1 class="mn-placeholder-title">Welcome Back</h1>
          <p class="mn-placeholder-sub">Your&nbsp;&nbsp;feed&nbsp;&nbsp;is&nbsp;&nbsp;loading</p>
        </div>
      </main>

    </div>
  `;

  // ── Canvas starfield ──────────────────────────────────────────────────────
  initMnCanvas();
  spawnMnParticles();

  // ── Populate username ────────────────────────────────────────────────────
  const user = getUser();
  const displayName = user?.username ?? user?.email ?? 'Member';

  const ddUsername     = container.querySelector('#mn-dd-username');
  const mobileUsername = container.querySelector('#mn-mobile-username');
  if (ddUsername)     ddUsername.textContent     = displayName;
  if (mobileUsername) mobileUsername.textContent = displayName;

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
    await logout();
    // logout() already navigates to /login
  };

  container.querySelector('#mn-dd-logout')?.addEventListener('click', doLogout);
  container.querySelector('#mn-mobile-logout')?.addEventListener('click', doLogout);
}

/* ======================================================================
   CANVAS — same drifting star system as Login, no card bias
   ====================================================================== */
function initMnCanvas() {
  const canvas = document.getElementById('mn-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  measure();
  window.addEventListener('resize', measure);

  const STAR_COUNT = 200;
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) stars.push(makeStar(true));

  function makeStar(firstTime) {
    const isRed  = Math.random() < 0.07;
    const isGold = !isRed && Math.random() < 0.04;
    const r      = Math.random() * 1.4 + 0.3;
    return {
      x: Math.random() * (W || window.innerWidth),
      y: firstTime ? Math.random() * (H || window.innerHeight) : (H || window.innerHeight) + 5,
      r,
      vx: (Math.random() - 0.5) * 0.06,
      vy: -(Math.random() * 0.18 + 0.04),
      opacity: Math.random() * 0.6 + 0.2,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.02 + 0.004,
      isRed, isGold,
      life: 0,
      maxLife: 500 + Math.random() * 700,
    };
  }

  let streakTimer = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    streakTimer++;
    if (streakTimer > 200 + Math.random() * 200) {
      drawMnStreak(ctx, W, H);
      streakTimer = 0;
    }

    stars.forEach((s, i) => {
      s.flicker += s.flickerSpeed;
      s.life++;
      const fade  = Math.min(s.life / 40, 1) * Math.max(1 - (s.life - s.maxLife * 0.8) / (s.maxLife * 0.2), 0);
      const alpha = s.opacity * (0.65 + 0.35 * Math.sin(s.flicker)) * Math.max(fade, 0.01);

      ctx.globalAlpha = Math.min(alpha, 1);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.isRed ? '#CC1A1A' : s.isGold ? '#D4AF37' : '#FFE8D8';
      ctx.fill();
      ctx.globalAlpha = 1;

      s.x += s.vx;
      s.y += s.vy;

      if (s.life > s.maxLife || s.y < -20 || s.x < -20 || s.x > W + 20) {
        stars[i] = makeStar(false);
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}

function drawMnStreak(ctx, W, H) {
  const x = Math.random() * W;
  const y = Math.random() * H * 0.7;
  const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.6;
  const len   = 80 + Math.random() * 160;

  const grd = ctx.createLinearGradient(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(0.45, 'rgba(220,60,40,0.45)');
  grd.addColorStop(0.55, 'rgba(255,200,180,0.6)');
  grd.addColorStop(1, 'transparent');

  ctx.save();
  ctx.lineWidth = Math.random() * 1.0 + 0.3;
  ctx.strokeStyle = grd;
  ctx.shadowColor = 'rgba(200,50,30,0.3)';
  ctx.shadowBlur  = 5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  ctx.stroke();
  ctx.restore();
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

