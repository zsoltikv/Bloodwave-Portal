import { beginReactiveCreationPhase, effect, endReactiveCreationPhase, isReactive, read, untrack } from './state.js';
import { cx, token } from './theme.js';

const FRAGMENT = Symbol('feather.fragment');
const DYNAMIC = Symbol('feather.dynamic');
const FEATHER_RUNTIME_STYLE_ID = 'feather-runtime-styles';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SVG_TAGS = new Set([
  'svg',
  'path',
  'g',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
  'defs',
  'clipPath',
  'mask',
  'linearGradient',
  'radialGradient',
  'stop',
  'use',
  'symbol',
]);

function ensureRuntimeStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(FEATHER_RUNTIME_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = FEATHER_RUNTIME_STYLE_ID;
  style.textContent = `
    .feather-vstack{display:flex;flex-direction:column}
    .feather-hstack{display:flex;flex-direction:row}
    .feather-zstack{display:grid}
    .feather-zstack>*{grid-area:1/1}
    .feather-spacer{flex:1 1 auto}
    .feather-field{display:flex;flex-direction:column;gap:.5rem}
    .feather-field-control{position:relative}
    .feather-field-error{font-size:.875rem;line-height:1.25rem;color:#b91c1c}
    .feather-field-hint{font-size:.875rem;line-height:1.25rem;color:#64748b}
    .feather-checkbox-field{display:flex;flex-direction:column;gap:.5rem}
    .feather-animate-enter{animation:feather-enter .22s cubic-bezier(.22,1,.36,1)}
    .feather-animate-fade{animation:feather-fade .18s ease-out}
    .feather-animate-rise{animation:feather-rise .2s cubic-bezier(.22,1,.36,1)}
    @keyframes feather-enter{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes feather-fade{from{opacity:0}to{opacity:1}}
    @keyframes feather-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  `;

  document.head.appendChild(style);
}

function isDomNode(value) {
  return typeof Node !== 'undefined' && value instanceof Node;
}

function isPlainObject(value) {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  if (isDomNode(value)) return false;
  if (value.__feather === true) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

function isViewNode(value) {
  return Boolean(value) && typeof value === 'object' && value.__feather === true;
}

function isDynamicNode(value) {
  return Boolean(value) && typeof value === 'object' && value.__featherDynamic === true;
}

function isFormObject(value) {
  return Boolean(value) && typeof value === 'object' && value.__featherForm === true;
}

function isFieldObject(value) {
  return Boolean(value) && typeof value === 'object' && value.__featherField === true;
}

function flattenValue(value) {
  if (Array.isArray(value)) {
    return value.map(flattenValue).join('');
  }

  if (value === null || value === undefined || value === false) {
    return '';
  }

  if (isReactive(value)) {
    return flattenValue(value.get());
  }

  return String(value);
}

function normalizeChildren(children) {
  const normalized = [];

  children.forEach((child) => {
    if (Array.isArray(child)) {
      normalized.push(...normalizeChildren(child));
      return;
    }

    if (child === null || child === undefined || child === false) {
      return;
    }

    normalized.push(child);
  });

  return normalized;
}

function parseArguments(args) {
  if (args.length === 0) {
    return { props: {}, children: [] };
  }

  const [first, ...rest] = args;
  if (isPlainObject(first)) {
    return {
      props: { ...first },
      children: normalizeChildren(rest),
    };
  }

  return {
    props: {},
    children: normalizeChildren(args),
  };
}

function composeHandlers(...handlers) {
  return function composedHandler(event, ...rest) {
    handlers.filter((handler) => typeof handler === 'function').forEach((handler) => {
      handler(event, ...rest);
    });
  };
}

function readBoundValue(binding) {
  if (isFieldObject(binding)) {
    return binding.value;
  }

  return binding;
}

function resolveModelBindingProps(props = {}) {
  const { model, field, onInput, onChange, type, checked, value, ...rest } = props;
  const binding = field || model;

  if (!binding) {
    return props;
  }

  const nextType = isReactive(type) ? type : read(type);
  const isCheckboxLike = nextType === 'checkbox' || nextType === 'radio';

  if (isCheckboxLike) {
    return mergeProps(rest, {
      type: nextType,
      checked: field ? field.value : (model || checked),
      onChange: composeHandlers((event) => {
        if (binding?.set) {
          binding.set(Boolean(event.target.checked));
        }

        if (field?.touch) {
          field.touch();
        }
      }, onChange),
      attrs: field?.invalid ? { 'aria-invalid': field.invalid } : null,
    });
  }

  return mergeProps(rest, {
    type: nextType,
    value: field ? field.value : (model || value),
    onInput: composeHandlers((event) => {
      if (binding?.set) {
        binding.set(event.target.value);
      }

      if (field?.touch) {
        field.touch();
      }
    }, onInput),
    onChange,
    attrs: field?.invalid ? { 'aria-invalid': field.invalid } : null,
  });
}

function resolveFormProps(props = {}) {
  const { form, onSubmit, ...rest } = props;

  if (!form) {
    return props;
  }

  return mergeProps(rest, {
    onSubmit: composeHandlers((event) => {
      form.submit(event);
    }, onSubmit),
    attrs: {
      novalidate: true,
    },
  });
}

function resolveSemanticClass(group, value, fallbackPrefix) {
  const resolvedValue = read(value);
  const semanticClass = token(`${group}.${resolvedValue}`);

  if (semanticClass) {
    return semanticClass;
  }

  if (!fallbackPrefix || resolvedValue === null || resolvedValue === undefined || resolvedValue === false) {
    return '';
  }

  return `${fallbackPrefix}-${resolvedValue}`;
}

function resolveTailwindSize(prefix, value) {
  if (value === 'fill' || value === 'full') return `${prefix}-full`;
  if (value === 'screen') return `${prefix}-screen`;
  if (value === 'fit') return `${prefix}-fit`;
  if (value === 'min') return `${prefix}-min`;
  if (value === 'max') return `${prefix}-max`;
  if (value === 'auto') return `${prefix}-auto`;
  return `${prefix}-${value}`;
}

function resolveTailwindSpace(prefix, value) {
  return `${prefix}-${value}`;
}

function resolveJustifyClass(value) {
  const map = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return map[value] || `justify-${value}`;
}

function resolveAlignClass(value) {
  const map = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  return map[value] || `items-${value}`;
}

function resolveAnimateClass(value = 'pulse') {
  const resolvedValue = read(value);
  const semanticAnimation = token(`animation.${resolvedValue}`);

  if (semanticAnimation) {
    return semanticAnimation;
  }

  if (String(resolvedValue).startsWith('animate-')) {
    return String(resolvedValue);
  }

  return `animate-${resolvedValue}`;
}

function runCleanups(cleanups) {
  while (cleanups.length > 0) {
    const cleanup = cleanups.pop();

    try {
      cleanup();
    } catch {
      // Best effort cleanup keeps navigation resilient.
    }
  }
}

function resolveTarget(target, container) {
  if (!target) return null;
  if (typeof target === 'string') {
    return container.querySelector(target) || document.querySelector(target);
  }

  return target;
}

function createNode(type, props = {}, children = [], meta = null) {
  return withModifiers({
    __feather: true,
    nodeType: type,
    nodeProps: props,
    children,
    meta,
  });
}

function scheduleFrame(callback) {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(callback);
  }

  return setTimeout(() => callback(Date.now()), 16);
}

