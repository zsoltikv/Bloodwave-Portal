import '../../css/pages/Login.css';
import { login } from '../auth.js';

export default function Login(container) {
  container.innerHTML = `
    <div class="bw-root">
      <canvas id="lx-canvas" class="bw-canvas"></canvas>
      <div class="bw-glow-center"></div>

      <div class="bw-card">
        <div class="bw-card-inner">
          <div class="bw-corner bw-corner--tl"></div>
          <div class="bw-corner bw-corner--tr"></div>
          <div class="bw-corner bw-corner--bl"></div>
          <div class="bw-corner bw-corner--br"></div>

          <div class="bw-header">
            <div class="bw-ornament">
              <div class="bw-ornament-line"></div>
              <div class="bw-ornament-diamond"></div>
              <div class="bw-ornament-line"></div>
            </div>
            <h1 class="bw-title">Bloodwave</h1>
            <p class="bw-subtitle">Members&nbsp;&nbsp;Only&nbsp;&nbsp;Access</p>
          </div>

          <form class="bw-form" id="lxForm">

            <div class="bw-field">
              <label class="bw-label">Username</label>
              <div class="bw-input-wrap">
                <input type="text" id="lxUsername" class="bw-input" placeholder="your_username" required autocomplete="username" />
                <div class="bw-input-line"></div>
              </div>
            </div>

            <div class="bw-field">
              <label class="bw-label">Password</label>
              <div class="bw-input-wrap">
                <input type="password" id="lxPassword" class="bw-input" placeholder="············" required autocomplete="current-password" style="padding-right: clamp(40px, 9vw, 52px);" />
                <button type="button" class="bw-pw-toggle" id="lxPwToggle" aria-label="Toggle password visibility">
                  <svg id="lxEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div class="bw-input-line"></div>
              </div>
            </div>

            <div class="bw-extras">
              <label class="bw-remember">
                <input type="checkbox" class="bw-checkbox" />
                <span class="bw-remember-label">Remember Me</span>
              </label>
              <a href="/forgot-password" data-link class="bw-forgot">Forgot Password</a>
            </div>

            <span class="bw-error" id="lxError" style="text-align:center;"></span>

            <button type="submit" class="bw-btn" id="lxBtn">
              <div class="bw-btn-shimmer"></div>
              <span class="bw-btn-text">Enter</span>
            </button>

            <div class="bw-divider">
              <div class="bw-divider-line"></div>
              <span class="bw-divider-text">or</span>
              <div class="bw-divider-line"></div>
            </div>

            <div class="bw-footer-link">
              <p>New member? <a href="/register" data-link>Join Now</a></p>
            </div>

          </form>
        </div>
      </div>
    </div>
  `;

  initCanvas();
  spawnParticles();

  const form = document.getElementById('lxForm');
  const btn  = document.getElementById('lxBtn');

  const errorEl = document.getElementById('lxError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';

    const username   = document.getElementById('lxUsername').value.trim();
    const password   = document.getElementById('lxPassword').value;
    const rememberMe = document.querySelector('#lxForm .bw-checkbox')?.checked ?? false;

    btn.disabled = true;
    btn.querySelector('.bw-btn-text').textContent = '✦  Entering…  ✦';

    try {
      await login(username, password, rememberMe);
      btn.classList.add('success');
      btn.querySelector('.bw-btn-text').textContent = '✦  Welcome Back  ✦';
      setTimeout(() => window.router.navigate('/main'), 700);
    } catch (err) {
      errorEl.textContent = err.message || 'Login failed. Please try again.';
      btn.querySelector('.bw-btn-text').textContent = 'Enter';
      btn.disabled = false;
    }
  });

  // Password visibility toggle
  const pwToggle  = document.getElementById('lxPwToggle');
  const pwInput   = document.getElementById('lxPassword');
  const eyeIcon   = document.getElementById('lxEyeIcon');
  const eyeOpen   = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />`;
  const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />`;
  pwToggle.addEventListener('click', () => {
    const isHidden = pwInput.type === 'password';
    pwInput.type = isHidden ? 'text' : 'password';
    eyeIcon.innerHTML = isHidden ? eyeClosed : eyeOpen;
  });
}

/* ============================================================
   CANVAS – star field that CONCENTRATES around the card
   ============================================================ */
