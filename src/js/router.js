import { isLoggedIn } from './auth.js';
import { createRouter } from './feather/index.js';
import { ensureGlobalStarfield, setGlobalStarfieldEnabled } from './global-starfield.js';

const PROTECTED_PATHS = ['/main', '/stats', '/leaderboard', '/achievements', '/user-panel'];
const GUEST_ONLY_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/'];
const FOOTER_VISIBLE_PATHS = ['/main', '/stats', '/leaderboard', '/achievements', '/user-panel'];
const STARFIELD_PATHS = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/tos', '/android-download', '/main', '/stats', '/leaderboard', '/achievements', '/user-panel'];
const GITHUB_PROJECT_URL = 'https://github.com/zsoltikv/Project-Bloodwave-Web';

function createGlobalFooter(loggedIn) {
  const footer = document.createElement('footer');
  footer.className = 'bw-site-footer';

  const currentYear = new Date().getFullYear();
  const primaryAction = loggedIn
    ? '<a href="/main" data-link class="bw-footer-link">Dashboard</a>'
    : '<a href="/login" data-link class="bw-footer-link">Login</a>';

  footer.innerHTML = `
    <div class="bw-footer-crest" aria-hidden="true">
      <span class="bw-footer-crest-line"></span>
      <span class="bw-footer-crest-mark">✦</span>
      <span class="bw-footer-crest-line"></span>
    </div>

    <div class="bw-footer-inner">
      <section class="bw-footer-brand" aria-label="Brand">
        <span class="bw-footer-title">Project Bloodwave</span>
        <p class="bw-footer-copy">Forged for players who track every run.</p>
      </section>

      <nav class="bw-footer-nav" aria-label="Footer links">
        <a href="${GITHUB_PROJECT_URL}" target="_blank" rel="noopener noreferrer" class="bw-footer-link">GitHub Project</a>
        <a href="/tos" data-link class="bw-footer-link">ToS & Cookie Policy</a>
        ${primaryAction}
      </nav>
    </div>

    <div class="bw-footer-bottom">
      <div class="bw-footer-meta">© ${currentYear} Bloodwave. All rights reserved.</div>
    </div>
  `;

  return footer;
}

function resolveAppRoute(path) {
  const loggedIn = isLoggedIn();

  if (PROTECTED_PATHS.includes(path) && !loggedIn) {
    return '/login';
  }

  if (GUEST_ONLY_PATHS.includes(path) && loggedIn) {
    return '/main';
  }

  return path;
}

export default function createAppRouter(routes) {
  const root = document.getElementById('app');

  ensureGlobalStarfield();

  return createRouter({
    root,
    routes,
    notFoundPath: '/login',
    beforeResolve({ path }) {
      const resolvedPath = resolveAppRoute(path);
      setGlobalStarfieldEnabled(STARFIELD_PATHS.includes(resolvedPath));
      return resolvedPath;
    },
    afterRender({ path, route, root: appRoot }) {
      const loggedIn = isLoggedIn();
      const showFooter = FOOTER_VISIBLE_PATHS.includes(route.path);

      appRoot.setAttribute('data-route', route.path);
      appRoot.setAttribute('data-has-footer', String(showFooter));

      const routeView = appRoot.querySelector('.feather-route-view');
      if (routeView) {
        routeView.className = 'bw-route-view';
      }

      const existingFooter = appRoot.querySelector('.bw-site-footer');
      if (existingFooter) {
        existingFooter.remove();
      }

      if (showFooter) {
        appRoot.appendChild(createGlobalFooter(loggedIn));
      }

      setGlobalStarfieldEnabled(STARFIELD_PATHS.includes(path));
    },
  });
}