function cancelFrame(handle) {
  if (typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(handle);
    return;
  }

  clearTimeout(handle);
}

function cloneMeta(meta, overrides = {}) {
  if (!meta && !overrides) {
    return null;
  }

  return {
    ...(meta || {}),
    ...(overrides || {}),
    state: {
      ...(meta?.state || {}),
      ...(overrides.state || {}),
    },
    modifiers: overrides.modifiers || meta?.modifiers,
    resolveClassName: overrides.resolveClassName || meta?.resolveClassName,
    resolveProps: overrides.resolveProps || meta?.resolveProps,
    prepareProps: overrides.prepareProps || meta?.prepareProps,
  };
}

function cloneNode(node, overrides = {}) {
  return withModifiers({
    ...node,
    nodeType: overrides.nodeType || node.nodeType,
    nodeProps: mergeProps(node.nodeProps, overrides.props || {}),
    children: overrides.children || node.children,
    meta: cloneMeta(node.meta, overrides.meta),
  });
}

function addClass(node, nextClassName) {
  return cloneNode(node, {
    props: {
      className: nextClassName,
    },
  });
}

function addStyles(node, nextStyles) {
  return cloneNode(node, {
    props: {
      style: nextStyles,
    },
  });
}

function addStyleEntries(node, nextStyles) {
  return cloneNode(node, {
    props: {
      style: mergeProps(
        node.nodeProps?.style ? { style: node.nodeProps.style } : null,
        { style: nextStyles },
      ).style,
    },
  });
}

function isPlainStyleObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function assignDirectionalStyles(property, key, value, styles) {
  const normalizedKey = String(key).toLowerCase();

  if (normalizedKey === 'x' || normalizedKey === 'horizontal' || normalizedKey === 'inline') {
    styles[`${property}Left`] = value;
    styles[`${property}Right`] = value;
    return;
  }

  if (normalizedKey === 'y' || normalizedKey === 'vertical' || normalizedKey === 'block') {
    styles[`${property}Top`] = value;
    styles[`${property}Bottom`] = value;
    return;
  }

  const aliases = {
    top: 'Top',
    right: 'Right',
    bottom: 'Bottom',
    left: 'Left',
    topleft: 'TopLeft',
    topright: 'TopRight',
    bottomleft: 'BottomLeft',
    bottomright: 'BottomRight',
    start: 'InlineStart',
    end: 'InlineEnd',
  };

  const suffix = aliases[normalizedKey] || `${String(key).charAt(0).toUpperCase()}${String(key).slice(1)}`;
  styles[`${property}${suffix}`] = value;
}

function resolveBoxModelStyles(property, args) {
  if (args.length === 0) {
    return {};
  }

  if (args.length === 1) {
    const [value] = args;

    if (isPlainStyleObject(value)) {
      const styles = {};
      Object.entries(value).forEach(([key, entryValue]) => {
        assignDirectionalStyles(property, key, entryValue, styles);
      });
      return styles;
    }

    return { [property]: value };
  }

  if (typeof args[0] === 'string') {
    const [key, value] = args;
    const styles = {};
    assignDirectionalStyles(property, key, value, styles);
    return styles;
  }

  return { [property]: args.map((value) => read(value)).join(' ') };
}

function resolveShadowValue(args) {
  if (args.length === 0) {
    return null;
  }

  if (args.length === 1) {
    const [value] = args;

    if (isPlainStyleObject(value)) {
      const {
        inset = false,
        x = 0,
        y = 0,
        blur = 0,
        spread = 0,
        color = 'currentColor',
      } = value;

      return `${inset ? 'inset ' : ''}${read(x)} ${read(y)} ${read(blur)} ${read(spread)} ${read(color)}`.trim();
    }

    return read(value);
  }

  return args.map((value) => read(value)).join(' ');
}

function addAttributes(node, nextAttributes) {
  return cloneNode(node, {
    props: {
      attrs: nextAttributes,
    },
  });
}

function setDatasetEntry(node, key, value) {
  return cloneNode(node, {
    props: {
      dataset: {
        [key]: value,
      },
    },
  });
}

function addEventHandler(node, eventName, handler) {
  const propName = `on${String(eventName).charAt(0).toUpperCase()}${String(eventName).slice(1)}`;
  return cloneNode(node, {
    props: {
      [propName]: composeHandlers(node.nodeProps?.[propName], handler),
    },
  });
}

function setNodeProp(node, key, value) {
  return cloneNode(node, {
    props: {
      [key]: value,
    },
  });
}

function setNodeProps(node, nextProps) {
  return cloneNode(node, {
    props: nextProps,
  });
}

function addModifierMethod(node, name, implementation) {
  Object.defineProperty(node, name, {
    value: implementation,
    enumerable: false,
    configurable: false,
    writable: false,
  });
}

function containsReactive(value) {
  if (isReactive(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(containsReactive);
  }

  if (value && typeof value === 'object') {
    return Object.values(value).some(containsReactive);
  }

  return false;
}

function unwrapReactive(value) {
  if (isReactive(value)) {
    return value.get();
  }

  if (Array.isArray(value)) {
    return value.map(unwrapReactive);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, unwrapReactive(entryValue)]),
    );
  }

  return value;
}

function applyPrimitiveModifier(node, name, value) {
  const modifier = node.meta?.modifiers?.[name];
  if (typeof modifier === 'function') {
    return modifier(node, value);
  }

  return node;
}

function updateNodeState(node, nextState) {
  return cloneNode(node, {
    meta: {
      state: nextState,
    },
  });
}

export function setPrimitiveState(node, nextState) {
  return updateNodeState(node, nextState);
}

