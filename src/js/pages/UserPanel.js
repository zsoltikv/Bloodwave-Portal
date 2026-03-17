import { getUser, logout, authFetch } from '../auth.js';

const API_BASE = 'http://5.38.140.128:5000';

export default function UserPanel(container) {
  const user = getUser();

  container.innerHTML = `
    <style>
      /* === PAGE ROOT === */
      .up-root {
        --up-nav-h: clamp(56px, 7vh, 68px);
        --up-ornament-gap: clamp(26px, 4.2vh, 36px);
        min-height: 100vh;
        min-height: 100dvh;
        background: var(--obsidian);
        font-family: 'Montserrat', sans-serif;
        position: relative;
        overflow-x: hidden;
      }

      /* === NAVBAR === */
      .up-nav {
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
        animation: up-nav-in 0.9s cubic-bezier(0.22,1,0.36,1) both;
      }

      .up-nav::after {
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

      @keyframes up-nav-in {
        from { opacity: 0; transform: translateY(-16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .up-nav-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 clamp(16px, 4vw, 48px);
        height: var(--up-nav-h);
        display: flex;
        align-items: center;
        position: relative;
      }

      .up-logo {
        font-family: 'Cinzel', 'Cormorant Garamond', serif;
        font-weight: 700;
        font-size: clamp(18px, 3.2vw, 24px);
        letter-spacing: clamp(3.4px, 1.1vw, 7.2px);
        color: rgba(255,255,255,0.94);
        text-transform: uppercase;
        text-decoration: none;
        position: relative;
        display: inline-block;
        padding: 2px 0 6px;
        background: linear-gradient(
          100deg,
          rgba(255,255,255,0.96) 8%,
          rgba(245,226,155,0.98) 28%,
          rgba(212,175,55,0.98) 47%,
          rgba(255,243,196,0.98) 62%,
          rgba(255,255,255,0.96) 92%
        );
        background-size: 240% 100%;
        background-position: 0% 50%;
        text-shadow:
          0 0 12px rgba(212,175,55,0.2),
          0 0 26px rgba(180,0,0,0.34),
          0 0 56px rgba(139,0,0,0.22);
        flex-shrink: 0;
        user-select: none;
        transition: text-shadow 0.4s, letter-spacing 0.35s, filter 0.35s;
        animation: up-logo-shine 7.5s ease-in-out infinite, up-logo-breathe 4.8s ease-in-out infinite;
      }

      @supports (-webkit-background-clip: text) {
        .up-logo {
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      @keyframes up-logo-shine {
        0%, 100% { background-position: 0% 50%; }
        50%      { background-position: 100% 50%; }
      }

      @keyframes up-logo-breathe {
        0%, 100% { filter: drop-shadow(0 0 0 rgba(212,175,55,0)); }
        50%      { filter: drop-shadow(0 0 6px rgba(212,175,55,0.28)); }
      }

      .up-logo::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background: linear-gradient(90deg, rgba(212,175,55,0), rgba(255,228,128,0.9), rgba(212,175,55,0));
        opacity: 0.78;
        transform-origin: center;
        transform: scaleX(0.76);
        transition: transform 0.35s ease, opacity 0.35s ease;
      }

      .up-logo::after {
        content: '✦';
        position: absolute;
        right: -12px;
        top: 50%;
        transform: translateY(-52%) scale(0.9);
        font-size: 8px;
        color: rgba(212,175,55,0.72);
        text-shadow: 0 0 8px rgba(212,175,55,0.38);
        opacity: 0.72;
        transition: opacity 0.35s ease, transform 0.35s ease;
      }

      .up-logo:hover {
        letter-spacing: clamp(3.6px, 1.15vw, 7.6px);
        text-shadow:
          0 0 16px rgba(255,228,128,0.3),
          0 0 30px rgba(192,57,43,0.62),
          0 0 80px rgba(139,0,0,0.34);
        animation-duration: 3.2s, 2.6s;
      }

      .up-logo:hover::before {
        opacity: 0.95;
        transform: scaleX(1);
      }

      .up-logo:hover::after {
        opacity: 0.95;
        transform: translateY(-52%) scale(1);
      }

      .up-nav-spacer { margin-left: auto; }

      .up-nav-link {
        font-size: 9px;
        font-weight: 400;
        letter-spacing: 3.5px;
        color: rgba(255,255,255,0.38);
        text-transform: uppercase;
        text-decoration: none;
        position: relative;
        transition: color 0.35s;
        white-space: nowrap;
      }
      .up-nav-link:hover { color: rgba(255,255,255,0.82); }

      /* === CONTENT AREA === */
      .up-content {
        position: relative;
        z-index: 10;
        padding-top: calc(var(--up-nav-h) + var(--up-ornament-gap));
        min-height: 100vh;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-bottom: clamp(40px, 8vh, 80px);
      }

      .up-container {
        max-width: 900px;
        width: 100%;
        padding: 0 clamp(16px, 4vw, 48px);
      }

      /* === HEADER === */
      .up-header {
        text-align: center;
        margin-bottom: clamp(40px, 6vh, 60px);
      }

      .up-ornament {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin-bottom: var(--up-ornament-gap);
        animation: up-ornament-in 0.8s cubic-bezier(0.22,1,0.36,1) both;
      }

      @keyframes up-ornament-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      .up-ornament-line {
        height: 1px;
        width: clamp(24px, 5vw, 40px);
        background: linear-gradient(90deg, transparent, var(--gold));
      }
      .up-ornament-line:last-child { background: linear-gradient(90deg, var(--gold), transparent); }

      .up-ornament-diamond {
        width: 7px;
        height: 7px;
        background: var(--gold-light);
        transform: rotate(45deg);
        box-shadow: 0 0 8px rgba(212,175,55,0.45);
        flex-shrink: 0;
        animation: up-diamond-pulse 3s ease-in-out infinite;
      }
      @keyframes up-diamond-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

      .up-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(32px, 7vw, 52px);
        font-weight: 300;
        letter-spacing: clamp(4px, 1.5vw, 10px);
        color: rgba(255,255,255,0.85);
        text-transform: uppercase;
        margin-top: 0;
        margin-bottom: 8px;
        text-shadow: 0 0 40px rgba(139,0,0,0.35);
        animation: up-title-in 0.9s cubic-bezier(0.22,1,0.36,1) both 0.1s;
      }

      @keyframes up-title-in {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .up-subtitle {
        font-size: clamp(8px, 1.8vw, 10px);
        font-weight: 300;
        letter-spacing: clamp(3px, 1.2vw, 6px);
        color: rgba(212,175,55,0.5);
        text-transform: uppercase;
        animation: up-subtitle-in 0.9s cubic-bezier(0.22,1,0.36,1) both 0.2s;
      }

      @keyframes up-subtitle-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      /* === INFO GRID === */
      .up-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: clamp(16px, 3vw, 28px);
        margin-bottom: 0;
        animation: up-info-in 1s cubic-bezier(0.22,1,0.36,1) both 0.3s;
      }

      @keyframes up-info-in {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .up-info-card {
        padding: clamp(20px, 4vw, 28px);
        background: linear-gradient(135deg, rgba(28,8,8,0.96) 0%, rgba(18,4,4,0.94) 100%);
        border: 1.5px solid rgba(212,175,55,0.18);
        border-radius: 1px;
        position: relative;
        overflow: hidden;
        transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
      }

      .up-info-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.12), transparent);
        transition: left 0.6s;
      }

      .up-info-card:hover {
        border-color: rgba(212,175,55,0.4);
        background: linear-gradient(135deg, rgba(40,10,10,0.97) 0%, rgba(24,6,6,0.95) 100%);
        box-shadow:
          0 8px 24px rgba(0,0,0,0.35),
          inset 0 0 12px rgba(212,175,55,0.04);
      }

      .up-info-card:hover::before { left: 100%; }

      .up-info-label {
        display: block;
        font-size: 7.5px;
        font-weight: 500;
        letter-spacing: 3px;
        color: rgba(212,175,55,0.55);
        text-transform: uppercase;
        margin-bottom: 12px;
      }

      .up-info-value {
        display: block;
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(16px, 3.5vw, 22px);
        font-weight: 400;
        letter-spacing: 1px;
        color: rgba(255,255,255,0.85);
        word-break: break-word;
      }

      /* === DIVIDER === */
      .up-divider {
        display: flex;
        align-items: center;
        gap: 14px;
        margin: clamp(40px, 6vh, 60px) 0;
        animation: up-divider-in 1.1s cubic-bezier(0.22,1,0.36,1) both 0.4s;
      }

      @keyframes up-divider-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      .up-divider-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent);
      }

      .up-divider-text {
        font-size: 8px;
        letter-spacing: 3px;
        color: rgba(212,175,55,0.35);
        text-transform: uppercase;
        flex-shrink: 0;
      }

      /* === SETTINGS PANEL === */
      .up-settings-panel {
        padding: clamp(24px, 5vw, 36px);
        background: linear-gradient(135deg, rgba(28,8,8,0.96) 0%, rgba(18,4,4,0.94) 100%);
        border: 1.5px solid rgba(212,175,55,0.18);
        border-radius: 2px;
        margin-bottom: clamp(40px, 6vh, 60px);
        animation: up-panel-in 1.2s cubic-bezier(0.22,1,0.36,1) both 0.5s;
      }

      @keyframes up-panel-in {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .up-settings-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(16px, 3vw, 20px);
        font-weight: 400;
        letter-spacing: 1.5px;
        color: rgba(255,255,255,0.8);
        margin-bottom: clamp(16px, 3vw, 24px);
        text-align: center;
        text-transform: uppercase;
      }

      .up-settings-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: clamp(12px, 2vw, 18px);
      }

      .up-settings-btn {
        position: relative;
        padding: clamp(13px, 2.5vw, 17px) clamp(14px, 2.5vw, 20px);
        background: linear-gradient(135deg, rgba(46,8,8,0.95) 0%, rgba(24,3,3,0.93) 100%);
        border: 1.5px solid rgba(212,175,55,0.3);
        color: rgba(212,175,55,0.8);
        font-family: 'Montserrat', sans-serif;
        font-size: clamp(8px, 1.2vw, 8.5px);
        font-weight: 500;
        letter-spacing: 2px;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 1px;
        overflow: hidden;
        transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        outline: none;
        -webkit-tap-highlight-color: transparent;
      }

      .up-settings-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent);
        transition: left 0.6s;
      }

      .up-settings-btn:hover:not(:disabled) {
        border-color: rgba(212,175,55,0.55);
        color: rgba(212,175,55,0.95);
        background: linear-gradient(135deg, rgba(62,10,10,0.97) 0%, rgba(30,4,4,0.95) 100%);
        box-shadow:
          0 0 12px rgba(212,175,55,0.15),
          inset 0 0 12px rgba(212,175,55,0.04);
      }

      .up-settings-btn:hover:not(:disabled)::before { left: 100%; }

      .up-settings-btn:active:not(:disabled) { transform: scale(0.97); }

      .up-settings-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .up-settings-btn.success {
        border-color: rgba(76,175,80,0.4);
        color: rgba(129,199,132,0.85);
      }

      .up-settings-action {
        display: block;
        text-align: center;
      }

      .up-settings-action .up-btn-icon,
      .up-settings-action .up-btn-sub {
        display: none;
      }

      .up-settings-action .up-btn-main {
        display: inline;
      }

      /* === LOGOUT SECTION === */
      .up-logout-section {
        display: flex;
        justify-content: center;
        animation: up-logout-in 1.3s cubic-bezier(0.22,1,0.36,1) both 0.6s;
      }

      @keyframes up-logout-in {
        from { opacity: 0; transform: translateY(15px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .up-logout-btn {
        position: relative;
        padding: clamp(13px, 2.5vw, 17px) clamp(20px, 4vw, 32px);
        background: linear-gradient(135deg, rgba(46,8,8,0.95) 0%, rgba(24,3,3,0.93) 100%);
        border: 1.5px solid rgba(192,57,43,0.3);
        color: rgba(192,57,43,0.75);
        font-family: 'Montserrat', sans-serif;
        font-size: clamp(8px, 1.2vw, 8.5px);
        font-weight: 500;
        letter-spacing: 2px;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 1px;
        overflow: hidden;
        transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        outline: none;
        -webkit-tap-highlight-color: transparent;
      }

      .up-logout-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(192,57,43,0.15), transparent);
        transition: left 0.6s;
      }

      .up-logout-btn:hover:not(:disabled) {
        border-color: rgba(192,57,43,0.6);
        color: rgba(220,80,60,0.9);
        background: linear-gradient(135deg, rgba(139,0,0,0.25) 0%, rgba(28,2,2,0.45) 100%);
        box-shadow:
          0 0 12px rgba(192,57,43,0.2),
          inset 0 0 12px rgba(192,57,43,0.06);
      }

      .up-logout-btn:hover:not(:disabled)::before { left: 100%; }

      .up-logout-btn:active:not(:disabled) { transform: scale(0.97); }

      .up-logout-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* === MODAL OVERLAY === */
      .up-modal-overlay {
        position: fixed;
        inset: 0;
        background:
          radial-gradient(circle at 50% 18%, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0) 40%),
          rgba(8,6,6,0.9);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        padding: clamp(16px, 4vw, 32px);
        animation: up-modal-fade 0.35s cubic-bezier(0.22,1,0.36,1);
      }

      @keyframes up-modal-fade {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      .up-modal-card {
        background:
          linear-gradient(165deg, rgba(34,10,10,0.98) 0%, rgba(14,4,4,0.99) 55%, rgba(9,2,2,0.99) 100%);
        border: 1.5px solid rgba(212,175,55,0.28);
        border-radius: 2px;
        max-width: 400px;
        width: 100%;
        padding: clamp(24px, 5vw, 32px);
        position: relative;
        overflow: hidden;
        box-shadow:
          0 16px 48px rgba(0,0,0,0.65),
          0 0 0 1px rgba(212,175,55,0.08) inset,
          0 0 32px rgba(139,0,0,0.18);
        animation: up-modal-slide 0.35s cubic-bezier(0.22,1,0.36,1);
      }

      .up-modal-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.75), transparent);
        pointer-events: none;
      }

      .up-modal-card::after {
        content: '';
        position: absolute;
        top: -40%;
        left: -15%;
        width: 130%;
        height: 70%;
        background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0) 70%);
        pointer-events: none;
      }

      @keyframes up-modal-slide {
        from { opacity: 0; transform: translateY(-30px) scale(0.95); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }

      .up-modal-header {
        text-align: center;
        margin-bottom: clamp(20px, 4vw, 28px);
        position: relative;
      }

      .up-modal-header::after {
        content: '';
        display: block;
        width: 72px;
        height: 1px;
        margin: 12px auto 0;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.55), transparent);
      }

      .up-modal-title {
        font-family: 'Cinzel', 'Cormorant Garamond', serif;
        font-size: clamp(18px, 4vw, 24px);
        font-weight: 400;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.85);
        text-transform: uppercase;
        margin-bottom: 6px;
        text-shadow: 0 0 18px rgba(212,175,55,0.14), 0 0 30px rgba(139,0,0,0.2);
      }

      .up-modal-subtitle {
        font-size: 8px;
        letter-spacing: 2.5px;
        color: rgba(212,175,55,0.58);
        text-transform: uppercase;
      }

      .up-form {
        display: flex;
        flex-direction: column;
        gap: clamp(14px, 3vw, 20px);
      }

      .up-form-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .up-form-label {
        font-size: 8px;
        font-weight: 500;
        letter-spacing: 2.5px;
        color: rgba(212,175,55,0.6);
        text-transform: uppercase;
      }

      .up-form-input {
        padding: clamp(10px, 2vw, 14px) clamp(12px, 2.5vw, 16px);
        background: linear-gradient(180deg, rgba(15,6,6,0.72) 0%, rgba(8,4,4,0.74) 100%);
        border: 1px solid rgba(212,175,55,0.2);
        border-bottom: 1.5px solid rgba(212,175,55,0.2);
        color: rgba(255,255,255,0.85);
        font-family: 'Montserrat', sans-serif;
        font-size: 9px;
        letter-spacing: 0.5px;
        border-radius: 1px;
        transition: all 0.3s;
        outline: none;
      }

      .up-form-input:focus {
        border-color: rgba(212,175,55,0.4);
        border-bottom-color: rgba(212,175,55,0.75);
        background: linear-gradient(180deg, rgba(20,8,8,0.78) 0%, rgba(10,4,4,0.82) 100%);
        box-shadow: 0 0 14px rgba(212,175,55,0.15), inset 0 0 8px rgba(212,175,55,0.05);
      }

      .up-form-error {
        font-size: 7.5px;
        color: rgba(192,57,43,0.8);
        letter-spacing: 0.5px;
        display: none;
      }

      .up-form-error.show { display: block; }

      .up-form-actions {
        display: flex;
        gap: clamp(10px, 2vw, 16px);
        margin-top: 20px;
      }

      .up-form-actions .up-settings-btn {
        flex: 1;
      }

      .up-btn-cancel {
        background: rgba(139,0,0,0.08);
        border-color: rgba(139,0,0,0.3);
        color: rgba(255,255,255,0.5);
      }
      .up-btn-cancel:hover:not(:disabled) {
        border-color: rgba(139,0,0,0.6);
        background: rgba(139,0,0,0.15);
        color: rgba(255,255,255,0.75);
      }

      /* === AMBIENT GLOW === */
      .up-glow {
        position: fixed;
        width: min(600px, 120vw);
        height: min(600px, 120vw);
        background: radial-gradient(circle, rgba(139,0,0,0.08) 0%, rgba(80,0,0,0.03) 40%, transparent 70%);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        border-radius: 50%;
        pointer-events: none;
        animation: up-breathe 6s ease-in-out infinite;
      }
      @keyframes up-breathe {
        0%,100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
        50%      { opacity: 0.8; transform: translate(-50%, -50%) scale(1.12); }
      }

      /* === CANVAS === */
      canvas.up-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      }

      /* === RESPONSIVE === */
      @media (max-width: 600px) {
        .up-content {
          min-height: auto;
          padding-bottom: 28px;
        }

        .up-info-grid {
          grid-template-columns: 1fr;
        }

        .up-divider {
          margin: 26px 0;
          gap: 10px;
        }

        .up-divider-text {
          letter-spacing: 2.2px;
          font-size: 7.5px;
        }

        .up-settings-panel {
          padding: 18px 14px;
          border-radius: 6px;
          margin-bottom: 28px;
          border-color: rgba(212,175,55,0.24);
          box-shadow:
            0 8px 24px rgba(0,0,0,0.28),
            inset 0 0 0 1px rgba(212,175,55,0.06);
        }

        .up-settings-title {
          margin-bottom: 14px;
          letter-spacing: 1.2px;
          font-size: 18px;
        }

        .up-settings-buttons {
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .up-settings-btn {
          width: 100%;
          min-height: 46px;
          padding: 12px 14px;
          font-size: 9px;
          letter-spacing: 1.5px;
        }

        .up-settings-action {
          min-height: 58px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          text-align: left;
          padding: 12px 14px;
        }

        .up-settings-action .up-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          border: 1px solid rgba(212,175,55,0.28);
          border-radius: 50%;
          color: rgba(212,175,55,0.88);
          background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.03) 70%);
        }

        .up-settings-action .up-btn-icon svg {
          display: block;
          width: 15px;
          height: 15px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .up-settings-action .up-btn-icon svg.up-icon-lock {
          transform: translate(0.35px, 0.2px);
        }


        .up-settings-action .up-btn-copy {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .up-settings-action .up-btn-main {
          display: block;
          font-size: 10.8px;
          letter-spacing: 0.9px;
          color: rgba(235,201,95,0.95);
          line-height: 1.3;
        }

        .up-settings-action .up-btn-sub {
          display: block;
          font-size: 10.8px;
          letter-spacing: 0.2px;
          color: rgba(255,255,255,0.52);
          line-height: 1.4;
          text-transform: none;
        }

        .up-logo {
          letter-spacing: 3px;
          padding-bottom: 4px;
          animation-duration: 6.2s, 4.2s;
        }

        .up-logo::after {
          right: -10px;
          font-size: 7px;
        }

        .up-modal-overlay {
          padding: 16px;
        }

        .up-modal-card {
          max-width: 100%;
          border-radius: 3px;
          padding: 22px 16px;
        }

        .up-modal-header {
          margin-bottom: 16px;
        }

        .up-modal-title {
          font-size: 22px;
          letter-spacing: 1.8px;
          margin-bottom: 6px;
        }

        .up-modal-subtitle {
          font-size: 8.5px;
          letter-spacing: 2px;
          line-height: 1.3;
        }

        .up-form {
          gap: 14px;
        }

        .up-form-label {
          font-size: 8.5px;
          letter-spacing: 2px;
        }

        .up-form-input {
          min-height: 42px;
          padding: 11px 13px;
          font-size: 12.5px;
          letter-spacing: 0.3px;
          border-radius: 2px;
        }

        .up-form-error {
          font-size: 9px;
          line-height: 1.3;
          letter-spacing: 0.3px;
        }

        .up-form-actions {
          margin-top: 14px;
          gap: 10px;
        }

        .up-form-actions .up-settings-btn {
          min-height: 44px;
          font-size: 8.8px;
          letter-spacing: 1.6px;
        }
      }
    </style>

    <div class="up-root">
      <canvas id="up-canvas" class="up-canvas"></canvas>
      <div class="up-glow"></div>

      <!-- === NAVBAR === -->
      <nav class="up-nav">
        <div class="up-nav-inner">
          <a href="/" data-link class="up-logo">Bloodwave</a>
          <div class="up-nav-spacer"></div>
          <a href="/main" data-link class="up-nav-link" id="upBackToDashboard">Back to Dashboard</a>
        </div>
      </nav>

      <!-- === MAIN CONTENT === -->
      <main class="up-content">
        <div class="up-container">

          <!-- HEADER -->
          <div class="up-header">
            <div class="up-ornament">
              <div class="up-ornament-line"></div>
              <div class="up-ornament-diamond"></div>
              <div class="up-ornament-line"></div>
            </div>
            <h1 class="up-title">Your Profile</h1>
            <p class="up-subtitle">Account&nbsp;&nbsp;Management</p>
          </div>

          <!-- INFO GRID -->
          <div class="up-info-grid">
            <div class="up-info-card">
              <span class="up-info-label">👤 Username</span>
              <span class="up-info-value">${escapeHtml(user?.username || 'N/A')}</span>
            </div>

            <div class="up-info-card">
              <span class="up-info-label">✉ Email</span>
              <span class="up-info-value">${escapeHtml(user?.email || 'N/A')}</span>
            </div>

            <div class="up-info-card">
              <span class="up-info-label">📅 Member Since</span>
              <span class="up-info-value">${formatDate(user?.createdAt || 'N/A')}</span>
            </div>
          </div>

          <!-- DIVIDER -->
          <div class="up-divider">
            <div class="up-divider-line"></div>
            <span class="up-divider-text">Settings</span>
            <div class="up-divider-line"></div>
          </div>

          <!-- SETTINGS PANEL -->
          <div class="up-settings-panel">
            <div class="up-settings-title">Account Settings</div>
            <div class="up-settings-buttons">
              <button class="up-settings-btn up-settings-action" id="upEditUsername">
                <span class="up-btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                    <circle cx="12" cy="8" r="3.5"></circle>
                    <path d="M5 19c1.8-3 4.2-4.5 7-4.5s5.2 1.5 7 4.5"></path>
                  </svg>
                </span>
                <span class="up-btn-copy">
                  <span class="up-btn-main">Edit Username</span>
                  <span class="up-btn-sub">Update display name</span>
                </span>
              </button>
              <button class="up-settings-btn up-settings-action" id="upEditEmail">
                <span class="up-btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                    <rect x="3.5" y="6.5" width="17" height="11" rx="2"></rect>
                    <path d="M4.5 8l7.5 5.5L19.5 8"></path>
                  </svg>
                </span>
                <span class="up-btn-copy">
                  <span class="up-btn-main">Change Email</span>
                  <span class="up-btn-sub">Set a new email address</span>
                </span>
              </button>
              <button class="up-settings-btn up-settings-action" id="upEditPassword">
                <span class="up-btn-icon" aria-hidden="true">
                  <svg class="up-icon-lock" viewBox="0 0 24 24" role="presentation" focusable="false">
                    <rect x="6" y="11" width="12" height="9" rx="2"></rect>
                    <path d="M8 11V9a4 4 0 0 1 8 0v2"></path>
                    <circle cx="12" cy="15.5" r="1"></circle>
                  </svg>
                </span>
                <span class="up-btn-copy">
                  <span class="up-btn-main">Change Password</span>
                  <span class="up-btn-sub">Secure your account</span>
                </span>
              </button>
            </div>
          </div>

          <!-- LOGOUT SECTION -->
          <div class="up-logout-section">
            <button class="up-logout-btn" id="upLogout">✦ Logout ✦</button>
          </div>

        </div>
      </main>
    </div>

    <!-- === MODALS === -->

    <!-- EDIT USERNAME MODAL -->
    <div class="up-modal-overlay" id="upUsernameModal" style="display:none;">
      <div class="up-modal-card">
        <div class="up-modal-header">
          <div class="up-modal-title">Edit Username</div>
          <div class="up-modal-subtitle">Choose your new display name</div>
        </div>
        <form class="up-form" id="upUsernameForm">
          <span class="up-form-error" id="upUsernameError"></span>
          <div class="up-form-field">
            <label class="up-form-label">New Username</label>
            <input type="text" id="upUsernameInput" class="up-form-input" placeholder="your_username" autocomplete="off" />
          </div>
          <div class="up-form-actions">
            <button type="submit" class="up-settings-btn">Update</button>
            <button type="button" class="up-settings-btn up-btn-cancel" id="upUsernameCancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT EMAIL MODAL -->
    <div class="up-modal-overlay" id="upEmailModal" style="display:none;">
      <div class="up-modal-card">
        <div class="up-modal-header">
          <div class="up-modal-title">Change Email</div>
          <div class="up-modal-subtitle">Update your email address</div>
        </div>
        <form class="up-form" id="upEmailForm">
          <span class="up-form-error" id="upEmailError"></span>
          <div class="up-form-field">
            <label class="up-form-label">New Email</label>
            <input type="email" id="upEmailInput" class="up-form-input" placeholder="your@email.com" autocomplete="off" />
          </div>
          <div class="up-form-actions">
            <button type="submit" class="up-settings-btn">Update</button>
            <button type="button" class="up-settings-btn up-btn-cancel" id="upEmailCancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CHANGE PASSWORD MODAL -->
    <div class="up-modal-overlay" id="upPasswordModal" style="display:none;">
      <div class="up-modal-card">
        <div class="up-modal-header">
          <div class="up-modal-title">Change Password</div>
          <div class="up-modal-subtitle">Secure your account</div>
        </div>
        <form class="up-form" id="upPasswordForm">
          <span class="up-form-error" id="upPasswordError"></span>
          <div class="up-form-field">
            <label class="up-form-label">Current Password</label>
            <input type="password" id="upPasswordCurrent" class="up-form-input" placeholder="············" autocomplete="off" />
          </div>
          <div class="up-form-field">
            <label class="up-form-label">New Password</label>
            <input type="password" id="upPasswordNew" class="up-form-input" placeholder="············" autocomplete="off" />
          </div>
          <div class="up-form-field">
            <label class="up-form-label">Confirm Password</label>
            <input type="password" id="upPasswordConfirm" class="up-form-input" placeholder="············" autocomplete="off" />
          </div>
          <div class="up-form-actions">
            <button type="submit" class="up-settings-btn">Change</button>
            <button type="button" class="up-settings-btn up-btn-cancel" id="upPasswordCancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // ========== HELPERS ==========
  function escapeHtml(text) {
    const span = document.createElement('span');
    span.textContent = text;
    return span.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  // ========== CANVAS ANIMATION ==========
  function initUpCanvas() {
    const canvas = document.getElementById('up-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    let stars = [];

    function measure() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < 60; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.3 + 0.3,
          opacity: Math.random() * 0.5 + 0.15,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
        });
      }
    }

    function anim() {
      // Full clear each frame so stars remain points without motion trails.
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgb(8,6,6)';
      ctx.fillRect(0, 0, W, H);

      stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = W;
        if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H;
        if (s.y > H) s.y = 0;

        const glowRadius = s.r * 5;
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
        glow.addColorStop(0, `rgba(212,175,55,${Math.min(1, s.opacity * 0.9)})`);
        glow.addColorStop(0.35, `rgba(212,175,55,${s.opacity * 0.35})`);
        glow.addColorStop(1, 'rgba(212,175,55,0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,230,150,${Math.min(1, s.opacity + 0.2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(anim);
    }

    measure();
    initStars();
    anim();

    window.addEventListener('resize', () => {
      measure();
      initStars();
    });
  }

  // ========== MODAL SETUP ==========
  function setupModal(modalId, triggerBtnId, cancelBtnId, formId, onSubmit) {
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(triggerBtnId);
    const cancelBtn = document.getElementById(cancelBtnId);
    const form = document.getElementById(formId);

    btn?.addEventListener('click', () => {
      modal.style.display = 'flex';
      const firstInput = form?.querySelector('input');
      firstInput?.focus();
    });

    cancelBtn?.addEventListener('click', () => {
      modal.style.display = 'none';
      form?.reset();
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        form?.reset();
      }
    });

    form?.addEventListener('submit', onSubmit);
  }

  // === USERNAME MODAL ===
  setupModal('upUsernameModal', 'upEditUsername', 'upUsernameCancel', 'upUsernameForm', async (e) => {
    e.preventDefault();
    const input = document.getElementById('upUsernameInput');
    const errorEl = document.getElementById('upUsernameError');
    const submitBtn = document.querySelector('#upUsernameForm button[type="submit"]');

    errorEl.classList.remove('show');
    errorEl.textContent = '';

    const username = input.value.trim();
    if (username.length < 3) {
      errorEl.textContent = 'Username must be at least 3 characters';
      errorEl.classList.add('show');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✦ Updating… ✦';

    try {
      const res = await authFetch(`${API_BASE}/api/User/username`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update username');
      }

      submitBtn.textContent = '✦ Updated ✦';
      submitBtn.classList.add('success');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // === EMAIL MODAL ===
  setupModal('upEmailModal', 'upEditEmail', 'upEmailCancel', 'upEmailForm', async (e) => {
    e.preventDefault();
    const input = document.getElementById('upEmailInput');
    const errorEl = document.getElementById('upEmailError');
    const submitBtn = document.querySelector('#upEmailForm button[type="submit"]');

    errorEl.classList.remove('show');
    errorEl.textContent = '';

    const email = input.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRe.test(email)) {
      errorEl.textContent = 'Invalid email address';
      errorEl.classList.add('show');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✦ Updating… ✦';

    try {
      const res = await authFetch(`${API_BASE}/api/User/email`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update email');
      }

      submitBtn.textContent = '✦ Updated ✦';
      submitBtn.classList.add('success');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // === PASSWORD MODAL ===
  setupModal('upPasswordModal', 'upEditPassword', 'upPasswordCancel', 'upPasswordForm', async (e) => {
    e.preventDefault();
    const current = document.getElementById('upPasswordCurrent');
    const newPass = document.getElementById('upPasswordNew');
    const confirm = document.getElementById('upPasswordConfirm');
    const errorEl = document.getElementById('upPasswordError');
    const submitBtn = document.querySelector('#upPasswordForm button[type="submit"]');

    errorEl.classList.remove('show');
    errorEl.textContent = '';

    let valid = true;
    if (!current.value) {
      errorEl.textContent = 'Current password is required';
      valid = false;
    } else if (newPass.value.length < 6) {
      errorEl.textContent = 'New password must be at least 6 characters';
      valid = false;
    } else if (newPass.value !== confirm.value) {
      errorEl.textContent = 'Passwords do not match';
      valid = false;
    } else if (current.value === newPass.value) {
      errorEl.textContent = 'New password must be different';
      valid = false;
    }

    if (!valid) {
      errorEl.classList.add('show');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✦ Changing… ✦';

    try {
      const res = await authFetch(`${API_BASE}/api/Auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: current.value,
          newPassword: newPass.value,
          confirmPassword: confirm.value
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to change password');
      }

      submitBtn.textContent = '✦ Changed ✦';
      submitBtn.classList.add('success');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // ========== LOGOUT ==========
  document.getElementById('upLogout')?.addEventListener('click', async () => {
    const btn = document.getElementById('upLogout');
    btn.disabled = true;
    btn.textContent = '✦ Goodbye… ✦';
    
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  });

  document.getElementById('upBackToDashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.router?.navigate) {
      window.router.navigate('/main');
      return;
    }
    window.location.href = '/main';
  });

  // ========== INIT ==========
  initUpCanvas();
}
