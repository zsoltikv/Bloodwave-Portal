# ?? Feather

Feather is the UI runtime behind Project-Bloodwave-Web.

It is a small JavaScript framework for building reactive pages with plain functions, plain objects, and direct DOM rendering. Feather does not use a virtual DOM, a compiler, JSX, or a build-time template language. Instead, it gives you:

- reactive primitives for local page state
- page objects with `setup()` and `render()`
- composable view functions and chainable modifiers
- form helpers for common application flows
- a tiny router for multi-page browser apps

`example/Register.js` is not a synthetic demo. It is a real page adapted from Project-Bloodwave-Web, and it shows the intended style of Feather: custom application markup where needed, plus framework helpers for reactivity, forms, and page lifecycle.

## What Feather Is Now

Feather is a small application framework built around composable nodes, reactivity, and modifier chaining.
The intended authoring style is a lightweight core of views like `Box`, `VStack`, `Input`, `Form`, `Icon`, and `Link`, with your own CSS classes and chained modifiers layered on top.

## Core Ideas

- Plain JavaScript components: components are just functions that return Feather nodes.
- Reactive rendering: reading a `signal()`, `store()`, or `computed()` during render automatically subscribes the view to updates.
- Coarse-grained rerendering: Feather rerenders the mounted container instead of diffing individual DOM nodes.
- Setup-first pages: create state once in `setup()`, then read it in `render(ctx)`.
- Minimal abstraction: props, classes, styles, DOM attributes, and event handlers stay close to the browser.
- Tailwind-friendly output: semantic tokens resolve to class strings, and modifiers can emit utility classes directly.

## Architecture

- `state.js`
Reactive primitives and dependency tracking.
- `core.js`
View creation, DOM mounting, page lifecycle, modifiers, helpers, and base primitives.
- `forms.js`
Form state, validation, field objects, and form-oriented components.
- `theme.js`
Theme tokens, class composition, and variant utilities.
- `router.js`
Client-side route matching, navigation, and route lifecycle.
- `constants.js`
Shared enum-like values for common modifiers.
- `index.js`
Public framework exports.

## Render Model

1. Define a page with `page({ setup, render, mount })`.
2. `setup(context)` runs once for the route instance and returns long-lived local state.
3. `render(context)` runs inside a tracked reactive effect.
4. Reactive reads made during render become dependencies automatically.
5. Direct reactive prop bindings update the affected DOM node in place.
6. `Show(...)` and `ForEach(...)` create reactive subregions so common control flow can update without remounting the whole page.
7. If the top-level render function itself reads reactive state, Feather still rerenders that mounted container and rebinds render-scoped effects.

Important rule: create reactive values in `setup()` or module scope, not inside `render()`. Feather explicitly throws if `signal()`, `computed()`, `store()`, or `effect()` are created during render.

## Quick Start

```js
import {
  Button,
  Title,
  VStack,
  page,
  render,
  signal,
} from './index.js';

const count = signal(0);

render(
  () => VStack(
    Title(`Count: ${count.get()}`),
    Button('Increment').onClick(() => count.update((value) => value + 1)),
  ).gap(12).padding(24),
);
```

## Pages

Pages are plain objects created by `page()`.

```js
const Register = page({
  name: 'Register',

  setup(context) {
    const email = signal('');
    const loading = signal(false);

    return { email, loading };
  },

  render(ctx) {
    return VStack(
      Title('Create account'),
      Input()
        .model(ctx.email)
        .type('email'),
      Button('Submit').loading(ctx.loading),
    ).gap(12);
  },

  mount(ctx) {
    // Optional DOM work after each render pass.
  },
});
```

### Page Context

Feather passes the same render context through the page lifecycle. It includes:

- `container`
The mounted DOM element for the current page or local render.
- `route`
The matched route object when using the router.
- `router`
The active router instance.
- `navigate(path, options)`
Convenience wrapper around `router.navigate(...)`.
- `cleanup(fn, scope)`
Registers cleanup work. Use `'render'` for per-render cleanup or `'lifetime'` for route-lifetime cleanup.
- `timeout(fn, delay, scope)` / `interval(fn, delay, scope)` / `raf(fn, scope)`
Schedule work that is automatically cleaned up with the chosen lifecycle scope.
- `watch(source, listener, options)`
Runs a reactive watcher scoped to the current page lifecycle. Supports `scope`, `immediate`, and custom `equals`.
- `prepareRender()`
Runs render-scoped cleanup before a rerender.
- `$(selector)` and `$all(selector)`
Query helpers scoped to the mounted container.
- `bind(target, type, handler, options)`
Adds an event listener that is automatically cleaned up on rerender.
- `setHTML(nextHtml)`, `setView(nextView)`, `render(nextView)`
Imperative escape hatches for replacing the mounted content.

### Setup Composition

Feather keeps setup data as plain objects, but now ships two tiny helpers for making larger `setup()` blocks easier to scan:

```js
import { setupGroup, setupState } from './index.js';

setup(ctx) {
  const form = createForm(...);
  const password = {
    revealed: signal(false),
    type: computed(() => 'password'),
  };

  return setupState(
    { form },
    setupGroup('password', password),
    setupGroup('submit', {
      success: signal(false),
      label: computed(() => 'Create account'),
    }),
  );
}
```

- `setupGroup(name, value)`
Wraps a related setup section under one named key.
- `setupState(...entries)`
Merges setup sections and throws on duplicate top-level keys.

## Reactive State

### `signal(initialValue)`

Use for a single mutable value.

```js
const loading = signal(false);
loading.get();
loading.set(true);
loading.update((value) => !value);
loading.subscribe((value) => console.log(value));
```

Available members:

- `get()`
- `peek()`
- `set(nextValue)`
- `update(updater)`
- `subscribe(listener)`
- `value` getter/setter

### `computed(getter)`

Use derived state that updates automatically when dependencies change.

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

Use object-shaped state with immutable patching.

```js
const user = store({ name: '', email: '' });

user.patch({ name: 'Avery' });
user.update((current) => ({ email: `${current.name}@example.com` }));
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

Runs immediately, tracks dependencies, and reruns when they change. If `fn` returns a function, that return value becomes cleanup for the next run or disposal.

### `dynamic(getter)`

Creates a reactive child region that updates only its local DOM slice.

This is the low-level primitive behind `Show(...)` and `ForEach(...)`.

### `batch(fn)`

Groups reactive writes and flushes observers once at the end of the batch.

### `read(value)` and `untrack(fn)`

- `read(value)` unwraps reactive values when you want a function to accept either a raw value or a reactive handle.
- `untrack(fn)` reads reactive state without subscribing the current observer.

### `isReactive(value)`

Utility for checking whether a value is a Feather reactive handle.

## View Authoring

Feather nodes are created by calling view functions:

```js
Box(
  Title('Bloodwave'),
  Paragraph('Join the covenant.'),
).className('hero');
```

The intended style is modifier-first:

```js
Input()
  .field(form.field('email'))
  .id('email')
  .className('bw-input')
  .type('email')
  .placeholder('you@example.com')
  .autocomplete('email');
```

The framework supports:

- strings and numbers as text nodes
- arrays of children
- nested Feather nodes
- reactive values as children or prop values
- DOM nodes when needed

### Base View Helpers

- `view(type, props, ...children)`
Low-level node constructor.
- `El(type, ...args)`
Alias for creating arbitrary tag-based nodes.
- `Fragment(...children)`
Groups children without a wrapper element.
- `html\`...\``
Template helper for generating strings.
- `createDomNode(value, context)`
Converts Feather output into real DOM nodes.
- `mountView(output, container, context)`
Mounts a resolved view into a DOM container.
- `render(output, container, options)`
Creates a tracked render effect and mounts the result.

