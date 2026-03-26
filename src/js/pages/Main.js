import '../../css/pages/Main.css';
import '../../css/pages/Stats.css';
import { API_BASE, getUser, authFetch } from '../auth.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import {
  DashboardNavbar,
  mountDashboardNavbar,
  refreshDashboardNavbarUsername,
  resolveDashboardDisplayName,
} from '../components/DashboardNavbar.js';
import swordImg from '../../assets/weapons/sword.png';
import pistolImg from '../../assets/weapons/pistol.png';
import shotgunImg from '../../assets/weapons/shotgun.png';
import orbitingSwordImg from '../../assets/weapons/orbiting_sword.png';
import orbitingIceCrystalImg from '../../assets/weapons/orbiting_ice_crystal.png';
import bloodScytheImg from '../../assets/weapons/blood_scythe.png';
import bloodforgedSigilImg from '../../assets/items/bloodforged_sigil.png';
import cascadeOrbImg from '../../assets/items/cascade_orb.png';
import glassEdgeImg from '../../assets/items/glass_edge.png';
import hasteRuneImg from '../../assets/items/haste_rune.png';
import heartOfAscendanceImg from '../../assets/items/heart_of_ascendance.png';
import hourglassPendantImg from '../../assets/items/hourglass_pendant.png';
import longreachEmblemImg from '../../assets/items/longreach_emblem.png';
import marksmanCoreImg from '../../assets/items/marksman_core.png';
import oathbladeImg from '../../assets/items/oathblade.png';
import orbOfHealthImg from '../../assets/items/orb_of_health.png';
import swiftshotCharmImg from '../../assets/items/swiftshot_charm.png';
import volleyStoneImg from '../../assets/items/volley_stone.png';
import { Box, Button, El, Icon, Img, Link, Main as MainContent, Paragraph, Span, Title, page, setupGroup, setupState, signal } from '../feather/index.js';

const WEAPON_IMAGE_BY_ID = {
  1: swordImg,
  2: pistolImg,
  3: shotgunImg,
  4: orbitingSwordImg,
  5: orbitingIceCrystalImg,
  6: bloodScytheImg,
};

const ITEM_IMAGE_BY_ID = {
  1: bloodforgedSigilImg,
  2: cascadeOrbImg,
  3: glassEdgeImg,
  4: hasteRuneImg,
  5: heartOfAscendanceImg,
  6: hourglassPendantImg,
  7: longreachEmblemImg,
  8: marksmanCoreImg,
  9: oathbladeImg,
  10: orbOfHealthImg,
  11: swiftshotCharmImg,
  12: volleyStoneImg,
};

const MAIN_ICONS = {
  plus: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />',
};

const MAIN_STAT_SECTIONS = [
  {
    title: 'Core Totals',
    subtitle: 'Overall lifetime volume',
    stats: [
      { name: 'Matches Played', key: 'matches', type: 'int', unit: 'total games' },
      { name: 'Time Lived', key: 'time-lived', type: 'time-hm', unit: 'total survival time', initialText: '0h 0m' },
      { name: 'Damage Dealt', key: 'damage', type: 'int', unit: 'total damage' },
      { name: 'Damage Taken', key: 'damage-taken', type: 'int', unit: 'total damage received' },
      { name: 'Enemies Killed', key: 'kills', type: 'int', unit: 'eliminations' },
      { name: 'Coins Collected', key: 'coins', type: 'int', unit: 'total coins' },
    ],
  },
  {
    title: 'Per Match Efficiency',
    subtitle: 'Average output and pace',
    stats: [
      { name: 'Avg Survival / Match', key: 'avg-survival-match', type: 'time-hms', unit: 'time per game', initialText: '0h 0m 0s' },
      { name: 'Avg Damage / Match', key: 'avg-damage-match', type: 'int', unit: 'damage per game' },
      { name: 'Avg Damage / Minute', key: 'avg-damage-minute', type: 'int', unit: 'damage per minute' },
      { name: 'Avg Kills / Match', key: 'avg-kills-match', type: 'int', unit: 'kills per game' },
      { name: 'Avg Kills / Minute', key: 'avg-kills-minute', type: 'int', unit: 'kills per minute' },
      { name: 'Avg Coins / Match', key: 'avg-coins-match', type: 'int', unit: 'coins per game' },
    ],
  },
  {
    title: 'Peak Records',
    subtitle: 'Best single-run highlights',
    stats: [
      { name: 'Best Match Score', key: 'best-score', type: 'int', unit: 'top weighted run score' },
      { name: 'Highest Level Reached', key: 'highest-level', type: 'int', unit: 'all-time best level' },
      { name: 'Best Match Survival', key: 'best-survival', type: 'time-hms', unit: 'longest single match', initialText: '0h 0m 0s' },
      { name: 'Best Match Damage', key: 'best-damage', type: 'int', unit: 'top single-match damage' },
      { name: 'Best Match Kills', key: 'best-kills', type: 'int', unit: 'top single-match kills' },
      { name: 'Best Match Coins', key: 'best-coins', type: 'int', unit: 'top single-match coins' },
    ],
  },
  {
    title: 'Run Shape And Stability',
    subtitle: 'Session length distribution and consistency',
    stats: [
      { name: 'Short Match Ratio', key: 'short-match-ratio', type: 'int', unit: 'under 2 min (%)' },
      { name: 'Long Match Ratio', key: 'long-match-ratio', type: 'int', unit: 'over 10 min (%)' },
      { name: 'Performance Volatility', key: 'performance-volatility', type: 'int', unit: 'lower = more stable (%)' },
    ],
  },
];

