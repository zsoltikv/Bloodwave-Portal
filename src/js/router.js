import { isLoggedIn } from './auth.js';

const PROTECTED_PATHS = ['/main', '/stats', '/user-panel'];
const GUEST_ONLY_PATHS = ['/login', '/register', '/forgot-password', '/'];

class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    
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
      if (e.target.matches('[data-link]')) {
        this.navigate(e.target.getAttribute('href'));
      }
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
    
    if (route) {
      this.currentRoute = route;
      const app = document.getElementById('app');
      app.innerHTML = '';
      route.component(app);
    }
  }
}

export default Router;