## Built-In Components

### General Layout and Text

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
- `Strong`
- `Emphasis`
- `Small`
- `Code`
- `Subtitle`
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

### Forms and Inputs

- `Form`
- `Label`
- `Input`
- `Checkbox`
- `Button`
- `Link`
- `Alert`
- `Icon`
- `Path`

### Control Flow

- `Show(condition, truthyValue, falsyValue)`
- `ForEach(items, renderItem)`

When `condition` or `items` are reactive, these update as fine-grained dynamic regions instead of forcing a full page rerender.

### Semantic Modifiers

- `Title` and `Subtitle` support `.level(1..6)` for semantic heading levels without needing separate `H2`/`H3` components.
- Text-oriented elements such as `Span`, `Paragraph`, `Title`, `Subtitle`, `Strong`, `Emphasis`, `Small`, and `Code` support `.balance()`, `.pretty()`, and `.clamp(lines)`.
- `Strong` also supports `.weight(value)`.
- `Section`, `Article`, `Aside`, `Header`, `Footer`, `Main`, and `Nav` support `.label(text)`, `.labelledBy(id)`, and `.describedBy(id)`.
- `Section` also supports `.landmark(role)` and treats `true` as `role="region"`.
- `List` and `OrderedList` support `.marker(type)`, `.inside()`, `.outside()`, `.gap(value)`, and `.dense()`.
- `OrderedList` also supports `.start(value)` and `.reversed(value)`.
- `ListItem` supports `.value(number)`.

## Styling Modes

### 1. Application Styling

This is the mode used by `example/Register.js`.

You bring your own CSS classes and use Feather for structure, events, state binding, and lifecycle:

```js
Box(
  Title('Bloodwave').className('bw-title'),
  Input()
    .className('bw-input')
    .field(form.field('email')),
).className('bw-card');
```

This mode is ideal when the product already has an art direction, animation language, or handcrafted layout system.

## Modifiers

Most Feather nodes expose chainable modifier methods. They return a cloned node, so they are safe to chain.
Feather is intentionally modifier-centric: start with a node, then describe it through chained bindings, styling, and behavior.

### Common prop and event modifiers

- `.className(value)` / `.class(value)` / `.tw(value)`
- `.style(object)`
- `.bindStyle(key, value)`
- `.prop(key, value)` / `.props(object)`
- `.with(fnOrProps)`
- `.when(condition, fn)` / `.if(condition, truthy, falsy?)`
- `.as(tagName)`
- `.bind(key, value)`
- `.bindAttr(key, value)` / `.aria(key, value)`
- `.ariaInvalid(value)` / `.ariaLabel(value)` / `.ariaDescribedBy(value)`
- `.id(value)`
- `.name(value)`
- `.type(value)`
- `.value(value)` / `.checked(value)`
- `.placeholder(value)` / `.autocomplete(value)`
- `.field(value)` / `.model(value)` / `.form(value)`
- `.href(value)` / `.src(value)` / `.dataLink(value)`
- `.text(value)` / `.html(value)` / `.ref(value)`
- `.attr(key, value)` / `.attrs(object)`
- `.data(key, value)`
- `.on(eventName, handler)`
- `.onClick(handler)`
- `.onInput(handler)`
- `.onChange(handler)`
- `.onSubmit(handler)`
- `.onEnter(handler)` / `.onEscape(handler)`
- `.disabled(value)`
- `.disabledWhen(value)`
- `.submit()`
- `.showWhen(value)` / `.hideWhen(value)` / `.focusWhen(value)`
- `.modifier(fn)`

### Convenience patterns

Conditional chains:

```js
Input()
  .className('bw-input')
  .when(field.invalid, (node) => node.ariaInvalid(true))
  .if(loading, (node) => node.disabled(), (node) => node);
```

Reusable modifier bundles:

