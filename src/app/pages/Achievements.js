import '../../styles/pages/Leaderboard.css';
import '../../styles/pages/Achievements.css';
import { API_BASE, getUser, logout, authFetch } from '../services/auth.js';
import { confirmLogout } from '../effects/logout-confirm.js';
import { ensureGlobalStarfield } from '../effects/global-starfield.js';

const ACHIEVEMENT_IMAGE_MODULES = import.meta.glob('../../assets/achievements/*', {
  eager: true,
  import: 'default',
});

const ACHIEVEMENT_IMAGE_BY_KEY = Object.entries(ACHIEVEMENT_IMAGE_MODULES).reduce((acc, [path, url]) => {
  const fileName = path.split('/').pop() || '';
  const key = fileName.replace(/\.[^.]+$/, '').toLowerCase();
  acc.set(key, url);
  return acc;
}, new Map());

const ACHIEVEMENT_IMAGE_KEY_BY_ID = {
  1: 'first_time_player',
  2: 'movie_buff',
  3: 'first_pause',
  4: 'first_restart',
  5: 'first_save',
  6: 'first_steps',
  7: 'first_blood',
  8: 'slayer_10',
  9: 'slayer_50',
  10: 'mass_murderer',
  11: 'multi_kill_10',
  12: 'multi_kill_20',
  13: 'no_hit_2min',
  14: 'tank_500',
  15: 'die_fast_15s',
  16: 'no_pause_run',
  17: 'afk_30s',
  18: 'survivor_5min',
  19: 'survivor_10min',
  20: 'survivor_15min',
  21: 'survivor_30min',
  22: 'level_5',
  23: 'level_10',
  24: 'level_15',
  25: 'level_20',
  26: 'level_25',
  27: 'level_50',
  28: 'first_weapon_upgrade',
  29: 'upgrade_damage_once',
  30: 'upgrade_projectiles_once',
  31: 'upgrade_cooldown_once',
  32: 'upgrade_range_once',
  33: 'upgrade_orbitalspeed_once',
  34: 'weapon_level_5',
  35: 'weapon_level_10',
  36: 'projectiles_bonus_3',
  37: 'cooldown_50',
  38: 'range_150',
  39: 'orbitalspeed_200',
  40: 'rich',
  41: 'shopaholic',
  42: 'shop_clear_10',
  43: 'collector',
  44: 'big_spender',
  45: 'arsenal',
  46: 'orbit_master',
  47: 'music_lover',
  48: 'unlock_10_achievements',
  49: 'unlock_25_achievements',
  50: 'completionist',
};

