import { API_BASE, authFetch, logout } from '../auth.js';
import { confirmLogout } from '../logout-confirm.js';
import { Box, Button, Icon, Link, Nav, Span, read } from '../feather/index.js';

const NAV_ITEMS = [
  { key: 'matches', label: 'Matches', href: '/main' },
  { key: 'stats', label: 'Stats', href: '/stats' },
  { key: 'leaderboard', label: 'Leaderboard', href: '/leaderboard' },
  { key: 'achievements', label: 'Achievements', href: '/achievements' },
];

const NAV_ICONS = {
  user: '<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>',
  profile: '<path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />',
  cloud: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />',
  logout: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />',
};

const NAV_VARIANTS = {
  main: {
    classPrefix: 'mn',
    idPrefix: 'mn',
    logoHref: '/',
    fallbackDisplayName: 'Member',
  },
  leaderboard: {
    classPrefix: 'lb',
    idPrefix: 'lb',
    logoHref: '/',
    fallbackDisplayName: '-',
  },
  achievements: {
    classPrefix: 'lb',
    idPrefix: 'ac',
    logoHref: '/',
    fallbackDisplayName: 'Member',
  },
  stats: {
    classPrefix: 'st',
    idPrefix: 'st',
    logoHref: '/main',
    fallbackDisplayName: 'Member',
  },
};

function icon(markup, fill = 'none', stroke = 'currentColor', width = '1.5') {
  return Icon().attrs({
    xmlns: 'http://www.w3.org/2000/svg',
    fill,
    viewBox: '0 0 24 24',
    stroke,
    'stroke-width': width,
  }).html(markup);
}

function getNavbarVariant(variant) {
  const resolved = NAV_VARIANTS[variant];
  if (!resolved) {
    throw new Error(`DashboardNavbar: unknown variant "${variant}".`);
  }

  return resolved;
}

function classes(prefix) {
  return {
    nav: `${prefix}-nav`,
    navInner: `${prefix}-nav-inner`,
    logo: `${prefix}-logo`,
    links: `${prefix}-links`,
    link: `${prefix}-link`,
    right: `${prefix}-right`,
    navLink: `${prefix}-nav-link`,
    avatarWrap: `${prefix}-avatar-wrap`,
    avatar: `${prefix}-avatar`,
    ddHeader: `${prefix}-dd-header`,
    ddUsername: `${prefix}-dd-username`,
    ddRole: `${prefix}-dd-role`,
    ddItem: `${prefix}-dd-item`,
    ddDivider: `${prefix}-dd-divider`,
    avatarDropdown: `${prefix}-avatar-dropdown`,
    hamburger: `${prefix}-hamburger`,
    bar: `${prefix}-bar`,
    mobileMenu: `${prefix}-mobile-menu`,
    mobileMenuInner: `${prefix}-mobile-menu-inner`,
    mobileLink: `${prefix}-mobile-link`,
    mobileDivider: `${prefix}-mobile-divider`,
    mobileProfile: `${prefix}-mobile-profile`,
    mobileAvatar: `${prefix}-mobile-avatar`,
    mobileLogout: `${prefix}-mobile-logout`,
  };
}

function ids(prefix) {
  return {
    backLink: `${prefix}BackToDashboard`,
    avatarButton: `${prefix}-avatar-btn`,
    avatarDropdown: `${prefix}-avatar-dropdown`,
    desktopUsername: `${prefix}-dd-username`,
    desktopLogout: `${prefix}-dd-logout`,
    hamburger: `${prefix}-hamburger`,
    mobileMenu: `${prefix}-mobile-menu`,
    mobileUsername: `${prefix}-mobile-username`,
    mobileLogout: `${prefix}-mobile-logout`,
  };
}

function activeClass(baseClassName, active, key) {
  return active === key ? `${baseClassName} active` : baseClassName;
}

export function resolveDashboardDisplayName(user, fallback = 'Member') {
  return user?.username ?? user?.email ?? fallback;
}