function initCanvas() {
  const canvas = document.getElementById('lx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, cardCX, cardCY, cardW, cardH;
  let stars = [];
  let animId;

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const card = document.querySelector('.bw-card-inner');
    if (card) {
      const r = card.getBoundingClientRect();
      cardCX = r.left + r.width  / 2;
      cardCY = r.top  + r.height / 2;
      cardW  = r.width;
      cardH  = r.height;
    } else {
      cardCX = W / 2;
      cardCY = H / 2;
      cardW  = 420;
      cardH  = 560;
    }
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(makeStar(i < STAR_COUNT * 0.45, true));
    }
  }

  const STAR_COUNT = 220;

  // Defer so the card has finished layout before we measure
  requestAnimationFrame(() => {
    measure();
    initStars();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        measure();
        initStars();
      }, 150);
    });

    let streakTimer = 0;

    function draw() {
      if (!document.getElementById('lx-canvas')) { cancelAnimationFrame(animId); return; }
      ctx.clearRect(0, 0, W, H);

      streakTimer++;
      if (streakTimer > 180 + Math.random() * 180) {
        drawStreak(ctx, cardCX, cardCY, cardW, cardH, W, H);
        streakTimer = 0;
      }

      stars.forEach((s, i) => {
        s.flicker += s.flickerSpeed;
        s.life++;

        const fade  = Math.min(s.life / 40, 1) * Math.max(1 - (s.life - s.maxLife * 0.8) / (s.maxLife * 0.2), 0);
        const alpha = s.opacity * (0.65 + 0.35 * Math.sin(s.flicker)) * Math.max(fade, 0.01);
        const extra = s.nearCard ? 1.25 : 1;

        ctx.globalAlpha = Math.min(alpha * extra, 1);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.isRed ? '#CC1A1A' : s.isGold ? '#D4AF37' : '#FFE8D8';
        ctx.fill();
        ctx.globalAlpha = 1;

        s.x += s.vx;
        s.y += s.vy;

        if (s.life > s.maxLife || s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20) {
          stars[i] = makeStar(Math.random() < 0.45, false);
        }
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
  });

  function makeStar(nearCard, firstTime) {
    const isRed  = Math.random() < 0.07;
    const isGold = !isRed && Math.random() < 0.04;
    const r      = Math.random() * 1.4 + 0.2;

    let x, y;
    if (nearCard) {
      const haloR = (Math.max(cardW, cardH) * 0.5) + Math.random() * Math.min(W, H) * 0.35;
      const angle = Math.random() * Math.PI * 2;
      x = cardCX + Math.cos(angle) * haloR;
      y = cardCY + Math.sin(angle) * haloR;
    } else {
      x = Math.random() * W;
      y = firstTime ? Math.random() * H : H + 5;
    }

    const baseAngle = Math.atan2(cardCY - y, cardCX - x);
    const scatter   = (Math.random() - 0.5) * 0.9;
    const speed     = Math.random() * 0.22 + 0.05;

    return {
      x, y, r,
      vx: Math.cos(baseAngle + scatter) * speed * 0.4,
      vy: Math.sin(baseAngle + scatter) * speed * (Math.random() < 0.6 ? 0.5 : -0.2),
      opacity: Math.random() * 0.65 + 0.18,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.025 + 0.004,
      isRed, isGold, nearCard,
      life: 0,
      maxLife: 400 + Math.random() * 600,
    };
  }
}

function drawStreak(ctx, cx, cy, cw, ch, W, H) {
  let x, y;
  if (Math.random() < 0.5) {
    x = Math.random() * W;
    y = Math.random() * cy * 0.6;
  } else {
    x = Math.random() > 0.5 ? -10 : W + 10;
    y = Math.random() * H;
  }

  const targetX = cx + (Math.random() - 0.5) * cw * 1.5;
  const targetY = cy + (Math.random() - 0.5) * ch * 1.5;
  const len     = Math.hypot(targetX - x, targetY - y) * (0.4 + Math.random() * 0.4);
  const angle   = Math.atan2(targetY - y, targetX - x);

  const grd = ctx.createLinearGradient(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(0.45, 'rgba(220,60,40,0.55)');
  grd.addColorStop(0.55, 'rgba(255,200,180,0.7)');
  grd.addColorStop(1, 'transparent');

  ctx.save();
  ctx.lineWidth = Math.random() * 1.2 + 0.4;
  ctx.strokeStyle = grd;
  ctx.shadowColor = 'rgba(200,50,30,0.4)';
  ctx.shadowBlur  = 6;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  ctx.stroke();
  ctx.restore();
}

function spawnParticles() {
  const root = document.querySelector('.bw-root');
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
