let canvas = null;
let ctx = null;
let width = 0;
let height = 0;
let stars = [];
let started = false;
let enabled = true;
let resizeFrameId = 0;
let resizeSettleTimeoutId = 0;
let resizeActiveUntil = 0;
let lastResizeDrawTime = 0;

function measureCanvas() {
  if (!canvas || !ctx) return;

  const nextWidth = Math.max(1, window.innerWidth);
  const nextHeight = Math.max(1, window.innerHeight);
  const prevWidth = width;
  const prevHeight = height;
  const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);

  width = nextWidth;
  height = nextHeight;

  canvas.width = Math.round(nextWidth * devicePixelRatio);
  canvas.height = Math.round(nextHeight * devicePixelRatio);
  canvas.style.width = `${nextWidth}px`;
  canvas.style.height = `${nextHeight}px`;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  if (!stars.length || prevWidth <= 0 || prevHeight <= 0) return;

  const scaleX = nextWidth / prevWidth;
  const scaleY = nextHeight / prevHeight;

  stars.forEach((star) => {
    star.x *= scaleX;
    star.y *= scaleY;
  });
}

function initStars() {
  stars = [];
  for (let i = 0; i < 85; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    });
  }
}

function draw(now = performance.now()) {
  if (!ctx || !canvas) return;

  const resizing = now < resizeActiveUntil;
  if (resizing && now - lastResizeDrawTime < 33) {
    requestAnimationFrame(draw);
    return;
  }

  if (resizing) {
    lastResizeDrawTime = now;
  }

  stars.forEach((s) => {
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < 0) s.x = width;
    if (s.x > width) s.x = 0;
    if (s.y < 0) s.y = height;
    if (s.y > height) s.y = 0;
  });

  if (enabled) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgb(8,6,6)';
    ctx.fillRect(0, 0, width, height);

    stars.forEach((s) => {
      if (resizing) {
        ctx.fillStyle = `rgba(255,230,150,${Math.min(1, s.opacity + 0.2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      const glowRadius = s.r * 6;
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
      glow.addColorStop(0, `rgba(212,175,55,${Math.min(1, s.opacity * 0.75)})`);
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
  }

  requestAnimationFrame(draw);
}

function handleResize() {
  resizeActiveUntil = performance.now() + 180;

  if (resizeFrameId) {
    cancelAnimationFrame(resizeFrameId);
  }

  resizeFrameId = requestAnimationFrame(() => {
    resizeFrameId = 0;
    measureCanvas();
  });

  if (resizeSettleTimeoutId) {
    clearTimeout(resizeSettleTimeoutId);
  }

  resizeSettleTimeoutId = setTimeout(() => {
    resizeSettleTimeoutId = 0;
    resizeActiveUntil = 0;
    measureCanvas();
  }, 200);
}

function createCanvas() {
  canvas = document.createElement('canvas');
  canvas.id = 'bw-global-starfield';
  canvas.className = 'bw-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  ctx = canvas.getContext('2d');
  measureCanvas();
  initStars();

  window.addEventListener('resize', handleResize, { passive: true });
}

export function ensureGlobalStarfield() {
  if (!canvas || !canvas.isConnected) {
    createCanvas();
  }

  if (!started) {
    started = true;
    requestAnimationFrame(draw);
  }
}

export function setGlobalStarfieldEnabled(nextEnabled) {
  enabled = Boolean(nextEnabled);
  if (canvas) {
    canvas.style.opacity = enabled ? '1' : '0';
  }
}