const MAIN_STAT_VALUE_BY_KEY = {
  damage: (stats) => toNonNegativeInt(stats.damageDealt),
  'damage-taken': (stats) => toNonNegativeInt(stats.damageTaken),
  kills: (stats) => toNonNegativeInt(stats.enemiesKilled),
  'time-lived': (stats) => toNonNegativeInt(stats.totalMinutesLived),
  matches: (stats) => toNonNegativeInt(stats.matchesPlayed),
  coins: (stats) => toNonNegativeInt(stats.coinsCollected),
  'avg-damage-match': (stats) => toNonNegativeInt(stats.averageDamagePerMatch),
  'avg-kills-match': (stats) => toNonNegativeInt(stats.averageKillsPerMatch),
  'avg-coins-match': (stats) => toNonNegativeInt(stats.averageCoinsPerMatch),
  'avg-kills-minute': (stats) => toNonNegativeInt(stats.averageKillsPerMinute),
  'avg-damage-minute': (stats) => toNonNegativeInt(stats.averageDamagePerMinute),
  'avg-survival-match': (stats) => toNonNegativeInt(stats.averageSurvivalSecondsPerMatch),
  'best-damage': (stats) => toNonNegativeInt(stats.bestMatchDamage),
  'best-kills': (stats) => toNonNegativeInt(stats.bestMatchKills),
  'best-survival': (stats) => toNonNegativeInt(stats.bestMatchSurvivalSeconds),
  'highest-level': (stats) => toNonNegativeInt(stats.highestLevelReached),
  'best-coins': (stats) => toNonNegativeInt(stats.bestMatchCoins),
  'best-score': (stats) => toNonNegativeInt(stats.bestMatchScore),
  'short-match-ratio': (stats) => toNonNegativeInt(stats.shortMatchRatioPercent),
  'long-match-ratio': (stats) => toNonNegativeInt(stats.longMatchRatioPercent),
  'performance-volatility': (stats) => toNonNegativeInt(stats.performanceVolatilityPercent),
};

const svgIcon = (markup, fill = 'none', stroke = 'currentColor', width = '1.5') => Icon().attrs({
  xmlns: 'http://www.w3.org/2000/svg',
  fill,
  viewBox: '0 0 24 24',
  stroke,
  'stroke-width': width,
}).html(markup);

function mainOrnament() {
  return Box(
    Box().className('mn-ornament-line'),
    Box().className('mn-ornament-diamond'),
    Box().className('mn-ornament-line'),
  ).className('mn-ornament');
}

function selectMainMatch(ctx, matchId) {
  ctx.matches.selectedId.set(matchId);
}

function mainMatchList(ctx) {
  const status = ctx.matches.status.get();
  const matches = ctx.matches.rows.get();

  if (status === 'loading') {
    return Box('Loading played matches...').className('mn-match-empty');
  }

  if (status === 'error') {
    return Box(ctx.matches.error.get() || 'Failed to load played matches.').className('mn-match-empty');
  }

  if (!matches.length) {
    return Box('No played matches yet.').className('mn-match-empty');
  }

  return matches.map((match, index) => {
    const swipeDelayMs = Math.min(index * 55, 440);
    const swipeShiftPx = Math.min(20 + index * 3, 42);

    return Button(
      Box(
        Span(formatDuration(match.durationSeconds)).className('mn-match-chip'),
        Span(`Lv ${match.levelReached}`).className('mn-match-chip'),
      ).className('mn-match-meta'),
      Box(formatPlayedAt(match.playedAt)).className('mn-match-time'),
    )
      .className('mn-match-item')
      .attr('type', 'button')
      .attr('role', 'option')
      .attr('aria-selected', () => String(ctx.matches.selectedId.get() === match.id))
      .attr('data-match-id', match.id)
      .style({ '--mn-row-delay': `${swipeDelayMs}ms`, '--mn-row-shift': `${swipeShiftPx}px` })
      .onClick(() => selectMainMatch(ctx, match.id));
  });
}

function mainPanelStat(label, value) {
  return Box(
    Box(label).className('mn-panel-label'),
    Box(value).className('mn-panel-value'),
  ).className('mn-panel-stat');
}

