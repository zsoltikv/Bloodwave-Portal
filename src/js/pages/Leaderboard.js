import '../../css/pages/Leaderboard.css';
import { API_BASE, getUser, authFetch } from '../auth.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import {
  DashboardNavbar,
  mountDashboardNavbar,
  refreshDashboardNavbarUsername,
  resolveDashboardDisplayName,
} from '../components/DashboardNavbar.js';
import { Box, Button, Main, Paragraph, Span, Title, page, setupGroup, setupState, signal } from '../feather/index.js';

function ornament() {
  return Box(
    Box().className('lb-ornament-line'),
    Box().className('lb-ornament-diamond'),
    Box().className('lb-ornament-line'),
  ).className('lb-ornament');
}

function leaderboardCard(entry, index) {
  const medal = index === 0 ? '1.' : index === 1 ? '2.' : index === 2 ? '3.' : `${index + 1}.`;

  return Box(
    Box().className('lb-card-corner lb-card-corner--tl'),
    Box().className('lb-card-corner lb-card-corner--tr'),
    Box().className('lb-card-corner lb-card-corner--bl'),
    Box().className('lb-card-corner lb-card-corner--br'),
    Box(
      Box(medal).className('lb-card-rank'),
      Box(
        Box(entry.displayName || `User #${entry.userId}`).className('lb-card-username'),
        Box('YOU')
          .className(`lb-you-badge ${entry.isCurrentUser ? '' : 'is-hidden'}`.trim()),
      ).className('lb-card-username-wrap'),
      Box().className('lb-card-sep'),
      Box(
        Box(
          Span('Level').className('lb-stat-label'),
          Span(String(entry.level || 0))
            .className('lb-stat-value js-lb-count')
            .attr('data-type', 'int')
            .attr('data-target', String(entry.level || 0)),
        ).className('lb-stat'),
        Box(
          Span('Run Time').className('lb-stat-label'),
          Span(formatTime(entry.runTimeMs || 0))
            .className('lb-stat-value js-lb-count')
            .attr('data-type', 'time-hm')
            .attr('data-target', String(Math.max(0, Math.round(entry.runTimeMs || 0)))),
        ).className('lb-stat'),
      ).className('lb-card-stats'),
    ).className('lb-card-body'),
  )
    .className(`lb-card ${index < 3 ? `lb-rank-${index + 1}` : ''} ${entry.isCurrentUser ? 'lb-card-you' : ''}`.trim())
    .onClick(() => {
      window.router?.navigate(`/main?userId=${encodeURIComponent(entry.userId)}`);
    });
}

function leaderboardGrid(board) {
  if (board.status.get() === 'loading') {
    return Box('Loading leaderboard...').className('lb-loading');
  }

  if (board.status.get() === 'error') {
    return Box(board.error.get() || 'Failed to load leaderboard').className('lb-empty');
  }

  const rows = board.rows.get();
  if (!rows.length) {
    return Box('No players yet').className('lb-empty');
  }

  return rows.map(leaderboardCard);
}

function createLeaderboardView(ctx) {
  return Box(
    Box().className('lb-glow'),
    DashboardNavbar({
      variant: 'leaderboard',
      active: 'leaderboard',
      username: ctx.user.displayName,
    }),
    Main(
      Box(
        Box(
          ornament(),
          Title('Global Leaderboard').className('lb-title'),
          Paragraph('Worldwide\u00A0\u00A0rankings').className('lb-subtitle'),
        ).className('lb-header'),
        Box(
          () => leaderboardGrid(ctx.board),
        ).className('lb-grid').id('lb-grid'),
      ).className('lb-inner'),
    ).className('lb-content'),
  ).className('lb-root');
}