function withModifiers(node) {
  addModifierMethod(node, 'prop', (key, value) => setNodeProp(node, key, value));
  addModifierMethod(node, 'props', (value) => setNodeProps(node, value));
  addModifierMethod(node, 'with', (value) => {
    if (typeof value === 'function') {
      return value(node);
    }

    if (value && typeof value === 'object') {
      return setNodeProps(node, value);
    }

    return node;
  });
  addModifierMethod(node, 'when', (condition, applyWhenTrue) => (read(condition)
    ? (typeof applyWhenTrue === 'function' ? applyWhenTrue(node) : node)
    : node));
  addModifierMethod(node, 'if', (condition, truthyValue, falsyValue = null) => {
    if (read(condition)) {
      return typeof truthyValue === 'function' ? truthyValue(node) : truthyValue || node;
    }

    return typeof falsyValue === 'function' ? falsyValue(node) : (falsyValue || node);
  });
  addModifierMethod(node, 'as', (value) => withModifiers({
    ...cloneNode(node),
    nodeType: read(value) || node.nodeType,
  }));
  addModifierMethod(node, 'bind', (key, value) => setNodeProp(node, key, value));
  addModifierMethod(node, 'bindAttr', (key, value) => addAttributes(node, { [key]: value }));
  addModifierMethod(node, 'aria', (key, value = true) => addAttributes(node, {
    [`aria-${String(key).replace(/^aria-/, '')}`]: value,
  }));
  addModifierMethod(node, 'ariaInvalid', (value = true) => node.aria('invalid', value));
  addModifierMethod(node, 'ariaLabel', (value) => node.aria('label', value));
  addModifierMethod(node, 'ariaDescribedBy', (value) => node.aria('describedby', value));
  addModifierMethod(node, 'className', (value) => addClass(node, value));
  addModifierMethod(node, 'class', (value) => addClass(node, value));
  addModifierMethod(node, 'bindClass', (name, condition = true) => addClass(node, {
    [name]: condition,
  }));
  addModifierMethod(node, 'toggleClass', (name, condition = true) => node.bindClass(name, condition));
  addModifierMethod(node, 'tw', (...values) => addClass(node, values.filter(Boolean).join(' ')));
  addModifierMethod(node, 'style', (value) => addStyles(node, value));
  addModifierMethod(node, 'bindStyle', (key, value) => addStyleEntries(node, { [key]: value }));
  addModifierMethod(node, 'padding', (...args) => addStyleEntries(node, resolveBoxModelStyles('padding', args)));
  addModifierMethod(node, 'paddingRight', (value) => addStyleEntries(node, { paddingRight: value }));
  addModifierMethod(node, 'paddingLeft', (value) => addStyleEntries(node, { paddingLeft: value }));
  addModifierMethod(node, 'paddingTop', (value) => addStyleEntries(node, { paddingTop: value }));
  addModifierMethod(node, 'paddingBottom', (value) => addStyleEntries(node, { paddingBottom: value }));
  addModifierMethod(node, 'margin', (...args) => addStyleEntries(node, resolveBoxModelStyles('margin', args)));
  addModifierMethod(node, 'gap', (value) => addStyleEntries(node, { gap: value }));
  addModifierMethod(node, 'rowGap', (value) => addStyleEntries(node, { rowGap: value }));
  addModifierMethod(node, 'columnGap', (value) => addStyleEntries(node, { columnGap: value }));
  addModifierMethod(node, 'textAlign', (value) => addStyleEntries(node, { textAlign: value }));
  addModifierMethod(node, 'justifyContent', (value) => addStyleEntries(node, { justifyContent: value }));
  addModifierMethod(node, 'alignItems', (value) => addStyleEntries(node, { alignItems: value }));
  addModifierMethod(node, 'alignSelf', (value) => addStyleEntries(node, { alignSelf: value }));
  addModifierMethod(node, 'placeItems', (value) => addStyleEntries(node, { placeItems: value }));
  addModifierMethod(node, 'displayStyle', (value) => addStyleEntries(node, { display: value }));
  addModifierMethod(node, 'position', (value) => addStyleEntries(node, { position: value }));
  addModifierMethod(node, 'top', (value) => addStyleEntries(node, { top: value }));
  addModifierMethod(node, 'right', (value) => addStyleEntries(node, { right: value }));
  addModifierMethod(node, 'bottom', (value) => addStyleEntries(node, { bottom: value }));
  addModifierMethod(node, 'left', (value) => addStyleEntries(node, { left: value }));
  addModifierMethod(node, 'inset', (value) => addStyleEntries(node, { inset: value }));
  addModifierMethod(node, 'overflow', (value) => addStyleEntries(node, { overflow: value }));
  addModifierMethod(node, 'overflowX', (value) => addStyleEntries(node, { overflowX: value }));
  addModifierMethod(node, 'overflowY', (value) => addStyleEntries(node, { overflowY: value }));
  addModifierMethod(node, 'opacityStyle', (value) => addStyleEntries(node, { opacity: value }));
  addModifierMethod(node, 'fontSize', (value) => addStyleEntries(node, { fontSize: value }));
  addModifierMethod(node, 'fontWeight', (value) => addStyleEntries(node, { fontWeight: value }));
  addModifierMethod(node, 'lineHeight', (value) => addStyleEntries(node, { lineHeight: value }));
  addModifierMethod(node, 'letterSpacing', (value) => addStyleEntries(node, { letterSpacing: value }));
  addModifierMethod(node, 'color', (value) => addStyleEntries(node, { color: value }));
  addModifierMethod(node, 'backgroundColor', (value) => addStyleEntries(node, { backgroundColor: value }));
  addModifierMethod(node, 'borderRadius', (...args) => addStyleEntries(node, resolveBoxModelStyles('borderRadius', args)));
  addModifierMethod(node, 'borderColorStyle', (value) => addStyleEntries(node, { borderColor: value }));
  addModifierMethod(node, 'borderWidth', (value) => addStyleEntries(node, { borderWidth: value }));
  addModifierMethod(node, 'boxShadow', (...args) => addStyleEntries(node, { boxShadow: resolveShadowValue(args) }));
  addModifierMethod(node, 'shadow', (...args) => addStyleEntries(node, { boxShadow: resolveShadowValue(args) }));
  addModifierMethod(node, 'transform', (value) => addStyleEntries(node, { transform: value }));
  addModifierMethod(node, 'transitionStyle', (value) => addStyleEntries(node, { transition: value }));
  addModifierMethod(node, 'pointerEvents', (value) => addStyleEntries(node, { pointerEvents: value }));
  addModifierMethod(node, 'cursor', (value) => addStyleEntries(node, { cursor: value }));
  addModifierMethod(node, 'id', (value) => setNodeProp(node, 'id', value));
  addModifierMethod(node, 'name', (value) => setNodeProp(node, 'name', value));
  addModifierMethod(node, 'type', (value) => setNodeProp(node, 'type', value));
  addModifierMethod(node, 'value', (value) => setNodeProp(node, 'value', value));
  addModifierMethod(node, 'checked', (value = true) => setNodeProp(node, 'checked', value));
  addModifierMethod(node, 'placeholder', (value) => setNodeProp(node, 'placeholder', value));
  addModifierMethod(node, 'autocomplete', (value) => setNodeProp(node, 'autocomplete', value));
  addModifierMethod(node, 'field', (value) => setNodeProp(node, 'field', value));
  addModifierMethod(node, 'model', (value) => setNodeProp(node, 'model', value));
  addModifierMethod(node, 'form', (value) => setNodeProp(node, 'form', value));
  addModifierMethod(node, 'href', (value) => setNodeProp(node, 'href', value));
  addModifierMethod(node, 'src', (value) => setNodeProp(node, 'src', value));
  addModifierMethod(node, 'alt', (value) => setNodeProp(node, 'alt', value));
  addModifierMethod(node, 'text', (value) => setNodeProp(node, 'text', value));
  addModifierMethod(node, 'html', (value) => setNodeProp(node, 'html', value));
  addModifierMethod(node, 'ref', (value) => setNodeProp(node, 'ref', value));
  addModifierMethod(node, 'dataLink', (value = true) => setNodeProp(node, 'dataLink', value));
  addModifierMethod(node, 'attr', (key, value) => addAttributes(node, { [key]: value }));
  addModifierMethod(node, 'attrs', (value) => addAttributes(node, value));
  addModifierMethod(node, 'data', (key, value) => setDatasetEntry(node, key, value));
  addModifierMethod(node, 'slot', (name, child = null) => {
    if (child && child.__feather === true) {
      return cloneNode(node, {
        children: [...node.children, child.attr('slot', name)],
      });
    }

    return node.attr('slot', name);
  });
  addModifierMethod(node, 'on', (eventName, handler) => addEventHandler(node, eventName, handler));
  addModifierMethod(node, 'onClick', (handler) => node.on('click', handler));
  addModifierMethod(node, 'onInput', (handler) => node.on('input', handler));
  addModifierMethod(node, 'onChange', (handler) => node.on('change', handler));
  addModifierMethod(node, 'onSubmit', (handler) => node.on('submit', handler));
  addModifierMethod(node, 'onEnter', (handler) => node.on('keydown', (event) => {
    if (event.key === 'Enter') {
      handler(event);
    }
  }));
  addModifierMethod(node, 'onEscape', (handler) => node.on('keydown', (event) => {
    if (event.key === 'Escape') {
      handler(event);
    }
  }));
  addModifierMethod(node, 'modifier', (fn) => (typeof fn === 'function' ? fn(node) : node));
  addModifierMethod(node, 'variant', (value) => applyPrimitiveModifier(node, 'variant', value));
  addModifierMethod(node, 'tone', (value) => applyPrimitiveModifier(node, 'tone', value));
  addModifierMethod(node, 'size', (value) => applyPrimitiveModifier(node, 'size', value));
  addModifierMethod(node, 'block', (value = true) => applyPrimitiveModifier(node, 'block', value));
  addModifierMethod(node, 'loading', (value = true) => applyPrimitiveModifier(node, 'loading', value));
  addModifierMethod(node, 'to', (value) => applyPrimitiveModifier(node, 'to', value));
  addModifierMethod(node, 'disabled', (value = true) => cloneNode(node, { props: { disabled: value } }));
  addModifierMethod(node, 'disabledWhen', (value = true) => node.disabled(value));
  addModifierMethod(node, 'submit', () => cloneNode(node, { props: { type: 'submit' } }));

  addModifierMethod(node, 'width', (value) => addClass(node, resolveTailwindSize('w', read(value))));
  addModifierMethod(node, 'height', (value) => addClass(node, resolveTailwindSize('h', read(value))));
  addModifierMethod(node, 'minWidth', (value) => addClass(node, resolveTailwindSize('min-w', read(value))));
  addModifierMethod(node, 'minHeight', (value) => addClass(node, resolveTailwindSize('min-h', read(value))));
  addModifierMethod(node, 'maxWidth', (value) => addClass(node, resolveTailwindSize('max-w', read(value))));
  addModifierMethod(node, 'maxHeight', (value) => addClass(node, resolveTailwindSize('max-h', read(value))));
  addModifierMethod(node, 'widthStyle', (value) => addStyleEntries(node, { width: value }));
  addModifierMethod(node, 'heightStyle', (value) => addStyleEntries(node, { height: value }));
  addModifierMethod(node, 'minWidthStyle', (value) => addStyleEntries(node, { minWidth: value }));
  addModifierMethod(node, 'minHeightStyle', (value) => addStyleEntries(node, { minHeight: value }));
  addModifierMethod(node, 'maxWidthStyle', (value) => addStyleEntries(node, { maxWidth: value }));
  addModifierMethod(node, 'maxHeightStyle', (value) => addStyleEntries(node, { maxHeight: value }));
  addModifierMethod(node, 'rounded', (value = 'md') => addClass(node, read(value) === 'none' ? 'rounded-none' : `rounded-${read(value)}`));
  addModifierMethod(node, 'background', (value) => addClass(node, resolveSemanticClass('background', value, 'bg')));
  addModifierMethod(node, 'textColor', (value) => addClass(node, resolveSemanticClass('text', value, 'text')));
  addModifierMethod(node, 'border', (value = true) => addClass(node, read(value) === true ? 'border' : `border-${read(value)}`));
  addModifierMethod(node, 'borderColor', (value) => addClass(node, resolveSemanticClass('border', value, 'border')));
  addModifierMethod(node, 'opacity', (value) => addClass(node, `opacity-${read(value)}`));
  addModifierMethod(node, 'display', (value) => addClass(node, String(read(value))));
  addModifierMethod(node, 'font', (value) => addClass(node, `font-${read(value)}`));
  addModifierMethod(node, 'textSize', (value) => addClass(node, `text-${read(value)}`));
  addModifierMethod(node, 'leading', (value) => addClass(node, `leading-${read(value)}`));
  addModifierMethod(node, 'tracking', (value) => addClass(node, `tracking-${read(value)}`));
  addModifierMethod(node, 'justify', (value) => addClass(node, resolveJustifyClass(read(value))));
  addModifierMethod(node, 'align', (value) => addClass(node, resolveAlignClass(read(value))));
  addModifierMethod(node, 'items', (value) => addClass(node, `items-${read(value)}`));
  addModifierMethod(node, 'self', (value) => addClass(node, `self-${read(value)}`));
  addModifierMethod(node, 'grow', (value = true) => addClass(node, read(value) === true ? 'grow' : `grow-${read(value)}`));
  addModifierMethod(node, 'shrink', (value = true) => addClass(node, read(value) === true ? 'shrink' : `shrink-${read(value)}`));
  addModifierMethod(node, 'transition', (value = 'colors') => addClass(node, `transition-${read(value) === 'colors' ? 'colors' : read(value)}`));
  addModifierMethod(node, 'duration', (value) => addClass(node, `duration-${read(value)}`));
  addModifierMethod(node, 'ease', (value = 'out') => addClass(node, String(read(value)).startsWith('ease-') ? String(read(value)) : `ease-${read(value)}`));
  addModifierMethod(node, 'animate', (value = 'pulse') => addClass(node, resolveAnimateClass(value)));
  addModifierMethod(node, 'absolute', () => addClass(node, 'absolute'));
  addModifierMethod(node, 'relative', () => addClass(node, 'relative'));
  addModifierMethod(node, 'fixed', () => addClass(node, 'fixed'));
  addModifierMethod(node, 'sticky', () => addClass(node, 'sticky top-0'));
  addModifierMethod(node, 'centered', () => addClass(node, 'items-center justify-center text-center'));
  addModifierMethod(node, 'hide', () => addClass(node, 'hidden'));
  addModifierMethod(node, 'show', () => addClass(node, 'block'));
  addModifierMethod(node, 'showWhen', (value = true) => setNodeProp(node, 'showWhen', value));
  addModifierMethod(node, 'hideWhen', (value = true) => setNodeProp(node, 'hideWhen', value));
  addModifierMethod(node, 'focusWhen', (value = true) => setNodeProp(node, 'focusWhen', value));

  return node;
}

