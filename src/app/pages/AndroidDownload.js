import '../../styles/pages/AndroidDownload.css';
import { isLoggedIn } from '../services/auth.js';
import { ensureGlobalStarfield } from '../effects/global-starfield.js';

const APK_FILE_NAME = 'Project-Bloodwave-Android.apk';
const APK_PUBLIC_PATH = `https://github.com/zsoltikv/Project-Bloodwave/releases/download/APK/Project-Bloodwave.apk`;

export default function AndroidDownload(container) {
  const loggedIn = isLoggedIn();
  const backHref = loggedIn ? '/main' : '/login';
  const backLabel = loggedIn ? 'Back to Dashboard' : 'Back to Login';

  container.innerHTML = `
    <div class="bw-root bw-apk-root">
      <div class="bw-glow-center"></div>

      <div class="bw-card bw-apk-card">
        <div class="bw-card-inner bw-apk-card-inner">
          <div class="bw-corner bw-corner--tl"></div>
          <div class="bw-corner bw-corner--tr"></div>
          <div class="bw-corner bw-corner--bl"></div>
          <div class="bw-corner bw-corner--br"></div>

          <div class="bw-header bw-apk-header">
            <div class="bw-ornament">
              <div class="bw-ornament-line"></div>
              <div class="bw-ornament-diamond"></div>
              <div class="bw-ornament-line"></div>
            </div>
            <h1 class="bw-title">Android Download</h1>
            <p class="bw-subtitle">Project Bloodwave Mobile Installer</p>
          </div>

          <div class="bw-apk-content">
            <div class="bw-apk-top-grid">
              <section class="bw-apk-hero">
                <h2 class="bw-apk-heading">Before You Install</h2>
                <p class="bw-apk-text">
                  Check these quick requirements before installing to avoid common setup errors on Android devices.
                </p>
                <div class="bw-apk-badges" aria-label="Package details">
                  <span class="bw-apk-badge">Android 6.0+</span>
                  <span class="bw-apk-badge">Unknown Apps Enabled</span>
                  <span class="bw-apk-badge">Free Storage Available</span>
                </div>
              </section>

              <aside class="bw-apk-download-card" aria-label="Download panel">
                <p class="bw-apk-kicker">Latest Build</p>
                <p class="bw-apk-file">${APK_FILE_NAME}</p>

                <a class="bw-btn bw-apk-btn" href="${APK_PUBLIC_PATH}" download="${APK_FILE_NAME}">
                  <div class="bw-btn-shimmer"></div>
                  <span class="bw-btn-text">Download APK</span>
                </a>

                <p class="bw-apk-note" id="bw-apk-status">Checking APK availability...</p>
              </aside>
            </div>

            <div class="bw-apk-grid">
              <section class="bw-apk-panel">
                <h2 class="bw-apk-heading">Installation Steps</h2>
                <ol class="bw-apk-step-list">
                  <li class="bw-apk-step-item">
                    <span class="bw-apk-step-index">1</span>
                    <p>Open the downloaded file in the Android Downloads app or notification panel.</p>
                  </li>
                  <li class="bw-apk-step-item">
                    <span class="bw-apk-step-index">2</span>
                    <p>When prompted, allow installation from unknown sources for your browser or file manager.</p>
                  </li>
                  <li class="bw-apk-step-item">
                    <span class="bw-apk-step-index">3</span>
                    <p>Tap Install and wait until setup is complete.</p>
                  </li>
                  <li class="bw-apk-step-item">
                    <span class="bw-apk-step-index">4</span>
                    <p>Launch Project: Bloodwave and sign in with your existing account.</p>
                  </li>
                </ol>
              </section>

              <section class="bw-apk-panel bw-apk-panel-warn">
                <h2 class="bw-apk-heading">Troubleshooting</h2>
                <ul class="bw-apk-list">
                  <li>If you get "App not installed", remove the previous build and install again.</li>
                  <li>If install is blocked, check permission for unknown apps in Android security settings.</li>
                  <li>Make sure you have enough free storage before downloading and installing.</li>
                  <li>If download is interrupted, delete the partial file and download again.</li>
                  <li>If your phone flags the app as unsafe, continue only if the APK came from this official page.</li>
                  <li>If it crashes, reinstall after a reboot.</li>
                </ul>
              </section>
            </div>

            <div class="bw-apk-footer-link">
              <a href="${backHref}" data-link class="bw-btn bw-apk-back-btn">
                <div class="bw-btn-shimmer"></div>
                <span class="bw-btn-text">${backLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  ensureGlobalStarfield();
  updateApkAvailability(container);
}

async function updateApkAvailability(container) {
  const statusEl = container.querySelector('#bw-apk-status');
  const downloadBtn = container.querySelector('.bw-apk-btn');
  if (!statusEl || !downloadBtn) return;

  try {
    const response = await fetch('https://api.github.com/repos/zsoltikv/Project-Bloodwave/releases/latest', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    
    if (response.ok) {
      statusEl.textContent = 'APK is available on GitHub releases and ready to download.';
      statusEl.classList.add('ok');
      downloadBtn.classList.remove('bw-apk-disabled');
      return;
    }

    statusEl.textContent = 'APK is currently unavailable. Please try again later.';
    statusEl.classList.add('warn');
    downloadBtn.classList.add('bw-apk-disabled');
    downloadBtn.addEventListener('click', (e) => e.preventDefault(), { once: false });
  } catch {
    statusEl.textContent = 'APK is currently unavailable. Please try again later.';
    statusEl.classList.add('warn');
    downloadBtn.classList.add('bw-apk-disabled');
    downloadBtn.addEventListener('click', (e) => e.preventDefault(), { once: false });
  }
}
