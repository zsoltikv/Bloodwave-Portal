import '../../css/pages/ResetPassword.css';
import { API_BASE } from '../auth.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import {
  Box,
  Button,
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

const SUCCESS_ICON = `
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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

function getParamFromUrl(name) {
  const searchParams = new URLSearchParams(window.location.search);
  const fromSearch = searchParams.get(name);
  if (fromSearch) return fromSearch.trim();

  const hashQuery = window.location.hash.split('?')[1] || '';
  const hashParams = new URLSearchParams(hashQuery);
  const fromHash = hashParams.get(name);
  return fromHash ? fromHash.trim() : '';
}

function validateResetPassword(values) {
  const errors = {
    password: '',
    confirm: '',
  };

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Minimum 8 characters';
  }

  if (!values.confirm) {
    errors.confirm = 'Please confirm your password';
  } else if (values.confirm !== values.password) {
    errors.confirm = 'Passwords do not match';
  }

  return errors;
}

async function submitResetPassword(values, pageState, ctx) {
  if (pageState.meta.tokenMissing.get()) {
    throw new Error('Missing or invalid reset token.');
  }

  pageState.submit.success.set(false);
  pageState.transition.formLeaving.set(false);
  pageState.transition.formHidden.set(false);
  pageState.transition.successVisible.set(false);

  const payload = {
    token: pageState.meta.token,
    email: pageState.meta.email || undefined,
    password: values.password,
    newPassword: values.password,
    confirmPassword: values.confirm,
  };

  const response = await fetch(`${API_BASE}/api/user/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || 'Password reset failed. Please try again.');
  }

  pageState.submit.success.set(true);

  ctx.timeout(() => {
    pageState.transition.formLeaving.set(true);
    ctx.timeout(() => {
      pageState.transition.formHidden.set(true);
      pageState.transition.successVisible.set(true);
    }, 370, 'lifetime');
  }, 500, 'lifetime');
}

