import '../../css/pages/UserPanel.css';
import { getUser, logout, authFetch } from '../auth.js';

const API_BASE = 'http://5.38.140.128:5000';

export default function UserPanel(container) {
  const user = getUser();

  container.innerHTML = `
    

    <div class="up-root">
      <canvas id="up-canvas" class="up-canvas"></canvas>
      <div class="up-glow"></div>

      <!-- === NAVBAR === -->
      <nav class="up-nav">
        <div class="up-nav-inner">
          <a href="/" data-link class="up-logo">Bloodwave</a>
          <div class="up-right">
            <a href="/main" data-link class="up-nav-link" id="upBackToDashboard">Back to Dashboard</a>
            <button class="up-hamburger" id="up-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="up-bar"></span>
              <span class="up-bar"></span>
              <span class="up-bar"></span>
            </button>
          </div>
        </div>

        <div class="up-mobile-menu" id="up-mobile-menu">
          <div class="up-mobile-menu-inner">
            <a href="/main" data-link class="up-mobile-link">Matches</a>
            <a href="/stats" data-link class="up-mobile-link">Stats</a>
            <div class="up-mobile-divider"></div>
            <div class="up-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="up-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="up-mobile-username">—</span>
            </div>
            <div class="up-mobile-divider"></div>
            <a href="/user-panel" data-link class="up-mobile-link">Profile</a>
            <button class="up-mobile-logout" id="up-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- === MAIN CONTENT === -->
      <main class="up-content">
        <div class="up-container">

          <!-- HEADER -->
          <div class="up-header">
            <div class="up-ornament">
              <div class="up-ornament-line"></div>
              <div class="up-ornament-diamond"></div>
              <div class="up-ornament-line"></div>
            </div>
            <h1 class="up-title">Your Profile</h1>
            <p class="up-subtitle">Account&nbsp;&nbsp;Management</p>
          </div>

          <!-- INFO GRID -->
          <div class="up-info-grid">
            <div class="up-info-card">
              <span class="up-info-label">👤 Username</span>
              <span class="up-info-value">${escapeHtml(user?.username || 'N/A')}</span>
            </div>

            <div class="up-info-card">
              <span class="up-info-label">✉ Email</span>
              <span class="up-info-value">${escapeHtml(user?.email || 'N/A')}</span>
            </div>

            <div class="up-info-card">
              <span class="up-info-label">📅 Member Since</span>
              <span class="up-info-value">${formatDate(user?.createdAt || 'N/A')}</span>
            </div>
          </div>

          <!-- DIVIDER -->
          <div class="up-divider">
            <div class="up-divider-line"></div>
            <span class="up-divider-text">Settings</span>
            <div class="up-divider-line"></div>
          </div>

          <!-- SETTINGS PANEL -->
          <div class="up-settings-panel">
            <div class="up-settings-title">Account Settings</div>
            <div class="up-settings-buttons">
              <button class="up-settings-btn up-settings-action" id="upEditUsername">
                <span class="up-btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                    <circle cx="12" cy="8" r="3.5"></circle>
                    <path d="M5 19c1.8-3 4.2-4.5 7-4.5s5.2 1.5 7 4.5"></path>
                  </svg>
                </span>
                <span class="up-btn-copy">
                  <span class="up-btn-main">Edit Username</span>
                  <span class="up-btn-sub">Update display name</span>
                </span>
              </button>
              <button class="up-settings-btn up-settings-action" id="upEditEmail">
                <span class="up-btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                    <rect x="3.5" y="6.5" width="17" height="11" rx="2"></rect>
                    <path d="M4.5 8l7.5 5.5L19.5 8"></path>
                  </svg>
                </span>
                <span class="up-btn-copy">
                  <span class="up-btn-main">Change Email</span>
                  <span class="up-btn-sub">Set a new email address</span>
                </span>
              </button>
              <button class="up-settings-btn up-settings-action" id="upEditPassword">
                <span class="up-btn-icon" aria-hidden="true">
                  <svg class="up-icon-lock" viewBox="0 0 24 24" role="presentation" focusable="false">
                    <rect x="6" y="11" width="12" height="9" rx="2"></rect>
                    <path d="M8 11V9a4 4 0 0 1 8 0v2"></path>
                    <circle cx="12" cy="15.5" r="1"></circle>
                  </svg>
                </span>
                <span class="up-btn-copy">
                  <span class="up-btn-main">Change Password</span>
                  <span class="up-btn-sub">Secure your account</span>
                </span>
              </button>
            </div>
          </div>

          <!-- LOGOUT SECTION -->
          <div class="up-logout-section">
            <button class="up-logout-btn" id="upLogout">✦ Logout ✦</button>
          </div>

        </div>
      </main>
    </div>

    <!-- === MODALS === -->

    <!-- EDIT USERNAME MODAL -->
    <div class="up-modal-overlay" id="upUsernameModal" style="display:none;">
      <div class="up-modal-card">
        <div class="up-modal-header">
          <div class="up-modal-title">Edit Username</div>
          <div class="up-modal-subtitle">Choose your new display name</div>
        </div>
        <form class="up-form" id="upUsernameForm">
          <span class="up-form-error" id="upUsernameError"></span>
          <div class="up-form-field">
            <label class="up-form-label">New Username</label>
            <input type="text" id="upUsernameInput" class="up-form-input" placeholder="your_username" autocomplete="off" />
          </div>
          <div class="up-form-actions">
            <button type="submit" class="up-settings-btn">Update</button>
            <button type="button" class="up-settings-btn up-btn-cancel" id="upUsernameCancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT EMAIL MODAL -->
    <div class="up-modal-overlay" id="upEmailModal" style="display:none;">
      <div class="up-modal-card">
        <div class="up-modal-header">
          <div class="up-modal-title">Change Email</div>
          <div class="up-modal-subtitle">Update your email address</div>
        </div>
        <form class="up-form" id="upEmailForm">
          <span class="up-form-error" id="upEmailError"></span>
          <div class="up-form-field">
            <label class="up-form-label">New Email</label>
            <input type="email" id="upEmailInput" class="up-form-input" placeholder="your@email.com" autocomplete="off" />
          </div>
          <div class="up-form-actions">
            <button type="submit" class="up-settings-btn">Update</button>
            <button type="button" class="up-settings-btn up-btn-cancel" id="upEmailCancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CHANGE PASSWORD MODAL -->
    <div class="up-modal-overlay" id="upPasswordModal" style="display:none;">
      <div class="up-modal-card">
        <div class="up-modal-header">
          <div class="up-modal-title">Change Password</div>
          <div class="up-modal-subtitle">Secure your account</div>
        </div>
        <form class="up-form" id="upPasswordForm">
          <span class="up-form-error" id="upPasswordError"></span>
          <div class="up-form-field">
            <label class="up-form-label">Current Password</label>
            <input type="password" id="upPasswordCurrent" class="up-form-input" placeholder="············" autocomplete="off" />
          </div>
          <div class="up-form-field">
            <label class="up-form-label">New Password</label>
            <input type="password" id="upPasswordNew" class="up-form-input" placeholder="············" autocomplete="off" />
          </div>
          <div class="up-form-field">
            <label class="up-form-label">Confirm Password</label>
            <input type="password" id="upPasswordConfirm" class="up-form-input" placeholder="············" autocomplete="off" />
          </div>
          <div class="up-form-actions">
            <button type="submit" class="up-settings-btn">Change</button>
            <button type="button" class="up-settings-btn up-btn-cancel" id="upPasswordCancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // ========== HELPERS ==========
  function escapeHtml(text) {
    const span = document.createElement('span');
    span.textContent = text;
    return span.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  const mobileUsername = document.getElementById('up-mobile-username');
  if (mobileUsername) {
    mobileUsername.textContent = user?.username || user?.email || 'Member';
  }

  const hamburger = document.getElementById('up-hamburger');
  const mobileMenu = document.getElementById('up-mobile-menu');
  let mobileMenuOpen = false;

  hamburger?.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;
    hamburger.classList.toggle('open', mobileMenuOpen);
    hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));
    mobileMenu.style.maxHeight = mobileMenuOpen ? mobileMenu.scrollHeight + 'px' : '0';
  });

  mobileMenu?.querySelectorAll('.up-mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenuOpen = false;
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      mobileMenu.style.maxHeight = '0';
    });
  });

  // ========== CANVAS ANIMATION ==========
  function initUpCanvas() {
    const canvas = document.getElementById('up-canvas');
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
      for (let i = 0; i < 60; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.3 + 0.3,
          opacity: Math.random() * 0.5 + 0.15,
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

        const glowRadius = s.r * 5;
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
        glow.addColorStop(0, `rgba(212,175,55,${Math.min(1, s.opacity * 0.9)})`);
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

  // ========== MODAL SETUP ==========
  function setupModal(modalId, triggerBtnId, cancelBtnId, formId, onSubmit) {
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(triggerBtnId);
    const cancelBtn = document.getElementById(cancelBtnId);
    const form = document.getElementById(formId);

    btn?.addEventListener('click', () => {
      modal.style.display = 'flex';
      const firstInput = form?.querySelector('input');
      firstInput?.focus();
    });

    cancelBtn?.addEventListener('click', () => {
      modal.style.display = 'none';
      form?.reset();
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        form?.reset();
      }
    });

    form?.addEventListener('submit', onSubmit);
  }

  // === USERNAME MODAL ===
  setupModal('upUsernameModal', 'upEditUsername', 'upUsernameCancel', 'upUsernameForm', async (e) => {
    e.preventDefault();
    const input = document.getElementById('upUsernameInput');
    const errorEl = document.getElementById('upUsernameError');
    const submitBtn = document.querySelector('#upUsernameForm button[type="submit"]');

    errorEl.classList.remove('show');
    errorEl.textContent = '';

    const username = input.value.trim();
    if (username.length < 3) {
      errorEl.textContent = 'Username must be at least 3 characters';
      errorEl.classList.add('show');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✦ Updating… ✦';

    try {
      const res = await authFetch(`${API_BASE}/api/User/username`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update username');
      }

      submitBtn.textContent = '✦ Updated ✦';
      submitBtn.classList.add('success');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // === EMAIL MODAL ===
  setupModal('upEmailModal', 'upEditEmail', 'upEmailCancel', 'upEmailForm', async (e) => {
    e.preventDefault();
    const input = document.getElementById('upEmailInput');
    const errorEl = document.getElementById('upEmailError');
    const submitBtn = document.querySelector('#upEmailForm button[type="submit"]');

    errorEl.classList.remove('show');
    errorEl.textContent = '';

    const email = input.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRe.test(email)) {
      errorEl.textContent = 'Invalid email address';
      errorEl.classList.add('show');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✦ Updating… ✦';

    try {
      const res = await authFetch(`${API_BASE}/api/User/email`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update email');
      }

      submitBtn.textContent = '✦ Updated ✦';
      submitBtn.classList.add('success');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // === PASSWORD MODAL ===
  setupModal('upPasswordModal', 'upEditPassword', 'upPasswordCancel', 'upPasswordForm', async (e) => {
    e.preventDefault();
    const current = document.getElementById('upPasswordCurrent');
    const newPass = document.getElementById('upPasswordNew');
    const confirm = document.getElementById('upPasswordConfirm');
    const errorEl = document.getElementById('upPasswordError');
    const submitBtn = document.querySelector('#upPasswordForm button[type="submit"]');

    errorEl.classList.remove('show');
    errorEl.textContent = '';

    let valid = true;
    if (!current.value) {
      errorEl.textContent = 'Current password is required';
      valid = false;
    } else if (newPass.value.length < 6) {
      errorEl.textContent = 'New password must be at least 6 characters';
      valid = false;
    } else if (newPass.value !== confirm.value) {
      errorEl.textContent = 'Passwords do not match';
      valid = false;
    } else if (current.value === newPass.value) {
      errorEl.textContent = 'New password must be different';
      valid = false;
    }

    if (!valid) {
      errorEl.classList.add('show');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✦ Changing… ✦';

    try {
      const res = await authFetch(`${API_BASE}/api/Auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: current.value,
          newPassword: newPass.value,
          confirmPassword: confirm.value
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to change password');
      }

      submitBtn.textContent = '✦ Changed ✦';
      submitBtn.classList.add('success');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // ========== LOGOUT ==========
  const doLogout = async (button) => {
    if (button) {
      button.disabled = true;
      if (button.id === 'upLogout') {
        button.textContent = '✦ Goodbye… ✦';
      } else {
        button.innerHTML = '✦ Logging out… ✦';
      }
    }

    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  document.getElementById('upLogout')?.addEventListener('click', async () => {
    await doLogout(document.getElementById('upLogout'));
  });

  document.getElementById('up-mobile-logout')?.addEventListener('click', async () => {
    await doLogout(document.getElementById('up-mobile-logout'));
  });

  document.getElementById('upBackToDashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.router?.navigate) {
      window.router.navigate('/main');
      return;
    }
    window.location.href = '/main';
  });

  // ========== INIT ==========
  initUpCanvas();
}

