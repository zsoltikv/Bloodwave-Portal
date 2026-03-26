import '../../styles/pages/ResetPassword.css';
import { API_BASE } from '../services/auth.js';
import { ensureGlobalStarfield } from '../effects/global-starfield.js';

export default function ResetPassword(container) {
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
            <p class="bw-subtitle">Set&nbsp;&nbsp;New&nbsp;&nbsp;Password</p>
          </div>

          <div class="bw-form" id="rpFormWrap">
            <p class="bw-desc">Choose a new password for your account.</p>

            <form id="rpForm" novalidate>
              <div class="bw-field">
                <label class="bw-label" for="rpPassword">New Password</label>
                <div class="bw-input-wrap">
                  <input
                    type="password"
                    id="rpPassword"
                    class="bw-input"
                    placeholder="............"
                    required
                    autocomplete="new-password"
                    style="padding-right: clamp(40px, 9vw, 52px);"
                  />
                  <button type="button" class="bw-pw-toggle" id="rpPwToggle" aria-label="Toggle new password visibility">
                    <svg id="rpEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <div class="bw-input-line"></div>
                </div>
                <span class="bw-error" id="rpPasswordError"></span>
              </div>

              <div class="bw-field bw-field--confirm">
                <label class="bw-label" for="rpConfirm">Confirm Password</label>
                <div class="bw-input-wrap">
                  <input
                    type="password"
                    id="rpConfirm"
                    class="bw-input"
                    placeholder="............"
                    required
                    autocomplete="new-password"
                    style="padding-right: clamp(40px, 9vw, 52px);"
                  />
                  <button type="button" class="bw-pw-toggle" id="rpConfirmToggle" aria-label="Toggle confirm password visibility">
                    <svg id="rpConfirmEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <div class="bw-input-line"></div>
                </div>
                <span class="bw-error" id="rpConfirmError"></span>
              </div>

              <span class="bw-error bw-error--center" id="rpGeneralError"></span>

              <button type="submit" class="bw-btn" id="rpBtn">
                <div class="bw-btn-shimmer"></div>
                <span class="bw-btn-text">Update Password</span>
              </button>
            </form>

            <div class="bw-success-panel" id="rpSuccess">
              <div class="bw-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.35">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p class="bw-success-title">Password Updated</p>
              <p class="bw-success-text">Your password has been changed successfully.</p>
              <div class="bw-success-sep"></div>
            </div>

            <div class="bw-divider">
              <div class="bw-divider-line"></div>
              <span class="bw-divider-text">or</span>
              <div class="bw-divider-line"></div>
            </div>

            <div class="bw-footer-link">
              <p>Back to <a href="/login" data-link class="bw-forgot">Sign In</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  ensureGlobalStarfield();

  const form = document.getElementById('rpForm');
  const btn = document.getElementById('rpBtn');
  const passwordInput = document.getElementById('rpPassword');
  const confirmInput = document.getElementById('rpConfirm');
  const passwordError = document.getElementById('rpPasswordError');
  const confirmError = document.getElementById('rpConfirmError');
  const generalError = document.getElementById('rpGeneralError');
  const successPanel = document.getElementById('rpSuccess');

  function getParamFromUrl(name) {
    const searchParams = new URLSearchParams(window.location.search);
    const fromSearch = searchParams.get(name);
    if (fromSearch) return fromSearch.trim();

    // Fallback: some links can place query params after #
    const hashQuery = window.location.hash.split('?')[1] || '';
    const hashParams = new URLSearchParams(hashQuery);
    const fromHash = hashParams.get(name);
    return fromHash ? fromHash.trim() : '';
  }

  const token = getParamFromUrl('token');
  const email = getParamFromUrl('email');

  if (!token) {
    generalError.textContent = 'Missing or invalid reset token.';
    btn.disabled = true;
  }

  function clearErrors() {
    passwordError.textContent = '';
    confirmError.textContent = '';
    generalError.textContent = '';
  }

  function validate() {
    let valid = true;

    if (!passwordInput.value) {
      passwordError.textContent = 'Password is required';
      valid = false;
    } else if (passwordInput.value.length < 8) {
      passwordError.textContent = 'Minimum 8 characters';
      valid = false;
    }

    if (!confirmInput.value) {
      confirmError.textContent = 'Please confirm your password';
      valid = false;
    } else if (confirmInput.value !== passwordInput.value) {
      confirmError.textContent = 'Passwords do not match';
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    if (!token) {
      generalError.textContent = 'Missing or invalid reset token.';
      return;
    }

    if (!validate()) return;

    btn.disabled = true;
    btn.querySelector('.bw-btn-text').textContent = 'Updating...';

    const payload = {
      token,
      email: email || undefined,
      password: passwordInput.value,
      newPassword: passwordInput.value,
      confirmPassword: confirmInput.value,
    };

    try {
      const res = await fetch(`${API_BASE}/api/user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || 'Password reset failed. Please try again.');
      }

      btn.classList.add('success');
      btn.querySelector('.bw-btn-text').textContent = 'Updated';

      setTimeout(() => {
        form.style.cssText = 'opacity:0; pointer-events:none; transform:translateY(-8px); transition:opacity 0.35s ease, transform 0.35s ease;';
        setTimeout(() => {
          form.style.display = 'none';
          successPanel.classList.add('visible');
        }, 370);
      }, 500);
    } catch (err) {
      generalError.textContent = err.message || 'Password reset failed. Please try again.';
      btn.querySelector('.bw-btn-text').textContent = 'Update Password';
      btn.disabled = false;
    }
  });

  const eyeOpen = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />`;
  const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />`;

  document.getElementById('rpPwToggle').addEventListener('click', () => {
    const hidden = passwordInput.type === 'password';
    passwordInput.type = hidden ? 'text' : 'password';
    document.getElementById('rpEyeIcon').innerHTML = hidden ? eyeClosed : eyeOpen;
  });

  document.getElementById('rpConfirmToggle').addEventListener('click', () => {
    const hidden = confirmInput.type === 'password';
    confirmInput.type = hidden ? 'text' : 'password';
    document.getElementById('rpConfirmEyeIcon').innerHTML = hidden ? eyeClosed : eyeOpen;
  });
}
