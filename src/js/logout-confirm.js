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
