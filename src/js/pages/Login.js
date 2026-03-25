import '../../css/pages/Login.css';
import { login } from '../auth.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import {
  Box,
  Button,
  Checkbox,
  Form,
  Icon,
  Input,
  Label,
  Link,
  Paragraph,
  SubmitButton,
  Subtitle,
  Title,
  VStack,
  computed,
  createForm,
  page,
  signal,
  setupGroup,
  setupState,
} from '../feather/index.js';

const PASSWORD_PLACEHOLDER = '\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7';

const EYE_OPEN = `
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
`;

const EYE_CLOSED = `
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
`;

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

function validateLogin(values) {
  return {
    username: values.username.trim() ? '' : 'Username is required',
    password: values.password ? '' : 'Password is required',
    rememberMe: '',
  };
}

async function submitLogin(values, submitState, ctx) {
  submitState.success.set(false);

  await login(
    values.username.trim(),
    values.password,
    values.rememberMe,
  );

  submitState.success.set(true);
  ctx.timeout(() => window.router.navigate('/main'), 700, 'lifetime');
}

function FieldError({ field, style = null }) {
  return Paragraph()
    .className('bw-error')
    .text(() => field.error.get())
    .when(style, (node) => node.style(style));
}

function PasswordToggle({ revealed, iconMarkup, label }) {
  return Button(
    Icon()
      .attrs({
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        'stroke-width': '1.5',
      })
      .html(iconMarkup),
  )
    .type('button')
    .className('bw-pw-toggle')
    .ariaLabel(label)
    .onClick(() => revealed.update((value) => !value));
}

function BloodwaveLabel(text, fieldId) {
  return Label(text)
    .className('bw-label')
    .attr('for', fieldId);
}

const bloodwaveInput = (node) => node.className('bw-input');
const bloodwaveFieldWrap = (node) => node.className('bw-input-wrap');
const bloodwaveFieldLine = (node) => node.className('bw-input-line');
const bloodwaveParticles = (style) => Box().className('bw-particle').style(style);

const bloodwavePasswordInput = (node) => node
  .with(bloodwaveInput)
  .placeholder(PASSWORD_PLACEHOLDER)
  .autocomplete('current-password')
  .paddingRight('clamp(40px, 9vw, 52px)');

const bloodwaveField = ({
  label,
  fieldId,
  error,
  className = 'bw-field',
  margin = null,
}) => (node) => VStack(
  BloodwaveLabel(label, fieldId),
  node,
  FieldError({ field: error }),
)
  .className(className)
  .when(margin, (nextNode) => nextNode.margin(margin));

function RememberMeField(field) {
  return Box(
    Label(
      Checkbox()
        .field(field)
        .className('bw-checkbox'),
      Box('Remember Me').className('bw-remember-label'),
    ).className('bw-remember'),
    Link('Forgot Password')
      .href('/forgot-password')
      .dataLink()
      .className('bw-forgot'),
  ).className('bw-extras');
}

function Divider() {
  return Box(
    Box().className('bw-divider-line'),
    Box('or').className('bw-divider-text'),
    Box().className('bw-divider-line'),
  ).className('bw-divider');
}

function FooterLink() {
  return Box(
    Paragraph(
      'New member? ',
      Link('Join Now')
        .href('/register')
        .dataLink()
        .className('bw-forgot'),
    ),
  ).className('bw-footer-link');
}

function createPasswordVisibilityState(field) {
  const revealed = field.state('revealed', false);

  return {
    revealed,
    icon: computed(() => (revealed.get() ? EYE_CLOSED : EYE_OPEN)),
    inputType: computed(() => (revealed.get() ? 'text' : 'password')),
  };
}

const Login = page({
  name: 'Login',

  setup(ctx) {
    ensureGlobalStarfield();

    const particles = createParticles();
    const submitState = {
      success: signal(false),
    };

    const form = createForm({
      initial: {
        username: '',
        password: '',
        rememberMe: false,
      },
      validate: validateLogin,
      submit: (values) => submitLogin(values, submitState, ctx),
    });

    const usernameField = form.field('username');
    const passwordField = form.field('password');
    const rememberMeField = form.field('rememberMe');
    const password = {
      visibility: createPasswordVisibilityState(passwordField),
    };

    const submit = {
      ...submitState,
      label: computed(() => {
        if (submitState.success.get()) return '\u2726  Welcome Back  \u2726';
        if (form.submitting.get()) return '\u2726  Entering\u2026  \u2726';
        return 'Enter';
      }),
      error: computed(() => form.submitError.get()?.message || ''),
    };

    return setupState(
      {
        form,
        particles,
      },
      setupGroup('fields', {
        username: usernameField,
        password: passwordField,
        rememberMe: rememberMeField,
      }),
      setupGroup('password', password),
      setupGroup('submit', submit),
    );
  },

  render(ctx) {
    const {
      username: usernameField,
      password: passwordField,
      rememberMe: rememberMeField,
    } = ctx.fields;

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
            Box(
              Box().className('bw-ornament-line'),
              Box().className('bw-ornament-diamond'),
              Box().className('bw-ornament-line'),
            ).className('bw-ornament'),
            Title('Bloodwave').className('bw-title'),
            Subtitle('Members\u00A0\u00A0Only\u00A0\u00A0Access').className('bw-subtitle'),
          ).className('bw-header'),
          Form(
            VStack(
              Box(
                Input()
                  .with(bloodwaveInput)
                  .id('lxUsername')
                  .field(usernameField)
                  .placeholder('your_username')
                  .autocomplete('username'),
                Box().with(bloodwaveFieldLine),
              )
                .with(bloodwaveFieldWrap)
                .with(bloodwaveField({
                  label: 'Username',
                  fieldId: 'lxUsername',
                  error: usernameField,
                })),
              Box(
                Input()
                  .with(bloodwavePasswordInput)
                  .id('lxPassword')
                  .field(passwordField)
                  .type(() => ctx.password.visibility.inputType.get())
                  .ariaInvalid(() => passwordField.invalid.get())
                  .onEscape(() => ctx.password.visibility.revealed.set(false)),
                PasswordToggle({
                  revealed: ctx.password.visibility.revealed,
                  iconMarkup: () => ctx.password.visibility.icon.get(),
                  label: 'Toggle password visibility',
                }),
                Box().with(bloodwaveFieldLine),
              )
                .with(bloodwaveFieldWrap)
                .with(bloodwaveField({
                  label: 'Password',
                  fieldId: 'lxPassword',
                  error: passwordField,
                })),
              RememberMeField(rememberMeField),
              Paragraph()
                .className('bw-error')
                .text(() => ctx.submit.error.get())
                .showWhen(() => ctx.submit.error.get())
                .textAlign('center'),
              SubmitButton(
                ctx.form,
                Box().className('bw-btn-shimmer'),
                Box().className('bw-btn-text').text(() => ctx.submit.label.get()),
              )
                .className('bw-btn')
                .bindClass('success', () => ctx.submit.success.get())
                .id('lxBtn'),
              Divider(),
              FooterLink(),
            ),
          )
            .form(ctx.form)
            .className('bw-form')
            .id('lxForm'),
        ).className('bw-card-inner'),
      ).className('bw-card'),
    ).className('bw-root');
  },
});

export default Login;
