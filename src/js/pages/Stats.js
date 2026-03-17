import { logout } from '../auth.js';

export default function Stats(container) {
  container.innerHTML = `
    <style>
      /* === PAGE ROOT === */
      .st-root {
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
         ===================================================== */
      .st-nav {
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 100;
        background: linear-gradient(180deg,
          rgba(8,4,4,0.97) 0%,
          rgba(10,3,3,0.92) 100%);
        backdrop-filter: blur(28px);
        -webkit-backdrop-filter: blur(28px);
        border-bottom: 1px solid rgba(139,0,0,0.2);
        animation: st-nav-in 0.9s cubic-bezier(0.22,1,0.36,1) both;
      }
      .st-nav::after {
        content: '';
        position: absolute;
        bottom: -1px; left: 50%;
        transform: translateX(-50%);
        width: 60%; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent);
        pointer-events: none;
      }
      @keyframes st-nav-in {
        from { opacity: 0; transform: translateY(-16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .st-nav-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 clamp(16px, 4vw, 48px);
        height: clamp(56px, 7vh, 68px);
        display: flex;
        align-items: center;
        position: relative;
      }

      .st-logo {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 400;
        font-size: clamp(18px, 3.5vw, 24px);
        letter-spacing: clamp(4px, 1.2vw, 8px);
        color: #fff;
        text-transform: uppercase;
        text-decoration: none;
        text-shadow: 0 0 20px rgba(180,0,0,0.5), 0 0 50px rgba(139,0,0,0.2);
        flex-shrink: 0;
        user-select: none;
        transition: text-shadow 0.4s;
      }
      .st-logo:hover {
        text-shadow: 0 0 28px rgba(192,57,43,0.75), 0 0 70px rgba(139,0,0,0.35);
      }

      .st-links {
        display: flex;
        align-items: center;
        gap: clamp(28px, 5vw, 56px);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .st-link {
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
      .st-link span {
        position: relative;
        display: inline-block;
      }
      .st-link span::after {
        content: '';
        position: absolute;
        bottom: -3px; left: 0;
        width: calc(100% - clamp(3px, 1vw, 5px));
        height: 1px;
        background: linear-gradient(90deg, var(--crimson), var(--gold-light), var(--crimson));
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
      }
      .st-link:hover { color: rgba(255,255,255,0.92); }
      .st-link:hover span::after { transform: scaleX(1); }
      .st-link.active { color: rgba(212,175,55,0.75); }
      .st-link.active span::after { transform: scaleX(1); background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold)); }

      .st-right {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .st-avatar {
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
      .st-avatar::before {
        content: '';
        position: absolute; inset: 0;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(212,175,55,0.08), transparent 65%);
        pointer-events: none;
      }
      .st-avatar:hover {
        border-color: rgba(212,175,55,0.45);
        box-shadow: 0 0 16px rgba(139,0,0,0.35), 0 0 36px rgba(139,0,0,0.12);
        transform: scale(1.07);
      }
      .st-avatar svg { width: 18px; height: 18px; color: rgba(212,175,55,0.65); transition: color 0.3s; position: relative; z-index: 1; }
      .st-avatar:hover svg { color: rgba(212,175,55,0.95); }

      .st-hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 36px; height: 36px;
        gap: 5px;
        background: none;
        border: 1px solid rgba(139,0,0,0.25);
        cursor: pointer;
        padding: 0;
        outline: none;
        -webkit-tap-highlight-color: transparent;
        transition: border-color 0.3s;
      }
      .st-hamburger:hover { border-color: rgba(192,57,43,0.5); }

      .st-bar {
        display: block;
        width: 18px; height: 1px;
        background: rgba(212,175,55,0.6);
        transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s;
        transform-origin: center;
      }

      .st-mobile-menu {
        display: none;
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.4s cubic-bezier(0.22,1,0.36,1);
        background: linear-gradient(180deg, rgba(10,3,3,0.98) 0%, rgba(8,2,2,0.99) 100%);
        border-top: 1px solid rgba(139,0,0,0.12);
      }
      .st-mobile-menu-inner { padding: 10px clamp(16px, 4vw, 48px) 16px; }

      .st-mobile-link {
        display: flex;
        align-items: center;
        padding: 14px 8px;
        font-size: 9px; font-weight: 400;
        letter-spacing: 4px;
        color: rgba(255,255,255,0.35);
        text-transform: uppercase;
        text-decoration: none;
        border-bottom: 1px solid rgba(139,0,0,0.1);
        transition: color 0.3s, padding-left 0.3s;
      }
      .st-mobile-link:last-of-type { border-bottom: none; }
      .st-mobile-link:hover { color: rgba(255,255,255,0.8); padding-left: 14px; }

      .st-mobile-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent);
        margin: 6px 0;
      }

      .st-mobile-profile {
        display: flex; align-items: center; gap: 12px;
        padding: 14px 8px;
        font-size: 9px; font-weight: 400; letter-spacing: 4px;
        color: rgba(212,175,55,0.5);
        text-transform: uppercase;
        background: none; border: none;
        width: 100%; cursor: pointer;
        transition: color 0.3s, padding-left 0.3s;
        -webkit-tap-highlight-color: transparent; outline: none;
      }
      .st-mobile-profile:hover { color: rgba(212,175,55,0.9); padding-left: 14px; }

      .st-mobile-avatar {
        width: 28px; height: 28px; border-radius: 50%;
        background: linear-gradient(145deg, rgba(139,0,0,0.6), rgba(40,5,5,0.9));
        border: 1px solid rgba(139,0,0,0.35);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .st-mobile-avatar svg { width: 14px; height: 14px; color: rgba(212,175,55,0.6); }

      @media (max-width: 768px) {
        .st-links     { display: none; }
        .st-hamburger { display: flex; }
        .st-mobile-menu { display: block; }
        .st-avatar    { display: none; }
      }

      .st-hamburger.open .st-bar:nth-child(1) { transform: translateY(6px) rotate(45deg); }
      .st-hamburger.open .st-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
      .st-hamburger.open .st-bar:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

      /* =====================================================
         CONTENT
         ===================================================== */
      .st-content {
        position: relative;
        z-index: 10;
        padding-top: clamp(56px, 7vh, 68px);
        min-height: 100vh;
      }

      .st-inner {
        max-width: 1100px;
        margin: 0 auto;
        padding: clamp(40px, 7vh, 72px) clamp(16px, 4vw, 48px) clamp(48px, 8vh, 80px);
        animation: st-rise 1.1s cubic-bezier(0.22,1,0.36,1) both 0.2s;
      }

      @keyframes st-rise {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* Page header */
      .st-header {
        text-align: center;
        margin-bottom: clamp(36px, 6vh, 60px);
      }

      .st-ornament {
        display: flex; align-items: center; justify-content: center;
        gap: 14px; margin-bottom: 20px;
      }
      .st-ornament-line {
        height: 1px; width: clamp(28px, 6vw, 48px);
        background: linear-gradient(90deg, transparent, var(--gold));
      }
      .st-ornament-line:last-child { background: linear-gradient(90deg, var(--gold), transparent); }
      .st-ornament-diamond {
        width: 7px; height: 7px;
        background: var(--gold-light);
        transform: rotate(45deg);
        box-shadow: 0 0 8px rgba(212,175,55,0.45);
        flex-shrink: 0;
        animation: st-diamond-pulse 3s ease-in-out infinite;
      }
      @keyframes st-diamond-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

      .st-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(28px, 5.5vw, 44px);
        font-weight: 300;
        letter-spacing: clamp(5px, 1.8vw, 12px);
        color: rgba(255,255,255,0.88);
        text-transform: uppercase;
        text-shadow: 0 0 40px rgba(139,0,0,0.4);
        margin-bottom: 10px;
      }

      .st-subtitle {
        font-size: clamp(7px, 1.8vw, 9.5px);
        font-weight: 300;
        letter-spacing: clamp(3px, 1.2vw, 6px);
        color: rgba(212,175,55,0.4);
        text-transform: uppercase;
      }

      /* Stat grid */
      .st-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
        gap: clamp(16px, 3vw, 28px);
      }

      /* Stat card */
      .st-card {
        position: relative;
        background: linear-gradient(160deg,
          rgba(22,8,8,0.96) 0%,
          rgba(12,4,4,1)    50%,
          rgba(22,6,6,0.96) 100%);
        border: 1px solid rgba(139,0,0,0.28);
        overflow: hidden;
        transition: border-color 0.4s, box-shadow 0.4s, transform 0.3s;
        animation: st-card-in 0.8s cubic-bezier(0.22,1,0.36,1) both;
        box-shadow:
          0 4px 32px rgba(0,0,0,0.65),
          inset 0 1px 0 rgba(255,255,255,0.02);
      }

      .st-card:nth-child(1) { animation-delay: 0.15s; }
      .st-card:nth-child(2) { animation-delay: 0.25s; }
      .st-card:nth-child(3) { animation-delay: 0.35s; }
      .st-card:nth-child(4) { animation-delay: 0.45s; }
      .st-card:nth-child(5) { animation-delay: 0.55s; }
      .st-card:nth-child(6) { animation-delay: 0.65s; }

      @keyframes st-card-in {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* Gold corner ornaments */
      .st-card-corner {
        position: absolute;
        width: 16px; height: 16px;
        pointer-events: none;
        opacity: 0.35;
        transition: opacity 0.35s;
      }
      .st-card:hover .st-card-corner { opacity: 0.8; }
      .st-card-corner--tl { top: -1px;    left: -1px;  border-top: 1px solid var(--gold-light); border-left:  1px solid var(--gold-light); }
      .st-card-corner--tr { top: -1px;    right: -1px; border-top: 1px solid var(--gold-light); border-right: 1px solid var(--gold-light); }
      .st-card-corner--bl { bottom: -1px; left: -1px;  border-bottom: 1px solid var(--gold-light); border-left:  1px solid var(--gold-light); }
      .st-card-corner--br { bottom: -1px; right: -1px; border-bottom: 1px solid var(--gold-light); border-right: 1px solid var(--gold-light); }

      /* Inner glow on card */
      .st-card::before {
        content: '';
        position: absolute; inset: 0;
        background: radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.07) 0%, transparent 65%);
        pointer-events: none;
        transition: opacity 0.4s;
      }
      .st-card:hover {
        border-color: rgba(139,0,0,0.5);
        box-shadow:
          0 4px 40px rgba(0,0,0,0.7),
          0 0 40px rgba(139,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.03);
        transform: translateY(-3px);
      }
      .st-card:hover::before { opacity: 2; }

      /* Shimmer sweep on hover */
      .st-card::after {
        content: '';
        position: absolute;
        top: 0; left: -80%;
        width: 50%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent);
        transition: left 0.7s cubic-bezier(0.22,1,0.36,1);
        pointer-events: none;
      }
      .st-card:hover::after { left: 170%; }

      .st-card-body {
        padding: clamp(22px, 4vw, 34px) clamp(20px, 4vw, 32px);
        position: relative;
        z-index: 1;
      }

      /* Icon area */
      .st-card-icon {
        width: 36px; height: 36px;
        margin-bottom: 18px;
        opacity: 0.55;
        transition: opacity 0.35s;
      }
      .st-card:hover .st-card-icon { opacity: 0.9; }
      .st-card-icon svg { width: 100%; height: 100%; }

      /* Stat name */
      .st-card-name {
        font-size: clamp(7px, 1.6vw, 9px);
        font-weight: 500;
        letter-spacing: clamp(2.5px, 1vw, 4.5px);
        color: rgba(212,175,55,0.55);
        text-transform: uppercase;
        margin-bottom: clamp(10px, 2vw, 16px);
      }

      /* Gold separator */
      .st-card-sep {
        height: 1px;
        width: 32px;
        background: linear-gradient(90deg, var(--crimson), var(--gold));
        margin-bottom: clamp(12px, 2.5vw, 18px);
        transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
      }
      .st-card:hover .st-card-sep { width: 64px; }

      /* Stat value */
      .st-card-value {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(28px, 5vw, 42px);
        font-weight: 300;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.88);
        line-height: 1;
        text-shadow: 0 0 24px rgba(139,0,0,0.3);
      }

      .st-card-unit {
        font-family: 'Montserrat', sans-serif;
        font-size: clamp(8px, 1.5vw, 10px);
        letter-spacing: 2px;
        color: rgba(255,255,255,0.22);
        margin-top: 6px;
        font-weight: 300;
      }

      /* Ambient glow */
      .st-glow {
        position: fixed;
        width: min(600px, 120vw); height: min(600px, 120vw);
        background: radial-gradient(circle, rgba(139,0,0,0.12) 0%, rgba(80,0,0,0.05) 40%, transparent 70%);
        left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1; border-radius: 50%;
        pointer-events: none;
        animation: st-breathe 6s ease-in-out infinite;
      }
      @keyframes st-breathe {
        0%,100% { opacity: 0.6; transform: translate(-50%,-50%) scale(1); }
        50%      { opacity: 1;   transform: translate(-50%,-50%) scale(1.12); }
      }
    </style>

    <div class="st-root">
      <canvas id="st-canvas" class="bw-canvas"></canvas>
      <div class="st-glow"></div>

      <!-- ===== NAVBAR ===== -->
      <nav class="st-nav">
        <div class="st-nav-inner">

          <a href="/main" data-link class="st-logo">Bloodwave</a>

          <div class="st-links">
            <a href="/main" data-link class="st-link"><span>Matches</span></a>
            <a href="/stats" data-link class="st-link active"><span>Stats</span></a>
          </div>

          <div class="st-right">
            <button class="st-avatar" id="st-profile-btn" aria-label="Profile & Settings">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </button>

            <button class="st-hamburger" id="st-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="st-bar"></span>
              <span class="st-bar"></span>
              <span class="st-bar"></span>
            </button>
          </div>

        </div>

        <div class="st-mobile-menu" id="st-mobile-menu">
          <div class="st-mobile-menu-inner">
            <a href="/main" data-link class="st-mobile-link">Matches</a>
            <a href="/stats" data-link class="st-mobile-link">Stats</a>
            <div class="st-mobile-divider"></div>
            <a href="/user-panel" data-link class="st-mobile-link">Profile</a>
            <button class="st-mobile-logout" id="st-mobile-logout" style="background:none; border:none; padding:14px 8px; width:100%; text-align:left; cursor:pointer; color:rgba(255,255,255,0.35); font-size:9px; font-weight:400; letter-spacing:4px; text-transform:uppercase; transition:color 0.3s, padding-left 0.3s;">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- ===== CONTENT ===== -->
      <main class="st-content">
        <div class="st-inner">

          <!-- Header -->
          <div class="st-header">
            <div class="st-ornament">
              <div class="st-ornament-line"></div>
              <div class="st-ornament-diamond"></div>
              <div class="st-ornament-line"></div>
            </div>
            <h1 class="st-title">All&#8209;Time Stats</h1>
            <p class="st-subtitle">Lifetime&nbsp;&nbsp;performance&nbsp;&nbsp;overview</p>
          </div>

          <!-- Stat cards -->
          <div class="st-grid">

            <!-- Damage Dealt -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                  </svg>
                </div>
                <div class="st-card-name">Damage Dealt</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">1,482,390</div>
                <div class="st-card-unit">total damage</div>
              </div>
            </div>

            <!-- Enemies Killed -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </div>
                <div class="st-card-name">Enemies Killed</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">8,741</div>
                <div class="st-card-unit">eliminations</div>
              </div>
            </div>

            <!-- Time Lived -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Time Lived</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">347h 12m</div>
                <div class="st-card-unit">total survival time</div>
              </div>
            </div>

            <!-- Deaths -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <div class="st-card-name">Deaths</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">2,103</div>
                <div class="st-card-unit">times fallen</div>
              </div>
            </div>

            <!-- Matches Played -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                </div>
                <div class="st-card-name">Matches Played</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">3,256</div>
                <div class="st-card-unit">total games</div>
              </div>
            </div>

            <!-- K/D Ratio -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div class="st-card-name">K / D Ratio</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value">4.16</div>
                <div class="st-card-unit">kills per death</div>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  `;

  // ── Canvas starfield ──────────────────────────────────────────────────────
  initStCanvas();
  spawnStParticles();

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  const hamburger  = container.querySelector('#st-hamburger');
  const mobileMenu = container.querySelector('#st-mobile-menu');
  let menuOpen = false;

  hamburger?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    hamburger.setAttribute('aria-expanded', String(menuOpen));
    mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + 'px' : '0';
  });

  mobileMenu?.querySelectorAll('.st-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.style.maxHeight = '0';
    });
  });

  // ── Profile navigation ────────────────────────────────────────────────────
  const goToProfile = () => {
    window.router?.navigate('/user-panel');
  };
  container.querySelector('#st-profile-btn')?.addEventListener('click', goToProfile);
  container.querySelector('#st-profile-btn-mobile')?.addEventListener('click', goToProfile);

  // ── Logout functionality ──────────────────────────────────────────────────
  const logoutBtn = container.querySelector('#st-mobile-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      logoutBtn.disabled = true;
      logoutBtn.textContent = '✦ Logging out… ✦';
      await logout();
    });
  }
}

