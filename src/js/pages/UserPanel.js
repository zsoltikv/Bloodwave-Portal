import '../../css/pages/UserPanel.css';
import { API_BASE, getUser, logout, authFetch } from '../auth.js';
import { confirmLogout, confirmDeleteAccount, showDeleteAccountError } from '../logout-confirm.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import {
  Box,
  Button,
  Main,
  Form,
  Input,
  Label,
  Link,
  Nav,
  Span,
  Subtitle,
  Title,
  page,
  setupGroup,
  setupState,
} from '../feather/index.js';

const PASSWORD_PLACEHOLDER = '\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7';

function formatDate(dateStr) {
  if (!dateStr || dateStr === 'N/A') return 'N/A';

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function ornament() {
  return Box(
    Box().className('up-ornament-line'),
    Box().className('up-ornament-diamond'),
    Box().className('up-ornament-line'),
  ).className('up-ornament');
}

function infoCard(label, value, id) {
  return Box(
    Span(label).className('up-info-label'),
    Span(value).className('up-info-value').id(id),
  ).className('up-info-card');
}

function settingsButton(id, title, subtitle) {
  return Button(
    Span().className('up-btn-icon').attr('aria-hidden', 'true'),
    Span(
      Span(title).className('up-btn-main'),
      Span(subtitle).className('up-btn-sub'),
    ).className('up-btn-copy'),
  )
    .id(id)
    .className('up-settings-btn up-settings-action');
}

function modalField(field) {
  return Box(
    Label(field.label).className('up-form-label'),
    Input()
      .type(field.type || 'text')
      .id(field.id)
      .className('up-form-input')
      .placeholder(field.placeholder)
      .autocomplete(field.autocomplete || 'off'),
  ).className('up-form-field');
}

function settingsModal({ id, title, subtitle, formId, errorId, fields, submitLabel, cancelId }) {
  return Box(
    Box(
      Box(
        Box(title).className('up-modal-title'),
        Box(subtitle).className('up-modal-subtitle'),
      ).className('up-modal-header'),
      Form(
        Span().className('up-form-error').id(errorId),
        fields.map(modalField),
        Box(
          Button(submitLabel)
            .type('submit')
            .className('up-settings-btn'),
          Button('Cancel')
            .type('button')
            .id(cancelId)
            .className('up-settings-btn up-btn-cancel'),
        ).className('up-form-actions'),
      )
        .id(formId)
        .className('up-form'),
    ).className('up-modal-card'),
  )
    .className('up-modal-overlay')
    .id(id)
    .style({ display: 'none' });
}

function createUserPanelView(user) {
  const username = user?.username || 'N/A';
  const email = user?.email || 'N/A';
  const createdAt = formatDate(user?.createdAt || 'N/A');

  return Box(
    Box().className('up-glow'),
    Nav(
      Box(
        Link('Bloodwave')
          .href('/')
          .dataLink()
          .className('up-logo'),
        Box(
          Link('Back to Dashboard')
            .href('/main')
            .dataLink()
            .className('up-nav-link')
            .id('upBackToDashboard'),
          Button(
            Span().className('up-bar'),
            Span().className('up-bar'),
            Span().className('up-bar'),
          )
            .id('up-hamburger')
            .className('up-hamburger')
            .ariaLabel('Toggle menu')
            .attr('aria-expanded', 'false'),
        ).className('up-right'),
      ).className('up-nav-inner'),
      Box(
        Box(
          Link('Matches').href('/main').dataLink().className('up-mobile-link'),
          Link('Stats').href('/stats').dataLink().className('up-mobile-link'),
          Link('Leaderboard').href('/leaderboard').dataLink().className('up-mobile-link'),
          Link('Achievements').href('/achievements').dataLink().className('up-mobile-link'),
          Box().className('up-mobile-divider'),
          Box(
            Span('BW').className('up-mobile-avatar'),
            Span('-').id('up-mobile-username'),
          )
            .className('up-mobile-profile')
            .style({ pointerEvents: 'none', cursor: 'default' }),
          Box().className('up-mobile-divider'),
          Link('Profile').href('/user-panel').dataLink().className('up-mobile-link'),
          Button('Logout')
            .id('up-mobile-logout')
            .className('up-mobile-logout'),
        ).className('up-mobile-menu-inner'),
      )
        .className('up-mobile-menu')
        .id('up-mobile-menu'),
    ).className('up-nav'),
    Main(
      Box(
        Box(
          ornament(),
          Title('Your Profile').className('up-title'),
          Subtitle('Account\u00A0\u00A0Management').className('up-subtitle'),
        ).className('up-header'),
        Box(
          infoCard('Username', username, 'up-username-value'),
          infoCard('Email', email, 'up-email-value'),
          infoCard('Member Since', createdAt, 'up-created-at-value'),
        ).className('up-info-grid'),
        Box(
          Box().className('up-divider-line'),
          Span('Settings').className('up-divider-text'),
          Box().className('up-divider-line'),
        ).className('up-divider'),
        Box(
          Box('Account Settings').className('up-settings-title'),
          Box(
            settingsButton('upEditUsername', 'Edit Username', 'Update display name'),
            settingsButton('upEditEmail', 'Change Email', 'Set a new email address'),
            settingsButton('upEditPassword', 'Change Password', 'Secure your account'),
          ).className('up-settings-buttons'),
        ).className('up-settings-panel'),
        Box(
          Button('Delete Account')
            .id('upDeleteAccount')
            .className('up-logout-btn up-delete-btn'),
          Button('Sign Out Now')
            .id('upLogout')
            .className('up-logout-btn up-delete-btn'),
        ).className('up-logout-section'),
      ).className('up-container'),
    ).className('up-content'),
    settingsModal({
      id: 'upUsernameModal',
      title: 'Edit Username',
      subtitle: 'Choose your new display name',
      formId: 'upUsernameForm',
      errorId: 'upUsernameError',
      submitLabel: 'Update',
      cancelId: 'upUsernameCancel',
      fields: [
        { label: 'New Username', id: 'upUsernameInput', placeholder: 'your_username' },
      ],
    }),
    settingsModal({
      id: 'upEmailModal',
      title: 'Change Email',
      subtitle: 'Update your email address',
      formId: 'upEmailForm',
      errorId: 'upEmailError',
      submitLabel: 'Update',
      cancelId: 'upEmailCancel',
      fields: [
        { label: 'New Email', id: 'upEmailInput', type: 'email', placeholder: 'your@email.com' },
      ],
    }),
    settingsModal({
      id: 'upPasswordModal',
      title: 'Change Password',
      subtitle: 'Secure your account',
      formId: 'upPasswordForm',
      errorId: 'upPasswordError',
      submitLabel: 'Change',
      cancelId: 'upPasswordCancel',
      fields: [
        { label: 'Current Password', id: 'upPasswordCurrent', type: 'password', placeholder: PASSWORD_PLACEHOLDER },
        { label: 'New Password', id: 'upPasswordNew', type: 'password', placeholder: PASSWORD_PLACEHOLDER },
        { label: 'Confirm Password', id: 'upPasswordConfirm', type: 'password', placeholder: PASSWORD_PLACEHOLDER },
      ],
    }),
  ).className('up-root');
}

const UserPanel = page({
  name: 'UserPanel',

  setup() {
    ensureGlobalStarfield();

    const cachedUser = getUser();
    const profileState = {
      username: cachedUser?.username || '',
      email: cachedUser?.email || '',
      createdAt: cachedUser?.createdAt || '',
    };

    return setupState(
      setupGroup('user', {
        cached: cachedUser,
        profile: profileState,
      }),
    );
  },

  render(ctx) {
    return createUserPanelView(ctx.user.cached);
  },

  mount(ctx) {
    const { container } = ctx;
    const { cached, profile } = ctx.user;

    const $ = (selector) => container.querySelector(selector);
    const on = (target, eventName, handler, options) => {
      if (!target) return;
      target.addEventListener(eventName, handler, options);
      ctx.cleanup(() => target.removeEventListener(eventName, handler, options), 'lifetime');
    };

    const mobileUsername = $('#up-mobile-username');
    if (mobileUsername) {
      mobileUsername.textContent = cached?.username || cached?.email || 'Member';
    }

    function applyUserToUi(userData) {
      if (!userData) return;

      profile.username = userData.username || profile.username;
      profile.email = userData.email || profile.email;
      profile.createdAt = userData.createdAt || profile.createdAt;

      const usernameEl = $('#up-username-value');
      const emailEl = $('#up-email-value');
      const createdAtEl = $('#up-created-at-value');

      if (usernameEl) usernameEl.textContent = profile.username || 'N/A';
      if (emailEl) emailEl.textContent = profile.email || 'N/A';
      if (createdAtEl) createdAtEl.textContent = formatDate(profile.createdAt || '');
      if (mobileUsername) {
        mobileUsername.textContent = profile.username || profile.email || 'Member';
      }
    }

    async function updateCurrentUser(payload) {
      const res = await authFetch(`${API_BASE}/api/User/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update profile');
      }

      const updatedUser = await res.json();
      applyUserToUi(updatedUser);
      return updatedUser;
    }

    async function fetchCurrentUser() {
      try {
        const res = await authFetch(`${API_BASE}/api/User/me`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Failed to load profile (${res.status})`);
        }

        return await res.json();
      } catch (err) {
        console.error('Failed to fetch current user profile:', err);
        return null;
      }
    }

    const hamburger = $('#up-hamburger');
    const mobileMenu = $('#up-mobile-menu');
    let mobileMenuOpen = false;

    on(hamburger, 'click', () => {
      if (!mobileMenu) return;

      mobileMenuOpen = !mobileMenuOpen;
      hamburger.classList.toggle('open', mobileMenuOpen);
      hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));
      mobileMenu.style.maxHeight = mobileMenuOpen ? `${mobileMenu.scrollHeight}px` : '0';
    });

    mobileMenu?.querySelectorAll('.up-mobile-link').forEach((link) => {
      on(link, 'click', () => {
        mobileMenuOpen = false;
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
        if (mobileMenu) {
          mobileMenu.style.maxHeight = '0';
        }
      });
    });

    function setupModal(modalId, triggerBtnId, cancelBtnId, formId, onSubmit) {
      const modal = $(`#${modalId}`);
      const trigger = $(`#${triggerBtnId}`);
      const cancelBtn = $(`#${cancelBtnId}`);
      const form = $(`#${formId}`);

      on(trigger, 'click', () => {
        if (!modal) return;
        modal.style.display = 'flex';
        form?.querySelector('input')?.focus();
      });

      on(cancelBtn, 'click', () => {
        if (modal) {
          modal.style.display = 'none';
        }
        form?.reset();
      });

      on(modal, 'click', (event) => {
        if (event.target === modal) {
          modal.style.display = 'none';
          form?.reset();
        }
      });

      on(form, 'submit', onSubmit);
    }

    setupModal('upUsernameModal', 'upEditUsername', 'upUsernameCancel', 'upUsernameForm', async (event) => {
      event.preventDefault();

      const input = $('#upUsernameInput');
      const errorEl = $('#upUsernameError');
      const submitBtn = $('#upUsernameForm button[type="submit"]');
      if (!input || !errorEl || !submitBtn) return;

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
      submitBtn.textContent = 'Updating...';

      try {
        await updateCurrentUser({
          username,
          email: profile.email,
        });

        submitBtn.textContent = 'Updated';
        submitBtn.classList.add('success');
        ctx.timeout(() => {
          const modal = $('#upUsernameModal');
          const form = $('#upUsernameForm');
          if (modal) {
            modal.style.display = 'none';
          }
          form?.reset();
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('success');
          submitBtn.disabled = false;
        }, 700, 'lifetime');
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.add('show');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

    setupModal('upEmailModal', 'upEditEmail', 'upEmailCancel', 'upEmailForm', async (event) => {
      event.preventDefault();

      const input = $('#upEmailInput');
      const errorEl = $('#upEmailError');
      const submitBtn = $('#upEmailForm button[type="submit"]');
      if (!input || !errorEl || !submitBtn) return;

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
      submitBtn.textContent = 'Updating...';

      try {
        await updateCurrentUser({
          username: profile.username,
          email,
        });

        submitBtn.textContent = 'Updated';
        submitBtn.classList.add('success');
        ctx.timeout(() => {
          const modal = $('#upEmailModal');
          const form = $('#upEmailForm');
          if (modal) {
            modal.style.display = 'none';
          }
          form?.reset();
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('success');
          submitBtn.disabled = false;
        }, 700, 'lifetime');
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.add('show');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

    setupModal('upPasswordModal', 'upEditPassword', 'upPasswordCancel', 'upPasswordForm', async (event) => {
      event.preventDefault();

      const newPass = $('#upPasswordNew');
      const confirm = $('#upPasswordConfirm');
      const errorEl = $('#upPasswordError');
      const submitBtn = $('#upPasswordForm button[type="submit"]');
      if (!newPass || !confirm || !errorEl || !submitBtn) return;

      errorEl.classList.remove('show');
      errorEl.textContent = '';

      let valid = true;
      if (newPass.value.length < 6) {
        errorEl.textContent = 'New password must be at least 6 characters';
        valid = false;
      } else if (newPass.value !== confirm.value) {
        errorEl.textContent = 'Passwords do not match';
        valid = false;
      }

      if (!valid) {
        errorEl.classList.add('show');
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Changing...';

      try {
        await updateCurrentUser({
          username: profile.username,
          email: profile.email,
          password: newPass.value,
        });

        submitBtn.textContent = 'Changed';
        submitBtn.classList.add('success');
        ctx.timeout(() => {
          const modal = $('#upPasswordModal');
          const form = $('#upPasswordForm');
          if (modal) {
            modal.style.display = 'none';
          }
          form?.reset();
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('success');
          submitBtn.disabled = false;
        }, 700, 'lifetime');
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.add('show');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

    const doLogout = async (button) => {
      const confirmed = await confirmLogout();
      if (!confirmed) return;

      if (button) {
        button.disabled = true;
        if (button.id === 'upLogout') {
          button.textContent = 'Goodbye...';
        } else {
          button.innerHTML = 'Logging out...';
        }
      }

      try {
        await logout();
      } catch (err) {
        console.error('Logout error:', err);
      }
    };

    on($('#upLogout'), 'click', async () => {
      await doLogout($('#upLogout'));
    });

    on($('#up-mobile-logout'), 'click', async () => {
      await doLogout($('#up-mobile-logout'));
    });

    const doDeleteAccount = async (button) => {
      const expectedUsername = (profile.username || cached?.username || '').trim();
      const confirmation = await confirmDeleteAccount(expectedUsername);
      if (!confirmation || confirmation.confirmed !== true) return;

      const originalText = button?.textContent || '';
      if (button) {
        button.disabled = true;
        button.textContent = 'Deleting...';
      }

      try {
        const response = await authFetch(`${API_BASE}/api/User/me`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          },
          body: JSON.stringify({
            password: confirmation.password,
          }),
          skipAutoLogout: true,
        });

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => ({}));
          throw new Error(errorPayload?.message || 'Failed to delete account.');
        }

        await logout();
      } catch (err) {
        console.error('Delete account error:', err);
        await showDeleteAccountError(
          err?.message || 'Could not delete account. Please try again.',
          'Please verify your username and password are correct.',
        );
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    };

    on($('#upDeleteAccount'), 'click', async () => {
      await doDeleteAccount($('#upDeleteAccount'));
    });

    on($('#upBackToDashboard'), 'click', (event) => {
      event.preventDefault();
      if (window.router?.navigate) {
        window.router.navigate('/main');
        return;
      }
      window.location.href = '/main';
    });

    void Promise.resolve(ctx.once('user-panel.current-user', fetchCurrentUser)).then((userData) => {
      applyUserToUi(userData);
    });
  },
});

export default UserPanel;
