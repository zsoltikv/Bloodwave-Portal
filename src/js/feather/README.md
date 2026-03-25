# Feather

Feather is a small JavaScript framework for building reactive browser applications with plain functions, plain objects, and direct DOM rendering.

It does not use a virtual DOM, JSX, a compiler, or a template language. The framework is designed around a few simple ideas:

- create long-lived state in `setup()`
- describe UI with plain function calls
- bind reactive values through functions in DOM-facing children and props
- use small local reactive regions instead of broad page rerenders
- keep styling and application structure close to normal HTML and CSS

Feather originated inside Project-Bloodwave-Web, but the framework is documented here as a standalone runtime.

## What Feather Provides

- reactive primitives: `signal`, `computed`, `store`, `effect`
- page lifecycle: `setup`, `render`, `mount`
- composable view helpers such as `Box`, `VStack`, `Input`, `Button`, and `Link`
- chainable modifiers for props, classes, styles, attributes, and events
- form helpers for validation and submission flows
- a lightweight client-side router for multi-page browser applications

## Runtime Model

Feather pages follow a setup-first model:

1. `setup(ctx)` runs once for the route instance.
2. `render(ctx)` runs as a one-time view pass that builds the page shell.
3. `mount(ctx)` runs after the initial DOM has been mounted.
4. Function-based child bindings, function-based props, inline getter regions, `Show(...)`, and `ForEach(...)` update only their local DOM region.

Important rule: create reactive values in `setup()` or module scope, not inside `render()`. Feather throws if `signal()`, `computed()`, `store()`, or `effect()` are created during render.

### Render Guidance

`render()` is intentionally not a broad reactive effect.

Prefer these patterns:

```js
Title('Count: ', () => count.get());

Box(() => (count.get() > 0 ? 'Ready' : 'Idle'));

Paragraph()
  .text(() => submitState.message.get())
  .showWhen(() => submitState.visible.get());
```

Avoid this pattern for dynamic UI:

```js
Title(`Count: ${count.get()}`);
```

If you need derived branching or a local reactive subtree, use an inline getter child:

```js
Box(() => (
  form.submitting.get()
    ? 'Saving...'
    : 'Save'
));
```

## Quick Start

```js
import {
  Button,
  Title,
  VStack,
  render,
  signal,
} from './index.js';

const count = signal(0);

render(
  () => VStack(
    Title('Count: ', count),
    Button('Increment').onClick(() => {
      count.update((value) => value + 1);
    }),
  ).gap(12).padding(24),
  document.getElementById('app'),
);
```

## Pages

Pages are plain objects created with `page(...)`.

```js
import {
  Button,
  Input,
  Title,
  VStack,
  page,
  signal,
} from './index.js';

const LoginPage = page({
  name: 'Login',

  setup() {
    return {
      email: signal(''),
      loading: signal(false),
    };
  },

  render(ctx) {
    return VStack(
      Title('Sign in'),
      Input().model(ctx.email).type('email'),
      Button('Submit').loading(ctx.loading),
    ).gap(12);
  },

  mount(ctx) {
    // Optional DOM work after the initial render.
  },
});
```

### Setup Helpers

Feather ships two small helpers for organizing larger `setup()` blocks:

```js
import { computed, setupGroup, setupState, signal } from './index.js';

setup() {
  const submitting = signal(false);
  const password = signal('');

  return setupState(
    setupGroup('form', {
      submitting,
    }),
    setupGroup('password', {
      value: password,
      strength: computed(() => password.get().length),
    }),
  );
}
```

- `setupGroup(name, value)` nests a related section under one key.
- `setupState(...entries)` merges setup sections and throws on duplicate keys.

## Page Context

Feather passes the same context object through `setup`, `render`, and `mount`.

Common context fields and helpers:

- `container`
  The mounted DOM element for the current page or local region.
- `route`
  The current route object when using the router.
- `router`
  The active router instance.
- `navigate(path, options)`
  Convenience wrapper around `router.navigate(...)`.
- `cleanup(fn, scope = 'render')`
  Registers cleanup work. Use `'render'` for render-scoped work and `'lifetime'` for route-lifetime work.
- `once(key, fn)`
  Runs a function once for the current route context and returns the cached result.