export function mergeProps(...sources) {
  const nextProps = {};
  const style = {};
  const attrs = {};
  const dataset = {};
  const classNames = [];
  let hasReactiveClassName = false;

  sources
    .filter(Boolean)
    .forEach((source) => {
      Object.entries(source).forEach(([key, value]) => {
        if (value === undefined) return;

        if (key === 'class' || key === 'className') {
          classNames.push(value);
          if (containsReactive(value)) {
            hasReactiveClassName = true;
          }
          return;
        }

        if (key === 'style' && isPlainObject(value)) {
          Object.assign(style, value);
          return;
        }

        if (key === 'attrs' && isPlainObject(value)) {
          Object.assign(attrs, value);
          return;
        }

        if (key === 'dataset' && isPlainObject(value)) {
          Object.assign(dataset, value);
          return;
        }

        nextProps[key] = value;
      });
    });

  if (classNames.length > 0) {
    if (hasReactiveClassName) {
      nextProps.className = classNames;
    } else {
      const mergedClassName = cx(classNames);
      if (mergedClassName) {
        nextProps.className = mergedClassName;
      }
    }
  }

  if (Object.keys(style).length > 0) {
    nextProps.style = style;
  }

  if (Object.keys(attrs).length > 0) {
    nextProps.attrs = attrs;
  }

  if (Object.keys(dataset).length > 0) {
    nextProps.dataset = dataset;
  }

  delete nextProps.class;
  return nextProps;
}

