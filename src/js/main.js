import Router from './router.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import ForgotPassword from './pages/ForgotPassword.js';
import ResetPassword from './pages/ResetPassword.js';
import Main from './pages/Main.js';
import Stats from './pages/Stats.js';
import Leaderboard from './pages/Leaderboard.js';
import Achievements from './pages/Achievements.js';
import ToS from './pages/ToS.js';
import UserPanel from './pages/UserPanel.js';
import AndroidDownload from './pages/AndroidDownload.js';
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
    path: '/reset-password',
    component: ResetPassword
  },
  {
    path: '/tos',
    component: ToS
  },
  {
    path: '/android-download',
    component: AndroidDownload
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
    path: '/achievements',
    component: Achievements
  },
  {
    path: '/user-panel',
    component: UserPanel
  }
];

// Initialize router
const router = Router(routes);
ensureCustomCursor();

// Make router globally accessible
window.router = router;
router.start();