export default function Achievements(container) {
  let achievementView = 'unlocked-first';
  let cachedAchievements = [];
  let cachedUnlockedMap = new Map();
  container.innerHTML = `
    <div class="lb-root">
      <div class="lb-glow"></div>

      <nav class="lb-nav">
        <div class="lb-nav-inner">
          <a href="/" data-link class="lb-logo">Bloodwave</a>

          <div class="lb-links">
            <a href="/main" data-link class="lb-link"><span>Matches</span></a>
            <a href="/stats" data-link class="lb-link"><span>Stats</span></a>
            <a href="/leaderboard" data-link class="lb-link"><span>Leaderboard</span></a>
            <a href="/achievements" data-link class="lb-link active"><span>Achievements</span></a>
          </div>

          <div class="lb-right">
            <div class="lb-avatar-wrap">
              <button class="lb-avatar" id="ac-avatar-btn" aria-label="Profile menu" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
              <div class="lb-avatar-dropdown" id="ac-avatar-dropdown" role="menu">
                <div class="lb-dd-header">
                  <div class="lb-dd-username" id="ac-dd-username">-</div>
                  <div class="lb-dd-role">Member</div>
                </div>
                <a href="/user-panel" data-link class="lb-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />
                  </svg>
                  Profile
                </a>
                <a href="/android-download" data-link class="lb-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />
                  </svg>
                  Installation
                </a>
                <a href="/backend-status" data-link class="lb-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5 8.25 9l3 3 4.5-6 4.5 7.5" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 19.5h16.5" />
                  </svg>
                  API Status
                </a>
                <div class="lb-dd-divider"></div>
                <button class="lb-dd-item logout" id="ac-dd-logout" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <button class="lb-hamburger" id="ac-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="lb-bar"></span>
              <span class="lb-bar"></span>
              <span class="lb-bar"></span>
            </button>
          </div>
        </div>

        <div class="lb-mobile-menu" id="ac-mobile-menu">
          <div class="lb-mobile-menu-inner">
            <a href="/main" data-link class="lb-mobile-link">Matches</a>
            <a href="/stats" data-link class="lb-mobile-link">Stats</a>
            <a href="/leaderboard" data-link class="lb-mobile-link">Leaderboard</a>
            <a href="/achievements" data-link class="lb-mobile-link">Achievements</a>
            <div class="lb-mobile-divider"></div>
            <div class="lb-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="lb-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="ac-mobile-username">-</span>
            </div>
            <div class="lb-mobile-divider"></div>
            <a href="/user-panel" data-link class="lb-mobile-link">Profile</a>
            <a href="/android-download" data-link class="lb-mobile-link">Installation</a>
            <a href="/backend-status" data-link class="lb-mobile-link">Backend Status</a>
            <button class="lb-mobile-logout" id="ac-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main class="lb-content">
        <div class="ach-inner">
          <div class="lb-header">
            <div class="lb-ornament">
              <div class="lb-ornament-line"></div>
              <div class="lb-ornament-diamond"></div>
              <div class="lb-ornament-line"></div>
            </div>
            <h1 class="lb-title">Achievements</h1>
            <p class="lb-subtitle">Track your unlocked milestones</p>
            <div class="ach-toolbar">
              <label class="ach-control ach-sort" for="ac-view-select">
                <span class="ach-control-label">Browse By</span>
                <select class="ach-control-select ach-sort-select" id="ac-view-select" aria-label="Browse achievements">
                  <option value="all">All Achievements</option>
                  <option value="unlocked-only">Unlocked Only</option>
                  <option value="locked-only">Locked Only</option>
                  <option value="unlocked-first">Unlocked First</option>
                  <option value="recent-unlocked">Recently Unlocked</option>
                </select>
              </label>
            </div>
          </div>

          <section class="ach-summary" id="ac-summary"></section>
          <section class="ach-grid" id="ac-grid" aria-live="polite"></section>
        </div>
      </main>
    </div>
  `;

  ensureGlobalStarfield();

  const user = getUser();
  const fallbackDisplayName = user?.username ?? user?.email ?? 'Member';
  const viewSelect = container.querySelector('#ac-view-select');

  const ddUsernameEl = container.querySelector('#ac-dd-username');
  const mobileUsernameEl = container.querySelector('#ac-mobile-username');
  if (ddUsernameEl) ddUsernameEl.textContent = fallbackDisplayName;
  if (mobileUsernameEl) mobileUsernameEl.textContent = fallbackDisplayName;

  const hamburger = container.querySelector('#ac-hamburger');
  const mobileMenu = container.querySelector('#ac-mobile-menu');
  let mobileMenuOpen = false;

  hamburger?.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;
    hamburger.classList.toggle('open', mobileMenuOpen);
    hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));
    if (mobileMenu) {
      mobileMenu.style.maxHeight = mobileMenuOpen ? `${mobileMenu.scrollHeight}px` : '0';
    }
  });

  mobileMenu?.querySelectorAll('.lb-mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenuOpen = false;
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      if (mobileMenu) mobileMenu.style.maxHeight = '0';
    });
  });

  const avatarBtn = container.querySelector('#ac-avatar-btn');
  const avatarDropdown = container.querySelector('#ac-avatar-dropdown');

  avatarBtn?.addEventListener('click', () => {
    avatarDropdown?.classList.toggle('open');
    avatarBtn.setAttribute('aria-expanded', String(avatarDropdown?.classList.contains('open')));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.lb-avatar-wrap')) {
      avatarDropdown?.classList.remove('open');
      avatarBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  const doLogout = async () => {
    const confirmed = await confirmLogout();
    if (!confirmed) return;

    await logout();
    if (window.router?.navigate) {
      window.router.navigate('/login');
      return;
    }
    window.location.href = '/login';
  };

  container.querySelector('#ac-dd-logout')?.addEventListener('click', doLogout);
  container.querySelector('#ac-mobile-logout')?.addEventListener('click', doLogout);

  viewSelect?.addEventListener('change', (event) => {
    achievementView = event.target.value || 'unlocked-first';
    renderAchievements(cachedAchievements, cachedUnlockedMap);
  });

  async function refreshNavbarUsername() {
    try {
      const res = await authFetch(`${API_BASE}/api/User/me`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) return;

      const userData = await res.json();
      const liveDisplayName = userData?.username ?? userData?.email ?? fallbackDisplayName;

      if (ddUsernameEl) ddUsernameEl.textContent = liveDisplayName;
      if (mobileUsernameEl) mobileUsernameEl.textContent = liveDisplayName;
    } catch {
      // Keep cached name if the request fails.
    }
  }

  function escapeHtml(value) {
    const span = document.createElement('span');
    span.textContent = String(value ?? '');
    return span.innerHTML;
  }

  function normalizeAchievementText(value) {
    if (typeof value !== 'string') return '';

    let text = value.trim();
    if (text.startsWith('"') && text.endsWith('"') && text.length >= 2) {
      text = text.slice(1, -1);
    }

    return text.replace(/\\"/g, '"').trim();
  }

  function makeTitleImageKey(value) {
    return normalizeAchievementText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  function getAchievementImageUrl(achievement) {
    const achievementId = Number(achievement?.id);
    const idKey = ACHIEVEMENT_IMAGE_KEY_BY_ID[achievementId];
    if (idKey && ACHIEVEMENT_IMAGE_BY_KEY.has(idKey)) {
      return ACHIEVEMENT_IMAGE_BY_KEY.get(idKey);
    }

    const titleKey = makeTitleImageKey(achievement?.title);
    if (titleKey && ACHIEVEMENT_IMAGE_BY_KEY.has(titleKey)) {
      return ACHIEVEMENT_IMAGE_BY_KEY.get(titleKey);
    }

    return '';
  }

  function formatUnlockedAt(isoDate) {
    const raw = typeof isoDate === 'string' ? isoDate.trim() : '';
    if (!raw) return '';

    const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw);
    const normalized = hasTimezone ? raw : `${raw}Z`;
    const parsedDate = new Date(normalized);

    if (Number.isNaN(parsedDate.getTime())) return '';

    return new Intl.DateTimeFormat('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Budapest',
    }).format(parsedDate);
  }

  function renderSummary(total, unlocked) {
    const summaryEl = container.querySelector('#ac-summary');
    if (!summaryEl) return;

    const locked = Math.max(0, total - unlocked);
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    summaryEl.innerHTML = `
      <article class="ach-summary-card">
        <span class="ach-summary-label">Total</span>
        <span class="ach-summary-value">${total}</span>
      </article>
      <article class="ach-summary-card is-unlocked">
        <span class="ach-summary-label">Unlocked</span>
        <span class="ach-summary-value">${unlocked}</span>
      </article>
      <article class="ach-summary-card is-locked">
        <span class="ach-summary-label">Locked</span>
        <span class="ach-summary-value">${locked}</span>
      </article>
      <article class="ach-summary-card is-progress">
        <span class="ach-summary-label">Progress</span>
        <span class="ach-summary-value">${percentage}%</span>
      </article>
    `;
  }

  function renderLoading() {
    const gridEl = container.querySelector('#ac-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '<div class="ach-loading">Loading achievements...</div>';
  }

  function renderError(message) {
    const gridEl = container.querySelector('#ac-grid');
    if (!gridEl) return;

    gridEl.innerHTML = `
      <div class="ach-error">
        <p>${escapeHtml(message)}</p>
        <button type="button" class="ach-retry" id="ac-retry">Retry</button>
      </div>
    `;

    const retryBtn = gridEl.querySelector('#ac-retry');
    retryBtn?.addEventListener('click', loadAchievements);
  }

  function renderAchievements(achievements, unlockedMap) {
    const gridEl = container.querySelector('#ac-grid');
    if (!gridEl) return;

    if (!Array.isArray(achievements) || achievements.length === 0) {
      gridEl.innerHTML = '<div class="ach-loading">No achievements available.</div>';
      renderSummary(0, 0);
      return;
    }

    const unlockedCount = achievements.reduce((count, achievement) => {
      return count + (unlockedMap.has(Number(achievement.id)) ? 1 : 0);
    }, 0);
    const sorted = applyAchievementView(achievements, unlockedMap, achievementView);

    renderSummary(achievements.length, unlockedCount);

    if (!sorted.length) {
      const emptyMessage = achievementView === 'unlocked-only'
        ? 'No unlocked achievements yet.'
        : achievementView === 'locked-only'
          ? 'No locked achievements remaining.'
          : 'No achievements available.';
      gridEl.innerHTML = `<div class="ach-loading">${escapeHtml(emptyMessage)}</div>`;
      return;
    }

    gridEl.innerHTML = sorted.map((achievement) => {
      const achievementId = Number(achievement.id);
      const unlockedAt = unlockedMap.get(achievementId);
      const isUnlocked = Boolean(unlockedAt);
      const title = escapeHtml(normalizeAchievementText(achievement.title));
      const description = escapeHtml(normalizeAchievementText(achievement.description));
      const unlockedText = isUnlocked ? formatUnlockedAt(unlockedAt) : '';
      const imageUrl = getAchievementImageUrl(achievement);
      const lockOverlay = isUnlocked
        ? ''
        : '<span class="ach-art-lock" aria-label="Locked" title="Locked"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 1 1 8 0v3"></path></svg></span>';
      const imageMarkup = imageUrl
        ? `<div class="ach-art"><img src="${escapeHtml(imageUrl)}" alt="${title}" loading="lazy" decoding="async">${lockOverlay}</div>`
        : '';

      return `
        <article class="ach-card ${isUnlocked ? 'is-unlocked' : 'is-locked'}" aria-label="Achievement ${achievementId}">
          <span class="ach-id">#${achievementId}</span>
          ${imageMarkup}
          <h3 class="ach-title">${title}</h3>
          <p class="ach-description">${description}</p>
          <div class="ach-footer">${isUnlocked ? `Unlocked: ${escapeHtml(unlockedText)}` : 'Locked'}</div>
        </article>
      `;
    }).join('');
  }

  async function loadAchievements() {
    renderLoading();

    try {
      const [allRes, mineRes] = await Promise.all([
        authFetch(`${API_BASE}/api/Achievment`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }),
        authFetch(`${API_BASE}/api/Achievment/me`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }),
      ]);

      if (!allRes.ok) {
        throw new Error('Failed to load achievements list.');
      }

      const allAchievements = await allRes.json();
      const unlockedRows = mineRes.ok ? await mineRes.json() : [];
      const unlockedMap = new Map();

      if (Array.isArray(unlockedRows)) {
        unlockedRows.forEach((row) => {
          const achievementId = Number(row?.achievmentId);
          const unlockedAt = row?.unlockedAt;
          if (Number.isFinite(achievementId)) {
            unlockedMap.set(achievementId, unlockedAt || '');
          }
        });
      }

      cachedAchievements = Array.isArray(allAchievements) ? allAchievements : [];
      cachedUnlockedMap = unlockedMap;
      renderAchievements(cachedAchievements, cachedUnlockedMap);
    } catch (error) {
      renderError(error?.message || 'Failed to load achievements.');
    }
  }

  function sortAchievements(achievements, unlockedMap, sortKey) {
    const normalized = Array.isArray(achievements) ? [...achievements] : [];

    const getUnlockedTime = (achievement) => {
      const raw = unlockedMap.get(Number(achievement?.id));
      if (!raw) return 0;
      const parsed = new Date(/(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw) ? raw : `${raw}Z`);
      return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
    };

    switch (sortKey) {
      case 'unlocked-first':
        return normalized.sort((a, b) => {
          const leftUnlocked = unlockedMap.has(Number(a.id)) ? 1 : 0;
          const rightUnlocked = unlockedMap.has(Number(b.id)) ? 1 : 0;
          if (rightUnlocked !== leftUnlocked) return rightUnlocked - leftUnlocked;
          return Number(a.id) - Number(b.id);
        });
      case 'recent-unlocked':
        return normalized.sort((a, b) => {
          const leftUnlockedTime = getUnlockedTime(a);
          const rightUnlockedTime = getUnlockedTime(b);
          if (rightUnlockedTime !== leftUnlockedTime) return rightUnlockedTime - leftUnlockedTime;
          const leftUnlocked = unlockedMap.has(Number(a.id)) ? 1 : 0;
          const rightUnlocked = unlockedMap.has(Number(b.id)) ? 1 : 0;
          if (rightUnlocked !== leftUnlocked) return rightUnlocked - leftUnlocked;
          return Number(a.id) - Number(b.id);
        });
      default:
        return normalized.sort((a, b) => {
          const leftUnlocked = unlockedMap.has(Number(a.id)) ? 1 : 0;
          const rightUnlocked = unlockedMap.has(Number(b.id)) ? 1 : 0;
          if (rightUnlocked !== leftUnlocked) return rightUnlocked - leftUnlocked;
          return Number(a.id) - Number(b.id);
        });
    }
  }

  function applyAchievementView(achievements, unlockedMap, viewKey) {
    const normalized = Array.isArray(achievements) ? [...achievements] : [];

    switch (viewKey) {
      case 'unlocked-only':
        return sortAchievements(
          normalized.filter((achievement) => unlockedMap.has(Number(achievement?.id))),
          unlockedMap,
          'unlocked-first',
        );
      case 'locked-only':
        return sortAchievements(
          normalized.filter((achievement) => !unlockedMap.has(Number(achievement?.id))),
          unlockedMap,
          'unlocked-first',
        );
      case 'recent-unlocked':
        return sortAchievements(normalized, unlockedMap, 'recent-unlocked');
      case 'all':
      case 'unlocked-first':
      default:
        return sortAchievements(normalized, unlockedMap, 'unlocked-first');
    }
  }

  refreshNavbarUsername();
  loadAchievements();
}