function mainEntityTable(title, entities, type) {
  const rows = Array.isArray(entities) ? entities : [];

  if (!rows.length) {
    return Box(
      Box(
        Title(title).className('mn-summary-section-title').attr('level', '3'),
        Span('0').className('mn-summary-section-count'),
      ).className('mn-summary-section-head'),
      Box(`No ${type === 'weapon' ? 'weapons' : 'items'} recorded for this run.`).className('mn-summary-empty'),
    ).className('mn-summary-section');
  }

  return Box(
    Box(
      Title(title).className('mn-summary-section-title').attr('level', '3'),
      Span(formatCount(rows.length)).className('mn-summary-section-count'),
    ).className('mn-summary-section-head'),
    El('table', { className: 'mn-summary-table', 'aria-label': title },
      El('thead', {},
        El('tr', {},
          El('th', { scope: 'col' }, 'Image'),
          El('th', { scope: 'col' }, 'Name'),
        ),
      ),
      El('tbody', {},
        rows.map((entry) => El('tr', {},
          El('td', {},
            Box(
              entry.image
                ? Img({ src: entry.image, alt: entry.name }).className('mn-summary-entity-image')
                : Box('-').className('mn-summary-entity-fallback'),
            ).className('mn-summary-entity'),
          ),
          El('td', {}, entry.name),
        )),
      ),
    ),
  ).className('mn-summary-section');
}

function mainMatchPanel(ctx) {
  const status = ctx.matches.status.get();
  const matches = ctx.matches.rows.get();
  const selectedMatchId = ctx.matches.selectedId.get();
  const match = matches.find((entry) => entry.id === selectedMatchId) || null;

  if (status === 'loading') {
    return Box('Loading run details...').className('mn-match-empty');
  }

  if (!match) {
    return Box('No played matches yet.').className('mn-match-empty');
  }

  const stats = [
    { label: 'Duration', value: formatDuration(match.durationSeconds) },
    { label: 'Level Reached', value: formatCount(match.levelReached) },
    { label: 'Max Health', value: formatCount(match.maxHealth) },
    { label: 'Damage Dealt', value: formatCount(match.damageDealt) },
    { label: 'Damage Taken', value: formatCount(match.damageTaken) },
    { label: 'Enemies Killed', value: formatCount(match.enemiesKilled) },
    { label: 'Coins Collected', value: formatCount(match.coinsCollected) },
    { label: 'Finished At', value: formatPlayedAt(match.playedAt) },
  ];

  return [
    Title('Run Summary').className('mn-panel-title').attr('level', '2'),
    Box(stats.map((stat) => mainPanelStat(stat.label, stat.value))).className('mn-panel-grid'),
    mainEntityTable('Weapons', match.weapons, 'weapon'),
    mainEntityTable('Items', match.items, 'item'),
  ];
}

function mainStatCard(config, stats) {
  const targetValue = MAIN_STAT_VALUE_BY_KEY[config.key]?.(stats) ?? 0;

  return Box(
    Box().className('st-card-corner st-card-corner--tl'),
    Box().className('st-card-corner st-card-corner--tr'),
    Box().className('st-card-corner st-card-corner--bl'),
    Box().className('st-card-corner st-card-corner--br'),
    Box(
      Box(svgIcon(MAIN_ICONS.plus, 'none', 'rgba(192,57,43,0.8)', '1.2')).className('st-card-icon'),
      Box(config.name).className('st-card-name'),
      Box().className('st-card-sep'),
      Box(config.initialText || '0')
        .className('st-card-value js-st-count')
        .attr('data-stat', config.key)
        .attr('data-type', config.type)
        .attr('data-target', String(targetValue)),
      Box(config.unit).className('st-card-unit'),
    ).className('st-card-body'),
  ).className('st-card');
}

function mainStatsSections(stats) {
  return MAIN_STAT_SECTIONS.map((section) => Box(
    Box(
      Title(section.title).className('st-section-title').attr('level', '2'),
      Paragraph(section.subtitle).className('st-section-subtitle'),
    ).className('st-section-head'),
    Box(section.stats.map((stat) => mainStatCard(stat, stats))).className('st-grid st-grid--section'),
  ).className('st-stat-section'));
}

