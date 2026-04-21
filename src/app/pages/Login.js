// login page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/Login.css";
// imports dependencies used by this module
import { login } from "../services/auth.js";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";
// imports dependencies used by this module
import { attachCapsLockHint } from "../utils/caps-lock.js";

const COOKIE_POLICY_ACCEPT_KEY = "bw_cookie_policy_accepted_v1";

// exports the main function for this module
export default function Login(container) {
  // executes this operation step as part of the flow
  container.innerHTML = `
    <div class="bw-root">
      <div class="bw-glow-center"></div>

      <div class="bw-card">
        <div class="bw-card-inner">
          <div class="bw-corner bw-corner--tl"></div>
          <div class="bw-corner bw-corner--tr"></div>
          <div class="bw-corner bw-corner--bl"></div>
          <div class="bw-corner bw-corner--br"></div>

          <div class="bw-header">
            <div class="bw-ornament">
              <div class="bw-ornament-line"></div>
              <div class="bw-ornament-diamond"></div>
              <div class="bw-ornament-line"></div>
            </div>
            <h1 class="bw-title">Bloodwave</h1>
            <p class="bw-subtitle">Members&nbsp;&nbsp;Only&nbsp;&nbsp;Access</p>
          </div>

          <form class="bw-form" id="lxForm">

            <div class="bw-field">
              <label class="bw-label">Username</label>
              <div class="bw-input-wrap">
                <input type="text" id="lxUsername" class="bw-input" placeholder="your_username" required autocomplete="username" />
                <div class="bw-input-line"></div>
              </div>
            </div>

            <div class="bw-field">
              <label class="bw-label">Password</label>
              <div class="bw-input-wrap">
                <input type="password" id="lxPassword" class="bw-input" placeholder="············" required autocomplete="current-password" style="padding-right: clamp(40px, 9vw, 52px);" />
                <button type="button" class="bw-pw-toggle" id="lxPwToggle" aria-label="Toggle password visibility">
                  <svg id="lxEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div class="bw-input-line"></div>
              </div>
              <span class="bw-caps-lock-hint" id="lxPasswordCapsHint" aria-live="polite" aria-hidden="true">Caps Lock is on</span>
            </div>

            <div class="bw-extras">
              <label class="bw-remember">
                <input type="checkbox" class="bw-checkbox" />
                <span class="bw-remember-label">Remember Me</span>
              </label>
              <a href="/forgot-password" data-link class="bw-forgot">Forgot Password</a>
            </div>

            <span class="bw-error" id="lxError" style="text-align:center;"></span>

            <button type="submit" class="bw-btn" id="lxBtn">
              <div class="bw-btn-shimmer"></div>
              <span class="bw-btn-text">Enter</span>
            </button>

            <div class="bw-divider">
              <div class="bw-divider-line"></div>
              <span class="bw-divider-text">or</span>
              <div class="bw-divider-line"></div>
            </div>

            <div class="bw-footer-link">
              <p>New member? <a href="/register" data-link class="bw-forgot">Join Now</a></p>
            </div>

          </form>
        </div>
      </div>

      <div class="bw-cookie-overlay" id="lxCookieOverlay" aria-hidden="true">
        <div class="bw-cookie-modal" role="dialog" aria-modal="true" aria-labelledby="lxCookieTitle" aria-describedby="lxCookieText">
          <div class="bw-cookie-ornament" aria-hidden="true">
            <span class="bw-cookie-ornament-line"></span>
            <span class="bw-cookie-ornament-diamond"></span>
            <span class="bw-cookie-ornament-line"></span>
          </div>

          <h2 class="bw-cookie-title" id="lxCookieTitle">Cookie Policy</h2>
          <p class="bw-cookie-text" id="lxCookieText">
            To continue, you must accept our Cookie Policy. We use cookies to keep your session secure and improve your experience.
          </p>

          <div class="bw-cookie-actions">
            <button type="button" class="bw-cookie-accept" id="lxCookieAccept">I Accept</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // executes this operation step as part of the flow
  ensureGlobalStarfield();

  // declares a constant used in this scope
  const form = document.getElementById("lxForm");
  // declares a constant used in this scope
  const btn = document.getElementById("lxBtn");

  // declares a constant used in this scope
  const errorEl = document.getElementById("lxError");
  // declares a constant used in this scope
  const cookieOverlay = document.getElementById("lxCookieOverlay");
  // declares a constant used in this scope
  const cookieAcceptBtn = document.getElementById("lxCookieAccept");
  // declares a constant used in this scope
  const cookieOpenTosBtn = document.getElementById("lxCookieOpenTos");

  const hasAcceptedCookiePolicy = () => {
    // starts guarded logic to catch runtime errors
    try {
      // returns a value from the current function
      return window.localStorage.getItem(COOKIE_POLICY_ACCEPT_KEY) === "true";
    } catch {
      // returns a value from the current function
      return false;
    }
  };

  const setCookiePolicyAccepted = () => {
    // starts guarded logic to catch runtime errors
    try {
      // executes this operation step as part of the flow
      window.localStorage.setItem(COOKIE_POLICY_ACCEPT_KEY, "true");
    } catch {
      // no-op when storage is unavailable
    }
  };

  const toggleCookieOverlay = (isVisible) => {
    // checks a condition before executing this branch
    if (!cookieOverlay) return;
    // executes this operation step as part of the flow
    cookieOverlay.classList.toggle("is-open", isVisible);
    // executes this operation step as part of the flow
    cookieOverlay.setAttribute("aria-hidden", String(!isVisible));
    // checks a condition before executing this branch
    if (isVisible) {
      // executes this operation step as part of the flow
      window.setTimeout(() => cookieAcceptBtn?.focus(), 0);
    }
  };

  // checks a condition before executing this branch
  if (!hasAcceptedCookiePolicy()) {
    // executes this operation step as part of the flow
    toggleCookieOverlay(true);
  }

  // attaches a dom event listener for user interaction
  cookieAcceptBtn?.addEventListener("click", () => {
    // executes this operation step as part of the flow
    setCookiePolicyAccepted();
    // executes this operation step as part of the flow
    toggleCookieOverlay(false);
  });

  cookieOpenTosBtn?.addEventListener("click", () => {
    // checks a condition before executing this branch
    if (window.router?.navigate) {
      // executes this operation step as part of the flow
      window.router.navigate("/tos");
      // returns a value from the current function
      return;
    }

    // executes this operation step as part of the flow
    window.location.href = "/tos";
  });

  // attaches a dom event listener for user interaction
  form.addEventListener("submit", async (e) => {
    // executes this operation step as part of the flow
    e.preventDefault();
    // executes this operation step as part of the flow
    errorEl.textContent = "";

    // checks a condition before executing this branch
    if (cookieOverlay?.classList.contains("is-open")) {
      // executes this operation step as part of the flow
      errorEl.textContent = "Please accept the Cookie Policy before logging in.";
      // executes this operation step as part of the flow
      cookieAcceptBtn?.focus();
      // returns a value from the current function
      return;
    }

    // declares a constant used in this scope
    const username = document.getElementById("lxUsername").value.trim();
    // declares a constant used in this scope
    const password = document.getElementById("lxPassword").value;
    // declares a constant used in this scope
    const rememberMe =
      // executes this operation step as part of the flow
      document.querySelector("#lxForm .bw-checkbox")?.checked ?? false;

    // executes this operation step as part of the flow
    btn.disabled = true;
    // executes this operation step as part of the flow
    btn.querySelector(".bw-btn-text").textContent = "✦  Entering…  ✦";

    // starts guarded logic to catch runtime errors
    try {
      // waits for an asynchronous operation to complete
      await login(username, password, rememberMe);
      // executes this operation step as part of the flow
      btn.classList.add("success");
      // executes this operation step as part of the flow
      btn.querySelector(".bw-btn-text").textContent = "✦  Welcome Back  ✦";
      // executes this operation step as part of the flow
      setTimeout(() => window.router.navigate("/main"), 700);
    } catch (err) {
      // executes this operation step as part of the flow
      errorEl.textContent = err.message || "Login failed. Please try again.";
      // executes this operation step as part of the flow
      btn.querySelector(".bw-btn-text").textContent = "Enter";
      // executes this operation step as part of the flow
      btn.disabled = false;
    }
  });

  // Password visibility toggle
  const pwToggle = document.getElementById("lxPwToggle");
  // declares a constant used in this scope
  const pwInput = document.getElementById("lxPassword");
  // declares a constant used in this scope
  const eyeIcon = document.getElementById("lxEyeIcon");
  // declares a constant used in this scope
  const capsLockHint = document.getElementById("lxPasswordCapsHint");
  // declares a constant used in this scope
  const eyeOpen = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />`;
  // declares a constant used in this scope
  const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />`;
  // attaches a dom event listener for user interaction
  pwToggle.addEventListener("click", () => {
    // declares a constant used in this scope
    const isHidden = pwInput.type === "password";
    // executes this operation step as part of the flow
    pwInput.type = isHidden ? "text" : "password";
    // executes this operation step as part of the flow
    eyeIcon.innerHTML = isHidden ? eyeClosed : eyeOpen;
  });

  // executes this operation step as part of the flow
  attachCapsLockHint(pwInput, capsLockHint);
}

/* ============================================================
   CANVAS – same starry background as Main page
   // executes this operation step as part of the flow
   ============================================================ */
// declares a helper function for a focused task
function initCanvas() {
  // declares a constant used in this scope
  const canvas = document.getElementById("lx-canvas");
  // checks a condition before executing this branch
  if (!canvas) return;
  // declares a constant used in this scope
  const ctx = canvas.getContext("2d");

  // executes this operation step as part of the flow
  let W, H;
  // declares mutable state used in this scope
  let stars = [];

  // declares a helper function for a focused task
  function measure() {
    // executes this operation step as part of the flow
    W = canvas.width = window.innerWidth;
    // executes this operation step as part of the flow
    H = canvas.height = window.innerHeight;
  }

  // declares a helper function for a focused task
  function initStars() {
    // executes this operation step as part of the flow
    stars = [];
    // iterates through a sequence of values
    for (let i = 0; i < 85; i++) {
      stars.push({
        // sets a named field inside an object or configuration block
        x: Math.random() * W,
        // sets a named field inside an object or configuration block
        y: Math.random() * H,
        // sets a named field inside an object or configuration block
        r: Math.random() * 1.3 + 0.3,
        // sets a named field inside an object or configuration block
        opacity: Math.random() * 0.6 + 0.2,
        // sets a named field inside an object or configuration block
        vx: (Math.random() - 0.5) * 0.15,
        // sets a named field inside an object or configuration block
        vy: (Math.random() - 0.5) * 0.15,
      });
    }
  }

  // declares a helper function for a focused task
  function anim() {
    // executes this operation step as part of the flow
    ctx.clearRect(0, 0, W, H);
    // executes this operation step as part of the flow
    ctx.fillStyle = "rgb(8,6,6)";
    // executes this operation step as part of the flow
    ctx.fillRect(0, 0, W, H);

    // defines an arrow function used by surrounding logic
    stars.forEach((s) => {
      // executes this operation step as part of the flow
      s.x += s.vx;
      // executes this operation step as part of the flow
      s.y += s.vy;
      // checks a condition before executing this branch
      if (s.x < 0) s.x = W;
      // checks a condition before executing this branch
      if (s.x > W) s.x = 0;
      // checks a condition before executing this branch
      if (s.y < 0) s.y = H;
      // checks a condition before executing this branch
      if (s.y > H) s.y = 0;

      // declares a constant used in this scope
      const glowRadius = s.r * 6;
      // declares a constant used in this scope
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
      // executes this operation step as part of the flow
      glow.addColorStop(0, `rgba(212,175,55,${Math.min(1, s.opacity * 0.75)})`);
      // executes this operation step as part of the flow
      glow.addColorStop(0.35, `rgba(212,175,55,${s.opacity * 0.35})`);
      // executes this operation step as part of the flow
      glow.addColorStop(1, "rgba(212,175,55,0)");

      // executes this operation step as part of the flow
      ctx.fillStyle = glow;
      // executes this operation step as part of the flow
      ctx.beginPath();
      // executes this operation step as part of the flow
      ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
      // executes this operation step as part of the flow
      ctx.fill();

      // executes this operation step as part of the flow
      ctx.fillStyle = `rgba(255,230,150,${Math.min(1, s.opacity + 0.2)})`;
      // executes this operation step as part of the flow
      ctx.beginPath();
      // executes this operation step as part of the flow
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      // executes this operation step as part of the flow
      ctx.fill();
    });

    // executes this operation step as part of the flow
    requestAnimationFrame(anim);
  }

  // executes this operation step as part of the flow
  measure();
  // executes this operation step as part of the flow
  initStars();
  // executes this operation step as part of the flow
  anim();

  // attaches a dom event listener for user interaction
  window.addEventListener("resize", () => {
    // executes this operation step as part of the flow
    measure();
    // executes this operation step as part of the flow
    initStars();
  });
}

// declares a helper function for a focused task
function spawnParticles() {
  // declares a constant used in this scope
  const root = document.querySelector(".bw-root");
  // checks a condition before executing this branch
  if (!root) return;

  // iterates through a sequence of values
  for (let i = 0; i < 18; i++) {
    // declares a constant used in this scope
    const p = document.createElement("div");
    // executes this operation step as part of the flow
    p.className = "bw-particle";
    // declares a constant used in this scope
    const size = Math.random() * 2.2 + 0.4;
    // declares a constant used in this scope
    const delay = Math.random() * 20;
    // declares a constant used in this scope
    const duration = 18 + Math.random() * 22;
    // declares a constant used in this scope
    const drift = (Math.random() - 0.5) * 90;
    // declares a constant used in this scope
    const isRed = Math.random() < 0.28;
    // declares a constant used in this scope
    const isGold = !isRed && Math.random() < 0.15;
    // declares a constant used in this scope
    const col = isRed
      ? "rgba(192,57,43,0.55)"
      : isGold
        ? "rgba(212,175,55,0.4)"
        // executes this operation step as part of the flow
        : "rgba(255,230,210,0.28)";

    // executes this operation step as part of the flow
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:-12px;
      background:${col};
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      --drift:${drift}px;
    `;
    // executes this operation step as part of the flow
    root.appendChild(p);
  }
}