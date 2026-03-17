import { getUser, logout } from '../auth.js';

export default function Main(container) {
  container.innerHTML = `
    <style>
      /* === PAGE ROOT === */
      .mn-root {
        min-height: 100vh;
        min-height: 100dvh;
        background: var(--obsidian);
        font-family: 'Montserrat', sans-serif;
        position: relative;
        overflow-x: hidden;
      }

      /* === PARTICLES are styled via .bw-particle in master.css === */

      /* =====================================================
         NAVBAR

      /* =====================================================
         NAVBAR
         ===================================================== */
      .mn-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        background: linear-gradient(180deg,
          rgba(8,4,4,0.97) 0%,
          rgba(10,3,3,0.92) 100%);
        backdrop-filter: blur(28px);
        -webkit-backdrop-filter: blur(28px);
        border-bottom: 1px solid rgba(139,0,0,0.2);
        animation: mn-nav-in 0.9s cubic-bezier(0.22,1,0.36,1) both;
      }

      /* Gold line below border */
      .mn-nav::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent);
        pointer-events: none;
      }

      @keyframes mn-nav-in {
        from { opacity: 0; transform: translateY(-16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .mn-nav-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 clamp(16px, 4vw, 48px);
        height: clamp(56px, 7vh, 68px);
        display: flex;
        align-items: center;
        position: relative;
      }

      /* --- Logo --- */
      .mn-logo {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 400;
        font-size: clamp(18px, 3.5vw, 24px);
        letter-spacing: clamp(4px, 1.2vw, 8px);
        color: #fff;
        text-transform: uppercase;
        text-decoration: none;
        text-shadow:
          0 0 20px rgba(180,0,0,0.5),
          0 0 50px rgba(139,0,0,0.2);
        flex-shrink: 0;
        user-select: none;
        transition: text-shadow 0.4s;
      }
      .mn-logo:hover {
        text-shadow:
          0 0 28px rgba(192,57,43,0.75),
          0 0 70px rgba(139,0,0,0.35);
      }

      /* --- Center Links (desktop) --- */
      .mn-links {
        display: flex;
        align-items: center;
        gap: clamp(28px, 5vw, 56px);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .mn-link {
        font-size: clamp(8px, 1.5vw, 10px);
        font-weight: 400;
        letter-spacing: clamp(3px, 1vw, 5px);
        color: rgba(255,255,255,0.38);
        text-transform: uppercase;
        text-decoration: none;
        position: relative;
        padding-bottom: 3px;
        transition: color 0.35s;
        white-space: nowrap;
      }

      .mn-link span {
        position: relative;
        display: inline-block;
      }

      .mn-link span::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: calc(100% - clamp(3px, 1vw, 5px));
        height: 1px;
        background: linear-gradient(90deg, var(--crimson), var(--gold-light), var(--crimson));
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
      }

      .mn-link:hover {
        color: rgba(255,255,255,0.92);
      }
      .mn-link:hover span::after { transform: scaleX(1); }

      .mn-link.active {
        color: rgba(212,175,55,0.75);
      }
      .mn-link.active span::after { transform: scaleX(1); background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold)); }

      /* --- Right side --- */
      .mn-right {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      /* Profile avatar button */
      .mn-avatar {
        width: clamp(34px, 4.5vw, 40px);
        height: clamp(34px, 4.5vw, 40px);
        border-radius: 50%;
        background: linear-gradient(145deg, rgba(139,0,0,0.6) 0%, rgba(40,5,5,0.9) 100%);
        border: 1px solid rgba(139,0,0,0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.35s, box-shadow 0.35s, transform 0.25s;
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
        outline: none;
        -webkit-tap-highlight-color: transparent;
      }

      .mn-avatar::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(212,175,55,0.08), transparent 65%);
        pointer-events: none;
      }

      .mn-avatar:hover {
        border-color: rgba(212,175,55,0.45);
        box-shadow:
          0 0 16px rgba(139,0,0,0.35),
          0 0 36px rgba(139,0,0,0.12);
        transform: scale(1.07);
      }

      .mn-avatar svg {
        width: 18px;
        height: 18px;
        color: rgba(212,175,55,0.65);
        transition: color 0.3s;
        position: relative;
        z-index: 1;
      }
      .mn-avatar:hover svg { color: rgba(212,175,55,0.95); }

      /* Hamburger button (mobile only) */
      .mn-hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        gap: 5px;
        background: none;
        border: 1px solid rgba(139,0,0,0.25);
        cursor: pointer;
        padding: 0;
        outline: none;
        -webkit-tap-highlight-color: transparent;
        transition: border-color 0.3s;
      }
      .mn-hamburger:hover { border-color: rgba(192,57,43,0.5); }

      .mn-bar {
        display: block;
        width: 18px;
        height: 1px;
        background: rgba(212,175,55,0.6);
        transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s;
        transform-origin: center;
      }

      /* Mobile dropdown */
      .mn-mobile-menu {
        display: none;
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.4s cubic-bezier(0.22,1,0.36,1);
        background: linear-gradient(180deg, rgba(10,3,3,0.98) 0%, rgba(8,2,2,0.99) 100%);
        border-top: 1px solid rgba(139,0,0,0.12);
      }

      .mn-mobile-menu-inner {
        padding: 10px clamp(16px, 4vw, 48px) 16px;
      }

      .mn-mobile-link {
        display: flex;
        align-items: center;
        padding: 14px 8px;
        font-size: 9px;
        font-weight: 400;
        letter-spacing: 4px;
        color: rgba(255,255,255,0.35);
        text-transform: uppercase;
        text-decoration: none;
        border-bottom: 1px solid rgba(139,0,0,0.1);
        transition: color 0.3s, padding-left 0.3s;
      }
      .mn-mobile-link:last-of-type { border-bottom: none; }
      .mn-mobile-link:hover { color: rgba(255,255,255,0.8); padding-left: 14px; }

      .mn-mobile-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent);
        margin: 6px 0;
      }

      .mn-mobile-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 8px;
        font-size: 9px;
        font-weight: 400;
        letter-spacing: 4px;
        color: rgba(212,175,55,0.5);
        text-transform: uppercase;
        background: none;
        border: none;
        width: 100%;
        cursor: pointer;
        transition: color 0.3s, padding-left 0.3s;
        -webkit-tap-highlight-color: transparent;
        outline: none;
      }
      .mn-mobile-profile:hover { color: rgba(212,175,55,0.9); padding-left: 14px; }

      .mn-mobile-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(145deg, rgba(139,0,0,0.6), rgba(40,5,5,0.9));
        border: 1px solid rgba(139,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .mn-mobile-avatar svg { width: 14px; height: 14px; color: rgba(212,175,55,0.6); }

      /* === AVATAR DROPDOWN === */
      .mn-avatar-wrap {
        position: relative;
      }

      .mn-avatar-dropdown {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        min-width: 188px;
        background: linear-gradient(160deg, rgba(14,4,4,0.98) 0%, rgba(8,2,2,0.99) 100%);
        border: 1px solid rgba(139,0,0,0.28);
        box-shadow:
          0 8px 32px rgba(0,0,0,0.65),
          0 0 0 1px rgba(212,175,55,0.06) inset;
        opacity: 0;
        pointer-events: none;
        transform: translateY(-6px);
        transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.22,1,0.36,1);
        z-index: 200;
      }
      .mn-avatar-dropdown::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent);
      }
      .mn-avatar-dropdown.open {
        opacity: 1;
        pointer-events: all;
        transform: translateY(0);
      }

      .mn-dd-header {
        padding: 14px 16px 10px;
        border-bottom: 1px solid rgba(139,0,0,0.14);
      }
      .mn-dd-username {
        font-family: 'Cormorant Garamond', serif;
        font-size: 15px;
        font-weight: 400;
        letter-spacing: 2px;
        color: rgba(212,175,55,0.85);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mn-dd-role {
        font-size: 8px;
        letter-spacing: 3px;
        color: rgba(255,255,255,0.25);
        text-transform: uppercase;
        margin-top: 2px;
      }

      .mn-dd-item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 12px 16px;
        font-size: 9px;
        letter-spacing: 3.5px;
        color: rgba(255,255,255,0.4);
        text-transform: uppercase;
        background: none;
        border: none;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.25s, background 0.25s, padding-left 0.25s;
        text-align: left;
      }
      .mn-dd-item svg { width: 13px; height: 13px; flex-shrink: 0; opacity: 0.6; transition: opacity 0.25s; }
      .mn-dd-item:hover { color: rgba(255,255,255,0.82); background: rgba(139,0,0,0.08); padding-left: 20px; }
      .mn-dd-item:hover svg { opacity: 1; }
      .mn-dd-item.logout { color: rgba(192,57,43,0.55); }
      .mn-dd-item.logout:hover { color: rgba(220,80,60,0.92); background: rgba(139,0,0,0.12); }
      .mn-dd-divider { height: 1px; background: rgba(139,0,0,0.12); margin: 2px 0; }

      /* mobile logout item */
      .mn-mobile-logout {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 8px;
        font-size: 9px;
        font-weight: 400;
        letter-spacing: 4px;
        color: rgba(192,57,43,0.55);
        text-transform: uppercase;
        background: none;
        border: none;
        width: 100%;
        cursor: pointer;
        transition: color 0.3s, padding-left 0.3s;
        -webkit-tap-highlight-color: transparent;
        outline: none;
      }
      .mn-mobile-logout:hover { color: rgba(220,80,60,0.9); padding-left: 14px; }
      .mn-mobile-logout svg { width: 14px; height: 14px; flex-shrink: 0; }

      /* === RESPONSIVE BREAKPOINTS === */
      @media (max-width: 768px) {
        .mn-links    { display: none; }
        .mn-hamburger { display: flex; }
        .mn-mobile-menu { display: block; }
        .mn-avatar   { display: none; }
      }

      /* Hamburger → X state */
      .mn-hamburger.open .mn-bar:nth-child(1) { transform: translateY(6px) rotate(45deg); }
      .mn-hamburger.open .mn-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
      .mn-hamburger.open .mn-bar:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

      /* =====================================================
         MAIN CONTENT AREA
         ===================================================== */
      .mn-content {
        position: relative;
        z-index: 10;
        padding-top: clamp(56px, 7vh, 68px); /* offset for fixed navbar */
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mn-placeholder {
        text-align: center;
        padding: clamp(40px, 8vh, 80px) clamp(16px, 4vw, 32px);
        animation: mn-rise 1.1s cubic-bezier(0.22,1,0.36,1) both 0.3s;
      }

      @keyframes mn-rise {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .mn-ornament {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin-bottom: 28px;
      }
      .mn-ornament-line {
        height: 1px;
        width: clamp(28px, 6vw, 48px);
        background: linear-gradient(90deg, transparent, var(--gold));
      }
      .mn-ornament-line:last-child { background: linear-gradient(90deg, var(--gold), transparent); }
      .mn-ornament-diamond {
        width: 7px;
        height: 7px;
        background: var(--gold-light);
        transform: rotate(45deg);
        box-shadow: 0 0 8px rgba(212,175,55,0.45);
        flex-shrink: 0;
        animation: mn-diamond-pulse 3s ease-in-out infinite;
      }
      @keyframes mn-diamond-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

      .mn-placeholder-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(28px, 6vw, 44px);
        font-weight: 300;
        letter-spacing: clamp(4px, 1.5vw, 10px);
        color: rgba(255,255,255,0.82);
        text-transform: uppercase;
        margin-bottom: 16px;
        text-shadow: 0 0 40px rgba(139,0,0,0.35);
      }

      .mn-placeholder-sub {
        font-size: clamp(7px, 1.8vw, 9.5px);
        font-weight: 300;
        letter-spacing: clamp(3px, 1.2vw, 6px);
        color: rgba(212,175,55,0.4);
        text-transform: uppercase;
      }

      /* Ambient radial glow */
      .mn-glow {
        position: fixed;
        width: min(600px, 120vw);
        height: min(600px, 120vw);
        background: radial-gradient(circle, rgba(139,0,0,0.12) 0%, rgba(80,0,0,0.05) 40%, transparent 70%);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        border-radius: 50%;
        pointer-events: none;
        animation: mn-breathe 6s ease-in-out infinite;
      }
      @keyframes mn-breathe {
        0%,100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
        50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.12); }
      }
    </style>

    <div class="mn-root">
      <canvas id="mn-canvas" class="bw-canvas"></canvas>
      <div class="mn-glow"></div>

      <!-- ===== NAVBAR ===== -->
      <nav class="mn-nav">
        <div class="mn-nav-inner">

          <!-- Logo -->
          <a href="/" data-link class="mn-logo">Bloodwave</a>

          <!-- Desktop Center Links -->
          <div class="mn-links">
            <a href="/main" data-link class="mn-link active"><span>Matches</span></a>
            <a href="/stats" data-link class="mn-link"><span>Stats</span></a>
          </div>

          <!-- Right: avatar + hamburger -->
          <div class="mn-right">

            <!-- Profile Avatar + dropdown (desktop) -->
            <div class="mn-avatar-wrap">
              <button class="mn-avatar" id="mn-avatar-btn" aria-label="Profile menu" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
              <div class="mn-avatar-dropdown" id="mn-avatar-dropdown" role="menu">
                <div class="mn-dd-header">
                  <div class="mn-dd-username" id="mn-dd-username">—</div>
                  <div class="mn-dd-role">Member</div>
                </div>
                <a href="/settings" data-link class="mn-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Settings
                </a>
                <a href="/user-panel" data-link class="mn-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />
                  </svg>
                  Profile
                </a>
                <div class="mn-dd-divider"></div>
                <button class="mn-dd-item logout" id="mn-dd-logout" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <!-- Hamburger (mobile) -->
            <button class="mn-hamburger" id="mn-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="mn-bar"></span>
              <span class="mn-bar"></span>
              <span class="mn-bar"></span>
            </button>
          </div>

        </div>

        <!-- Mobile Dropdown -->
        <div class="mn-mobile-menu" id="mn-mobile-menu">
          <div class="mn-mobile-menu-inner">
            <a href="/main" data-link class="mn-mobile-link">Matches</a>
            <a href="/stats" data-link class="mn-mobile-link">Stats</a>
            <div class="mn-mobile-divider"></div>
            <div class="mn-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="mn-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="mn-mobile-username">—</span>
            </div>
            <div class="mn-mobile-divider"></div>
            <a href="/user-panel" data-link class="mn-mobile-link">Profile</a>
            <button class="mn-mobile-logout" id="mn-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- ===== MAIN CONTENT ===== -->
      <main class="mn-content">
        <div class="mn-placeholder">
          <div class="mn-ornament">
            <div class="mn-ornament-line"></div>
            <div class="mn-ornament-diamond"></div>
            <div class="mn-ornament-line"></div>
          </div>
          <h1 class="mn-placeholder-title">Welcome Back</h1>
          <p class="mn-placeholder-sub">Your&nbsp;&nbsp;feed&nbsp;&nbsp;is&nbsp;&nbsp;loading</p>
        </div>
      </main>

    </div>
  `;

  // ── Canvas starfield ──────────────────────────────────────────────────────
  initMnCanvas();
  spawnMnParticles();

  // ── Populate username ────────────────────────────────────────────────────
  const user = getUser();
  const displayName = user?.username ?? user?.email ?? 'Member';

  const ddUsername     = container.querySelector('#mn-dd-username');
  const mobileUsername = container.querySelector('#mn-mobile-username');
  if (ddUsername)     ddUsername.textContent     = displayName;
  if (mobileUsername) mobileUsername.textContent = displayName;

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  const hamburger   = container.querySelector('#mn-hamburger');
  const mobileMenu  = container.querySelector('#mn-mobile-menu');
  let menuOpen = false;

  hamburger?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    hamburger.setAttribute('aria-expanded', String(menuOpen));
    mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + 'px' : '0';
  });

  // Close on mobile link click
  mobileMenu?.querySelectorAll('.mn-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.style.maxHeight = '0';
    });
  });

  // ── Desktop avatar dropdown ───────────────────────────────────────────────
  const avatarBtn  = container.querySelector('#mn-avatar-btn');
  const avatarDrop = container.querySelector('#mn-avatar-dropdown');
  let dropOpen = false;

  function openDrop() {
    dropOpen = true;
    avatarDrop.classList.add('open');
    avatarBtn.setAttribute('aria-expanded', 'true');
  }
  function closeDrop() {
    dropOpen = false;
    avatarDrop.classList.remove('open');
    avatarBtn.setAttribute('aria-expanded', 'false');
  }

  avatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropOpen ? closeDrop() : openDrop();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (dropOpen && !avatarDrop.contains(e.target) && e.target !== avatarBtn) {
      closeDrop();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropOpen) closeDrop();
  });

  // ── Logout ───────────────────────────────────────────────────────────────
  const doLogout = async () => {
    await logout();
    // logout() already navigates to /login
  };

  container.querySelector('#mn-dd-logout')?.addEventListener('click', doLogout);
  container.querySelector('#mn-mobile-logout')?.addEventListener('click', doLogout);
}

