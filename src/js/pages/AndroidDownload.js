import '../../css/pages/AndroidDownload.css';
import { isLoggedIn } from '../auth.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import {
  Box,
  computed,
  Link,
  List,
  ListItem,
  Paragraph,
  Subtitle,
  Title,
  page,
  signal,
  setupGroup,
  setupState,
} from '../feather/index.js';

const APK_FILE_NAME = 'Project-Bloodwave-Android.apk';
const APK_PUBLIC_PATH = 'https://github.com/zsoltikv/Project-Bloodwave/releases/download/APK/Project-Bloodwave.apk';

function createParticles(count = 18) {
  return Array.from({ length: count }, () => {
    const size = Math.random() * 2.2 + 0.4;
    const delay = Math.random() * 20;
    const duration = 18 + Math.random() * 22;
    const drift = (Math.random() - 0.5) * 90;
    const isRed = Math.random() < 0.28;
    const isGold = !isRed && Math.random() < 0.15;
    const background = isRed
      ? 'rgba(192,57,43,0.55)'
      : isGold
        ? 'rgba(212,175,55,0.4)'
        : 'rgba(255,230,210,0.28)';

    return {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      bottom: '-12px',
      background,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      '--drift': `${drift}px`,
    };
  });
}

const bloodwaveParticles = (style) => Box().className('bw-particle').style(style);

function DividerOrnament() {
  return Box(
    Box().className('bw-ornament-line'),
    Box().className('bw-ornament-diamond'),
    Box().className('bw-ornament-line'),
  ).className('bw-ornament');
}

function ApkBadge(text) {
  return Box(text).className('bw-apk-badge');
}

function StepItem(index, text) {
  return ListItem(
    Box(String(index)).className('bw-apk-step-index'),
    Paragraph(text),
  ).className('bw-apk-step-item');
}

function DownloadStatus(state) {
  return Paragraph()
    .className('bw-apk-note')
    .text(() => state.text.get())
    .bindClass('ok', () => state.ok.get())
    .bindClass('warn', () => state.warn.get())
    .id('bw-apk-status');
}

const AndroidDownload = page({
  name: 'AndroidDownload',

  setup() {
    ensureGlobalStarfield();

    const loggedIn = isLoggedIn();
    const particles = createParticles();
    const statusText = signal('Checking APK availability...');
    const available = signal(true);

    void updateApkAvailability(statusText, available);

    return setupState(
      {
        particles,
      },
      setupGroup('cta', {
        backHref: loggedIn ? '/main' : '/login',
        backLabel: loggedIn ? 'Back to Dashboard' : 'Back to Login',
      }),
      setupGroup('apk', {
        fileName: APK_FILE_NAME,
        filePath: APK_PUBLIC_PATH,
        statusText,
        available,
        statusOk: computed(() => available.get()),
        statusWarn: computed(() => !available.get()),
        disabled: computed(() => !available.get()),
      }),
    );
  },

  render(ctx) {
    return Box(
      Box().className('bw-glow-center'),
      ...ctx.particles.map(bloodwaveParticles),
      Box(
        Box(
          Box().className('bw-corner bw-corner--tl'),
          Box().className('bw-corner bw-corner--tr'),
          Box().className('bw-corner bw-corner--bl'),
          Box().className('bw-corner bw-corner--br'),
          Box(
            DividerOrnament(),
            Title('Android Download').className('bw-title'),
            Subtitle('Project Bloodwave Mobile Installer').className('bw-subtitle'),
          ).className('bw-header bw-apk-header'),
          Box(
            Box(
              Box(
                Subtitle('Before You Install').level(2).className('bw-apk-heading'),
                Paragraph('Check these quick requirements before installing to avoid common setup errors on Android devices.').className('bw-apk-text'),
                Box(
                  ApkBadge('Android 6.0+'),
                  ApkBadge('Unknown Apps Enabled'),
                  ApkBadge('Free Storage Available'),
                ).className('bw-apk-badges').attr('aria-label', 'Package details'),
              ).className('bw-apk-hero'),
              Box(
                Paragraph('Latest Build').className('bw-apk-kicker'),
                Paragraph(ctx.apk.fileName).className('bw-apk-file'),
                Link(
                  Box().className('bw-btn-shimmer'),
                  Box('Download APK').className('bw-btn-text'),
                )
                  .href(ctx.apk.filePath)
                  .attr('download', ctx.apk.fileName)
                  .className('bw-btn bw-apk-btn')
                  .bindClass('bw-apk-disabled', () => ctx.apk.disabled.get()),
                DownloadStatus({
                  text: ctx.apk.statusText,
                  ok: ctx.apk.statusOk,
                  warn: ctx.apk.statusWarn,
                }),
              ).className('bw-apk-download-card').attr('aria-label', 'Download panel'),
            ).className('bw-apk-top-grid'),
            Box(
              Box(
                Subtitle('Installation Steps').level(2).className('bw-apk-heading'),
                List(
                  StepItem(1, 'Open the downloaded file in the Android Downloads app or notification panel.'),
                  StepItem(2, 'When prompted, allow installation from unknown sources for your browser or file manager.'),
                  StepItem(3, 'Tap Install and wait until setup is complete.'),
                  StepItem(4, 'Launch Bloodwave and sign in with your existing account.'),
                ).className('bw-apk-step-list'),
              ).className('bw-apk-panel'),
              Box(
                Subtitle('Troubleshooting').level(2).className('bw-apk-heading'),
                List(
                  ListItem('If you get "App not installed", remove the previous build and install again.'),
                  ListItem('If install is blocked, check permission for unknown apps in Android security settings.'),
                  ListItem('Make sure you have enough free storage before downloading and installing.'),
                  ListItem('If download is interrupted, delete the partial file and download again.'),
                  ListItem('If your phone flags the app as unsafe, continue only if the APK came from this official page.'),
                  ListItem('If it crashes, reinstall after a reboot.'),
                ).className('bw-apk-list'),
              ).className('bw-apk-panel bw-apk-panel-warn'),
            ).className('bw-apk-grid'),
            Box(
              Link(
                Box().className('bw-btn-shimmer'),
                Box(ctx.cta.backLabel).className('bw-btn-text'),
              )
                .href(ctx.cta.backHref)
                .dataLink()
                .className('bw-btn bw-apk-back-btn'),
            ).className('bw-apk-footer-link'),
          ).className('bw-apk-content'),
        ).className('bw-card-inner bw-apk-card-inner'),
      ).className('bw-card bw-apk-card'),
    ).className('bw-root bw-apk-root');
  },
});

async function updateApkAvailability(statusText, available) {
  try {
    const response = await fetch('https://api.github.com/repos/zsoltikv/Project-Bloodwave/releases/latest', {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (response.ok) {
      statusText.set('APK is available on GitHub releases and ready to download.');
      available.set(true);
      return;
    }
  } catch {}

  statusText.set('APK is currently unavailable. Please try again later.');
  available.set(false);
}

export default AndroidDownload;
