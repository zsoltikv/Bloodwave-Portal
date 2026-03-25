import '../../css/pages/Leaderboard.css';
import '../../css/pages/Achievements.css';
import { API_BASE, getUser, logout, authFetch } from '../auth.js';
import { confirmLogout } from '../logout-confirm.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import { Box, Button, Icon, Img, Link, Main, Nav, Paragraph, Span, Title, page, setupGroup, setupState, signal } from '../feather/index.js';

const ACHIEVEMENT_IMAGE_MODULES = import.meta.glob('../../assets/achievements/*', { eager: true, import: 'default' });
const ACHIEVEMENT_IMAGE_BY_KEY = Object.entries(ACHIEVEMENT_IMAGE_MODULES).reduce((acc, [path, url]) => {
  const fileName = path.split('/').pop() || '';
  const key = fileName.replace(/\.[^.]+$/, '').toLowerCase();
  acc.set(key, url);
  return acc;
}, new Map());

const ACHIEVEMENT_IMAGE_KEY_BY_ID = { 1: 'first_time_player', 2: 'movie_buff', 3: 'first_pause', 4: 'first_restart', 5: 'first_save', 6: 'first_steps', 7: 'first_blood', 8: 'slayer_10', 9: 'slayer_50', 10: 'mass_murderer', 11: 'multi_kill_10', 12: 'multi_kill_20', 13: 'no_hit_2min', 14: 'tank_500', 15: 'die_fast_15s', 16: 'no_pause_run', 17: 'afk_30s', 18: 'survivor_5min', 19: 'survivor_10min', 20: 'survivor_15min', 21: 'survivor_30min', 22: 'level_5', 23: 'level_10', 24: 'level_15', 25: 'level_20', 26: 'level_25', 27: 'level_50', 28: 'first_weapon_upgrade', 29: 'upgrade_damage_once', 30: 'upgrade_projectiles_once', 31: 'upgrade_cooldown_once', 32: 'upgrade_range_once', 33: 'upgrade_orbitalspeed_once', 34: 'weapon_level_5', 35: 'weapon_level_10', 36: 'projectiles_bonus_3', 37: 'cooldown_50', 38: 'range_150', 39: 'orbitalspeed_200', 40: 'rich', 41: 'shopaholic', 42: 'shop_clear_10', 43: 'collector', 44: 'big_spender', 45: 'arsenal', 46: 'orbit_master', 47: 'music_lover', 48: 'unlock_10_achievements', 49: 'unlock_25_achievements', 50: 'completionist' };

const ICONS = {
  user: '<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>',
  profile: '<path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />',
  cloud: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />',
  logout: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 1 1 8 0v3"></path>',
};

const svgIcon = (markup, fill = 'none', stroke = 'currentColor', width = '1.5') => Icon().attrs({ xmlns: 'http://www.w3.org/2000/svg', fill, viewBox: '0 0 24 24', stroke, 'stroke-width': width }).html(markup);