export function splitProps(props, keys = []) {
  const picked = {};
  const rest = {};
  const keySet = new Set(keys);

  Object.entries(props || {}).forEach(([key, value]) => {
    if (keySet.has(key)) {
      picked[key] = value;
      return;
    }

    rest[key] = value;
  });

  return [picked, rest];
}

export function resolveComponentArgs(args, defaults = {}) {
  const { props, children } = parseArguments(Array.from(args));
  return {
    props: mergeProps(defaults, props),
    children,
  };
}

export function unstyled(component) {
  return function unstyledComponent(...args) {
    const { props, children } = resolveComponentArgs(args);
    return component(
      mergeProps({ unstyled: true }, props),
      ...children,
    );
  };
}

function appendChild(parent, child, context) {
  const node = createDomNode(child, context);
  if (node) {
    parent.appendChild(node);
  }
}

function clearBetween(start, end) {
  let current = start.nextSibling;

  while (current && current !== end) {
    const next = current.nextSibling;
    current.remove();
    current = next;
  }
}

function createReactiveRegion(getter, context) {
  const fragment = document.createDocumentFragment();
  const start = document.createComment('feather-reactive-start');
  const end = document.createComment('feather-reactive-end');

  fragment.appendChild(start);

  const initialValue = untrack(() => getter());
  const initialNode = createDomNode(initialValue, context);
  if (initialNode) {
    fragment.appendChild(initialNode);
  }

  fragment.appendChild(end);

  queueMicrotask(() => {
    if (!context?.cleanup) {
      return;
    }

    const stop = effect(() => {
      const parent = end.parentNode;
      if (!parent) {
        return;
      }

      clearBetween(start, end);
      const nextNode = createDomNode(getter(), context);
      if (nextNode) {
        parent.insertBefore(nextNode, end);
      }
    });

    context.cleanup(stop);
  });

  return fragment;
}

function createReactiveChildNode(binding, context) {
  return createReactiveRegion(() => binding.get(), context);
}

function createDynamicNode(node, context) {
  return createReactiveRegion(() => node.getter(), context);
}

function applyStyles(element, styles) {
  if (!styles || typeof styles !== 'object') return;

  Object.entries(styles).forEach(([property, value]) => {
    const nextValue = read(value);
    if (nextValue === null || nextValue === undefined) return;
    if (property.startsWith('--') || property.includes('-')) {
      element.style.setProperty(property, String(nextValue));
      return;
    }

    element.style[property] = String(nextValue);
  });
}

function applyClassName(element, value) {
  const classNames = cx(value);
  element.setAttribute('class', classNames);
}

function applyResolvedProp(element, key, nextValue, context) {
  if (key === 'checked') {
    element.checked = Boolean(nextValue);
    return;
  }

  if (key === 'showWhen') {
    element.hidden = !Boolean(nextValue);
    return;
  }

  if (key === 'hideWhen') {
    element.hidden = Boolean(nextValue);
    return;
  }

  if (key === 'focusWhen') {
    if (nextValue) {
      queueMicrotask(() => {
        if (document.activeElement !== element) {
          element.focus?.();
        }
      });
    }
    return;
  }

  if (nextValue === null || nextValue === undefined || nextValue === false) {
    if (key === 'class' || key === 'className') {
      element.removeAttribute('class');
      return;
    }

    if (key === 'style') {
      element.removeAttribute('style');
      return;
    }

    if (key === 'text' || key === 'html' || key === 'value') {
      element[key === 'html' ? 'innerHTML' : key === 'text' ? 'textContent' : 'value'] = '';
      return;
    }

    if (key === 'dataLink') {
      element.removeAttribute('data-link');
      return;
    }

    if (key === 'showWhen') {
      element.hidden = true;
      return;
    }

    if (key === 'hideWhen') {
      element.hidden = false;
      return;
    }

    if (key === 'focusWhen') {
      return;
    }

    if (key in element) {
      try {
        element[key] = '';
      } catch {
        element.removeAttribute(key);
      }
      return;
    }

    element.removeAttribute(key);
    return;
  }

  if (key === 'class' || key === 'className') {
    applyClassName(element, nextValue);
    return;
  }

  if (key === 'style') {
    applyStyles(element, nextValue);
    return;
  }

  if (key === 'dataset' && typeof nextValue === 'object') {
    Object.entries(nextValue).forEach(([entryKey, entryValue]) => {
      if (entryValue !== null && entryValue !== undefined) {
        element.dataset[entryKey] = String(entryValue);
      }
    });
    return;
  }

  if (key === 'dataLink') {
    if (nextValue) {
      element.setAttribute('data-link', '');
    }
    return;
  }

  if (key === 'attrs' && typeof nextValue === 'object') {
    Object.entries(nextValue).forEach(([entryKey, entryValue]) => {
      if (entryValue === true) {
        element.setAttribute(entryKey, '');
        return;
      }

      if (entryValue === null || entryValue === undefined || entryValue === false) {
        element.removeAttribute(entryKey);
        return;
      }

      element.setAttribute(entryKey, String(entryValue));
    });
    return;
  }

  if (key === 'html') {
    element.innerHTML = String(nextValue);
    return;
  }

  if (key === 'text') {
    element.textContent = String(nextValue);
    return;
  }

  if (key === 'ref' && typeof nextValue === 'function') {
    nextValue(element, context);
    return;
  }

  if (key.startsWith('on') && typeof nextValue === 'function') {
    const eventName = key.slice(2).toLowerCase();
    element.addEventListener(eventName, nextValue);

    if (context?.cleanup) {
      context.cleanup(() => element.removeEventListener(eventName, nextValue));
    }

    return;
  }

  if (key === 'value') {
    element.value = String(nextValue);
    return;
  }

  if (key in element && typeof nextValue !== 'object') {
    try {
      element[key] = nextValue;
      return;
    } catch {
      // Fall through to setAttribute.
    }
  }

  if (nextValue === true) {
    element.setAttribute(key, '');
    return;
  }

  element.setAttribute(key, String(nextValue));
}

function applyProp(element, key, value, context) {
  if (containsReactive(value)) {
    const stop = effect(() => {
      applyResolvedProp(element, key, unwrapReactive(value), context);
    });

    context?.cleanup(stop);
    return;
  }

  applyResolvedProp(element, key, value, context);
}

function createElementNode(node, context) {
  ensureRuntimeStyles();
  const resolvedNode = untrack(() => resolveRuntimeNode(node));

  if (resolvedNode.nodeType === FRAGMENT) {
    const fragment = document.createDocumentFragment();
    resolvedNode.children.forEach((child) => appendChild(fragment, child, context));
    return fragment;
  }

  if (typeof resolvedNode.nodeType === 'function') {
    return createDomNode(resolvedNode.nodeType({ ...resolvedNode.nodeProps, children: resolvedNode.children, context }), context);
  }

  const inSvgTree = Boolean(context?.svgNamespace);
  const isSvgTag = typeof resolvedNode.nodeType === 'string' && SVG_TAGS.has(resolvedNode.nodeType);
  const usesSvgNamespace = inSvgTree || isSvgTag;
  const element = usesSvgNamespace
    ? document.createElementNS(SVG_NAMESPACE, resolvedNode.nodeType)
    : document.createElement(resolvedNode.nodeType);
  const childContext = usesSvgNamespace && !inSvgTree
    ? { ...context, svgNamespace: true }
    : context;
  Object.entries(resolvedNode.nodeProps).forEach(([key, value]) => {
    applyProp(element, key, value, childContext);
  });

  if (containsReactive(node.meta?.state)) {
    let previousRuntimeProps = resolvedNode.nodeProps;
    const stop = effect(() => {
      const runtimeNode = resolveRuntimeNode(node);
      const nextRuntimeProps = runtimeNode.nodeProps;
      const keys = new Set([
        ...Object.keys(previousRuntimeProps || {}),
        ...Object.keys(nextRuntimeProps || {}),
      ]);

      keys.forEach((key) => {
        applyResolvedProp(
          element,
          key,
          unwrapReactive(Object.prototype.hasOwnProperty.call(nextRuntimeProps, key) ? nextRuntimeProps[key] : undefined),
          childContext,
        );
      });

      previousRuntimeProps = nextRuntimeProps;
    });

    childContext?.cleanup(stop);
  }

  if (!resolvedNode.nodeProps.html && !resolvedNode.nodeProps.text) {
    resolvedNode.children.forEach((child) => appendChild(element, child, childContext));
  }

  return element;
}