```js
const bloodwaveInput = (node) => node
  .className('bw-input')
  .paddingRight('clamp(40px, 9vw, 52px)');

Input()
  .with(bloodwaveInput)
  .field(passwordField);
```

Reactive class and style binding:

```js
Box()
  .className('bw-input-line')
  .bindClass('bw-pw-active', strengthActive)
  .bindClass('bw-pw-pulse', strengthPulse)
  .bindStyle('--pw-gradient', strengthGradient)
  .bindStyle('boxShadow', strengthGlow);
```

ARIA and attribute binding:

```js
Input()
  .value(passwordField.value)
  .ariaInvalid(passwordField.invalid)
  .ariaDescribedBy('password-help');

Button('Save')
  .ariaLabel('Save changes')
  .bindAttr('data-state', saveState);
```

Keyboard and visibility helpers:

```js
Input()
  .onEnter(() => submitSearch())
  .onEscape(() => clearSearch())
  .focusWhen(shouldFocus);

Paragraph('Something went wrong')
  .showWhen(errorMessage);
```

Use `.attr(...)` / `.attrs(...)` as the low-level escape hatch when no dedicated modifier reads better.

Lifecycle-friendly timers and watchers:

```js
setup(ctx) {
  const pulse = signal(false);

  ctx.watch(passwordField.value, () => {
    pulse.set(true);
    return ctx.timeout(() => pulse.set(false), 260, 'lifetime');
  }, { immediate: false, scope: 'lifetime' });
}
```

### Common layout and style modifiers

- `.bindClass(name, condition)` / `.toggleClass(name, condition)`
- `.padding(...)`
- `.margin(...)`
- `.gap(value)`
- `.rowGap(value)`
- `.columnGap(value)`
- `.width(value)` / `.widthStyle(value)`
- `.height(value)` / `.heightStyle(value)`
- `.minWidth(value)` / `.minWidthStyle(value)`
- `.minHeight(value)` / `.minHeightStyle(value)`
- `.maxWidth(value)` / `.maxWidthStyle(value)`
- `.maxHeight(value)` / `.maxHeightStyle(value)`
- `.rounded(value)`
- `.background(value)`
- `.textColor(value)`
- `.border(value)`
- `.borderColor(value)`
- `.opacity(value)` / `.opacityStyle(value)`
- `.font(value)`
- `.textSize(value)`
- `.leading(value)`
- `.tracking(value)`
- `.justify(value)`
- `.align(value)`
- `.items(value)`
- `.self(value)`
- `.grow(value)`
- `.shrink(value)`
- `.display(value)` / `.displayStyle(value)`
- `.position(value)`
- `.top(value)` / `.right(value)` / `.bottom(value)` / `.left(value)` / `.inset(value)`
- `.overflow(value)` / `.overflowX(value)` / `.overflowY(value)`
- `.boxShadow(value)` / `.shadow(value)`
- `.transform(value)`
- `.transition(value)` / `.transitionStyle(value)`
- `.duration(value)`
- `.ease(value)`
- `.animate(value)`
- `.absolute()` / `.relative()` / `.fixed()` / `.sticky()`
- `.centered()`
- `.hide()` / `.show()`

### Primitive-specific modifiers

- `Button`
`.variant(value)`, `.size(value)`, `.block(value)`, `.loading(value)`
- `Link`
`.to(path)`
- `Alert`
`.variant(value)`

## Constants

Feather ships enum-like constant sets for modifier values:

- `Width`
- `Height`
- `Justify`
- `Align`
- `Rounded`
- `Shadow`
- `Font`
- `TextSize`
- `Leading`
- `Tracking`
- `Display`
- `Animation`
- `Background`
- `TextColor`
- `BorderColor`
- `Variant`
- `Tone`
- `Size`

Example:

```js
Box(
  Title('Overview'),
)
  .width(Width.Full)
  .rounded(Rounded.TwoExtraLarge)
  .animate(Animation.Enter);
```

## Theme System