function achievementsNav() {
  return Nav(
    Box(
      Link('Bloodwave').href('/').dataLink().className('lb-logo'),
      Box(
        Link(Span('Matches')).href('/main').dataLink().className('lb-link'),
        Link(Span('Stats')).href('/stats').dataLink().className('lb-link'),
        Link(Span('Leaderboard')).href('/leaderboard').dataLink().className('lb-link'),
        Link(Span('Achievements')).href('/achievements').dataLink().className('lb-link active'),
      ).className('lb-links'),
      Box(
        Box(
          Button(svgIcon(ICONS.user, 'currentColor', 'none')).className('lb-avatar').id('ac-avatar-btn').ariaLabel('Profile menu').attr('aria-expanded', 'false'),
          Box(
            Box(
              Box('-').className('lb-dd-username').id('ac-dd-username'),
              Box('Member').className('lb-dd-role'),
            ).className('lb-dd-header'),
            Link(svgIcon(ICONS.profile), 'Profile').href('/user-panel').dataLink().className('lb-dd-item').attr('role', 'menuitem'),
            Link(svgIcon(ICONS.cloud), 'Installation').href('/android-download').dataLink().className('lb-dd-item').attr('role', 'menuitem'),
            Box().className('lb-dd-divider'),
            Button(svgIcon(ICONS.logout), 'Logout').className('lb-dd-item logout').id('ac-dd-logout').attr('role', 'menuitem'),
          ).className('lb-avatar-dropdown').id('ac-avatar-dropdown').attr('role', 'menu'),
        ).className('lb-avatar-wrap'),
        Button(Span().className('lb-bar'), Span().className('lb-bar'), Span().className('lb-bar')).className('lb-hamburger').id('ac-hamburger').ariaLabel('Toggle menu').attr('aria-expanded', 'false'),
      ).className('lb-right'),
    ).className('lb-nav-inner'),
    Box(
      Box(
        Link('Matches').href('/main').dataLink().className('lb-mobile-link'),
        Link('Stats').href('/stats').dataLink().className('lb-mobile-link'),
        Link('Leaderboard').href('/leaderboard').dataLink().className('lb-mobile-link'),
        Link('Achievements').href('/achievements').dataLink().className('lb-mobile-link'),
        Box().className('lb-mobile-divider'),
        Box(Span(svgIcon(ICONS.user, 'currentColor', 'none')).className('lb-mobile-avatar'), Span('-').id('ac-mobile-username')).className('lb-mobile-profile').style({ pointerEvents: 'none', cursor: 'default' }),
        Box().className('lb-mobile-divider'),
        Link('Profile').href('/user-panel').dataLink().className('lb-mobile-link'),
        Link('Installation').href('/android-download').dataLink().className('lb-mobile-link'),
        Button(svgIcon(ICONS.logout), 'Logout').className('lb-mobile-logout').id('ac-mobile-logout'),
      ).className('lb-mobile-menu-inner'),
    ).className('lb-mobile-menu').id('ac-mobile-menu'),
  ).className('lb-nav');
}

function ornament() {
  return Box(Box().className('lb-ornament-line'), Box().className('lb-ornament-diamond'), Box().className('lb-ornament-line')).className('lb-ornament');
}

function achievementSummaryCard(label, value, modifier = '') {
  return Box(
    Span(label).className('ach-summary-label'),
    Span(String(value)).className('ach-summary-value'),
  ).className(`ach-summary-card ${modifier}`.trim());
}

function achievementsSummary(summaryState) {
  const summary = summaryState.get();
  return [
    achievementSummaryCard('Total', summary.total),
    achievementSummaryCard('Unlocked', summary.unlocked, 'is-unlocked'),
    achievementSummaryCard('Locked', summary.locked, 'is-locked'),
    achievementSummaryCard('Progress', `${summary.percentage}%`, 'is-progress'),
  ];
}

function achievementImage(item) {
  if (!item.imageUrl) return null;

  return Box(
    Box(
      Img({ src: item.imageUrl, alt: item.title, loading: 'lazy', decoding: 'async' }),
      item.isUnlocked
        ? null
        : Span(
          svgIcon(ICONS.lock, 'none', 'currentColor', '1.8'),
        ).className('ach-art-lock').ariaLabel('Locked').attr('title', 'Locked'),
    ).className('ach-art'),
  );
}

function achievementCard(item) {
  return Box(
    Span(`#${item.id}`).className('ach-id'),
    achievementImage(item),
    Title(item.title).className('ach-title').attr('level', '3'),
    Paragraph(item.description).className('ach-description'),
    Box(item.isUnlocked ? `Unlocked: ${item.unlockedText}` : 'Locked').className('ach-footer'),
  )
    .className(`ach-card ${item.isUnlocked ? 'is-unlocked' : 'is-locked'}`.trim())
    .attr('aria-label', `Achievement ${item.id}`);
}

function achievementsGrid(achievementsState) {
  if (achievementsState.status.get() === 'loading') {
    return Box('Loading achievements...').className('ach-loading');
  }

  if (achievementsState.status.get() === 'error') {
    return Box(
      Paragraph(achievementsState.error.get() || 'Failed to load achievements.'),
      Button('Retry').className('ach-retry').id('ac-retry').attr('type', 'button'),
    ).className('ach-error');
  }

  const items = achievementsState.items.get();
  if (!items.length) {
    return Box('No achievements available.').className('ach-loading');
  }

  return items.map(achievementCard);
}

