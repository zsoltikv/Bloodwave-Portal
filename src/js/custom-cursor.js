const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary, label, [data-link]';
const TRAIL_LENGTH = 10;
const MOBILE_UA_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

let cursorRoot = null;
let trailLayerEl = null;
let trailDots = [];
let trailPoints = [];
let frameId = 0;
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;
let pointerActive = false;
let listenersController = null;

function supportsFancyCursor() {
  if (isPhoneDevice()) return false;
  return window.matchMedia('(pointer: fine)').matches
    && window.matchMedia('(hover: hover)').matches
    && !window.matchMedia('(max-width: 900px)').matches;
}

function isPhoneDevice() {
  const uaDataMobile = navigator.userAgentData?.mobile === true;
  const userAgent = navigator.userAgent || '';
  if (uaDataMobile || MOBILE_UA_REGEX.test(userAgent)) return true;

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const anyCoarsePointer = window.matchMedia('(any-pointer: coarse)').matches;
  const noHover = window.matchMedia('(hover: none)').matches;
  const anyNoHover = window.matchMedia('(any-hover: none)').matches;
  const smallViewport = window.matchMedia('(max-width: 1024px)').matches;
  const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;

  return hasTouch && (coarsePointer || anyCoarsePointer || noHover || anyNoHover) && smallViewport;
}

function teardownCustomCursor() {
  if (listenersController) {
    listenersController.abort();
    listenersController = null;
  }

  document.documentElement.classList.remove('bw-cursor-enabled');

  if (frameId) {
    cancelAnimationFrame(frameId);
    frameId = 0;
  }

  if (cursorRoot) {
    cursorRoot.remove();
    cursorRoot = null;
  }

  if (trailLayerEl) {
    trailLayerEl.remove();
    trailLayerEl = null;
  }

  trailDots = [];
  trailPoints = [];
  pointerActive = false;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function createCursorElements() {
  const root = document.createElement('div');
  root.className = 'bw-cursor';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <span class="bw-cursor__aura"></span>
    <span class="bw-cursor__ring"></span>
    <span class="bw-cursor__diamond"></span>
    <span class="bw-cursor__core"></span>
    <span class="bw-cursor__ray bw-cursor__ray--n"></span>
    <span class="bw-cursor__ray bw-cursor__ray--e"></span>
    <span class="bw-cursor__ray bw-cursor__ray--s"></span>
    <span class="bw-cursor__ray bw-cursor__ray--w"></span>
  `;

  const trailLayer = document.createElement('div');
  trailLayer.className = 'bw-cursor-trail';
  trailLayer.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < TRAIL_LENGTH; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'bw-cursor-trail-dot';
    trailLayer.appendChild(dot);
    trailDots.push(dot);
    trailPoints.push({ x: 0, y: 0 });
  }

  document.body.append(root, trailLayer);
  return { root, trailLayer };
}

function updateTrail() {
  if (!trailDots.length) return;

  trailPoints[0].x = currentX;
  trailPoints[0].y = currentY;

  for (let i = 1; i < TRAIL_LENGTH; i += 1) {
    trailPoints[i].x += (trailPoints[i - 1].x - trailPoints[i].x) * 0.33;
    trailPoints[i].y += (trailPoints[i - 1].y - trailPoints[i].y) * 0.33;
  }

  for (let i = 0; i < TRAIL_LENGTH; i += 1) {
    const dot = trailDots[i];
    const point = trailPoints[i];
    const ratio = 1 - i / TRAIL_LENGTH;
    const scale = 0.32 + ratio * 0.92;
    const opacity = pointerActive ? ratio * 0.5 : 0;

    dot.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
    dot.style.opacity = opacity.toFixed(3);
  }
}

function animate() {
  currentX += (targetX - currentX) * 0.18;
  currentY += (targetY - currentY) * 0.18;

  if (cursorRoot) {
    cursorRoot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  }

  updateTrail();

  frameId = requestAnimationFrame(animate);
}

function setInteractiveState(target) {
  if (!cursorRoot) return;
  const interactive = target?.closest?.(INTERACTIVE_SELECTOR);
  cursorRoot.classList.toggle('bw-cursor--active', Boolean(interactive));
}

export default function ensureCustomCursor() {
  if (!supportsFancyCursor()) {
    teardownCustomCursor();
    return;
  }

  if (cursorRoot) return;

  const { root, trailLayer } = createCursorElements();
  cursorRoot = root;
  trailLayerEl = trailLayer;
  listenersController = new AbortController();
  document.documentElement.classList.add('bw-cursor-enabled');

  const useTrail = !prefersReducedMotion();
  if (!useTrail) {
    trailDots = [];
    trailPoints = [];
  }

  const handlePointerMove = (event) => {
    if (!cursorRoot) return;

    pointerActive = true;
    targetX = event.clientX;
    targetY = event.clientY;

    if (!cursorRoot.classList.contains('bw-cursor--visible')) {
      currentX = targetX;
      currentY = targetY;
      for (let i = 0; i < trailPoints.length; i += 1) {
        trailPoints[i].x = targetX;
        trailPoints[i].y = targetY;
      }
      cursorRoot.classList.add('bw-cursor--visible');
    }

    setInteractiveState(event.target);
  };

  const handlePointerDown = (event) => {
    if (!cursorRoot || !pointerActive) return;
    setInteractiveState(event.target);
    cursorRoot.classList.add('bw-cursor--pressed');
  };

  const clearPressed = () => {
    if (!cursorRoot) return;
    cursorRoot.classList.remove('bw-cursor--pressed');
  };

  const handlePointerLeaveWindow = (event) => {
    if (!cursorRoot) return;
    if (event.relatedTarget !== null) return;
    pointerActive = false;
    cursorRoot.classList.remove('bw-cursor--visible', 'bw-cursor--active', 'bw-cursor--pressed');
  };

  const handleVisibility = () => {
    if (!cursorRoot) return;
    if (!document.hidden) return;
    pointerActive = false;
    cursorRoot.classList.remove('bw-cursor--visible', 'bw-cursor--active', 'bw-cursor--pressed');
  };

  document.addEventListener('pointermove', handlePointerMove, { passive: true, signal: listenersController.signal });
  document.addEventListener('mouseover', (event) => setInteractiveState(event.target), { passive: true, signal: listenersController.signal });
  document.addEventListener('pointerdown', handlePointerDown, { passive: true, signal: listenersController.signal });
  document.addEventListener('pointerup', clearPressed, { passive: true, signal: listenersController.signal });
  window.addEventListener('mouseout', handlePointerLeaveWindow, { signal: listenersController.signal });
  document.addEventListener('visibilitychange', handleVisibility, { signal: listenersController.signal });

  animate();

  window.addEventListener('beforeunload', () => {
    if (frameId) cancelAnimationFrame(frameId);
  }, { signal: listenersController.signal });

  window.addEventListener('resize', () => {
    if (!supportsFancyCursor()) {
      teardownCustomCursor();
    }
  }, { passive: true, signal: listenersController.signal });
}
