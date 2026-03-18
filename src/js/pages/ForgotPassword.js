import '../../css/pages/ForgotPassword.css';
import { ensureGlobalStarfield } from '../global-starfield.js';
export default function ForgotPassword(container) {
  container.innerHTML = `
    <div class="bw-root">
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
              <p>Remembered it? <a href="/login" data-link class="bw-forgot">Sign In</a></p>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;

  ensureGlobalStarfield();

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
   CANVAS – same starry background as Main page
   ============================================================ */
function initFpCanvas() {
  const canvas = document.getElementById('fp-canvas');
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