function FieldError({ field, style = null }) {
  return Paragraph()
    .className('bw-error')
    .text(field.error)
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
const bloodwaveParticles = (style) => Box().className('bw-particle').style(style);
const bloodwaveFieldWrap = (node) => node.className('bw-input-wrap');
const bloodwaveFieldLine = (node) => node.className('bw-input-line');
const bloodwavePasswordInput = (node) => node
  .with(bloodwaveInput)
  .placeholder(PASSWORD_PLACEHOLDER)
  .autocomplete('new-password')
  .paddingRight('clamp(40px, 9vw, 52px)');

const bloodwaveField = ({
  label,
  fieldId,
  error,
  className = 'bw-field',
}) => (node) => VStack(
  BloodwaveLabel(label, fieldId),
  node,
  FieldError({ field: error }),
).className(className);

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
      'Back to ',
      Link('Sign In')
        .href('/login')
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

const ResetPassword = page({
  name: 'ResetPassword',

  setup(ctx) {
    ensureGlobalStarfield();

    const particles = createParticles();
    const token = getParamFromUrl('token');
    const email = getParamFromUrl('email');
    const tokenMissing = signal(!token);

    const submitState = {
      success: signal(false),
    };

    const transition = {
      formLeaving: signal(false),
      formHidden: signal(false),
      successVisible: signal(false),
    };

    const form = createForm({
      initial: {
        password: '',
        confirm: '',
      },
      validate: validateResetPassword,
      submit: (values) => submitResetPassword(values, {
        meta: {
          token,
          email,
          tokenMissing,
        },
        submit: submitState,
        transition,
      }, ctx),
    });

    const passwordField = form.field('password');
    const confirmField = form.field('confirm');

    const password = {
      visibility: createPasswordVisibilityState(passwordField),
    };

    const confirm = {
      visibility: createPasswordVisibilityState(confirmField),
    };

    const submit = {
      ...submitState,
      label: computed(() => {
        if (submitState.success.get()) return 'Updated';
        if (form.submitting.get()) return 'Updating...';
        return 'Update Password';
      }),
      error: computed(() => {
        if (tokenMissing.get()) return 'Missing or invalid reset token.';
        return form.submitError.get()?.message || '';
      }),
    };

    return setupState(
      {
        form,
        particles,
      },
      setupGroup('fields', {
        password: passwordField,
        confirm: confirmField,
      }),
      setupGroup('password', password),
      setupGroup('confirmState', confirm),
      setupGroup('submit', submit),
      setupGroup('meta', {
        tokenMissing,
      }),
      setupGroup('transition', {
        ...transition,
        style: {
          display: computed(() => (transition.formHidden.get() ? 'none' : 'block')),
          opacity: computed(() => (transition.formLeaving.get() ? '0' : '1')),
          pointerEvents: computed(() => (transition.formLeaving.get() ? 'none' : 'auto')),
          transform: computed(() => (transition.formLeaving.get() ? 'translateY(-8px)' : 'translateY(0)')),
          transition: computed(() => (transition.formLeaving.get() ? 'opacity 0.35s ease, transform 0.35s ease' : 'none')),
        },
      }),
    );
  },

  render(ctx) {
    const passwordField = ctx.fields.password;
    const confirmField = ctx.fields.confirm;

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
            Subtitle('Set\u00A0\u00A0New\u00A0\u00A0Password').className('bw-subtitle'),
          ).className('bw-header'),
          Box(
            Paragraph('Choose a new password for your account.').className('bw-desc'),
            Form(
              VStack(
                Box(
                  Input()
                    .with(bloodwavePasswordInput)
                    .id('rpPassword')
                    .field(passwordField)
                    .type(ctx.password.visibility.inputType)
                    .ariaInvalid(passwordField.invalid)
                    .onEscape(() => ctx.password.visibility.revealed.set(false)),
                  PasswordToggle({
                    revealed: ctx.password.visibility.revealed,
                    iconMarkup: ctx.password.visibility.icon,
                    label: 'Toggle new password visibility',
                  }),
                  Box().with(bloodwaveFieldLine),
                )
                  .with(bloodwaveFieldWrap)
                  .with(bloodwaveField({
                    label: 'New Password',
                    fieldId: 'rpPassword',
                    error: passwordField,
                  })),
                Box(
                  Input()
                    .with(bloodwavePasswordInput)
                    .id('rpConfirm')
                    .field(confirmField)
                    .type(ctx.confirmState.visibility.inputType)
                    .ariaInvalid(confirmField.invalid)
                    .onEscape(() => ctx.confirmState.visibility.revealed.set(false)),
                  PasswordToggle({
                    revealed: ctx.confirmState.visibility.revealed,
                    iconMarkup: ctx.confirmState.visibility.icon,
                    label: 'Toggle confirm password visibility',
                  }),
                  Box().with(bloodwaveFieldLine),
                )
                  .with(bloodwaveFieldWrap)
                  .with(bloodwaveField({
                    label: 'Confirm Password',
                    fieldId: 'rpConfirm',
                    error: confirmField,
                    className: 'bw-field bw-field--confirm',
                  })),
                Paragraph()
                  .className('bw-error bw-error--center')
                  .text(ctx.submit.error)
                  .showWhen(ctx.submit.error),
                SubmitButton(
                  ctx.form,
                  Box().className('bw-btn-shimmer'),
                  Box().className('bw-btn-text').text(ctx.submit.label),
                )
                  .className('bw-btn')
                  .bindClass('success', ctx.submit.success)
                  .disabledWhen(ctx.meta.tokenMissing)
                  .id('rpBtn'),
              ),
            )
              .form(ctx.form)
              .id('rpForm')
              .bindStyle('display', ctx.transition.style.display)
              .bindStyle('opacity', ctx.transition.style.opacity)
              .bindStyle('pointerEvents', ctx.transition.style.pointerEvents)
              .bindStyle('transform', ctx.transition.style.transform)
              .bindStyle('transition', ctx.transition.style.transition),
            Box(
              Box(
                Icon()
                  .attrs({
                    xmlns: 'http://www.w3.org/2000/svg',
                    fill: 'none',
                    viewBox: '0 0 24 24',
                    stroke: 'currentColor',
                    'stroke-width': '1.35',
                  })
                  .html(SUCCESS_ICON),
              ).className('bw-success-icon'),
              Paragraph('Password Updated').className('bw-success-title'),
              Paragraph('Your password has been changed successfully.').className('bw-success-text'),
              Box().className('bw-success-sep'),
            )
              .className('bw-success-panel')
              .bindClass('visible', ctx.transition.successVisible)
              .id('rpSuccess'),
            Divider(),
            FooterLink(),
          ).className('bw-form').id('rpFormWrap'),
        ).className('bw-card-inner'),
      ).className('bw-card'),
    ).className('bw-root');
  },
});

export default ResetPassword;