- `watch(source, listener, options)`
  Creates a scoped reactive watcher.
- `timeout(fn, delay, scope)`, `interval(fn, delay, scope)`, `raf(fn, scope)`
  Schedule lifecycle-aware work.
- `bind(target, type, handler, options)`
  Attaches DOM listeners that clean themselves up automatically.
- `$(selector)`, `$all(selector)`
  Container-scoped DOM queries.
- `setHTML(nextHtml)`, `setView(nextView)`, `render(nextView)`
  Imperative escape hatches for replacing the current content.

## Reactive State

### `signal(initialValue)`

Use a signal for a single mutable value.

```js
const open = signal(false);

open.get();
open.set(true);
open.update((value) => !value);
```

Available members:

- `get()`
- `peek()`
- `set(nextValue)`
- `update(updater)`
- `subscribe(listener)`
- `value` getter/setter

### `computed(getter)`

Use a computed for derived state.

```js
const password = signal('');
const strength = computed(() => password.get().length);
```

Available members:

- `get()`
- `peek()`
- `subscribe(listener)`
- `value` getter

### `store(initialObject)`

Use a store for object-shaped state with immutable patching.

```js
const user = store({ name: '', email: '' });

user.patch({ name: 'Avery' });
user.update((current) => ({
  email: `${current.name}@example.com`,
}));
```

Available members:

- `get()`
- `peek()`
- `set(nextObject)`
- `patch(partialObject)`
- `update(updater)`
- `subscribe(listener)`
- `value` getter

### `effect(fn)`

Runs immediately, tracks dependencies, and reruns when they change. If `fn` returns a function, that function becomes cleanup for the next run or disposal.

### Other reactive helpers

- `batch(fn)` batches writes and flushes observers once.
- `read(value)` unwraps reactive handles or returns raw values unchanged.
- `untrack(fn)` reads reactive state without subscribing the current observer.
- `isReactive(value)` checks whether a value is a Feather reactive handle.

## View Authoring

Feather views are plain function calls:

```js
Box(
  Title('Settings'),
  Paragraph('Manage your account preferences.'),
).className('panel');
```

Supported child shapes:

- strings and numbers
- arrays of children
- nested Feather nodes
- reactive values
- inline getter children
- DOM nodes when needed

### Base Helpers

- `view(type, props, ...children)`
- `El(type, ...args)`
- `Fragment(...children)`
- `html\`...\``
- `createDomNode(value, context)`
- `mountView(output, container, context)`
- `render(output, container, options)`

### Control Flow

- `Show(condition, truthyValue, falsyValue)`
- `ForEach(items, renderItem)`

When `condition` or `items` are reactive, Feather updates only the local region created for that branch or list.

## Built-In Components

### Layout and text

- `Box`
- `Container`
- `Group`
- `Section`
- `Surface`
- `VStack`
- `HStack`
- `ZStack`
- `Spacer`
- `Text`
- `Span`
- `Paragraph`
- `Title`
- `Subtitle`
- `Strong`
- `Emphasis`
- `Small`
- `Code`
- `Article`
- `Aside`
- `Header`
- `Footer`
- `Main`
- `Nav`
- `List`
- `OrderedList`
- `ListItem`
- `Break`

### Forms and interactive elements

- `Form`
- `Label`
- `Input`
- `Checkbox`
- `Button`
- `Link`
- `Alert`
- `Icon`
- `Path`

## Modifiers

Feather is modifier-centric: build a node first, then describe it through chained modifiers.

Common modifier groups:

- props and attributes
  `.prop()`, `.props()`, `.attr()`, `.attrs()`, `.data()`, `.aria()`
- classes and styles
  `.className()`, `.class()`, `.tw()`, `.style()`, `.bindStyle()`, `.bindClass()`
- events
  `.on()`, `.onClick()`, `.onInput()`, `.onChange()`, `.onSubmit()`, `.onEnter()`, `.onEscape()`
- value and field binding
  `.value()`, `.checked()`, `.field()`, `.model()`, `.form()`
- visibility and state helpers
  `.showWhen()`, `.hideWhen()`, `.focusWhen()`, `.disabled()`, `.disabledWhen()`
- composition helpers
  `.with()`, `.when()`, `.if()`, `.as()`

