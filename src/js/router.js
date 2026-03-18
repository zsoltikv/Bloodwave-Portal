import { isLoggedIn } from './auth.js';
import { ensureGlobalStarfield, setGlobalStarfieldEnabled } from './global-starfield.js';

const PROTECTED_PATHS = ['/main', '/stats', '/leaderboard', '/user-panel'];
const GUEST_ONLY_PATHS = ['/login', '/register', '/forgot-password', '/'];
const FOOTER_VISIBLE_PATHS = ['/main', '/stats', '/leaderboard', '/user-panel'];
const STARFIELD_PATHS = ['/', '/login', '/register', '/forgot-password', '/tos', '/main', '/stats', '/leaderboard', '/user-panel'];
const GITHUB_PROJECT_URL = 'https://github.com/zsoltikv/Project-Bloodwave-Web';

function forceScrollTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

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

class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    ensureGlobalStarfield();

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Handle initial load
    window.addEventListener('DOMContentLoaded', (e) => {
      e.preventDefault();
      this.handleRoute();
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      this.handleRoute();
    });
    
    // Intercept link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (!link) return;

      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href) return;

      this.navigate(href);
    });
  }
  
  navigate(path) {
    window.history.pushState(null, null, path);
    this.handleRoute();
  }
  
  handleRoute() {
    const path    = window.location.pathname;
    const loggedIn = isLoggedIn();

    // Guard: protected page without a session → login
    if (PROTECTED_PATHS.includes(path) && !loggedIn) {
      window.history.replaceState(null, null, '/login');
      return this.handleRoute();
    }

    // Guard: already logged-in user hits a guest-only page → main
    if (GUEST_ONLY_PATHS.includes(path) && loggedIn) {
      window.history.replaceState(null, null, '/main');
      return this.handleRoute();
    }

    // Unknown path → login (or main if logged in, handled by the guard above on next call)
    const route = this.routes.find(r => r.path === path)
               || this.routes.find(r => r.path === '/login');

    setGlobalStarfieldEnabled(STARFIELD_PATHS.includes(path));
    
    if (route) {
      this.currentRoute = route;
      const app = document.getElementById('app');
      app.setAttribute('data-route', route.path);
      const showFooter = FOOTER_VISIBLE_PATHS.includes(route.path);
      app.setAttribute('data-has-footer', String(showFooter));
      app.innerHTML = '';

      const routeView = document.createElement('div');
      routeView.className = 'bw-route-view';
      app.appendChild(routeView);

      route.component(routeView);

      if (showFooter) {
        app.appendChild(createGlobalFooter(loggedIn));
      }

      forceScrollTop();
      requestAnimationFrame(() => forceScrollTop());
    }
  }
}

export default Router;