function createAchievementsView(ctx) {
  return Box(
    Box().className('lb-glow'),
    achievementsNav(),
    Main(
      Box(
        Box(
          ornament(),
          Title('Achievements').className('lb-title'),
          Paragraph('Track your unlocked milestones').className('lb-subtitle'),
        ).className('lb-header'),
        Box(
          achievementsSummary(ctx.achievements.summary),
        ).className('ach-summary').id('ac-summary'),
        Box(
          achievementsGrid(ctx.achievements),
        ).className('ach-grid').id('ac-grid').attr('aria-live', 'polite'),
      ).className('ach-inner'),
    ).className('lb-content'),
  ).className('lb-root');
}

const Achievements = page({
  name: 'Achievements',

  setup() {
    ensureGlobalStarfield();
    return setupState(
      setupGroup('user', { current: getUser() }),
      setupGroup('achievements', {
        status: signal('loading'),
        error: signal(''),
        summary: signal({ total: 0, unlocked: 0, locked: 0, percentage: 0 }),
        items: signal([]),
      }),
    );
  },

  render(ctx) {
    return createAchievementsView(ctx);
  },

  mount(ctx) {
    const { container } = ctx;
    const user = ctx.user.current;
    const fallbackDisplayName = user?.username ?? user?.email ?? 'Member';
    const ddUsernameEl = container.querySelector('#ac-dd-username');
    const mobileUsernameEl = container.querySelector('#ac-mobile-username');
    if (ddUsernameEl) ddUsernameEl.textContent = fallbackDisplayName;
    if (mobileUsernameEl) mobileUsernameEl.textContent = fallbackDisplayName;

    const hamburger = container.querySelector('#ac-hamburger');
    const mobileMenu = container.querySelector('#ac-mobile-menu');
    let mobileMenuOpen = false;

    const handleHamburgerClick = () => {
      mobileMenuOpen = !mobileMenuOpen;
      hamburger.classList.toggle('open', mobileMenuOpen);
      hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));
      if (mobileMenu) mobileMenu.style.maxHeight = mobileMenuOpen ? `${mobileMenu.scrollHeight}px` : '0';
    };
    hamburger?.addEventListener('click', handleHamburgerClick);
    ctx.cleanup(() => hamburger?.removeEventListener('click', handleHamburgerClick));

    mobileMenu?.querySelectorAll('.lb-mobile-link').forEach((link) => {
      const handleMobileLinkClick = () => {
        mobileMenuOpen = false;
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
        if (mobileMenu) mobileMenu.style.maxHeight = '0';
      };
      link.addEventListener('click', handleMobileLinkClick);
      ctx.cleanup(() => link.removeEventListener('click', handleMobileLinkClick));
    });

    const avatarBtn = container.querySelector('#ac-avatar-btn');
    const avatarDropdown = container.querySelector('#ac-avatar-dropdown');
    const handleAvatarClick = () => {
      avatarDropdown?.classList.toggle('open');
      avatarBtn.setAttribute('aria-expanded', String(avatarDropdown?.classList.contains('open')));
    };
    avatarBtn?.addEventListener('click', handleAvatarClick);
    ctx.cleanup(() => avatarBtn?.removeEventListener('click', handleAvatarClick));

    const handleDocumentClick = (event) => {
      const clickTarget = event.target instanceof Element ? event.target : null;
      if (!clickTarget?.closest('.lb-avatar-wrap')) {
        avatarDropdown?.classList.remove('open');
        avatarBtn?.setAttribute('aria-expanded', 'false');
      }
    };
    document.addEventListener('click', handleDocumentClick);
    ctx.cleanup(() => document.removeEventListener('click', handleDocumentClick));

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

    const desktopLogout = container.querySelector('#ac-dd-logout');
    const mobileLogout = container.querySelector('#ac-mobile-logout');
    desktopLogout?.addEventListener('click', doLogout);
    mobileLogout?.addEventListener('click', doLogout);
    ctx.cleanup(() => desktopLogout?.removeEventListener('click', doLogout));
    ctx.cleanup(() => mobileLogout?.removeEventListener('click', doLogout));

    const handleContainerClick = (event) => {
      const clickTarget = event.target instanceof Element ? event.target : null;
      if (clickTarget?.closest('#ac-retry')) {
        void loadAchievements();
      }
    };
    container.addEventListener('click', handleContainerClick);
    ctx.cleanup(() => container.removeEventListener('click', handleContainerClick));

    void ctx.once('achievements.boot', async () => {
      void refreshNavbarUsername();
      void loadAchievements();
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
      } catch {}
    }

    function normalizeAchievementText(value) {
      if (typeof value !== 'string') return '';
      let text = value.trim();
      if (text.startsWith('"') && text.endsWith('"') && text.length >= 2) text = text.slice(1, -1);
      return text.replace(/\\"/g, '"').trim();
    }

    function makeTitleImageKey(value) {
      return normalizeAchievementText(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    }

    function getAchievementImageUrl(achievement) {
      const achievementId = Number(achievement?.id);
      const idKey = ACHIEVEMENT_IMAGE_KEY_BY_ID[achievementId];
      if (idKey && ACHIEVEMENT_IMAGE_BY_KEY.has(idKey)) return ACHIEVEMENT_IMAGE_BY_KEY.get(idKey);
      const titleKey = makeTitleImageKey(achievement?.title);
      if (titleKey && ACHIEVEMENT_IMAGE_BY_KEY.has(titleKey)) return ACHIEVEMENT_IMAGE_BY_KEY.get(titleKey);
      return '';
    }

    function formatUnlockedAt(isoDate) {
      const raw = typeof isoDate === 'string' ? isoDate.trim() : '';
      if (!raw) return '';
      const normalized = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw) ? raw : `${raw}Z`;
      const parsedDate = new Date(normalized);
      if (Number.isNaN(parsedDate.getTime())) return '';
      return new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Budapest' }).format(parsedDate);
    }

    async function loadAchievements() {
      ctx.achievements.status.set('loading');
      ctx.achievements.error.set('');
      ctx.achievements.items.set([]);
      ctx.achievements.summary.set({ total: 0, unlocked: 0, locked: 0, percentage: 0 });

      try {
        const [allRes, mineRes] = await Promise.all([
          authFetch(`${API_BASE}/api/Achievment`, { method: 'GET', headers: { Accept: 'application/json' } }),
          authFetch(`${API_BASE}/api/Achievment/me`, { method: 'GET', headers: { Accept: 'application/json' } }),
        ]);

        if (!allRes.ok) throw new Error('Failed to load achievements list.');

        const allAchievements = await allRes.json();
        const unlockedRows = mineRes.ok ? await mineRes.json() : [];
        const unlockedMap = new Map();
        if (Array.isArray(unlockedRows)) {
          unlockedRows.forEach((row) => {
            const achievementId = Number(row?.achievmentId);
            if (Number.isFinite(achievementId)) {
              unlockedMap.set(achievementId, row?.unlockedAt || '');
            }
          });
        }

        const normalizedAchievements = Array.isArray(allAchievements)
          ? [...allAchievements]
            .sort((a, b) => Number(a.id) - Number(b.id))
            .map((achievement) => {
              const achievementId = Number(achievement.id);
              const unlockedAt = unlockedMap.get(achievementId);
              const isUnlocked = Boolean(unlockedAt);

              return {
                id: achievementId,
                title: normalizeAchievementText(achievement.title),
                description: normalizeAchievementText(achievement.description),
                imageUrl: getAchievementImageUrl(achievement),
                isUnlocked,
                unlockedText: isUnlocked ? formatUnlockedAt(unlockedAt) : '',
              };
            })
          : [];

        const unlockedCount = normalizedAchievements.reduce((count, achievement) => count + (achievement.isUnlocked ? 1 : 0), 0);
        const total = normalizedAchievements.length;

        ctx.achievements.summary.set({
          total,
          unlocked: unlockedCount,
          locked: Math.max(0, total - unlockedCount),
          percentage: total > 0 ? Math.round((unlockedCount / total) * 100) : 0,
        });
        ctx.achievements.items.set(normalizedAchievements);
        ctx.achievements.status.set('ready');
      } catch (error) {
        ctx.achievements.error.set(error?.message || 'Failed to load achievements.');
        ctx.achievements.status.set('error');
      }
    }
  },
});

export default Achievements;