Example:

```js
Input()
  .field(form.field('email'))
  .type('email')
  .placeholder('you@example.com')
  .className('input')
  .when(form.field('email').invalid, (node) => node.ariaInvalid(true));
```

## Forms

Feather ships higher-level form helpers in `forms.js`.

### `createForm(options)`

```js
const form = createForm({
  initial: {
    email: '',
    password: '',
  },
  validate(values) {
    return {
      email: values.email ? '' : 'Email is required',
      password: values.password ? '' : 'Password is required',
    };
  },
  async submit(values) {
    await api.login(values);
  },
});
```

Returned form API includes:

- `values`, `errors`, `touched`
- `submitting`, `submitError`, `valid`, `invalid`, `dirty`
- `field(name)`
- `validate()`
- `submit(event)`
- `reset(nextInitial?)`
- `set(nextValues)`, `patch(partialValues)`
- `touch(nextTouched)`
- `state(key, initialValue)`, `memo(key, createValue)`

### Field objects

`form.field(name)` returns a field object with:

- `name`
- `form`
- `value`
- `error`
- `touched`
- `invalid`
- `set(nextValue)`
- `touch(nextValue)`
- `reset()`
- `bind(props)`
- `state(key, initialValue)`
- `memo(key, createValue)`

### Form components

- `FormScope`
- `Field`
- `FieldLabel`
- `FieldControl`
- `FieldError`
- `FieldHint`
- `CheckboxField`
- `TextField`
- `SubmitButton`
- `InputField`

`Input`, `Checkbox`, and `Form` understand `field`, `model`, and `form` props directly.

## Routing

Use `createRouter()` for small browser applications:

```js
const router = createRouter({
  root: document.getElementById('app'),
  routes: [
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
  ],
  notFoundPath: '/login',
});

router.start();
```

Router options:

- `root`
- `routes`
- `beforeResolve`
- `afterRender`
- `notFoundPath`

Router API:

- `currentRoute`
- `navigate(path, { replace })`
- `start()`

`Link().to('/path')` automatically sets `href` and `data-link`, which the router intercepts for client-side navigation.

## Theme Utilities

Theme values in Feather are just class strings grouped by semantic meaning.

Available helpers:

- `cx(...values)`
- `defineTheme(overrides)`
- `setTheme(overrides)`
- `getTheme()`
- `token(path, fallback)`
- `resolveToken(group, value, fallback)`
- `defineVariants({ base, variants, defaults })`

Example:

```js
setTheme({
  button: {
    variant: {
      primary: 'bg-sky-500 text-white hover:bg-sky-400',
    },
  },
});
```

## Component Authoring

Reusable Feather components are plain functions.

Useful helpers when building them:

- `resolveComponentArgs(args, defaults)`
- `mergeProps(...sources)`
- `splitProps(props, keys)`
- `createPrimitive(tagName, options)`
- `setPrimitiveState(node, nextState)`
- `unstyled(component)`

Example:

```js
function Badge(...args) {
  const { props, children } = resolveComponentArgs(args);
  const [local, rest] = splitProps(props, ['tone']);

  return Span(
    mergeProps(rest, {
      className: cx(
        'inline-flex rounded-full px-2 py-1 text-xs font-medium',
        local.tone === 'accent'
          ? 'bg-sky-100 text-sky-800'
          : 'bg-slate-100 text-slate-700',
      ),
    }),
    ...children,
  );
}
```

## File Overview

- `state.js`
  Reactive primitives and dependency tracking.
- `core.js`
  View creation, DOM mounting, render regions, modifiers, and base components.
- `forms.js`
  Form state, validation, and form-oriented components.
- `router.js`
  Client-side navigation and route lifecycle.
- `theme.js`
  Theme tokens and class composition helpers.
- `constants.js`
  Enum-like values for common modifiers.
- `index.js`
  Public exports.

## Positioning

Feather works well for:

- dashboards
- internal tools
- auth flows
- multi-page browser apps
- applications that want direct CSS and DOM control without giving up reactive state

It is especially useful when you want framework help for state, forms, and routing, but still want your application markup and styling to remain explicit and easy to inspect.

For the complete public surface, see [index.js](./index.js).