const Leaderboard = page({
  name: 'Leaderboard',

  setup() {
    ensureGlobalStarfield();
    const user = getUser();
    return setupState(
      setupGroup('user', {
        current: user,
        displayName: signal(resolveDashboardDisplayName(user, '-')),
      }),
      setupGroup('board', {
        status: signal('loading'),
        error: signal(''),
        rows: signal([]),
      }),
    );
  },

  render(ctx) {
    return createLeaderboardView(ctx);
  },

  mount(ctx) {
    const user = ctx.user.current;
    mountDashboardNavbar(ctx, { variant: 'leaderboard' });

    void ctx.once('leaderboard.boot', async () => {
      void refreshDashboardNavbarUsername(ctx, ctx.user.displayName, 'leaderboard.navbar-username', '-');
      void loadLeaderboard();
    });

    async function loadLeaderboard() {
      ctx.board.status.set('loading');
      ctx.board.error.set('');
      ctx.board.rows.set([]);
      try {
        const currentUserContext = await resolveCurrentUserContext(user);
        const response = await authFetch(`${API_BASE}/api/Match`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        const matches = await response.json();

        const leaderboardRows = buildLeaderboardRows(matches, currentUserContext);

        const hydratedRows = await Promise.all(leaderboardRows.map(async (entry) => {
          try {
            const res = await authFetch(`${API_BASE}/api/User/name?id=${encodeURIComponent(entry.userId)}`, {
              method: 'GET',
              headers: { Accept: 'application/json' },
            });
            if (!res.ok) throw new Error('User not found');
            const data = await res.json();
            const displayName = data?.username || `User #${entry.userId}`;
            const isCurrentUser = entry.isCurrentUser || isSameUsername(displayName, currentUserContext?.username);
            return { ...entry, displayName, isCurrentUser };
          } catch {
            return { ...entry, displayName: `User #${entry.userId}` };
          }
        }));

        ctx.board.rows.set(hydratedRows);
        ctx.board.status.set('ready');
        ctx.timeout(() => {
          const grid = ctx.$('#lb-grid');
          if (grid) animateLbStats(grid);
        }, 0, 'lifetime');
      } catch (error) {
        console.error('Leaderboard error:', error);
        ctx.board.error.set('Failed to load leaderboard');
        ctx.board.status.set('error');
      }
    }
  },
});

export default Leaderboard;

function normalizeRunTimeMs(rawTime) {
  const numeric = Number(rawTime);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  if (numeric < 10000) return numeric * 1000;
  return numeric;
}

function compareByRank(a, b) {
  if (b.level !== a.level) return b.level - a.level;
  if (a.runTimeMs !== b.runTimeMs) return a.runTimeMs - b.runTimeMs;
  return a.username.localeCompare(b.username);
}

function resolveUsername(matchEntry, currentUser) {
  if (matchEntry?.username) return String(matchEntry.username);
  if (matchEntry?.user?.username) return String(matchEntry.user.username);

  const userId = Number(matchEntry?.userId);
  if (currentUser?.id === userId && currentUser?.username) {
    return currentUser.username;
  }

  return `User #${userId || 'Unknown'}`;
}

function resolveCurrentUserId(currentUser) {
  const candidates = [currentUser?.id, currentUser?.userId, currentUser?.playerId, currentUser?.Id, currentUser?.UserId, currentUser?.PlayerId];
  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isInteger(parsed) && parsed > 0) return parsed;
  }
  return null;
}

function normalizeUsername(value) {
  if (!value) return '';
  return String(value).trim().toLowerCase();
}

function isSameUsername(left, right) {
  const leftNorm = normalizeUsername(left);
  const rightNorm = normalizeUsername(right);
  return Boolean(leftNorm) && Boolean(rightNorm) && leftNorm === rightNorm;
}

async function resolveCurrentUserContext(cachedUser) {
  const fallback = {
    id: resolveCurrentUserId(cachedUser),
    username: cachedUser?.username || cachedUser?.email || null,
  };

  try {
    const res = await authFetch(`${API_BASE}/api/User/me`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return fallback;

    const me = await res.json();
    const meContext = {
      id: resolveCurrentUserId(me),
      username: me?.username || me?.email || fallback.username,
    };

    return {
      id: meContext.id ?? fallback.id,
      username: meContext.username,
    };
  } catch {
    return fallback;
  }
}

function buildLeaderboardRows(matches, currentUser) {
  if (!Array.isArray(matches)) return [];

  const currentUserId = resolveCurrentUserId(currentUser);
  const bestByUserId = new Map();

  matches.forEach((matchEntry) => {
    const userId = Number(matchEntry?.userId);
    if (!Number.isFinite(userId)) return;

    const candidate = {
      userId,
      username: resolveUsername(matchEntry, currentUser),
      level: Number(matchEntry?.level) || 0,
      runTimeMs: normalizeRunTimeMs(matchEntry?.time),
      isCurrentUser: currentUserId !== null && userId === currentUserId,
    };

    const existing = bestByUserId.get(userId);
    if (!existing || compareByRank(candidate, existing) < 0) {
      bestByUserId.set(userId, candidate);
    }
  });

  return Array.from(bestByUserId.values()).sort(compareByRank);
}

function formatTime(timeMs) {
  const totalSeconds = Math.max(0, Math.round(Number(timeMs || 0) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function animateLbStats(container) {
  const valueEls = container.querySelectorAll('.js-lb-count');
  if (!valueEls.length) return;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const formatInt = (value) => Math.round(value).toLocaleString('en-US');

  valueEls.forEach((el, index) => {
    const type = el.dataset.type || 'int';
    const targetValue = Number(el.dataset.target);
    if (!Number.isFinite(targetValue)) return;

    const startDelay = 140 + index * 48;
    const duration = type === 'time-hm' ? 980 : 860;
    const startValue = 0;

    const render = (value) => {
      if (type === 'time-hm') {
        el.textContent = formatTime(value);
        return;
      }
      el.textContent = formatInt(value);
    };

    el.classList.add('is-counting');
    render(startValue);

    const run = () => {
      const startTs = performance.now();

      const step = (now) => {
        const progress = Math.min(1, (now - startTs) / duration);
        const eased = easeOutCubic(progress);
        const current = startValue + (targetValue - startValue) * eased;
        render(current);

        if (progress < 1) {
          requestAnimationFrame(step);
          return;
        }

        render(targetValue);
        el.classList.remove('is-counting');
      };

      requestAnimationFrame(step);
    };

    window.setTimeout(run, startDelay);
  });
}