Theme values are plain class strings grouped by semantic meaning.

```js
import { token, setTheme } from './index.js';

token('background.app');
token('button.variant.primary');
token('animation.enter');

setTheme({
  background: {
    app: 'bg-zinc-950',
  },
  text: {
    base: 'text-zinc-50',
  },
  button: {
    variant: {
      primary: 'border-cyan-500 bg-cyan-500 text-zinc-950 hover:bg-cyan-400',
    },
  },
});
```

Public theme helpers:

- `cx(...values)`
Normalizes strings, arrays, objects, and reactive class values into one class string.
- `defineTheme(overrides)`
Deep-merges overrides into the default theme and returns the result.
- `setTheme(overrides)`
Sets the active runtime theme.
- `getTheme()`
Returns the active theme.
- `token(path, fallback)`
Looks up a semantic token path.
- `resolveToken(group, value, fallback)`
Looks up `group.value`.
- `defineVariants({ base, variants, defaults })`
Creates a simple variant resolver for reusable components.

## Forms

`forms.js` adds application-level form state on top of the base input primitives.

### `createForm(options)`

```js
const form = createForm({
  initial: {
    email: '',
    password: '',
    tos: false,
  },
  accepts: [
    { name: 'tos', message: 'You must accept the terms' },
  ],
  validate(values) {
    return {
      email: values.email ? '' : 'Email is required',
      password: values.password ? '' : 'Password is required',
    };
  },
  async submit(values) {
    await api.register(values);
  },
});
```

Returned form API:

- `values`, `errors`, `touched`
Reactive stores.
- `submitting`, `submitError`, `valid`, `invalid`, `dirty`
Reactive state helpers.
- `field(name)`
Returns a field object for a specific form key.
- `validate()`
Runs validation and writes field errors.
- `submit(event)`
Touches all fields, validates, runs async submit, and stores thrown errors in `submitError`.
- `reset(nextInitial?)`
Resets values, touched state, errors, and submit error.
- `set(nextValues)` / `patch(partialValues)`
Updates the form values.
- `touch(nextTouched = true)`
Marks touched state.
- `state(key, initialValue)` / `memo(key, createValue)`
Attach local state or memoized data to the form instance.

### Field objects

`form.field(name)` returns a field object with:

- `name`
- `form`
- `value`
- `error`
- `touched`
- `invalid`
- `set(nextValue)`
- `touch(nextValue = true)`
- `reset()`
- `bind(props)`
- `state(key, initialValue)`
- `memo(key, createValue)`

This is the pattern used heavily in the Bloodwave register page.

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

`Input`, `Checkbox`, and `Form` understand `field`, `model`, and `form` props, so value binding and submit wiring are automatic.
In modifier-first style, that usually looks like:

```js
Form(
  Input()
    .field(form.field('email'))
    .type('email'),
  SubmitButton(form, 'Create account'),
).form(form);
```

## Routing

Use `createRouter()` for small browser applications.

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
DOM element where pages are mounted.
- `routes`
Array of `{ path, component }`.
- `beforeResolve`
Optional redirect hook called before each route render.
- `afterRender`
Optional callback after each route render.
- `notFoundPath`
Fallback path if nothing matches.

Router API:

- `currentRoute`
Currently active route.
- `navigate(path, { replace })`
Programmatic navigation.
- `start()`
Starts routing, listens for `popstate`, intercepts `[data-link]` clicks, and renders the current route.

If a `Link` node uses `.to('/path')`, Feather automatically sets `href` and `data-link`, which the router intercepts for client-side navigation.

## Component Authoring

Reusable Feather components are plain functions.

Useful helpers for building them:

- `resolveComponentArgs(args, defaults)`
Parses the common `(props?, ...children)` signature.
- `mergeProps(...sources)`
Merges `className`, `style`, `attrs`, and `dataset` safely.
- `splitProps(props, keys)`
Separates local props from pass-through props.
- `createPrimitive(tagName, options)`
Creates a new primitive with state, modifiers, prop resolution, and shortcut constructors.
- `setPrimitiveState(node, nextState)`
Updates primitive state from a modifier.
- `unstyled(component)`
Returns a version of a component with `unstyled: true` forced in.