function resolveRuntimeNode(node) {
  const runtimeState = unwrapReactive(node.meta?.state || {});
  const preparedProps = typeof node.meta?.prepareProps === 'function'
    ? node.meta.prepareProps(node.nodeProps, node.children)
    : node.nodeProps;
  const resolvedClassName = typeof node.meta?.resolveClassName === 'function'
    ? node.meta.resolveClassName(runtimeState, node)
    : '';
  const resolvedProps = typeof node.meta?.resolveProps === 'function'
    ? node.meta.resolveProps(runtimeState, node)
    : null;

  if (!node.meta?.prepareProps && !resolvedClassName && !resolvedProps) {
    return node;
  }

  return {
    ...node,
    nodeProps: mergeProps(
      preparedProps,
      resolvedProps || {},
      resolvedClassName ? { className: resolvedClassName } : null,
    ),
  };
}

export function createDomNode(value, context) {
  if (value === null || value === undefined || value === false) {
    return null;
  }

  if (isReactive(value)) {
    return createReactiveChildNode(value, context);
  }

  if (isDynamicNode(value)) {
    return createDynamicNode(value, context);
  }

  if (isDomNode(value)) {
    return value;
  }

  if (isViewNode(value)) {
    return createElementNode(value, context);
  }

  if (Array.isArray(value)) {
    const fragment = document.createDocumentFragment();
    value.forEach((child) => appendChild(fragment, child, context));
    return fragment;
  }

  return document.createTextNode(String(value));
}

export function mountView(output, container, context) {
  ensureRuntimeStyles();

  if (typeof output === 'string') {
    container.innerHTML = output;
    return;
  }

  container.innerHTML = '';
  const node = createDomNode(output, context);
  if (node) {
    container.appendChild(node);
  }
}

export function render(output, container, options = {}) {
  const context = options.context || createRenderContext({
    container,
    route: options.route,
    router: options.router,
    scope: options.scope,
  });

  const resolveOutput = typeof output === 'function' ? output : () => output;

  const stop = effect(() => {
    context.prepareRender();
    let nextView;
    beginReactiveCreationPhase('render()');
    try {
      nextView = resolveOutput(context);
    } finally {
      endReactiveCreationPhase();
    }
    mountView(nextView, container, context);

    if (typeof options.mount === 'function') {
      untrack(() => options.mount(context));
    }

    if (typeof options.afterRender === 'function') {
      untrack(() => options.afterRender(context));
    }
  });

  context.cleanup(stop, 'lifetime');

  return {
    context,
    destroy() {
      context.destroy();
    },
  };
}

export function html(strings, ...values) {
  let output = '';

  for (let index = 0; index < strings.length; index += 1) {
    output += strings[index];
    if (index < values.length) {
      output += flattenValue(values[index]);
    }
  }

  return output;
}

export function view(type, props = {}, ...children) {
  return createNode(type, props || {}, normalizeChildren(children));
}

export function page(definition) {
  return {
    name: definition.name || 'AnonymousPage',
    setup: definition.setup || null,
    render: definition.render || (() => ''),
    mount: definition.mount || null,
  };
}

export function setupGroup(name, value) {
  if (!name || typeof name !== 'string') {
    throw new Error('Feather: setupGroup(name, value) requires a string name.');
  }

  return {
    [name]: typeof value === 'function' ? value() : value,
  };
}

export function setupState(...entries) {
  const nextState = {};

  entries
    .filter((entry) => entry !== null && entry !== undefined && entry !== false)
    .forEach((entry) => {
      const resolvedEntry = typeof entry === 'function' ? entry() : entry;

      if (!isPlainObject(resolvedEntry)) {
        throw new Error('Feather: setupState(...) only accepts plain objects or factories that return plain objects.');
      }

      Object.entries(resolvedEntry).forEach(([key, value]) => {
        if (Object.prototype.hasOwnProperty.call(nextState, key)) {
          throw new Error(`Feather: duplicate setup key "${key}" in setupState(...).`);
        }

        nextState[key] = value;
      });
    });

  return nextState;
}

export function dynamic(getter) {
  if (typeof getter !== 'function') {
    throw new Error('Feather: dynamic(getter) requires a function.');
  }

  return {
    __featherDynamic: true,
    nodeType: DYNAMIC,
    getter,
  };
}

export function createRenderContext({ container, route, router, scope = {} }) {
  const renderCleanups = [];
  const lifetimeCleanups = [];
  const onceEntries = new Map();

  const context = {
    ...scope,
    container,
    route,
    router,
    navigate(path, options) {
      return router?.navigate(path, options);
    },
    cleanup(fn, scopeName = 'render') {
      if (typeof fn !== 'function') {
        return fn;
      }

      if (scopeName === 'lifetime') {
        lifetimeCleanups.push(fn);
      } else {
        renderCleanups.push(fn);
      }

      return fn;
    },
    once(key, fn) {
      if (typeof key === 'function') {
        fn = key;
        key = fn;
      }

      if (typeof fn !== 'function') {
        return onceEntries.get(key);
      }

      if (onceEntries.has(key)) {
        return onceEntries.get(key);
      }

      let result;
      try {
        result = fn();
      } catch (error) {
        onceEntries.delete(key);
        throw error;
      }

      onceEntries.set(key, result);

      if (result && typeof result.then === 'function') {
        result.catch(() => {
          if (onceEntries.get(key) === result) {
            onceEntries.delete(key);
          }
        });
      }

      return result;
    },
    prepareRender() {
      runCleanups(renderCleanups);
    },
    $(selector) {
      return container.querySelector(selector);
    },
    $all(selector) {
      return Array.from(container.querySelectorAll(selector));
    },
    bind(target, type, handler, options) {
      const resolvedTarget = resolveTarget(target, container);
      if (!resolvedTarget?.addEventListener) return () => {};

      resolvedTarget.addEventListener(type, handler, options);
      const remove = () => resolvedTarget.removeEventListener(type, handler, options);
      renderCleanups.push(remove);
      return remove;
    },
    timeout(callback, delay = 0, scopeName = 'lifetime') {
      const timeoutId = setTimeout(() => {
        cleanup();
        callback();
      }, delay);

      const cleanup = () => clearTimeout(timeoutId);
      context.cleanup(cleanup, scopeName);
      return cleanup;
    },
    interval(callback, delay = 0, scopeName = 'lifetime') {
      const intervalId = setInterval(callback, delay);
      const cleanup = () => clearInterval(intervalId);
      context.cleanup(cleanup, scopeName);
      return cleanup;
    },
    raf(callback, scopeName = 'render') {
      const frameId = scheduleFrame(callback);
      const cleanup = () => cancelFrame(frameId);
      context.cleanup(cleanup, scopeName);
      return cleanup;
    },
    watch(source, listener, options = {}) {
      const {
        immediate = true,
        scope: scopeName = 'render',
        equals = Object.is,
      } = options;
      const readSource = typeof source === 'function' ? source : () => read(source);
      let initialized = false;
      let previousValue;

      const stop = effect(() => {
        const nextValue = readSource();

        if (!initialized) {
          initialized = true;
          previousValue = nextValue;
          if (immediate) {
            return listener(nextValue, undefined);
          }
          return undefined;
        }

        if (equals(previousValue, nextValue)) {
          return undefined;
        }

        const currentPrevious = previousValue;
        previousValue = nextValue;
        return listener(nextValue, currentPrevious);
      });

      context.cleanup(stop, scopeName);
      return stop;
    },
    setHTML(nextHtml) {
      context.prepareRender();
      container.innerHTML = nextHtml;
    },
    setView(nextView) {
      context.prepareRender();
      mountView(nextView, container, context);
    },
    render(nextView) {
      context.prepareRender();
      mountView(nextView, container, context);
    },
  };

  context.destroy = () => {
    runCleanups(renderCleanups);
    runCleanups(lifetimeCleanups);
  };

  return context;
}

