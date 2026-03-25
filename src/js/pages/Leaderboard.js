import '../../css/pages/Leaderboard.css';
import { API_BASE, getUser, logout, authFetch } from '../auth.js';
import { confirmLogout } from '../logout-confirm.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import { Box, Button, Icon, Link, Main, Nav, Paragraph, Span, Title, page, setupGroup, setupState, signal } from '../feather/index.js';

const ICONS = {
  user: '<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>',
  profile: '<path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />',
  cloud: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />',
  logout: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />',
};

const svgIcon = (markup, fill = 'none', stroke = 'currentColor', width = '1.5') => Icon().attrs({
  xmlns: 'http://www.w3.org/2000/svg',
  fill,
  viewBox: '0 0 24 24',
  stroke,
  'stroke-width': width,
}).html(markup);

function leaderboardNav() {
  return Nav(
    Box(
      Link('Bloodwave').href('/').dataLink().className('lb-logo'),
      Box(
        Link(Span('Matches')).href('/main').dataLink().className('lb-link'),
        Link(Span('Stats')).href('/stats').dataLink().className('lb-link'),
        Link(Span('Leaderboard')).href('/leaderboard').dataLink().className('lb-link active'),
        Link(Span('Achievements')).href('/achievements').dataLink().className('lb-link'),
      ).className('lb-links'),
      Box(
        Box(
          Button(svgIcon(ICONS.user, 'currentColor', 'none')).className('lb-avatar').id('lb-avatar-btn').ariaLabel('Profile menu').attr('aria-expanded', 'false'),
          Box(
            Box(
              Box('\u2014').className('lb-dd-username').id('lb-dd-username'),
              Box('Member').className('lb-dd-role'),
            ).className('lb-dd-header'),
            Link(svgIcon(ICONS.profile), 'Profile').href('/user-panel').dataLink().className('lb-dd-item').attr('role', 'menuitem'),
            Link(svgIcon(ICONS.cloud), 'Installation').href('/android-download').dataLink().className('lb-dd-item').attr('role', 'menuitem'),
            Box().className('lb-dd-divider'),
            Button(svgIcon(ICONS.logout), 'Logout').className('lb-dd-item logout').id('lb-dd-logout').attr('role', 'menuitem'),
          ).className('lb-avatar-dropdown').id('lb-avatar-dropdown').attr('role', 'menu'),
        ).className('lb-avatar-wrap'),
        Button(
          Span().className('lb-bar'),
          Span().className('lb-bar'),
          Span().className('lb-bar'),
        ).className('lb-hamburger').id('lb-hamburger').ariaLabel('Toggle menu').attr('aria-expanded', 'false'),
      ).className('lb-right'),
    ).className('lb-nav-inner'),
    Box(
      Box(
        Link('Matches').href('/main').dataLink().className('lb-mobile-link'),
        Link('Stats').href('/stats').dataLink().className('lb-mobile-link'),
        Link('Leaderboard').href('/leaderboard').dataLink().className('lb-mobile-link'),
        Link('Achievements').href('/achievements').dataLink().className('lb-mobile-link'),
        Box().className('lb-mobile-divider'),
        Box(
          Span(svgIcon(ICONS.user, 'currentColor', 'none')).className('lb-mobile-avatar'),
          Span('\u2014').id('lb-mobile-username'),
        ).className('lb-mobile-profile').style({ pointerEvents: 'none', cursor: 'default' }),
        Box().className('lb-mobile-divider'),
        Link('Profile').href('/user-panel').dataLink().className('lb-mobile-link'),
        Link('Installation').href('/android-download').dataLink().className('lb-mobile-link'),
        Button(svgIcon(ICONS.logout), 'Logout').className('lb-mobile-logout').id('lb-mobile-logout'),
      ).className('lb-mobile-menu-inner'),
    ).className('lb-mobile-menu').id('lb-mobile-menu'),
  ).className('lb-nav');
}

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
    leaderboardNav(),
    Main(
      Box(
        Box(
          ornament(),
          Title('Global Leaderboard').className('lb-title'),
          Paragraph('Worldwide\u00A0\u00A0rankings').className('lb-subtitle'),
        ).className('lb-header'),
        Box(
          leaderboardGrid(ctx.board),
        ).className('lb-grid').id('lb-grid'),
      ).className('lb-inner'),
    ).className('lb-content'),
  ).className('lb-root');
}

const Leaderboard = page({
  name: 'Leaderboard',

  setup() {
    ensureGlobalStarfield();
    return setupState(
      setupGroup('user', {
        current: getUser(),
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
    const { container } = ctx;
    const user = ctx.user.current;
    const ddUsernameEl = container.querySelector('#lb-dd-username');
    const mobileUsernameEl = container.querySelector('#lb-mobile-username');

    if (ddUsernameEl) ddUsernameEl.textContent = user?.username || '\u2014';
    if (mobileUsernameEl) mobileUsernameEl.textContent = user?.username || '\u2014';

    const hamburger = container.querySelector('#lb-hamburger');
    const mobileMenu = container.querySelector('#lb-mobile-menu');
    let mobileMenuOpen = false;

    const handleHamburgerClick = () => {
      if (!mobileMenu) return;
      mobileMenuOpen = !mobileMenuOpen;
      hamburger.classList.toggle('open', mobileMenuOpen);
      hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));
      mobileMenu.style.maxHeight = mobileMenuOpen ? `${mobileMenu.scrollHeight}px` : '0';
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

    const avatarBtn = container.querySelector('#lb-avatar-btn');
    const avatarDropdown = container.querySelector('#lb-avatar-dropdown');
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

    const desktopLogout = container.querySelector('#lb-dd-logout');
    const mobileLogout = container.querySelector('#lb-mobile-logout');
    desktopLogout?.addEventListener('click', doLogout);
    mobileLogout?.addEventListener('click', doLogout);
    ctx.cleanup(() => desktopLogout?.removeEventListener('click', doLogout));
    ctx.cleanup(() => mobileLogout?.removeEventListener('click', doLogout));

    void ctx.once('leaderboard.boot', async () => {
      void refreshNavbarUsername();
      void loadLeaderboard();
    });

    async function refreshNavbarUsername() {
      try {
        const res = await authFetch(`${API_BASE}/api/User/me`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) return;
        const userData = await res.json();
        const liveDisplayName = userData?.username ?? userData?.email ?? user?.username ?? '\u2014';
        if (ddUsernameEl) ddUsernameEl.textContent = liveDisplayName;
        if (mobileUsernameEl) mobileUsernameEl.textContent = liveDisplayName;
      } catch {}
    }

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
          const grid = container.querySelector('#lb-grid');
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
