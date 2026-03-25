import '../../css/pages/Leaderboard.css';
import '../../css/pages/Achievements.css';
import { API_BASE, getUser, authFetch } from '../auth.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import {
  DashboardNavbar,
  mountDashboardNavbar,
  refreshDashboardNavbarUsername,
  resolveDashboardDisplayName,
} from '../components/DashboardNavbar.js';
import { Box, Button, Icon, Img, Main, Paragraph, Span, Title, page, setupGroup, setupState, signal } from '../feather/index.js';

const ACHIEVEMENT_IMAGE_MODULES = import.meta.glob('../../assets/achievements/*', { eager: true, import: 'default' });
const ACHIEVEMENT_IMAGE_BY_KEY = Object.entries(ACHIEVEMENT_IMAGE_MODULES).reduce((acc, [path, url]) => {
  const fileName = path.split('/').pop() || '';
  const key = fileName.replace(/\.[^.]+$/, '').toLowerCase();
  acc.set(key, url);
  return acc;
}, new Map());

const ACHIEVEMENT_IMAGE_KEY_BY_ID = { 1: 'first_time_player', 2: 'movie_buff', 3: 'first_pause', 4: 'first_restart', 5: 'first_save', 6: 'first_steps', 7: 'first_blood', 8: 'slayer_10', 9: 'slayer_50', 10: 'mass_murderer', 11: 'multi_kill_10', 12: 'multi_kill_20', 13: 'no_hit_2min', 14: 'tank_500', 15: 'die_fast_15s', 16: 'no_pause_run', 17: 'afk_30s', 18: 'survivor_5min', 19: 'survivor_10min', 20: 'survivor_15min', 21: 'survivor_30min', 22: 'level_5', 23: 'level_10', 24: 'level_15', 25: 'level_20', 26: 'level_25', 27: 'level_50', 28: 'first_weapon_upgrade', 29: 'upgrade_damage_once', 30: 'upgrade_projectiles_once', 31: 'upgrade_cooldown_once', 32: 'upgrade_range_once', 33: 'upgrade_orbitalspeed_once', 34: 'weapon_level_5', 35: 'weapon_level_10', 36: 'projectiles_bonus_3', 37: 'cooldown_50', 38: 'range_150', 39: 'orbitalspeed_200', 40: 'rich', 41: 'shopaholic', 42: 'shop_clear_10', 43: 'collector', 44: 'big_spender', 45: 'arsenal', 46: 'orbit_master', 47: 'music_lover', 48: 'unlock_10_achievements', 49: 'unlock_25_achievements', 50: 'completionist' };

const LOCK_ICON = '<rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 1 1 8 0v3"></path>';

const svgIcon = (markup, fill = 'none', stroke = 'currentColor', width = '1.5') => Icon().attrs({ xmlns: 'http://www.w3.org/2000/svg', fill, viewBox: '0 0 24 24', stroke, 'stroke-width': width }).html(markup);

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
          svgIcon(LOCK_ICON, 'none', 'currentColor', '1.8'),
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
    DashboardNavbar({
      variant: 'achievements',
      active: 'achievements',
      username: ctx.user.displayName,
    }),
    Main(
      Box(
        Box(
          ornament(),
          Title('Achievements').className('lb-title'),
          Paragraph('Track your unlocked milestones').className('lb-subtitle'),
        ).className('lb-header'),
        Box(
          () => achievementsSummary(ctx.achievements.summary),
        ).className('ach-summary').id('ac-summary'),
        Box(
          () => achievementsGrid(ctx.achievements),
        ).className('ach-grid').id('ac-grid').attr('aria-live', 'polite'),
      ).className('ach-inner'),
    ).className('lb-content'),
  ).className('lb-root');
}

const Achievements = page({
  name: 'Achievements',

  setup() {
    ensureGlobalStarfield();
    const user = getUser();
    return setupState(
      setupGroup('user', {
        current: user,
        displayName: signal(resolveDashboardDisplayName(user)),
      }),
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
    mountDashboardNavbar(ctx, { variant: 'achievements' });

    const { container } = ctx;
    const handleContainerClick = (event) => {
      const clickTarget = event.target instanceof Element ? event.target : null;
      if (clickTarget?.closest('#ac-retry')) {
        void loadAchievements();
      }
    };
    container.addEventListener('click', handleContainerClick);
    ctx.cleanup(() => container.removeEventListener('click', handleContainerClick));

    void ctx.once('achievements.boot', async () => {
      void refreshDashboardNavbarUsername(ctx, ctx.user.displayName, 'achievements.navbar-username');
      void loadAchievements();
    });

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