export function Fragment(...children) {
  return createNode(FRAGMENT, {}, normalizeChildren(children));
}

export function El(type, ...args) {
  const { props, children } = parseArguments(args);
  return createNode(type, props, children);
}

export function createPrimitive(tagName, options = {}) {
  const primitive = function primitiveComponent(...args) {
    const { props, children } = resolveComponentArgs(args, options.defaults || {});
    const { styled = false, unstyled = false, ...nextProps } = props;
    const baseClassName = typeof options.className === 'function'
      ? options.className(nextProps, children)
      : options.className;

    return createNode(
      tagName,
      mergeProps(nextProps, styled && !unstyled && baseClassName ? { className: baseClassName } : null),
      children,
      {
        kind: options.kind || tagName,
        state: { ...(options.state || {}) },
        modifiers: options.modifiers || {},
        resolveClassName: options.resolveClassName || null,
        resolveProps: options.resolveProps || null,
        prepareProps: options.prepareProps || null,
        styled: styled && !unstyled,
      },
    );
  };

  Object.entries(options.shortcuts || {}).forEach(([name, applyShortcut]) => {
    Object.defineProperty(primitive, name, {
      value: (...args) => applyShortcut(primitive(...args)),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  });

  return primitive;
}

function createAlias(tagName, defaultClassName = '') {
  return function aliasComponent(...args) {
    const { props, children } = resolveComponentArgs(args);
    const { styled = false, unstyled = false, ...rest } = props;

    return createNode(
      tagName,
      mergeProps(styled && !unstyled && defaultClassName ? { className: defaultClassName } : null, rest),
      children,
    );
  };
}

function resolveButtonVariant(node, value) {
  return updateNodeState(node, {
    variant: value,
  });
}

function resolveButtonSize(node, value) {
  return updateNodeState(node, {
    size: value,
  });
}

function resolveButtonBlock(node, value = true) {
  return updateNodeState(node, {
    block: value,
  });
}

function resolveButtonLoading(node, value = true) {
  return updateNodeState(node, {
    loading: value,
  });
}

function resolveAlertVariant(node, value) {
  return updateNodeState(node, {
    variant: value,
  });
}

function resolveLinkTo(node, value) {
  return cloneNode(node, {
    props: {
      href: value,
      dataLink: true,
    },
  });
}

function resolveAriaLabel(node, value) {
  return cloneNode(node, {
    props: {
      attrs: {
        'aria-label': value,
      },
    },
  });
}

function resolveAriaLabelledBy(node, value) {
  return cloneNode(node, {
    props: {
      attrs: {
        'aria-labelledby': value,
      },
    },
  });
}

function resolveAriaDescribedBy(node, value) {
  return cloneNode(node, {
    props: {
      attrs: {
        'aria-describedby': value,
      },
    },
  });
}

function resolveLandmarkRole(node, value = 'region') {
  return cloneNode(node, {
    props: {
      attrs: {
        role: value === true ? 'region' : value,
      },
    },
  });
}

function resolveTextWrapBalance(node, value = true) {
  return cloneNode(node, {
    props: {
      style: value ? { textWrap: 'balance' } : {},
    },
  });
}

function resolveTextWrapPretty(node, value = true) {
  return cloneNode(node, {
    props: {
      style: value ? { textWrap: 'pretty' } : {},
    },
  });
}

function resolveClamp(node, lines = 1) {
  const count = Number(read(lines) ?? 1);
  if (count <= 1) {
    return cloneNode(node, {
      props: {
        style: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      },
    });
  }

  return cloneNode(node, {
    props: {
      style: {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: String(count),
        overflow: 'hidden',
      },
    },
  });
}

function resolveFontWeight(node, value) {
  return cloneNode(node, {
    props: {
      style: {
        fontWeight: value,
      },
    },
  });
}

function resolveHeadingLevel(node, value = 1) {
  const level = Math.max(1, Math.min(6, Number(read(value) || 1)));
  return cloneNode(node, {
    nodeType: `h${level}`,
  });
}

function resolveListMarker(node, value) {
  return cloneNode(node, {
    props: {
      style: {
        listStyleType: value,
      },
    },
  });
}

function resolveListInside(node, value = true) {
  return cloneNode(node, {
    props: {
      style: {
        listStylePosition: value ? 'inside' : 'outside',
      },
    },
  });
}

function resolveListOutside(node, value = true) {
  return cloneNode(node, {
    props: {
      style: {
        listStylePosition: value ? 'outside' : 'inside',
      },
    },
  });
}

function resolveListGap(node, value) {
  return cloneNode(node, {
    props: {
      style: {
        display: 'grid',
        gap: value,
      },
    },
  });
}

function resolveListDense(node, value = true) {
  return cloneNode(node, {
    props: {
      style: value ? { gap: '.25rem' } : {},
    },
  });
}

function resolveOrderedListStart(node, value) {
  return cloneNode(node, {
    props: {
      start: value,
    },
  });
}

function resolveOrderedListReversed(node, value = true) {
  return cloneNode(node, {
    props: {
      reversed: value,
    },
  });
}

function resolveListItemValue(node, value) {
  return cloneNode(node, {
    props: {
      value,
    },
  });
}

export function Text(...args) {
  const { props, children } = resolveComponentArgs(args);
  const { styled = false, unstyled = false, ...rest } = props;

  return createNode(
    'span',
    mergeProps(styled && !unstyled ? { className: token('text.base') } : null, rest),
    children,
  );
}

function createTextElement(tagName, defaultClassName = '', modifiers = {}, options = {}) {
  return createPrimitive(tagName, {
    resolveClassName: (_state, node) => !node.meta?.styled ? '' : defaultClassName,
    modifiers: {
      ...(options.level ? { level: resolveHeadingLevel } : null),
      balance: resolveTextWrapBalance,
      pretty: resolveTextWrapPretty,
      clamp: resolveClamp,
      ...modifiers,
    },
  });
}

function createLandmarkElement(tagName, defaultClassName = '', modifiers = {}) {
  return createPrimitive(tagName, {
    resolveClassName: (_state, node) => !node.meta?.styled ? '' : defaultClassName,
    modifiers: {
      label: resolveAriaLabel,
      labelledBy: resolveAriaLabelledBy,
      describedBy: resolveAriaDescribedBy,
      ...modifiers,
    },
  });
}

export const Container = createAlias('div', 'feather-container');
export const Box = createAlias('div', 'feather-box');
export const Break = createAlias('br');
export const Group = createAlias('div', 'feather-group');
export const Span = createTextElement('span');
export const Paragraph = createTextElement('p');
export const Strong = createTextElement('strong', '', {
  weight: resolveFontWeight,
});
export const Emphasis = createTextElement('em');
export const Small = createTextElement('small');
export const Code = createTextElement('code');
export const Title = createTextElement('h1', token('text.base'), {}, { level: true });
export const Subtitle = createTextElement('p', token('text.muted'), {}, { level: true });
export const Section = createLandmarkElement('section', 'feather-section', {
  landmark: resolveLandmarkRole,
});
export const Article = createLandmarkElement('article');
export const Aside = createLandmarkElement('aside');
export const Header = createLandmarkElement('header');
export const Footer = createLandmarkElement('footer');
export const Main = createLandmarkElement('main');
export const Nav = createLandmarkElement('nav');
export const List = createPrimitive('ul', {
  modifiers: {
    marker: resolveListMarker,
    inside: resolveListInside,
    outside: resolveListOutside,
    gap: resolveListGap,
    dense: resolveListDense,
  },
});
export const OrderedList = createPrimitive('ol', {
  modifiers: {
    marker: resolveListMarker,
    inside: resolveListInside,
    outside: resolveListOutside,
    gap: resolveListGap,
    dense: resolveListDense,
    start: resolveOrderedListStart,
    reversed: resolveOrderedListReversed,
  },
});
export const ListItem = createPrimitive('li', {
  modifiers: {
    value: resolveListItemValue,
  },
});
export const Surface = createAlias('div', 'feather-surface');
export const Field = createAlias('div', 'feather-field');
export const Label = createAlias('label', 'feather-label');
export const Icon = createAlias('svg');
export const Path = createAlias('path');

export function Form(...args) {
  if (args.length > 0 && isFormObject(args[0])) {
    const [form, ...rest] = args;
    return Form(...rest).form(form);
  }

  const { props, children } = resolveComponentArgs(args);
  const { styled = false, unstyled = false, ...rest } = props;

  return createNode(
    'form',
    mergeProps(styled && !unstyled ? { className: 'feather-form' } : null, rest),
    children,
    {
      kind: 'form',
      prepareProps: resolveFormProps,
    },
  );
}

export function VStack(...args) {
  const { props, children } = resolveComponentArgs(args, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
    },
  });

  return createNode('div', props, children);
}

