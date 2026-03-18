import '../../css/pages/ToS.css';
import { isLoggedIn } from '../auth.js';
export default function ToS(container) {
  const loggedIn = isLoggedIn();
  const ctaHref = loggedIn ? '/main' : '/register';
  const ctaLabel = loggedIn ? 'Back to Dashboard' : 'Back to Registration';

  container.innerHTML = `
    <div class="bw-root">
      <canvas id="tos-canvas" class="bw-canvas"></canvas>
      <div class="bw-glow-center"></div>

      <div class="bw-card" style="max-width: 800px; width: 90%;">
        <div class="bw-card-inner" style="padding: clamp(24px, 5vw, 48px);">
          <div class="bw-corner bw-corner--tl"></div>
          <div class="bw-corner bw-corner--tr"></div>
          <div class="bw-corner bw-corner--bl"></div>
          <div class="bw-corner bw-corner--br"></div>

          <div class="bw-header" style="margin-bottom: 2rem;">
            <div class="bw-ornament">
              <div class="bw-ornament-line"></div>
              <div class="bw-ornament-diamond"></div>
              <div class="bw-ornament-line"></div>
            </div>
            <h1 class="bw-title">Terms of Service &amp; Cookie Policy</h1>
            <p class="bw-subtitle">The&nbsp;&nbsp;Covenant&nbsp;&nbsp;Agreement</p>
          </div>

          <div class="bw-tos-content">
            <section class="bw-tos-section">
              <h2 class="bw-tos-heading">1. Terms of Service</h2>
              
              <h3 class="bw-tos-subheading">1.1 Acceptance of Terms</h3>
              <p class="bw-tos-text">
                By accessing and using Bloodwave, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to these terms, please do not use our service.
              </p>

              <h3 class="bw-tos-subheading">1.2 Use of Service</h3>
              <p class="bw-tos-text">
                You agree to use Bloodwave only for lawful purposes and in a way that does not infringe the rights of, restrict, 
                or inhibit anyone else's use and enjoyment of the service. Prohibited behavior includes harassing or causing 
                distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal 
                flow of dialogue within our service.
              </p>

              <h3 class="bw-tos-subheading">1.3 User Account</h3>
              <p class="bw-tos-text">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
                responsibility for all activities that occur under your account. We reserve the right to refuse service, 
                terminate accounts, or remove or edit content at our sole discretion.
              </p>

              <h3 class="bw-tos-subheading">1.4 Intellectual Property</h3>
              <p class="bw-tos-text">
                The service and its original content, features, and functionality are and will remain the exclusive property 
                of Bloodwave and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>

              <h3 class="bw-tos-subheading">1.5 Termination</h3>
              <p class="bw-tos-text">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason 
                whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section class="bw-tos-section">
              <h2 class="bw-tos-heading">2. Cookie Policy</h2>
              
              <h3 class="bw-tos-subheading">2.1 What Are Cookies</h3>
              <p class="bw-tos-text">
                Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored 
                in your web browser and allows the service or a third-party to recognize you and make your next visit easier 
                and the service more useful to you.
              </p>

              <h3 class="bw-tos-subheading">2.2 How We Use Cookies</h3>
              <p class="bw-tos-text">
                When you use and access Bloodwave, we may place cookie files in your web browser. We use cookies for the 
                following purposes:
              </p>
              <ul class="bw-tos-list">
                <li>To enable certain functions of the service</li>
                <li>To provide analytics and track usage patterns</li>
                <li>To store your preferences and settings</li>
                <li>To enable authentication and maintain your session</li>
              </ul>

              <h3 class="bw-tos-subheading">2.3 Types of Cookies We Use</h3>
              <p class="bw-tos-text">
                <strong>Essential Cookies:</strong> These cookies are necessary for the service to function and cannot be 
                switched off in our systems. They are usually only set in response to actions made by you which amount to 
                a request for services, such as setting your privacy preferences, logging in, or filling in forms.
              </p>
              <p class="bw-tos-text">
                <strong>Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can 
                measure and improve the performance of our site. They help us to know which pages are the most and least 
                popular and see how visitors move around the site.
              </p>

              <h3 class="bw-tos-subheading">2.4 Your Choices Regarding Cookies</h3>
              <p class="bw-tos-text">
                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the 
                help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, 
                you might not be able to use all of the features we offer.
              </p>
            </section>

            <section class="bw-tos-section">
              <h2 class="bw-tos-heading">3. Changes to This Agreement</h2>
              <p class="bw-tos-text">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide 
                notice of any changes by posting the new Terms on this page. Your continued use of the service after any 
                such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section class="bw-tos-section">
              <h2 class="bw-tos-heading">4. Contact Us</h2>
              <p class="bw-tos-text">
                If you have any questions about these Terms or our Cookie Policy, please contact us through our support channels.
              </p>
            </section>

            <div class="bw-footer-link" style="margin-top: 2rem; text-align: center;">
              <a href="${ctaHref}" data-link class="bw-btn" style="display: inline-block; margin-top: 1rem;">
                <div class="bw-btn-shimmer"></div>
                <span class="bw-btn-text">${ctaLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initToSCanvas();
  spawnToSParticles();
}

/* ============================================================
   CANVAS – minimal star field for ToS page
   ============================================================ */
function initToSCanvas() {
  const canvas = document.getElementById('tos-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let stars = [];
  let animId;

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.02 + 0.003,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        isRed: Math.random() < 0.08,
        isGold: Math.random() < 0.05
      });
    }
  }

  requestAnimationFrame(() => {
    measure();
    initStars();

    window.addEventListener('resize', () => {
      measure();
      initStars();
    });

    function draw() {
      if (!document.getElementById('tos-canvas')) {
        cancelAnimationFrame(animId);
        return;
      }
      
      ctx.clearRect(0, 0, W, H);

      stars.forEach((s) => {
        s.flicker += s.flickerSpeed;
        const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.flicker));
        
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.isRed ? '#CC1A1A' : s.isGold ? '#D4AF37' : '#FFE8D8';
        ctx.fill();
        ctx.globalAlpha = 1;

        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0) s.x = W;
        if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H;
        if (s.y > H) s.y = 0;
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
  });
}

function spawnToSParticles() {
  const root = document.querySelector('.bw-root');
  if (!root) return;

  for (let i = 0; i < 12; i++) {
    const p        = document.createElement('div');
    p.className    = 'bw-particle';
    const size     = Math.random() * 2 + 0.4;
    const delay    = Math.random() * 15;
    const duration = 15 + Math.random() * 20;
    const drift    = (Math.random() - 0.5) * 80;
    const isRed    = Math.random() < 0.25;
    const isGold   = !isRed && Math.random() < 0.12;
    const col      = isRed  ? 'rgba(192,57,43,0.5)'
                   : isGold ? 'rgba(212,175,55,0.35)'
                   :          'rgba(255,230,210,0.25)';

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

