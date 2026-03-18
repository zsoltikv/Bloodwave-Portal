import Router from './router.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import ForgotPassword from './pages/ForgotPassword.js';
import Main from './pages/Main.js';
import Stats from './pages/Stats.js';
import Leaderboard from './pages/Leaderboard.js';
import ToS from './pages/ToS.js';
import UserPanel from './pages/UserPanel.js';
import ensureCustomCursor from './custom-cursor.js';

// Define routes
const routes = [
  {
    path: '/',
    component: Login   // Default → login screen
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/forgot-password',
    component: ForgotPassword
  },
  {
    path: '/tos',
    component: ToS
  },
  {
    path: '/main',
    component: Main
  },
  {
    path: '/stats',
    component: Stats
  },
  {
    path: '/leaderboard',
    component: Leaderboard
  },
  {
    path: '/user-panel',
    component: UserPanel
  }
];

// Initialize router
const router = new Router(routes);
ensureCustomCursor();

// Make router globally accessible
window.router = router;