function buildMainTimelineGeometry(recentTimelineMatches) {
  const timelineMatches = Array.isArray(recentTimelineMatches) ? recentTimelineMatches : [];

  if (timelineMatches.length < 2) {
    return {
      clipPath: 'polygon(0% 65%, 100% 65%, 100% 69%, 0% 69%)',
      points: [],
    };
  }

  const scores = timelineMatches.map((entry) => toNonNegativeInt(entry.performanceScore));
  const maxScore = Math.max(...scores, 1);
  const minScore = Math.min(...scores, 0);
  const range = Math.max(1, maxScore - minScore);

  const points = timelineMatches.map((entry, index) => {
    const x = (index / (timelineMatches.length - 1)) * 100;
    const y = 86 - ((toNonNegativeInt(entry.performanceScore) - minScore) / range) * 72;
    const tooltip =
      `M${entry.matchNumber} | Score ${toNonNegativeInt(entry.performanceScore).toLocaleString('en-US')} | ` +
      `Dmg ${toNonNegativeInt(entry.damage)} | K ${toNonNegativeInt(entry.kills)} | ` +
      `C ${toNonNegativeInt(entry.coins)} | Lv ${toNonNegativeInt(entry.level)} | ` +
      `${formatEmbeddedDurationLabel(entry.durationSeconds)}`;

    return { x, y, tooltip };
  });

  return {
    clipPath: `polygon(${points.map((point) => `${point.x.toFixed(2)}% ${point.y.toFixed(2)}%`).join(', ')}, 100% 100%, 0% 100%)`,
    points,
  };
}

function buildMainVisualAnalytics(stats) {
  const matchesPlayed = toNonNegativeInt(stats.matchesPlayed);
  const shortRatio = matchesPlayed > 0 ? mnClamp(toNonNegativeInt(stats.shortMatchRatioPercent), 0, 100) : 0;
  const longRatio = matchesPlayed > 0 ? mnClamp(toNonNegativeInt(stats.longMatchRatioPercent), 0, 100) : 0;
  const normalRatio = matchesPlayed > 0 ? mnClamp(100 - shortRatio - longRatio, 0, 100) : 0;

  const avgDamage = toNonNegativeInt(stats.averageDamagePerMatch);
  const avgKills = toNonNegativeInt(stats.averageKillsPerMatch);
  const avgCoins = toNonNegativeInt(stats.averageCoinsPerMatch);
  const damageWeighted = avgDamage;
  const killsWeighted = avgKills * 120;
  const coinsWeighted = avgCoins * 4;
  const weightedBase = Math.max(damageWeighted, killsWeighted, coinsWeighted, 1);
  const volatility = mnClamp(toNonNegativeInt(stats.performanceVolatilityPercent), 0, 100);

  return {
    shortRatio,
    normalRatio,
    longRatio,
    damageWidth: mnClamp(Math.round((damageWeighted / weightedBase) * 100), 0, 100),
    killsWidth: mnClamp(Math.round((killsWeighted / weightedBase) * 100), 0, 100),
    coinsWidth: mnClamp(Math.round((coinsWeighted / weightedBase) * 100), 0, 100),
    avgDamage,
    avgKills,
    avgCoins,
    volatility,
    gaugeNote: volatility <= 15 ? 'Very stable' : volatility <= 35 ? 'Stable' : volatility <= 60 ? 'Swingy' : 'High variance',
    timeline: buildMainTimelineGeometry(stats.recentTimelineMatches),
  };
}

function mainBarRow(label, valueId, fillClass, width, value) {
  return Box(
    Span(label).className('st-bar-label'),
    Box(
      Span().className(`st-bar-fill ${fillClass}`.trim()).id(valueId).style({ width: `${width}%` }),
    ).className('st-bar-track'),
    Span(value.toLocaleString('en-US')).className('st-bar-value').id(`${valueId}-value`),
  ).className('st-bar-row');
}