export function HStack(...args) {
  const { props, children } = resolveComponentArgs(args, {
    style: {
      display: 'flex',
      flexDirection: 'row',
      margin: 0,
    },
  });

  return createNode('div', props, children);
}

export function ZStack(...args) {
  const { props, children } = resolveComponentArgs(args, {
    style: {
      display: 'grid',
      margin: 0,
    },
  });

  const layeredChildren = children.map((child) => {
    if (!isViewNode(child)) {
      return child;
    }

    return cloneNode(child, {
      props: {
        style: mergeProps(
          child.nodeProps?.style ? { style: child.nodeProps.style } : null,
          { style: { gridArea: '1 / 1' } },
        ).style,
      },
    });
  });

  return createNode('div', props, layeredChildren);
}

export function Spacer(props = {}) {
  return createNode('div', mergeProps(
    { style: { flex: '1 1 auto' }, 'aria-hidden': 'true' },
    props,
  ));
}

export const Button = createPrimitive('button', {
  kind: 'button',
  defaults: {
    type: 'button',
  },
  state: {
    variant: 'primary',
    size: 'md',
    block: false,
    loading: false,
  },
  resolveClassName: (state, node) => !node.meta?.styled ? '' : cx(
    token('button.base'),
    token(`button.variant.${read(state.variant) || 'primary'}`),
    token(`button.size.${read(state.size) || 'md'}`),
    read(state.block) && token('button.block'),
    read(state.loading) && token('button.loading'),
  ),
  resolveProps: (state) => (read(state.loading) ? {
    disabled: true,
    attrs: {
      'aria-busy': 'true',
    },
    dataset: {
      loading: 'true',
    },
  } : null),
  modifiers: {
    variant: resolveButtonVariant,
    size: resolveButtonSize,
    block: resolveButtonBlock,
    loading: resolveButtonLoading,
  },
});

export const Input = createPrimitive('input', {
  kind: 'input',
  prepareProps: (props) => resolveModelBindingProps(props),
  resolveClassName: (_state, node) => !node.meta?.styled ? '' : token('input.base'),
});

export const Img = createPrimitive('img', {
  kind: 'img',
  modifiers: {
    loading: (node, value) => setNodeProp(node, 'loading', value),
    decoding: (node, value) => setNodeProp(node, 'decoding', value),
  },
});

export const Checkbox = createPrimitive('input', {
  kind: 'checkbox',
  defaults: {
    type: 'checkbox',
  },
  prepareProps: (props) => resolveModelBindingProps(props),
  resolveClassName: (_state, node) => !node.meta?.styled ? '' : '',
});

export const Link = createPrimitive('a', {
  kind: 'link',
  resolveClassName: (_state, node) => !node.meta?.styled ? '' : token('link.base'),
  modifiers: {
    to: resolveLinkTo,
  },
});

export function ForEach(items, renderItem) {
  if (containsReactive(items)) {
    return dynamic(() => {
      const resolvedItems = read(items);
      if (!Array.isArray(resolvedItems)) return [];
      return resolvedItems.map((item, index) => renderItem(item, index));
    });
  }

  const resolvedItems = read(items);
  if (!Array.isArray(resolvedItems)) return [];
  return resolvedItems.map((item, index) => renderItem(item, index));
}

export function Show(condition, truthyValue, falsyValue = null) {
  if (containsReactive(condition)) {
    return dynamic(() => (read(condition) ? truthyValue : falsyValue));
  }

  return read(condition) ? truthyValue : falsyValue;
}

export function Alert(...args) {
  const { props, children } = resolveComponentArgs(args);
  const { styled = false, unstyled = false, ...rest } = props;

  return createNode('div', rest, children, {
    kind: 'alert',
    state: {
      variant: 'info',
      styled: styled && !unstyled,
    },
    modifiers: {
      variant: resolveAlertVariant,
    },
    resolveClassName: (state) => !state.styled ? '' : cx(
      token('surface.alert'),
      token(`alert.variant.${read(state.variant) || 'info'}`),
    ),
  });
}

export function InputField(props = {}) {
  const {
    label,
    model,
    type = 'text',
    placeholder,
    description,
    ...rest
  } = props;

  return VStack(
    Show(label, Label(label)),
    Input(rest)
      .type(type)
      .placeholder(placeholder)
      .value(model)
      .onInput((event) => {
        if (model?.set) {
          model.set(event.target.value);
        }
      }),
    Show(description, Text(description).textSize('sm').textColor('muted')),
  ).gap(2);
}