Example:

```js
function Badge(...args) {
  const { props, children } = resolveComponentArgs(args);
  const [local, rest] = splitProps(props, ['tone']);

  return Text(
    mergeProps(rest, {
      className: cx(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
        local.tone === 'accent'
          ? 'bg-sky-100 text-sky-800'
          : 'bg-slate-100 text-slate-700',
      ),
    }),
    ...children,
  );
}
```

## Project-Bloodwave-Web Example

`example/Register.js` demonstrates the framework in its intended production style:

- route-level state lives in `setup()`
- handcrafted CSS classes define the Bloodwave visual identity
- `createForm()` owns values, touched state, errors, and submit flow
- `field.state()` and `field.memo()` hold local UI concerns like password visibility and timers
- `computed()` drives derived UI such as the button label and password-strength state
- reusable modifier bundles keep repeated input styling small
- `bindClass()` and `bindStyle()` handle visual state without building long class/style strings by hand
- `Input`, `Checkbox`, `Form`, and `SubmitButton` reduce wiring while keeping the layout fully custom
- the page remains plain JavaScript end to end

That is the main Feather pattern: use the framework for state, lifecycle, and structure, while leaving room for deeply customized product UI.

## Public Exports

From `index.js`, Feather currently exports:

- core views and helpers:
`Alert`, `Article`, `Aside`, `Button`, `Box`, `Break`, `Checkbox`, `Code`, `Container`, `dynamic`, `El`, `Emphasis`, `FieldBox`, `Footer`, `ForEach`, `Form`, `Fragment`, `Group`, `HStack`, `Header`, `Input`, `Label`, `Link`, `List`, `ListItem`, `Main`, `Nav`, `OrderedList`, `Section`, `Show`, `Small`, `Spacer`, `Span`, `Strong`, `Subtitle`, `Surface`, `Text`, `Title`, `VStack`, `ZStack`, `createDomNode`, `createPrimitive`, `html`, `mergeProps`, `mountView`, `page`, `Paragraph`, `Path`, `Icon`, `render`, `resolveComponentArgs`, `setPrimitiveState`, `setupGroup`, `setupState`, `splitProps`, `unstyled`, `view`
- router:
`createRouter`
- form helpers:
`CheckboxField`, `Field`, `FieldControl`, `FieldError`, `FieldHint`, `FieldLabel`, `FormScope`, `InputField`, `SubmitButton`, `TextField`, `createForm`
- reactive helpers:
`batch`, `computed`, `effect`, `isReactive`, `read`, `signal`, `store`, `untrack`
- constants:
`Align`, `Animation`, `Background`, `BorderColor`, `Display`, `Font`, `Height`, `Justify`, `Leading`, `Rounded`, `Shadow`, `Size`, `TextColor`, `TextSize`, `Tone`, `Tracking`, `Variant`, `Width`
- theme helpers:
`cx`, `defineTheme`, `defineVariants`, `getTheme`, `resolveToken`, `setTheme`, `token`

## Notes

- Feather stays coarse-grained when a page render truly depends on reactive reads, but reactive prop bindings and control-flow regions now update local DOM more selectively.
- Render-scoped DOM bindings are cleaned up automatically before the next render.
- Lifetime cleanup is available through `context.cleanup(fn, 'lifetime')`.
- `context.timeout(...)`, `context.interval(...)`, `context.raf(...)`, and `context.watch(...)` keep transient work aligned with page teardown.
- Theme tokens are plain strings, so the styling system is easy to inspect and override.
- Feather works especially well for app shells, auth flows, dashboards, tools, and internal products that want direct control over markup and CSS without giving up reactive rendering.
