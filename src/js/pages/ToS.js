import '../../css/pages/ToS.css';
import { isLoggedIn } from '../auth.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import {
  Box,
  List,
  ListItem,
  Link,
  Paragraph,
  Section,
  Strong,
  Subtitle,
  Title,
  page,
  setupGroup,
  setupState,
} from '../feather/index.js';

const TOS_SECTIONS = [
  {
    title: '1. Terms of Service',
    items: [
      {
        heading: '1.1 Acceptance of Terms',
        body: [
          'By accessing and using Bloodwave, you accept and agree to be bound by the terms and provision of this agreement.',
          'If you do not agree to these terms, please do not use our service.',
        ],
      },
      {
        heading: '1.2 Use of Service',
        body: [
          'You agree to use Bloodwave only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else\'s use and enjoyment of the service.',
          'Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our service.',
        ],
      },
      {
        heading: '1.3 User Account',
        body: [
          'You are responsible for maintaining the confidentiality of your account and password.',
          'You agree to accept responsibility for all activities that occur under your account. We reserve the right to refuse service, terminate accounts, or remove or edit content at our sole discretion.',
        ],
      },
      {
        heading: '1.4 Intellectual Property',
        body: [
          'The service and its original content, features, and functionality are and will remain the exclusive property of Bloodwave and its licensors.',
          'The service is protected by copyright, trademark, and other laws.',
        ],
      },
      {
        heading: '1.5 Termination',
        body: [
          'We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.',
        ],
      },
    ],
  },
  {
    title: '2. Cookie Policy',
    items: [
      {
        heading: '2.1 What Are Cookies',
        body: [
          'Cookies are small pieces of text sent to your web browser by a website you visit.',
          'A cookie file is stored in your web browser and allows the service or a third-party to recognize you and make your next visit easier and the service more useful to you.',
        ],
      },
      {
        heading: '2.2 How We Use Cookies',
        body: [
          'When you use and access Bloodwave, we may place cookie files in your web browser. We use cookies for the following purposes:',
        ],
        list: [
          'To enable certain functions of the service',
          'To provide analytics and track usage patterns',
          'To store your preferences and settings',
          'To enable authentication and maintain your session',
        ],
      },
      {
        heading: '2.3 Types of Cookies We Use',
        body: [
          {
            strong: 'Essential Cookies:',
            text: ' These cookies are necessary for the service to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.',
          },
          {
            strong: 'Analytics Cookies:',
            text: ' These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.',
          },
        ],
      },
      {
        heading: '2.4 Your Choices Regarding Cookies',
        body: [
          'If you\'d like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.',
          'Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer.',
        ],
      },
    ],
  },
  {
    title: '3. Changes to This Agreement',
    items: [
      {
        body: [
          'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.',
          'Your continued use of the service after any such changes constitutes your acceptance of the new Terms.',
        ],
      },
    ],
  },
  {
    title: '4. Contact Us',
    items: [
      {
        body: [
          'If you have any questions about these Terms or our Cookie Policy, please contact us through our support channels.',
        ],
      },
    ],
  },
];

function Ornament() {
  return Box(
    Box().className('bw-ornament-line'),
    Box().className('bw-ornament-diamond'),
    Box().className('bw-ornament-line'),
  ).className('bw-ornament');
}

function CardCorners() {
  return [
    Box().className('bw-corner bw-corner--tl'),
    Box().className('bw-corner bw-corner--tr'),
    Box().className('bw-corner bw-corner--bl'),
    Box().className('bw-corner bw-corner--br'),
  ];
}

function ToSParagraph(block) {
  if (typeof block === 'string') {
    return Paragraph(block).className('bw-tos-text');
  }

  return Paragraph(
    Strong(block.strong),
    block.text,
  ).className('bw-tos-text');
}

function ToSSectionContent(item) {
  return [
    item.heading ? Subtitle(item.heading).level(3).className('bw-tos-subheading') : null,
    ...(item.body || []).map(ToSParagraph),
    item.list
      ? List(
        item.list.map((entry) => ListItem(entry)),
      ).className('bw-tos-list')
      : null,
  ];
}

const ToS = page({
  name: 'ToS',

  setup() {
    ensureGlobalStarfield();

    const loggedIn = isLoggedIn();

    return setupState(
      setupGroup('cta', {
        href: loggedIn ? '/main' : '/register',
        label: loggedIn ? 'Back to Dashboard' : 'Back to Registration',
      }),
    );
  },

  render(ctx) {
    return Box(
      Box().className('bw-glow-center'),
      Box(
        Box(
          ...CardCorners(),
          Box(
            Ornament(),
            Title('ToS & Cookie Policy').className('bw-title'),
          )
            .className('bw-header')
            .margin({ bottom: '2rem' }),
          Box(
            TOS_SECTIONS.map((section) => Section(
              Subtitle(section.title).level(2).className('bw-tos-heading'),
              section.items.map(ToSSectionContent),
            ).className('bw-tos-section')),
            Box(
              Link(
                Box().className('bw-btn-shimmer'),
                Box().className('bw-btn-text').text(ctx.cta.label),
              )
                .href(ctx.cta.href)
                .dataLink()
                .className('bw-btn')
                .style({ display: 'inline-block', marginTop: '1rem' }),
            )
              .className('bw-footer-link')
              .style({ marginTop: '2rem', textAlign: 'center' }),
          ).className('bw-tos-content'),
        )
          .className('bw-card-inner')
          .style({ padding: 'clamp(24px, 5vw, 48px)' }),
      )
        .className('bw-card')
        .style({ maxWidth: '800px', width: '90%' }),
    ).className('bw-root');
  },
});

export default ToS;
