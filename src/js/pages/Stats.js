import '../../css/pages/Stats.css';
import { getUser, logout } from '../auth.js';

export default function Stats(container) {
  container.innerHTML = `
    

    <div class="st-root">
      <canvas id="st-canvas" class="bw-canvas"></canvas>
      <div class="st-glow"></div>

      <!-- ===== NAVBAR ===== -->
      <nav class="st-nav">
        <div class="st-nav-inner">

          <a href="/main" data-link class="st-logo">Bloodwave</a>

          <div class="st-links">
            <a href="/main" data-link class="st-link"><span>Matches</span></a>
            <a href="/stats" data-link class="st-link active"><span>Stats</span></a>
          </div>

          <div class="st-right">
            <button class="st-avatar" id="st-profile-btn" aria-label="Profile & Settings">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </button>

            <button class="st-hamburger" id="st-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="st-bar"></span>
              <span class="st-bar"></span>
              <span class="st-bar"></span>
            </button>
          </div>

        </div>

        <div class="st-mobile-menu" id="st-mobile-menu">
          <div class="st-mobile-menu-inner">
            <a href="/main" data-link class="st-mobile-link">Matches</a>
            <a href="/stats" data-link class="st-mobile-link">Stats</a>
            <div class="st-mobile-divider"></div>
            <div class="st-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="st-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="st-mobile-username">—</span>
            </div>
            <div class="st-mobile-divider"></div>
            <a href="/user-panel" data-link class="st-mobile-link">Profile</a>
            <button class="st-mobile-logout" id="st-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- ===== CONTENT ===== -->
      <main class="st-content">
        <div class="st-inner">

          <!-- Header -->
          <div class="st-header">
            <div class="st-ornament">
              <div class="st-ornament-line"></div>
              <div class="st-ornament-diamond"></div>
              <div class="st-ornament-line"></div>
            </div>
            <h1 class="st-title">All&#8209;Time Stats</h1>
            <p class="st-subtitle">Lifetime&nbsp;&nbsp;performance&nbsp;&nbsp;overview</p>
          </div>

          <!-- Stat cards -->
          <div class="st-grid">

            <!-- Damage Dealt -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                  </svg>
                </div>
                <div class="st-card-name">Damage Dealt</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">1,482,390</div>
                <div class="st-card-unit">total damage</div>
              </div>
            </div>

            <!-- Enemies Killed -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </div>
                <div class="st-card-name">Enemies Killed</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">8,741</div>
                <div class="st-card-unit">eliminations</div>
              </div>
            </div>

            <!-- Time Lived -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Time Lived</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">347h 12m</div>
                <div class="st-card-unit">total survival time</div>
              </div>
            </div>

            <!-- Deaths -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <div class="st-card-name">Deaths</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">2,103</div>
                <div class="st-card-unit">times fallen</div>
              </div>
            </div>

            <!-- Matches Played -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                </div>
                <div class="st-card-name">Matches Played</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">3,256</div>
                <div class="st-card-unit">total games</div>
              </div>
            </div>

            <!-- K/D Ratio -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div class="st-card-name">K / D Ratio</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">4.16</div>
                <div class="st-card-unit">kills per death</div>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  `;

  // ── Canvas starfield ──────────────────────────────────────────────────────
  initStCanvas();
  spawnStParticles();

  const user = getUser();
  const displayName = user?.username ?? user?.email ?? 'Member';
  const mobileUsername = container.querySelector('#st-mobile-username');
  if (mobileUsername) mobileUsername.textContent = displayName;

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  const hamburger  = container.querySelector('#st-hamburger');
  const mobileMenu = container.querySelector('#st-mobile-menu');
  let menuOpen = false;

  hamburger?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    hamburger.setAttribute('aria-expanded', String(menuOpen));
    mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + 'px' : '0';
  });

  mobileMenu?.querySelectorAll('.st-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.style.maxHeight = '0';
    });
  });

  // ── Profile navigation ────────────────────────────────────────────────────
  const goToProfile = () => {
    window.router?.navigate('/user-panel');
  };
  container.querySelector('#st-profile-btn')?.addEventListener('click', goToProfile);
  container.querySelector('#st-profile-btn-mobile')?.addEventListener('click', goToProfile);

  // ── Logout functionality ──────────────────────────────────────────────────
  const logoutBtn = container.querySelector('#st-mobile-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      logoutBtn.disabled = true;
      logoutBtn.innerHTML = '✦ Logging out… ✦';
      await logout();
    });
  }
}

/* ======================================================================
   CANVAS
   ====================================================================== */
function initStCanvas() {
  const canvas = document.getElementById('st-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  measure();
  window.addEventListener('resize', measure);

  const stars = [];
  for (let i = 0; i < 200; i++) stars.push(makeStar(true));

  function makeStar(firstTime) {
    const isRed  = Math.random() < 0.07;
    const isGold = !isRed && Math.random() < 0.04;
    const r      = Math.random() * 1.4 + 0.3;
    return {
      x: Math.random() * (W || window.innerWidth),
      y: firstTime ? Math.random() * (H || window.innerHeight) : (H || window.innerHeight) + 5,
      r, vx: (Math.random() - 0.5) * 0.06, vy: -(Math.random() * 0.18 + 0.04),
      opacity: Math.random() * 0.6 + 0.2,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.02 + 0.004,
      isRed, isGold, life: 0, maxLife: 500 + Math.random() * 700,
    };
  }

  let streakTimer = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    streakTimer++;
    if (streakTimer > 200 + Math.random() * 200) {
      drawStreak(ctx, W, H);
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
      s.x += s.vx; s.y += s.vy;
      if (s.life > s.maxLife || s.y < -20 || s.x < -20 || s.x > W + 20) {
        stars[i] = makeStar(false);
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function drawStreak(ctx, W, H) {
  const x     = Math.random() * W;
  const y     = Math.random() * H * 0.7;
  const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.6;
  const len   = 80 + Math.random() * 160;
  const grd   = ctx.createLinearGradient(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
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

function spawnStParticles() {
  const root = document.querySelector('.st-root');
  if (!root) return;
  for (let i = 0; i < 18; i++) {
    const p        = document.createElement('div');
    p.className    = 'bw-particle';
    const size     = Math.random() * 2.2 + 0.4;
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
      animation-duration:${18 + Math.random() * 22}s;
      animation-delay:${Math.random() * 20}s;
      --drift:${(Math.random() - 0.5) * 90}px;
    `;
    root.appendChild(p);
  }
}

