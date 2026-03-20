export function confirmLogout() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'bw-confirm-overlay';
    overlay.innerHTML = `
      <div class="bw-confirm-card" role="dialog" aria-modal="true" aria-labelledby="bw-confirm-title" aria-describedby="bw-confirm-copy">
        <div class="bw-confirm-corner bw-confirm-corner--tl"></div>
        <div class="bw-confirm-corner bw-confirm-corner--tr"></div>
        <div class="bw-confirm-corner bw-confirm-corner--bl"></div>
        <div class="bw-confirm-corner bw-confirm-corner--br"></div>

        <div class="bw-confirm-ornament" aria-hidden="true">
          <span class="bw-confirm-ornament-line"></span>
          <span class="bw-confirm-ornament-diamond"></span>
          <span class="bw-confirm-ornament-line"></span>
        </div>

        <h2 class="bw-confirm-title" id="bw-confirm-title">Confirm Logout</h2>
        <p class="bw-confirm-kicker">Session Action</p>
        <p class="bw-confirm-copy" id="bw-confirm-copy">Are you sure you want to log out from your account?</p>
        <div class="bw-confirm-actions">
          <button type="button" class="bw-confirm-btn bw-confirm-btn-cancel" data-action="cancel">Cancel</button>
          <button type="button" class="bw-confirm-btn bw-confirm-btn-danger" data-action="confirm">Log Out</button>
        </div>
      </div>
    `;

    const cancelBtn = overlay.querySelector('[data-action="cancel"]');
    const confirmBtn = overlay.querySelector('[data-action="confirm"]');
    const card = overlay.querySelector('.bw-confirm-card');
    let isClosing = false;

    const cleanup = () => {
      document.removeEventListener('keydown', onKeyDown);
      overlay.remove();
    };

    const finish = (result, animated = false) => {
      if (isClosing) return;

      if (!animated) {
        cleanup();
        resolve(result);
        return;
      }

      isClosing = true;
      overlay.classList.add('bw-confirm-overlay--closing');

      const done = () => {
        cleanup();
        resolve(result);
      };

      card?.addEventListener('animationend', done, { once: true });
      window.setTimeout(done, 260);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        finish(false, true);
      }
    };

    cancelBtn?.addEventListener('click', () => finish(false, true));
    confirmBtn?.addEventListener('click', () => finish(true));

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        finish(false, true);
      }
    });

    document.addEventListener('keydown', onKeyDown);
    document.body.appendChild(overlay);
    cancelBtn?.focus();
  });
}

export function confirmDeleteAccount(expectedUsername) {
  return new Promise((resolve) => {
    const safeUsername = String(expectedUsername ?? '').trim();
    const overlay = document.createElement('div');
    overlay.className = 'bw-confirm-overlay';
    overlay.innerHTML = `
      <div class="bw-confirm-card" role="dialog" aria-modal="true" aria-labelledby="bw-confirm-delete-title" aria-describedby="bw-confirm-delete-copy">
        <div class="bw-confirm-corner bw-confirm-corner--tl"></div>
        <div class="bw-confirm-corner bw-confirm-corner--tr"></div>
        <div class="bw-confirm-corner bw-confirm-corner--bl"></div>
        <div class="bw-confirm-corner bw-confirm-corner--br"></div>

        <div class="bw-confirm-ornament" aria-hidden="true">
          <span class="bw-confirm-ornament-line"></span>
          <span class="bw-confirm-ornament-diamond"></span>
          <span class="bw-confirm-ornament-line"></span>
        </div>

        <h2 class="bw-confirm-title" id="bw-confirm-delete-title">Delete Account</h2>
        <p class="bw-confirm-kicker">Permanent Action</p>
        <p class="bw-confirm-copy" id="bw-confirm-delete-copy">
          Type your username <strong>${escapeHtml(safeUsername || 'unknown')}</strong> and your password to permanently delete your profile.
        </p>

        <label class="bw-confirm-field" for="bw-confirm-delete-username">Username confirmation</label>
        <input
          id="bw-confirm-delete-username"
          class="bw-confirm-input"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="Enter username"
        />
        <label class="bw-confirm-field" for="bw-confirm-delete-password">Password confirmation</label>
        <input
          id="bw-confirm-delete-password"
          class="bw-confirm-input"
          type="password"
          autocomplete="current-password"
          placeholder="Enter password"
        />
        <p class="bw-confirm-error" id="bw-confirm-delete-error" aria-live="polite"></p>

        <div class="bw-confirm-actions">
          <button type="button" class="bw-confirm-btn bw-confirm-btn-cancel" data-action="cancel">Cancel</button>
          <button type="button" class="bw-confirm-btn bw-confirm-btn-danger" data-action="confirm" disabled>Delete</button>
        </div>
      </div>
    `;

    const cancelBtn = overlay.querySelector('[data-action="cancel"]');
    const confirmBtn = overlay.querySelector('[data-action="confirm"]');
    const card = overlay.querySelector('.bw-confirm-card');
    const usernameInput = overlay.querySelector('#bw-confirm-delete-username');
    const passwordInput = overlay.querySelector('#bw-confirm-delete-password');
    const errorEl = overlay.querySelector('#bw-confirm-delete-error');
    let isClosing = false;

    const isMatch = () => usernameInput?.value.trim() === safeUsername;
    const hasPassword = () => (passwordInput?.value || '').trim().length > 0;

    const updateConfirmState = () => {
      if (!confirmBtn) return;
      confirmBtn.disabled = !safeUsername || !isMatch() || !hasPassword();
      if (errorEl && isMatch() && hasPassword()) {
        errorEl.textContent = '';
      }
    };

    const cleanup = () => {
      document.removeEventListener('keydown', onKeyDown);
      overlay.remove();
    };

    const finish = (result, animated = false) => {
      if (isClosing) return;

      if (!animated) {
        cleanup();
        resolve(result);
        return;
      }

      isClosing = true;
      overlay.classList.add('bw-confirm-overlay--closing');

      const done = () => {
        cleanup();
        resolve(result);
      };

      card?.addEventListener('animationend', done, { once: true });
      window.setTimeout(done, 260);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        finish(false, true);
      }
    };

    cancelBtn?.addEventListener('click', () => finish(false, true));
    confirmBtn?.addEventListener('click', () => {
      if (!isMatch()) {
        if (errorEl) {
          errorEl.textContent = 'Username does not match.';
        }
        return;
      }
      if (!hasPassword()) {
        if (errorEl) {
          errorEl.textContent = 'Password is required.';
        }
        return;
      }
      finish({
        confirmed: true,
        password: passwordInput?.value || '',
      });
    });

    usernameInput?.addEventListener('input', updateConfirmState);
    passwordInput?.addEventListener('input', updateConfirmState);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        finish(false, true);
      }
    });

    document.addEventListener('keydown', onKeyDown);
    document.body.appendChild(overlay);
    updateConfirmState();
    usernameInput?.focus();
  });
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
