import '../../css/pages/ForgotPassword.css';
export default function ForgotPassword(container) {
  container.innerHTML = `
    <div class="bw-root">
      <canvas id="fp-canvas" class="bw-canvas"></canvas>
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
            <p class="bw-subtitle">Restore&nbsp;&nbsp;Your&nbsp;&nbsp;Access</p>
          </div>

          <div class="bw-form" id="fpFormWrap">

            <p class="bw-desc">
              Enter your email address and we will send<br>
              you a link to reset your password.
            </p>

            <form id="fpForm" novalidate>
              <div class="bw-field">
                <label class="bw-label" for="fpEmail">Email Address</label>
                <div class="bw-input-wrap">
                  <input type="email" id="fpEmail" class="bw-input" placeholder="your@email.com" required autocomplete="email" />
                  <div class="bw-input-line"></div>
                </div>
                <span class="bw-error" id="fpEmailError"></span>
              </div>

              <button type="submit" class="bw-btn" id="fpBtn">
                <div class="bw-btn-shimmer"></div>
                <span class="bw-btn-text">Send Reset Link</span>
              </button>
            </form>

            <!-- Success state (hidden until submit) -->
            <div class="bw-success-panel" id="fpSuccess">
              <div class="bw-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <p class="bw-success-title">Check Your Inbox</p>
              <p class="bw-success-text">
                If an account exists for that address,<br>
                a reset link is on its way.
              </p>
              <div class="bw-success-sep"></div>
            </div>

            <div class="bw-divider">
              <div class="bw-divider-line"></div>
              <span class="bw-divider-text">or</span>
              <div class="bw-divider-line"></div>
            </div>

            <div class="bw-footer-link">
              <p>Remembered it? <a href="/login" data-link>Sign In</a></p>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;

  initFpCanvas();
  spawnFpParticles();

  const form       = document.getElementById('fpForm');
  const btn        = document.getElementById('fpBtn');
  const emailInput = document.getElementById('fpEmail');
  const emailError = document.getElementById('fpEmailError');
  const successPanel = document.getElementById('fpSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    emailError.textContent = '';

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email is required';
      return;
    }
    if (!emailRe.test(emailInput.value.trim())) {
      emailError.textContent = 'Invalid email address';
      return;
    }

    btn.classList.add('success');
    btn.querySelector('.bw-btn-text').textContent = '✦  Sent  ✦';

    setTimeout(() => {
      console.log('Password reset requested for:', emailInput.value.trim());
      form.style.cssText = 'opacity:0; pointer-events:none; transform:translateY(-8px); transition:opacity 0.35s ease, transform 0.35s ease;';
      setTimeout(() => {
        form.style.display = 'none';
        successPanel.classList.add('visible');
      }, 370);
    }, 650);
  });
}

/* ============================================================
   CANVAS – star field concentrated around the card
   ============================================================ */
function initFpCanvas() {
  const canvas = document.getElementById('fp-canvas');
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
      cardH  = 480;
    }
  }

  const STAR_COUNT = 220;

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(makeStar(i < STAR_COUNT * 0.45, true));
    }
  }

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
      if (!document.getElementById('fp-canvas')) { cancelAnimationFrame(animId); return; }
      ctx.clearRect(0, 0, W, H);

      streakTimer++;
      if (streakTimer > 180 + Math.random() * 180) {
        drawFpStreak(ctx, cardCX, cardCY, cardW, cardH, W, H);
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

function drawFpStreak(ctx, cx, cy, cw, ch, W, H) {
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

function spawnFpParticles() {
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
