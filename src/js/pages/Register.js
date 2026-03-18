import '../../css/pages/Register.css';
import { register } from '../auth.js';
import { ensureGlobalStarfield } from '../global-starfield.js';

export default function Register(container) {
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
            <p class="bw-subtitle">Join&nbsp;&nbsp;The&nbsp;&nbsp;Covenant</p>
          </div>

          <form class="bw-form" id="rxForm" novalidate>

            <div class="bw-field">
              <label class="bw-label" for="rxName">Username</label>
              <div class="bw-input-wrap">
                <input type="text" id="rxName" class="bw-input" placeholder="your_username" required autocomplete="username" />
                <div class="bw-input-line"></div>
              </div>
              <span class="bw-error" id="rxNameError"></span>
            </div>

            <div class="bw-field">
              <label class="bw-label" for="rxEmail">Email Address</label>
              <div class="bw-input-wrap">
                <input type="email" id="rxEmail" class="bw-input" placeholder="your@email.com" required autocomplete="email" />
                <div class="bw-input-line"></div>
              </div>
              <span class="bw-error" id="rxEmailError"></span>
            </div>

            <div class="bw-field">
              <label class="bw-label" for="rxPassword">Password</label>
              <div class="bw-input-wrap">
                <input type="password" id="rxPassword" class="bw-input" placeholder="············" required autocomplete="new-password" style="padding-right: clamp(40px, 9vw, 52px);" />
                <button type="button" class="bw-pw-toggle" id="rxPwToggle" aria-label="Toggle password visibility">
                  <svg id="rxEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div class="bw-input-line" id="pwStrengthLine"></div>
              </div>
              <span class="bw-error" id="rxPasswordError"></span>
            </div>

            <div class="bw-field">
              <label class="bw-label" for="rxConfirm">Confirm Password</label>
              <div class="bw-input-wrap">
                <input type="password" id="rxConfirm" class="bw-input" placeholder="············" required autocomplete="new-password" style="padding-right: clamp(40px, 9vw, 52px);" />
                <button type="button" class="bw-pw-toggle" id="rxConfirmToggle" aria-label="Toggle confirm password visibility">
                  <svg id="rxConfirmEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div class="bw-input-line"></div>
              </div>
              <span class="bw-error" id="rxConfirmError"></span>
            </div>

            <div class="bw-field" style="margin-top: 1.5rem;">
              <label class="bw-checkbox-wrapper">
                <input type="checkbox" id="rxTosAccept" class="bw-checkbox" required />
                <span class="bw-checkbox-label">
                  I accept the <a href="/tos" data-link style="color: var(--bw-crimson); text-decoration: underline;">Terms of Service &amp; Cookie Policy</a>
                </span>
              </label>
              <span class="bw-error" id="rxTosError"></span>
            </div>

            <button type="submit" class="bw-btn" id="rxBtn">
              <div class="bw-btn-shimmer"></div>
              <span class="bw-btn-text">Create Account</span>
            </button>

            <div class="bw-divider">
              <div class="bw-divider-line"></div>
              <span class="bw-divider-text">or</span>
              <div class="bw-divider-line"></div>
            </div>

            <div class="bw-footer-link">
              <p>Already a member? <a href="/login" data-link class="bw-forgot">Sign In</a></p>
            </div>

          </form>
        </div>
      </div>
    </div>
  `;

  ensureGlobalStarfield();

  const form          = document.getElementById('rxForm');
  const btn           = document.getElementById('rxBtn');
  const nameInput     = document.getElementById('rxName');
  const emailInput    = document.getElementById('rxEmail');
  const pwInput       = document.getElementById('rxPassword');
  const confirmInput  = document.getElementById('rxConfirm');
  const tosCheckbox   = document.getElementById('rxTosAccept');

  const nameError    = document.getElementById('rxNameError');
  const emailError   = document.getElementById('rxEmailError');
  const pwError      = document.getElementById('rxPasswordError');
  const confirmError = document.getElementById('rxConfirmError');
  const tosError     = document.getElementById('rxTosError');

  // --- Validation helpers ---
  function clearErrors() {
    [nameError, emailError, pwError, confirmError, tosError].forEach(el => el.textContent = '');
  }

  function validate() {
    let valid = true;

    if (!nameInput.value.trim()) {
      nameError.textContent = 'Username is required';
      valid = false;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email is required';
      valid = false;
    } else if (!emailRe.test(emailInput.value.trim())) {
      emailError.textContent = 'Invalid email address';
      valid = false;
    }

    if (!pwInput.value) {
      pwError.textContent = 'Password is required';
      valid = false;
    } else if (pwInput.value.length < 8) {
      pwError.textContent = 'Minimum 8 characters';
      valid = false;
    }

    if (!confirmInput.value) {
      confirmError.textContent = 'Please confirm your password';
      valid = false;
    } else if (confirmInput.value !== pwInput.value) {
      confirmError.textContent = 'Passwords do not match';
      valid = false;
    }

    if (!tosCheckbox.checked) {
      tosError.textContent = 'You must accept the Terms of Service & Cookie Policy';
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    if (!validate()) return;

    btn.disabled = true;
    btn.querySelector('.bw-btn-text').textContent = '✦  Creating…  ✦';

    try {
      await register(
        nameInput.value.trim(),
        emailInput.value.trim(),
        pwInput.value
      );
      btn.classList.add('success');
      btn.querySelector('.bw-btn-text').textContent = '✦  Account Created  ✦';
      setTimeout(() => window.router.navigate('/login'), 900);
    } catch (err) {
      // Show server error under the name field (general form error)
      nameError.textContent = err.message || 'Registration failed. Please try again.';
      btn.querySelector('.bw-btn-text').textContent = 'Create Account';
      btn.disabled = false;
    }
  });

  // --- Password visibility toggles ---
  const eyeOpen   = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />`;
  const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />`;

  // --- Password strength ---
  const pwLine = document.getElementById('pwStrengthLine');

  const strengthGradients = [
    // 0 – empty: back to default crimson-gold
    `linear-gradient(90deg,
      #2a0000 0%, #8B0000 25%, #C0392B 50%, #8B0000 75%, #2a0000 100%)`,
    // 1 – very weak: deep reds
    `linear-gradient(90deg,
      #1a0000 0%, #6B0000 20%, #C0392B 45%, #920000 70%, #1a0000 100%)`,
    // 2 – weak: red → orange
    `linear-gradient(90deg,
      #3d0000 0%, #C0392B 25%, #E67E22 50%, #C0392B 75%, #3d0000 100%)`,
    // 3 – fair: orange → amber
    `linear-gradient(90deg,
      #4a2000 0%, #E67E22 25%, #D4AC0D 50%, #E67E22 75%, #4a2000 100%)`,
    // 4 – strong: amber → lime
    `linear-gradient(90deg,
      #1a3a10 0%, #52BE80 25%, #D4AC0D 50%, #52BE80 75%, #1a3a10 100%)`,
    // 5 – very strong: vivid green
    `linear-gradient(90deg,
      #021a08 0%, #1E8449 20%, #52BE80 45%, #27AE60 70%, #021a08 100%)`,
  ];

  const strengthGlows = [
    'none',
    '0 0 6px rgba(139,0,0,0.5),  0 0 16px rgba(139,0,0,0.2)',
    '0 0 8px rgba(192,57,43,0.65), 0 0 20px rgba(230,126,34,0.2)',
    '0 0 8px rgba(212,172,13,0.7), 0 0 20px rgba(212,172,13,0.25)',
    '0 0 10px rgba(82,190,128,0.7), 0 0 24px rgba(82,190,128,0.3)',
    '0 0 12px rgba(39,174,96,0.85), 0 0 30px rgba(39,174,96,0.45)',
  ];

  function getStrength(pw) {
    let score = 0;
    if (pw.length >= 6)           score++;
    if (pw.length >= 10)          score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/[0-9]/.test(pw))         score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  let lastScore = -1;
  pwInput.addEventListener('input', () => {
    const score = pwInput.value.length ? getStrength(pwInput.value) : 0;

    pwLine.style.setProperty('--pw-gradient', strengthGradients[score]);
    pwLine.style.boxShadow = strengthGlows[score];

    if (score > 0) {
      pwLine.classList.add('bw-pw-active');
    } else {
      pwLine.classList.remove('bw-pw-active');
    }

    // pulse flash on score change
    if (score !== lastScore) {
      lastScore = score;
      pwLine.classList.add('bw-pw-pulse');
      setTimeout(() => pwLine.classList.remove('bw-pw-pulse'), 260);
    }
  });

  document.getElementById('rxPwToggle').addEventListener('click', () => {
    const hidden = pwInput.type === 'password';
    pwInput.type = hidden ? 'text' : 'password';
    document.getElementById('rxEyeIcon').innerHTML = hidden ? eyeClosed : eyeOpen;
  });

  document.getElementById('rxConfirmToggle').addEventListener('click', () => {
    const hidden = confirmInput.type === 'password';
    confirmInput.type = hidden ? 'text' : 'password';
    document.getElementById('rxConfirmEyeIcon').innerHTML = hidden ? eyeClosed : eyeOpen;
  });
}

/* ============================================================
   CANVAS – same starry background as Main page
   ============================================================ */
function initRegisterCanvas() {
  const canvas = document.getElementById('rx-canvas');
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

function spawnRegisterParticles() {
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


