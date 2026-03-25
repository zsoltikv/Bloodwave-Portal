import '../../css/pages/ForgotPassword.css';
import { ensureGlobalStarfield } from '../global-starfield.js';
import { API_BASE } from '../auth.js';
import {
  Box,
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
  Break,
} from '../feather/index.js';

const SUCCESS_ICON = `
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
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

function validateForgotPassword(values) {
  const errors = { email: '' };
  const email = values.email.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.email = 'Email is required';
  } else if (!emailRe.test(email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
}

async function submitForgotPassword(values, pageState, ctx) {
  pageState.submit.success.set(false);
  pageState.transition.formLeaving.set(false);
  pageState.transition.formHidden.set(false);
  pageState.transition.successVisible.set(false);

  try {
    await fetch(`${API_BASE}/api/user/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email.trim() }),
    });
  } catch (err) {
    console.error('API error:', err);
  }

  pageState.submit.success.set(true);

  ctx.timeout(() => {
    pageState.transition.formLeaving.set(true);
    ctx.timeout(() => {
      pageState.transition.formHidden.set(true);
      pageState.transition.successVisible.set(true);
    }, 370, 'lifetime');
  }, 650, 'lifetime');
}

function FieldError({ field }) {
  return Paragraph()
    .className('bw-error')
    .text(field.error);
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
      'Remembered it? ',
      Link('Sign In')
        .href('/login')
        .dataLink()
        .className('bw-forgot'),
    ),
  ).className('bw-footer-link');
}

const ForgotPassword = page({
  name: 'ForgotPassword',

  setup(ctx) {
    ensureGlobalStarfield();

    const particles = createParticles();
    const submitState = {
      success: signal(false),
    };
    const transition = {
      formLeaving: signal(false),
      formHidden: signal(false),
      successVisible: signal(false),
    };
    const transitionStyle = {
      display: computed(() => (transition.formHidden.get() ? 'none' : 'block')),
      opacity: computed(() => (transition.formLeaving.get() ? '0' : '1')),
      pointerEvents: computed(() => (transition.formLeaving.get() ? 'none' : 'auto')),
      transform: computed(() => (transition.formLeaving.get() ? 'translateY(-8px)' : 'translateY(0)')),
      transition: computed(() => (transition.formLeaving.get() ? 'opacity 0.35s ease, transform 0.35s ease' : 'none')),
    };

    const form = createForm({
      initial: {
        email: '',
      },
      validate: validateForgotPassword,
      submit: (values) => submitForgotPassword(values, {
        submit: submitState,
        transition,
      }, ctx),
    });

    const emailField = form.field('email');

    const submit = {
      ...submitState,
      label: computed(() => {
        if (submitState.success.get()) return '\u2726  Sent  \u2726';
        if (form.submitting.get()) return 'Sending...';
        return 'Send Reset Link';
      }),
      error: computed(() => form.submitError.get()?.message || ''),
    };

    return setupState(
      {
        form,
        particles,
      },
      setupGroup('fields', {
        email: emailField,
      }),
      setupGroup('submit', submit),
      setupGroup('transition', {
        ...transition,
        style: transitionStyle,
      }),
    );
  },

  render(ctx) {
    const emailField = ctx.fields.email;

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
            Subtitle('Restore\u00A0\u00A0Your\u00A0\u00A0Access').className('bw-subtitle'),
          ).className('bw-header'),
          Box(
            Paragraph(
              'Enter your email address and we will send',
              Break(),
              'you a link to reset your password.',
            ).className('bw-desc'),
            Form(
              VStack(
                Box(
                  Input()
                    .with(bloodwaveInput)
                    .id('fpEmail')
                    .field(emailField)
                    .type('email')
                    .placeholder('your@email.com')
                    .autocomplete('email'),
                  Box().with(bloodwaveFieldLine),
                )
                  .with(bloodwaveFieldWrap)
                  .with(bloodwaveField({
                    label: 'Email Address',
                    fieldId: 'fpEmail',
                    error: emailField,
                  })),
                SubmitButton(
                  ctx.form,
                  Box().className('bw-btn-shimmer'),
                  Box().className('bw-btn-text').text(ctx.submit.label),
                )
                  .className('bw-btn')
                  .bindClass('success', ctx.submit.success)
                  .id('fpBtn'),
              ),
            )
              .form(ctx.form)
              .id('fpForm')
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
                    'stroke-width': '1.2',
                  })
                  .html(SUCCESS_ICON),
              ).className('bw-success-icon'),
              Paragraph('Check Your Inbox').className('bw-success-title'),
              Paragraph('If an account exists for that address, a reset link is on its way.').className('bw-success-text'),
              Box().className('bw-success-sep'),
            )
              .className('bw-success-panel')
              .bindClass('visible', ctx.transition.successVisible)
              .id('fpSuccess'),
            Divider(),
            FooterLink(),
          ).className('bw-form').id('fpFormWrap'),
        ).className('bw-card-inner'),
      ).className('bw-card'),
    ).className('bw-root');
  },
});

export default ForgotPassword;