/* ======================================================================
   CANVAS
   ====================================================================== */
function initStCanvas() {
  const canvas = document.getElementById('st-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  measure();
  window.addEventListener('resize', measure);

  const stars = [];
  for (let i = 0; i < 200; i++) stars.push(makeStar(true));

  function makeStar(firstTime) {
    const isRed  = Math.random() < 0.07;
    const isGold = !isRed && Math.random() < 0.04;
    const r      = Math.random() * 1.4 + 0.3;
    return {
      x: Math.random() * (W || window.innerWidth),
      y: firstTime ? Math.random() * (H || window.innerHeight) : (H || window.innerHeight) + 5,
      r, vx: (Math.random() - 0.5) * 0.06, vy: -(Math.random() * 0.18 + 0.04),
      opacity: Math.random() * 0.6 + 0.2,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.02 + 0.004,
      isRed, isGold, life: 0, maxLife: 500 + Math.random() * 700,
    };
  }

  let streakTimer = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    streakTimer++;
    if (streakTimer > 200 + Math.random() * 200) {
      drawStreak(ctx, W, H);
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
      s.x += s.vx; s.y += s.vy;
      if (s.life > s.maxLife || s.y < -20 || s.x < -20 || s.x > W + 20) {
        stars[i] = makeStar(false);
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function drawStreak(ctx, W, H) {
  const x     = Math.random() * W;
  const y     = Math.random() * H * 0.7;
  const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.6;
  const len   = 80 + Math.random() * 160;
  const grd   = ctx.createLinearGradient(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
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

function spawnStParticles() {
  const root = document.querySelector('.st-root');
  if (!root) return;
  for (let i = 0; i < 18; i++) {
    const p        = document.createElement('div');
    p.className    = 'bw-particle';
    const size     = Math.random() * 2.2 + 0.4;
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
      animation-duration:${18 + Math.random() * 22}s;
      animation-delay:${Math.random() * 20}s;
      --drift:${(Math.random() - 0.5) * 90}px;
    `;
    root.appendChild(p);
  }
}