/* ======================================================================
   CANVAS — same drifting star system as Login, no card bias
   ====================================================================== */
function initMnCanvas() {
  const canvas = document.getElementById('mn-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  measure();
  window.addEventListener('resize', measure);

  const STAR_COUNT = 200;
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) stars.push(makeStar(true));

  function makeStar(firstTime) {
    const isRed  = Math.random() < 0.07;
    const isGold = !isRed && Math.random() < 0.04;
    const r      = Math.random() * 1.4 + 0.3;
    return {
      x: Math.random() * (W || window.innerWidth),
      y: firstTime ? Math.random() * (H || window.innerHeight) : (H || window.innerHeight) + 5,
      r,
      vx: (Math.random() - 0.5) * 0.06,
      vy: -(Math.random() * 0.18 + 0.04),
      opacity: Math.random() * 0.6 + 0.2,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.02 + 0.004,
      isRed, isGold,
      life: 0,
      maxLife: 500 + Math.random() * 700,
    };
  }

  let streakTimer = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    streakTimer++;
    if (streakTimer > 200 + Math.random() * 200) {
      drawMnStreak(ctx, W, H);
      streakTimer = 0;
    }

    stars.forEach((s, i) => {
      s.flicker += s.flickerSpeed;
      s.life++;
      const fade  = Math.min(s.life / 40, 1) * Math.max(1 - (s.life - s.maxLife * 0.8) / (s.maxLife * 0.2), 0);
      const alpha = s.opacity * (0.65 + 0.35 * Math.sin(s.flicker)) * Math.max(fade, 0.01);

      ctx.globalAlpha = Math.min(alpha, 1);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.isRed ? '#CC1A1A' : s.isGold ? '#D4AF37' : '#FFE8D8';
      ctx.fill();
      ctx.globalAlpha = 1;

      s.x += s.vx;
      s.y += s.vy;

      if (s.life > s.maxLife || s.y < -20 || s.x < -20 || s.x > W + 20) {
        stars[i] = makeStar(false);
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}

function drawMnStreak(ctx, W, H) {
  const x = Math.random() * W;
  const y = Math.random() * H * 0.7;
  const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.6;
  const len   = 80 + Math.random() * 160;

  const grd = ctx.createLinearGradient(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(0.45, 'rgba(220,60,40,0.45)');
  grd.addColorStop(0.55, 'rgba(255,200,180,0.6)');
  grd.addColorStop(1, 'transparent');

  ctx.save();
  ctx.lineWidth = Math.random() * 1.0 + 0.3;
  ctx.strokeStyle = grd;
  ctx.shadowColor = 'rgba(200,50,30,0.3)';
  ctx.shadowBlur  = 5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  ctx.stroke();
  ctx.restore();
}

function spawnMnParticles() {
  const root = document.querySelector('.mn-root');
  if (!root) return;

  for (let i = 0; i < 18; i++) {
    const p        = document.createElement('div');
    p.className    = 'bw-particle';
    const size     = Math.random() * 2.2 + 0.4;
    const delay    = Math.random() * 20;
    const duration = 18 + Math.random() * 22;
    const drift    = (Math.random() - 0.5) * 90;
    const isRed    = Math.random() < 0.28;
    const isGold   = !isRed && Math.random() < 0.15;
    const col      = isRed  ? 'rgba(192,57,43,0.55)'
                   : isGold ? 'rgba(212,175,55,0.4)'
                   :          'rgba(255,230,210,0.28)';

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:-12px;
      background:${col};
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      --drift:${drift}px;
    `;
    root.appendChild(p);
  }
}
