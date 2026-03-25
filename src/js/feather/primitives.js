import {
  HStack,
  Spacer,
  VStack,
  createPrimitive,
  setPrimitiveState,
} from './core.js';
import { cx, token } from './theme.js';
import { read } from './state.js';

function resolveSurfaceTone(node, value) {
  return setPrimitiveState(node, {
    tone: read(value),
  });
}

function resolveScreenToneClasses(tone = 'default') {
  if (tone === 'muted') {
    return cx(token('background.muted'), token('text.base'));
  }

  if (tone === 'accent') {
    return cx(token('background.accent'), token('text.inverse'));
  }

  return cx(token('background.app'), token('text.base'));
}

function resolveCardToneClasses(tone = 'default') {
  if (tone === 'accent') {
    return cx(token('background.accent'), token('text.inverse'), token('border.accent'));
  }

  if (tone === 'danger') {
    return cx(token('background.surface'), token('text.danger'), token('border.danger'));
  }

  if (tone === 'success') {
    return cx(token('background.surface'), token('text.success'), token('border.success'));
  }

  if (tone === 'muted') {
    return cx(token('background.muted'), token('text.base'), token('border.base'));
  }

  return cx(token('background.surface'), token('text.base'), token('border.base'));
}

function resolveNavbarToneClasses(tone = 'default') {
  if (tone === 'muted') {
    return cx(token('background.muted'), token('text.base'), token('border.base'));
  }

  if (tone === 'accent') {
    return cx(token('background.accent'), token('text.inverse'), token('border.accent'));
  }

  return cx(token('background.surface'), token('text.base'), token('border.base'));
}

export const Screen = createPrimitive('main', {
  kind: 'screen',
  state: {
    tone: 'default',
  },
  resolveClassName: (state) => cx(
    token('surface.screen'),
    resolveScreenToneClasses(state.tone),
  ),
  modifiers: {
    tone: resolveSurfaceTone,
  },
  shortcuts: {
    centered: (view) => view.tw('flex flex-col').centered(),
  },
});

export const Card = createPrimitive('article', {
  kind: 'card',
  state: {
    tone: 'default',
    elevated: false,
  },
  resolveClassName: (state) => cx(
    token('surface.card'),
    resolveCardToneClasses(state.tone),
    state.elevated ? 'shadow-xl' : 'shadow-sm',
  ),
  modifiers: {
    tone: resolveSurfaceTone,
  },
  shortcuts: {
    elevated: (view) => setPrimitiveState(view, { elevated: true }),
  },
});

export const Panel = createPrimitive('section', {
  kind: 'panel',
  state: {
    tone: 'default',
  },
  resolveClassName: (state) => cx(
    token('surface.panel'),
    resolveCardToneClasses(state.tone),
  ),
  modifiers: {
    tone: resolveSurfaceTone,
  },
});

export const Navbar = createPrimitive('nav', {
  kind: 'navbar',
  state: {
    tone: 'default',
  },
  resolveClassName: (state) => cx(
    token('surface.navbar'),
    resolveNavbarToneClasses(state.tone),
  ),
  modifiers: {
    tone: resolveSurfaceTone,
  },
  shortcuts: {
    sticky: (view) => view.tw('sticky top-0 z-40'),
  },
});

export function NavbarBrand(...args) {
  return HStack(...args).align('center').gap(3);
}

export function NavbarMenu(...args) {
  return HStack(...args).align('center').gap(4);
}

export function NavbarSpacer(props = {}) {
  return Spacer(props);
}

export function PanelGroup(...args) {
  return VStack(...args).gap(4);
}