function mainVisualAnalytics(stats) {
  const visuals = buildMainVisualAnalytics(stats);

  return Box(
    Box(
      Box().className('st-viz-line'),
      Title('Visual Analytics').className('st-viz-title').attr('level', '2'),
      Box().className('st-viz-line'),
    ).className('st-viz-head'),
    Box(
      Box(
        Title('Match Duration Split').className('st-viz-card-title').attr('level', '3'),
        Box(
          Span().className('st-ratio-segment short').id('st-ratio-short').style({ width: `${visuals.shortRatio}%` }),
          Span().className('st-ratio-segment normal').id('st-ratio-normal').style({ width: `${visuals.normalRatio}%` }),
          Span().className('st-ratio-segment long').id('st-ratio-long').style({ width: `${visuals.longRatio}%` }),
        ).className('st-ratio-track').id('st-ratio-track').attr('role', 'img').attr('aria-label', 'Short, normal and long match ratio'),
        Box(
          Box(Span().className('dot short'), Span('Short (<2m)'), Span(`${visuals.shortRatio}%`).id('st-ratio-short-label')).className('st-ratio-item'),
          Box(Span().className('dot normal'), Span('Normal'), Span(`${visuals.normalRatio}%`).id('st-ratio-normal-label')).className('st-ratio-item'),
          Box(Span().className('dot long'), Span('Long (>10m)'), Span(`${visuals.longRatio}%`).id('st-ratio-long-label')).className('st-ratio-item'),
        ).className('st-ratio-legend'),
      ).className('st-viz-card st-viz-card--ratio'),
      Box(
        Title('Per Match Performance').className('st-viz-card-title').attr('level', '3'),
        Box(
          mainBarRow('Damage', 'st-bar-damage', 'damage', visuals.damageWidth, visuals.avgDamage),
          mainBarRow('Kills', 'st-bar-kills', 'kills', visuals.killsWidth, visuals.avgKills),
          mainBarRow('Coins', 'st-bar-coins', 'coins', visuals.coinsWidth, visuals.avgCoins),
        ).className('st-bars').id('st-bars'),
      ).className('st-viz-card st-viz-card--bars'),
      Box(
        Title('Stability Gauge').className('st-viz-card-title').attr('level', '3'),
        Box(
          Box(
            Box(String(visuals.volatility)).className('st-gauge-value').id('st-gauge-value'),
            Box('volatility %').className('st-gauge-unit'),
          ).className('st-gauge-inner'),
        ).className('st-gauge').id('st-gauge').attr('role', 'img').attr('aria-label', 'Performance stability gauge').style({ '--volatility': String(visuals.volatility) }),
        Paragraph(visuals.gaugeNote).className('st-gauge-note').id('st-gauge-note'),
      ).className('st-viz-card st-viz-card--gauge'),
      Box(
        Title('Last 10 Matches Timeline').className('st-viz-card-title').attr('level', '3'),
        Box(
          Box().className('st-timeline-gridlines'),
          Box().className('st-timeline-line').id('st-timeline-line').style({ clipPath: visuals.timeline.clipPath }),
          Box(
            visuals.timeline.points.map((point) => Span()
              .className('st-timeline-point')
              .style({ left: `${point.x}%`, top: `${point.y}%` })
              .attr('data-tip', point.tooltip)
              .attr('aria-label', point.tooltip)),
          ).className('st-timeline-points').id('st-timeline-points').attr('role', 'img').attr('aria-label', 'Last ten matches timeline with hover details'),
        ).className('st-timeline-wrap'),
        Box(
          Span('older'),
          Span('match flow'),
          Span('newer'),
        ).className('st-timeline-foot'),
      ).className('st-viz-card st-viz-card--timeline'),
    ).className('st-viz-grid'),
  ).className('st-viz').attr('aria-label', 'Visual analytics');
}

function mainPlayerStats(ctx) {
  const stats = aggregateMappedMatchStats(ctx.matches.rows.get());

  return [
    Box(mainStatsSections(stats)).className('st-sections'),
    mainVisualAnalytics(stats),
  ];
}

function createMainView(ctx) {
  return Box(
    Box().className('mn-glow'),
    DashboardNavbar({
      variant: 'main',
      active: 'matches',
      username: ctx.user.displayName,
      viewMode: ctx.view.isViewingPlayer,
    }),
    MainContent(
      Box(
        Box(
          mainOrnament(),
          Title('Played Matches').className('mn-placeholder-title'),
          Paragraph('Select a run to view details').className('mn-placeholder-sub'),
          Box(
            Span('Viewing').className('mn-viewing-kicker'),
            Span(() => ctx.view.viewedPlayerName.get()).className('mn-viewing-name').id('mn-viewing-name'),
          ).className('mn-viewing-user').id('mn-viewing-user').style({ display: ctx.view.isViewingPlayer ? 'inline-flex' : 'none' }),
        ).className('mn-matches-head'),
        Box(
          Box(() => mainMatchList(ctx)).className('mn-matches-list').id('mn-matches-list').attr('role', 'listbox').attr('aria-label', 'Played matches'),
          Box(() => mainMatchPanel(ctx)).className('mn-match-panel').id('mn-match-panel').attr('aria-live', 'polite'),
        ).className('mn-matches-layout'),
        Box(() => mainPlayerStats(ctx)).className('mn-player-stats').id('mn-player-stats').attr('aria-live', 'polite'),
      ).className('mn-matches-shell'),
    ).className('mn-content'),
  ).className(ctx.view.isViewingPlayer ? 'mn-root mn-view-mode' : 'mn-root');
}