export function DashboardNavbar({
  variant,
  active,
  username,
  viewMode = false,
  backHref = '/main',
  backLabel = 'Back to Dashboard',
  logoHref,
}) {
  const config = getNavbarVariant(variant);
  const classNames = classes(config.classPrefix);
  const elementIds = ids(config.idPrefix);
  const resolvedLogoHref = logoHref || config.logoHref;
  const resolvedUsername = username ?? config.fallbackDisplayName;

  return Nav(
    Box(
      Link('Bloodwave').href(resolvedLogoHref).dataLink().className(classNames.logo),
      viewMode
        ? null
        : Box(
          NAV_ITEMS.map((item) => Link(Span(item.label))
            .href(item.href)
            .dataLink()
            .className(activeClass(classNames.link, active, item.key))),
        ).className(classNames.links),
      Box(
        viewMode
          ? Link(backLabel).href(backHref).dataLink().className(classNames.navLink).id(elementIds.backLink)
          : null,
        viewMode
          ? null
          : Box(
            Button(icon(NAV_ICONS.user, 'currentColor', 'none')).className(classNames.avatar).id(elementIds.avatarButton).ariaLabel('Profile menu').attr('aria-expanded', 'false'),
            Box(
              Box(
                Box(resolvedUsername).className(classNames.ddUsername).id(elementIds.desktopUsername),
                Box('Member').className(classNames.ddRole),
              ).className(classNames.ddHeader),
              Link(icon(NAV_ICONS.profile), 'Profile').href('/user-panel').dataLink().className(classNames.ddItem).attr('role', 'menuitem'),
              Link(icon(NAV_ICONS.cloud), 'Installation').href('/android-download').dataLink().className(classNames.ddItem).attr('role', 'menuitem'),
              Box().className(classNames.ddDivider),
              Button(icon(NAV_ICONS.logout), 'Logout').className(`${classNames.ddItem} logout`).id(elementIds.desktopLogout).attr('role', 'menuitem'),
            ).className(classNames.avatarDropdown).id(elementIds.avatarDropdown).attr('role', 'menu'),
          ).className(classNames.avatarWrap),
        viewMode
          ? null
          : Button(
            Span().className(classNames.bar),
            Span().className(classNames.bar),
            Span().className(classNames.bar),
          ).className(classNames.hamburger).id(elementIds.hamburger).ariaLabel('Toggle menu').attr('aria-expanded', 'false'),
      ).className(classNames.right),
    ).className(classNames.navInner),
    viewMode
      ? null
      : Box(
        Box(
          NAV_ITEMS.map((item) => Link(item.label).href(item.href).dataLink().className(classNames.mobileLink)),
          Box().className(classNames.mobileDivider),
          Box(
            Span(icon(NAV_ICONS.user, 'currentColor', 'none')).className(classNames.mobileAvatar),
            Span(resolvedUsername).id(elementIds.mobileUsername),
          ).className(classNames.mobileProfile).style({ pointerEvents: 'none', cursor: 'default' }),
          Box().className(classNames.mobileDivider),
          Link('Profile').href('/user-panel').dataLink().className(classNames.mobileLink),
          Link('Installation').href('/android-download').dataLink().className(classNames.mobileLink),
          Button(icon(NAV_ICONS.logout), 'Logout').className(classNames.mobileLogout).id(elementIds.mobileLogout),
        ).className(classNames.mobileMenuInner),
      ).className(classNames.mobileMenu).id(elementIds.mobileMenu),
  ).className(classNames.nav);
}

export function mountDashboardNavbar(ctx, { variant }) {
  const config = getNavbarVariant(variant);
  const classNames = classes(config.classPrefix);
  const elementIds = ids(config.idPrefix);
  const { container } = ctx;

  const on = (target, eventName, handler, options) => {
    if (!target?.addEventListener) return;
    target.addEventListener(eventName, handler, options);
    ctx.cleanup(() => target.removeEventListener(eventName, handler, options), 'lifetime');
  };

  const hamburger = container.querySelector(`#${elementIds.hamburger}`);
  const mobileMenu = container.querySelector(`#${elementIds.mobileMenu}`);
  let mobileMenuOpen = false;

  const closeMobileMenu = () => {
    mobileMenuOpen = false;
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    if (mobileMenu) {
      mobileMenu.style.maxHeight = '0';
    }
  };

  on(hamburger, 'click', () => {
    if (!mobileMenu || !hamburger) return;
    mobileMenuOpen = !mobileMenuOpen;
    hamburger.classList.toggle('open', mobileMenuOpen);
    hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));
    mobileMenu.style.maxHeight = mobileMenuOpen ? `${mobileMenu.scrollHeight}px` : '0';
  });

  mobileMenu?.querySelectorAll(`.${classNames.mobileLink}`).forEach((link) => {
    on(link, 'click', closeMobileMenu);
  });

  const avatarButton = container.querySelector(`#${elementIds.avatarButton}`);
  const avatarDropdown = container.querySelector(`#${elementIds.avatarDropdown}`);

  const closeAvatarDropdown = () => {
    avatarDropdown?.classList.remove('open');
    avatarButton?.setAttribute('aria-expanded', 'false');
  };

  on(avatarButton, 'click', (event) => {
    event.stopPropagation();
    if (!avatarDropdown || !avatarButton) return;
    avatarDropdown.classList.toggle('open');
    avatarButton.setAttribute('aria-expanded', String(avatarDropdown.classList.contains('open')));
  });

  on(document, 'click', (event) => {
    const clickTarget = event.target instanceof Element ? event.target : null;
    if (!clickTarget?.closest(`.${classNames.avatarWrap}`)) {
      closeAvatarDropdown();
    }
  });

  on(document, 'keydown', (event) => {
    if (event.key === 'Escape') {
      closeAvatarDropdown();
    }
  });

  const doLogout = async () => {
    const confirmed = await confirmLogout();
    if (!confirmed) return;
    await logout();
  };

  on(container.querySelector(`#${elementIds.desktopLogout}`), 'click', doLogout);
  on(container.querySelector(`#${elementIds.mobileLogout}`), 'click', doLogout);
}

export async function refreshDashboardNavbarUsername(ctx, displayName, onceKey = 'dashboard.navbar.username', fallback = 'Member') {
  const nextDisplayName = await Promise.resolve(ctx.once(onceKey, async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/User/me`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        return read(displayName) || fallback;
      }

      const userData = await res.json();
      return userData?.username ?? userData?.email ?? read(displayName) ?? fallback;
    } catch {
      return read(displayName) || fallback;
    }
  }));

  if (displayName?.set) {
    displayName.set(nextDisplayName);
  }

  return nextDisplayName;
}