const Main = page({
  name: 'Main',

  setup() {
    ensureGlobalStarfield();
    const user = getUser();
    const viewedPlayerId = resolveViewedPlayerIdFromQuery();

    return setupState(
      setupGroup('user', {
        current: user,
        displayName: signal(resolveDashboardDisplayName(user)),
      }),
      setupGroup('view', {
        isViewingPlayer: viewedPlayerId !== null,
        viewedPlayerId,
        viewedPlayerName: signal(viewedPlayerId !== null ? `User #${viewedPlayerId}` : '-'),
      }),
      setupGroup('matches', {
        status: signal('loading'),
        error: signal(''),
        rows: signal([]),
        selectedId: signal(null),
      }),
    );
  },

  render(ctx) {
    return createMainView(ctx);
  },

  mount(ctx) {
    const user = ctx.user.current;
    mountDashboardNavbar(ctx, { variant: 'main' });
    
    void ctx.once('main.boot', async () => {
      void refreshDashboardNavbarUsername(ctx, ctx.user.displayName, 'main.navbar-username');
      if (ctx.view.isViewingPlayer && ctx.view.viewedPlayerId !== null) {
        void loadViewedPlayerUsername(ctx.view.viewedPlayerId, ctx);
      }
      void loadMatches();
    });

    async function loadMatches() {
      const playerId = resolvePlayerId(user);
      ctx.matches.status.set('loading');
      ctx.matches.error.set('');
      ctx.matches.rows.set([]);
      ctx.matches.selectedId.set(null);

      if (!playerId) {
        ctx.matches.status.set('ready');
        runMainStatsAnimations(ctx);
        return;
      }

      try {
        const response = await authFetch(`${API_BASE}/api/Match/player?playerId=${encodeURIComponent(playerId)}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch matches');

        const apiMatches = await parseResponsePayload(response);
        const mappedMatches = mapApiMatches(apiMatches);
        ctx.matches.rows.set(mappedMatches);
        ctx.matches.selectedId.set(mappedMatches[0]?.id ?? null);
        ctx.matches.status.set('ready');
        runMainStatsAnimations(ctx);
      } catch {
        ctx.matches.error.set('Failed to load played matches.');
        ctx.matches.status.set('error');
        runMainStatsAnimations(ctx);
      }
    }
  },
});

export default Main;

function runMainStatsAnimations(ctx) {
  ctx.timeout(() => {
    if (ctx.container) animateEmbeddedStats(ctx.container);
  }, 0, 'lifetime');
}

async function parseResponsePayload(response) {
  const raw = await response.text();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function resolveViewedPlayerIdFromQuery() {
  const queryParams = new URLSearchParams(window.location.search);
  const userIdParam = queryParams.get('userId');
  if (!userIdParam) return null;

  const value = Number(userIdParam);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function resolvePlayerId(user) {
  const viewedPlayerId = resolveViewedPlayerIdFromQuery();
  if (viewedPlayerId !== null) return viewedPlayerId;

  const candidates = [user?.id, user?.userId, user?.playerId];
  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isInteger(value) && value > 0) {
      return value;
    }
  }

  return null;
}

async function loadViewedPlayerUsername(userId, ctx) {
  try {
    const res = await authFetch(`${API_BASE}/api/User/name?id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('User not found');

    const data = await res.json();
    ctx.view.viewedPlayerName.set(data?.username || `User #${userId}`);
  } catch {
    ctx.view.viewedPlayerName.set(`User #${userId}`);
  }
}

function mapApiMatches(apiMatches) {
  if (!Array.isArray(apiMatches)) return [];

  return apiMatches
    .map((match, index) => {
      const playedAt = normalizePlayedAt(match?.createdAt);
      return {
        id: String(match?.id ?? `run-${index + 1}`),
        durationSeconds: normalizeDurationSeconds(match?.time),
        levelReached: toNonNegativeInt(match?.level),
        maxHealth: toNonNegativeInt(match?.maxHealth),
        damageDealt: toNonNegativeInt(match?.damageDealt),
        damageTaken: toNonNegativeInt(match?.damageTaken),
        enemiesKilled: toNonNegativeInt(match?.enemiesKilled),
        coinsCollected: toNonNegativeInt(match?.coinsCollected),
        playedAt,
        weapons: mapMatchEntities(match?.matchWeapons, 'weapon'),
        items: mapMatchEntities(match?.matchItems, 'item'),
      };
    })
    .sort((left, right) => parseBackendDate(right.playedAt).getTime() - parseBackendDate(left.playedAt).getTime());
}

function mapMatchEntities(entities, type) {
  if (!Array.isArray(entities)) return [];

  return entities.map((entry, index) => {
    const entityId = toNonNegativeInt(type === 'weapon' ? entry?.weaponId : entry?.itemId);
    const fallbackName = type === 'weapon' ? `Weapon #${entityId || index + 1}` : `Item #${entityId || index + 1}`;

    return {
      id: toNonNegativeInt(entry?.id),
      entityId,
      name: normalizeEntityName(type === 'weapon' ? entry?.weaponName : entry?.itemName, fallbackName),
      image: type === 'weapon' ? WEAPON_IMAGE_BY_ID[entityId] : ITEM_IMAGE_BY_ID[entityId],
    };
  });
}

function normalizeEntityName(value, fallback) {
  const raw = typeof value === 'string' ? value.trim() : '';
  return raw || fallback;
}

function aggregateMappedMatchStats(mappedMatches) {
  if (!Array.isArray(mappedMatches) || !mappedMatches.length) {
    return {
      damageDealt: 0,
      damageTaken: 0,
      enemiesKilled: 0,
      totalMinutesLived: 0,
      matchesPlayed: 0,
      coinsCollected: 0,
      averageDamagePerMatch: 0,
      averageKillsPerMatch: 0,
      averageCoinsPerMatch: 0,
      averageKillsPerMinute: 0,
      averageDamagePerMinute: 0,
      averageSurvivalSecondsPerMatch: 0,
      bestMatchDamage: 0,
      bestMatchKills: 0,
      bestMatchSurvivalSeconds: 0,
      highestLevelReached: 0,
      bestMatchCoins: 0,
      bestMatchScore: 0,
      shortMatchRatioPercent: 0,
      longMatchRatioPercent: 0,
      performanceVolatilityPercent: 0,
      recentTimelineMatches: [],
    };
  }

  const SHORT_MATCH_THRESHOLD_SECONDS = 2 * 60;
  const LONG_MATCH_THRESHOLD_SECONDS = 10 * 60;

  let totalDamageDealt = 0;
  let totalDamageTaken = 0;
  let totalEnemiesKilled = 0;
  let totalDurationSeconds = 0;
  let totalCoinsCollected = 0;
  let bestMatchDamage = 0;
  let bestMatchKills = 0;
  let bestMatchSurvivalSeconds = 0;
  let highestLevelReached = 0;
  let bestMatchCoins = 0;
  let bestMatchScore = 0;
  let shortMatchesCount = 0;
  let longMatchesCount = 0;
  const performanceScores = [];

  mappedMatches.forEach((match) => {
    const damageDealt = toNonNegativeInt(match?.damageDealt);
    const damageTaken = toNonNegativeInt(match?.damageTaken);
    const enemiesKilled = toNonNegativeInt(match?.enemiesKilled);
    const durationSeconds = toNonNegativeInt(match?.durationSeconds);
    const coinsCollected = toNonNegativeInt(match?.coinsCollected);
    const levelReached = toNonNegativeInt(match?.levelReached);

    totalDamageDealt += damageDealt;
    totalDamageTaken += damageTaken;
    totalEnemiesKilled += enemiesKilled;
    totalDurationSeconds += durationSeconds;
    totalCoinsCollected += coinsCollected;

    bestMatchDamage = Math.max(bestMatchDamage, damageDealt);
    bestMatchKills = Math.max(bestMatchKills, enemiesKilled);
    bestMatchSurvivalSeconds = Math.max(bestMatchSurvivalSeconds, durationSeconds);
    highestLevelReached = Math.max(highestLevelReached, levelReached);
    bestMatchCoins = Math.max(bestMatchCoins, coinsCollected);

    if (durationSeconds < SHORT_MATCH_THRESHOLD_SECONDS) shortMatchesCount += 1;
    if (durationSeconds > LONG_MATCH_THRESHOLD_SECONDS) longMatchesCount += 1;

    const performanceScore = damageDealt + enemiesKilled * 120 + coinsCollected * 4 + levelReached * 250;
    bestMatchScore = Math.max(bestMatchScore, performanceScore);
    performanceScores.push(performanceScore);
  });

  const matchesPlayed = mappedMatches.length;
  const totalDurationMinutes = totalDurationSeconds / 60;

  return {
    damageDealt: totalDamageDealt,
    damageTaken: totalDamageTaken,
    enemiesKilled: totalEnemiesKilled,
    totalMinutesLived: Math.round(totalDurationSeconds / 60),
    matchesPlayed,
    coinsCollected: totalCoinsCollected,
    averageDamagePerMatch: toNonNegativeInt(mnSafeDivide(totalDamageDealt, matchesPlayed)),
    averageKillsPerMatch: toNonNegativeInt(mnSafeDivide(totalEnemiesKilled, matchesPlayed)),
    averageCoinsPerMatch: toNonNegativeInt(mnSafeDivide(totalCoinsCollected, matchesPlayed)),
    averageKillsPerMinute: toNonNegativeInt(mnSafeDivide(totalEnemiesKilled, totalDurationMinutes)),
    averageDamagePerMinute: toNonNegativeInt(mnSafeDivide(totalDamageDealt, totalDurationMinutes)),
    averageSurvivalSecondsPerMatch: toNonNegativeInt(mnSafeDivide(totalDurationSeconds, matchesPlayed)),
    bestMatchDamage,
    bestMatchKills,
    bestMatchSurvivalSeconds,
    highestLevelReached,
    bestMatchCoins,
    bestMatchScore,
    shortMatchRatioPercent: toNonNegativeInt(mnSafeDivide(shortMatchesCount * 100, matchesPlayed)),
    longMatchRatioPercent: toNonNegativeInt(mnSafeDivide(longMatchesCount * 100, matchesPlayed)),
    performanceVolatilityPercent: toNonNegativeInt(mnCalculateCoefficientOfVariationPercent(performanceScores)),
    recentTimelineMatches: buildRecentTimelineFromMappedMatches(mappedMatches),
  };
}

function buildRecentTimelineFromMappedMatches(mappedMatches) {
  if (!Array.isArray(mappedMatches) || !mappedMatches.length) return [];

  return mappedMatches
    .map((match, index) => {
      const parsed = parseBackendDate(match?.playedAt);
      const createdAtTime = parsed && !Number.isNaN(parsed.getTime()) ? parsed.getTime() : index;
      const damage = toNonNegativeInt(match?.damageDealt);
      const kills = toNonNegativeInt(match?.enemiesKilled);
      const coins = toNonNegativeInt(match?.coinsCollected);
      const level = toNonNegativeInt(match?.levelReached);
      const durationSeconds = toNonNegativeInt(match?.durationSeconds);
      const performanceScore = damage + kills * 120 + coins * 4 + level * 250;

      return { damage, kills, coins, level, durationSeconds, performanceScore, createdAtTime };
    })
    .sort((left, right) => left.createdAtTime - right.createdAtTime)
    .slice(-10)
    .map((entry, index) => ({ ...entry, matchNumber: index + 1 }));
}

function animateEmbeddedStats(container) {
  const valueEls = container.querySelectorAll('.js-st-count');
  if (!valueEls.length) return;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function formatInt(value) {
    return Math.round(value).toLocaleString('en-US');
  }

  function formatDecimal(value) {
    return value.toFixed(2);
  }

  function formatHoursMinutes(totalMinutesFloat) {
    const totalMinutes = Math.max(0, Math.round(totalMinutesFloat));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  function formatHoursMinutesSeconds(totalSecondsFloat) {
    const totalSeconds = Math.max(0, Math.round(totalSecondsFloat));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  valueEls.forEach((el, index) => {
    const type = el.dataset.type || 'int';
    const targetValue = Number(el.dataset.target);
    if (!Number.isFinite(targetValue)) return;

    const startDelay = 140 + index * 55;
    const duration = type === 'int' ? 900 : 780;
    const startValue = 0;

    el.classList.add('is-counting');

    const render = (value) => {
      if (type === 'time-hm') {
        el.textContent = formatHoursMinutes(value);
        return;
      }
      if (type === 'time-hms') {
        el.textContent = formatHoursMinutesSeconds(value);
        return;
      }
      if (type === 'decimal') {
        el.textContent = formatDecimal(value);
        return;
      }
      el.textContent = formatInt(value);
    };

    render(startValue);

    const run = () => {
      const startTs = performance.now();

      const step = (now) => {
        const progress = Math.min(1, (now - startTs) / duration);
        const eased = easeOutCubic(progress);
        const current = startValue + (targetValue - startValue) * eased;
        render(current);

        if (progress < 1) {
          requestAnimationFrame(step);
          return;
        }

        render(targetValue);
        el.classList.remove('is-counting');
      };

      requestAnimationFrame(step);
    };

    window.setTimeout(run, startDelay);
  });
}

function formatEmbeddedDurationLabel(totalSeconds) {
  const seconds = toNonNegativeInt(totalSeconds);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function mnCalculateCoefficientOfVariationPercent(values) {
  if (!Array.isArray(values) || values.length < 2) return 0;
  const normalized = values.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value >= 0);
  if (normalized.length < 2) return 0;
  const mean = normalized.reduce((sum, value) => sum + value, 0) / normalized.length;
  if (mean <= 0) return 0;
  const variance = normalized.map((value) => Math.pow(value - mean, 2)).reduce((sum, value) => sum + value, 0) / normalized.length;
  return mnSafeDivide(Math.sqrt(variance) * 100, mean);
}

function mnSafeDivide(numerator, denominator) {
  const left = Number(numerator);
  const right = Number(denominator);
  if (!Number.isFinite(left) || !Number.isFinite(right) || right <= 0) return 0;
  return left / right;
}

function mnClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatDuration(totalSeconds) {
  const normalizedTotalSeconds = toNonNegativeInt(totalSeconds);
  const hours = Math.floor(normalizedTotalSeconds / 3600);
  const minutes = Math.floor((normalizedTotalSeconds % 3600) / 60);
  const seconds = normalizedTotalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatPlayedAt(isoDateString) {
  const raw = typeof isoDateString === 'string' ? isoDateString.trim() : '';
  const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw);
  const normalized = raw && !hasTimezone ? `${raw}Z` : raw;
  const parsedDate = new Date(normalized);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Budapest',
  }).format(parsedDate);
}

function formatCount(value) {
  return toNonNegativeInt(value).toLocaleString('en-US');
}

function normalizeDurationSeconds(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;

  const nonNegative = Math.max(0, parsed);
  if (nonNegative >= 10000) {
    return Math.round(nonNegative / 1000);
  }

  return Math.round(nonNegative);
}

function toNonNegativeInt(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}

function normalizePlayedAt(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  const parsed = raw ? parseBackendDate(raw) : null;

  if (parsed && !Number.isNaN(parsed.getTime())) {
    return raw;
  }

  return new Date(0).toISOString();
}

function parseBackendDate(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw);
  const normalized = raw && !hasTimezone ? `${raw}Z` : raw;
  return new Date(normalized);
}
