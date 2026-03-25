import '../../css/pages/Stats.css';
import { API_BASE, getUser, authFetch } from '../auth.js';
import { ensureGlobalStarfield } from '../global-starfield.js';
import {
  DashboardNavbar,
  mountDashboardNavbar,
  refreshDashboardNavbarUsername,
  resolveDashboardDisplayName,
} from '../components/DashboardNavbar.js';
import { Box, Icon, Main, Paragraph, Span, Strong, Title, page, setupGroup, setupState, signal } from '../feather/index.js';

const STROKE = 'rgba(192,57,43,0.8)';

const ICONS = {
  flame: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />',
  shield: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v6c0 5.25-3.438 8.813-7 10-3.563-1.188-7-4.75-7-10V6l7-3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 10.5" />',
  eyeOff: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />',
  clock: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
  bars: '<path stroke-linecap="round" stroke-linejoin="round" d="M4 17h16M7 17V9m5 8V5m5 12v-6" />',
  plus: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m9-9H3" />',
  cross: '<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5v14" />',
  coin: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />',
  trend: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 17l6-6 4 4 8-8" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18" />',
};

const STATS_SECTIONS = [
  { title: 'Core Totals', subtitle: 'Overall lifetime volume', cards: [['damage', 'int', 'Damage Dealt', 'total damage', 'flame'], ['damage-taken', 'int', 'Damage Taken', 'total damage received', 'shield'], ['kills', 'int', 'Enemies Killed', 'eliminations', 'eyeOff'], ['time-lived', 'time-hm', 'Time Lived', 'total survival time', 'clock'], ['matches', 'int', 'Matches Played', 'total games', 'bars'], ['coins', 'int', 'Coins Collected', 'total coins', 'coin']] },
  { title: 'Per Match Efficiency', subtitle: 'Average output and pace', cards: [['avg-damage-match', 'int', 'Avg Damage / Match', 'damage per game', 'plus'], ['avg-kills-match', 'int', 'Avg Kills / Match', 'kills per game', 'cross'], ['avg-coins-match', 'int', 'Avg Coins / Match', 'coins per game', 'coin'], ['avg-kills-minute', 'int', 'Avg Kills / Minute', 'kills per minute', 'clock'], ['avg-damage-minute', 'int', 'Avg Damage / Minute', 'damage per minute', 'bars'], ['avg-survival-match', 'time-hms', 'Avg Survival / Match', 'time per game', 'clock']] },
  { title: 'Peak Records', subtitle: 'Best single-run highlights', cards: [['best-damage', 'int', 'Best Match Damage', 'top single-match damage', 'flame'], ['best-kills', 'int', 'Best Match Kills', 'top single-match kills', 'cross'], ['best-survival', 'time-hms', 'Best Match Survival', 'longest single match', 'clock'], ['highest-level', 'int', 'Highest Level Reached', 'all-time best level', 'bars'], ['best-coins', 'int', 'Best Match Coins', 'top single-match coins', 'coin'], ['best-score', 'int', 'Best Match Score', 'top weighted run score', 'trend']] },
  { title: 'Run Shape And Stability', subtitle: 'Session length distribution and consistency', cards: [['short-match-ratio', 'int', 'Short Match Ratio', 'under 2 min (%)', 'clock'], ['long-match-ratio', 'int', 'Long Match Ratio', 'over 10 min (%)', 'clock'], ['performance-volatility', 'int', 'Performance Volatility', 'lower = more stable (%)', 'trend']] },
];

const iconNode = (markup, { fill = 'none', stroke = STROKE, width = '1.2' } = {}) => Icon().attrs({ xmlns: 'http://www.w3.org/2000/svg', fill, viewBox: '0 0 24 24', stroke, 'stroke-width': width }).html(markup);
const statValue = (type) => type === 'time-hm' ? '0h 0m' : type === 'time-hms' ? '0h 0m 0s' : '0';

function cardCorners() { return [Box().className('st-card-corner st-card-corner--tl'), Box().className('st-card-corner st-card-corner--tr'), Box().className('st-card-corner st-card-corner--bl'), Box().className('st-card-corner st-card-corner--br')]; }
function ornament() { return Box(Box().className('st-ornament-line'), Box().className('st-ornament-diamond'), Box().className('st-ornament-line')).className('st-ornament'); }
function statCard([stat, type, label, unit, iconKey]) { return Box(...cardCorners(), Box(Box(iconNode(ICONS[iconKey])).className('st-card-icon'), Box(label).className('st-card-name'), Box().className('st-card-sep'), Box(statValue(type)).className('st-card-value js-st-count').attr('data-stat', stat).attr('data-type', type).attr('data-target', '0'), Box(unit).className('st-card-unit')).className('st-card-body')).className('st-card'); }
function statSection(section) { return Box(Box(Box(section.title).className('st-section-title'), Paragraph(section.subtitle).className('st-section-subtitle')).className('st-section-head'), Box(section.cards.map(statCard)).className('st-grid st-grid--section')).className('st-stat-section'); }

function visualAnalytics() {
  return Box(Box(Box().className('st-viz-line'), Box('Visual Analytics').className('st-viz-title'), Box().className('st-viz-line')).className('st-viz-head'), Box(Box(Box('Match Duration Split').className('st-viz-card-title'), Box(Span().className('st-ratio-segment short').id('st-ratio-short'), Span().className('st-ratio-segment normal').id('st-ratio-normal'), Span().className('st-ratio-segment long').id('st-ratio-long')).className('st-ratio-track').id('st-ratio-track').attr('role', 'img').ariaLabel('Short, normal and long match ratio'), Box(Box(Span().className('dot short'), Span('Short (<2m)'), Strong('0%').id('st-ratio-short-label')).className('st-ratio-item'), Box(Span().className('dot normal'), Span('Normal'), Strong('0%').id('st-ratio-normal-label')).className('st-ratio-item'), Box(Span().className('dot long'), Span('Long (>10m)'), Strong('0%').id('st-ratio-long-label')).className('st-ratio-item')).className('st-ratio-legend')).className('st-viz-card st-viz-card--ratio'), Box(Box('Per Match Performance').className('st-viz-card-title'), Box(Box(Span('Damage').className('st-bar-label'), Box(Span().className('st-bar-fill damage').id('st-bar-damage')).className('st-bar-track'), Span('0').className('st-bar-value').id('st-bar-damage-value')).className('st-bar-row'), Box(Span('Kills').className('st-bar-label'), Box(Span().className('st-bar-fill kills').id('st-bar-kills')).className('st-bar-track'), Span('0').className('st-bar-value').id('st-bar-kills-value')).className('st-bar-row'), Box(Span('Coins').className('st-bar-label'), Box(Span().className('st-bar-fill coins').id('st-bar-coins')).className('st-bar-track'), Span('0').className('st-bar-value').id('st-bar-coins-value')).className('st-bar-row')).className('st-bars').id('st-bars')).className('st-viz-card st-viz-card--bars'), Box(Box('Stability Gauge').className('st-viz-card-title'), Box(Box(Box('0').className('st-gauge-value').id('st-gauge-value'), Box('volatility %').className('st-gauge-unit')).className('st-gauge-inner')).className('st-gauge').id('st-gauge').attr('role', 'img').ariaLabel('Performance stability gauge'), Paragraph('Very stable').className('st-gauge-note').id('st-gauge-note')).className('st-viz-card st-viz-card--gauge'), Box(Box('Last 10 Matches Timeline').className('st-viz-card-title'), Box(Box().className('st-timeline-gridlines'), Box().className('st-timeline-line').id('st-timeline-line'), Box().className('st-timeline-points').id('st-timeline-points').attr('role', 'img').ariaLabel('Last ten matches timeline with hover details')).className('st-timeline-wrap'), Box(Span('older'), Strong('match flow'), Span('newer')).className('st-timeline-foot')).className('st-viz-card st-viz-card--timeline')).className('st-viz-grid')).className('st-viz').attr('aria-label', 'Visual analytics');
}

function createStatsView(ctx) {
  const viewedPlayerId = resolveViewedPlayerIdFromQuery();
  const isViewingPlayer = viewedPlayerId !== null;

  return Box(
    Box().className('st-glow'),
    DashboardNavbar({
      variant: 'stats',
      active: 'stats',
      username: ctx.user.displayName,
      viewMode: isViewingPlayer,
    }),
    Main(
      Box(
        Box(
          ornament(),
          Title('All\u2011Time Stats').className('st-title'),
          Paragraph('Lifetime\u00A0\u00A0performance\u00A0\u00A0overview').className('st-subtitle'),
          Paragraph(
            Span('Viewing').className('st-viewing-kicker'),
            Span(isViewingPlayer ? `User #${viewedPlayerId}` : '-').className('st-viewing-name').id('st-viewing-name'),
          ).className('st-viewing-user').id('st-viewing-user').style({ display: isViewingPlayer ? 'inline-flex' : 'none' }),
        ).className('st-header'),
        Box(STATS_SECTIONS.map(statSection)).className('st-sections'),
        visualAnalytics(),
      ).className('st-inner'),
    ).className('st-content'),
  ).className(isViewingPlayer ? 'st-root st-view-mode' : 'st-root');
}

const Stats = page({
  name: 'Stats',
  setup() {
    ensureGlobalStarfield();
    const user = getUser();
    return setupState(
      setupGroup('user', {
        current: user,
        displayName: signal(resolveDashboardDisplayName(user)),
      }),
    );
  },
  render(ctx) { return createStatsView(ctx); },
  mount(ctx) {
    const { container } = ctx;
    const user = ctx.user.current;
    mountDashboardNavbar(ctx, { variant: 'stats' });
    void refreshDashboardNavbarUsername(ctx, ctx.user.displayName, 'stats.navbar-username');
    loadViewedPlayerHeader(container, ctx);
    void Promise.resolve(ctx.once('stats.all-time', () => fetchAllTimeStats(user))).then((stats) => {
      applyStatsToCards(container, stats);
      renderStatsVisuals(container, stats);
      animateStStats(container);
    });
  },
});

export default Stats;

async function fetchAllTimeStats(user) {
  const playerId = resolvePlayerId(user);
  const fallbackStats = { damageDealt: 0, damageTaken: 0, enemiesKilled: 0, totalMinutesLived: 0, matchesPlayed: 0, coinsCollected: 0, totalLevelsReached: 0, averageDamagePerMatch: 0, averageKillsPerMatch: 0, averageCoinsPerMatch: 0, averageKillsPerMinute: 0, averageDamagePerMinute: 0, averageSurvivalSecondsPerMatch: 0, bestMatchDamage: 0, bestMatchKills: 0, bestMatchSurvivalSeconds: 0, highestLevelReached: 0, bestMatchCoins: 0, bestMatchScore: 0, shortMatchRatioPercent: 0, longMatchRatioPercent: 0, performanceVolatilityPercent: 0, recentTimelineMatches: [] };
  if (!playerId) return fallbackStats;
  try {
    const response = await authFetch(`${API_BASE}/api/Match/player?playerId=${encodeURIComponent(playerId)}`, { method: 'GET', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Failed to fetch player matches');
    const apiMatches = await parseResponsePayload(response);
    return aggregateMatchStats(apiMatches);
  } catch {
    return fallbackStats;
  }
}

function applyStatsToCards(container, stats) {
  const setStatTarget = (statKey, value) => { const valueEl = container.querySelector(`.js-st-count[data-stat="${statKey}"]`); if (valueEl) valueEl.dataset.target = String(value); };
  setStatTarget('damage', toNonNegativeInt(stats.damageDealt)); setStatTarget('damage-taken', toNonNegativeInt(stats.damageTaken)); setStatTarget('kills', toNonNegativeInt(stats.enemiesKilled)); setStatTarget('time-lived', toNonNegativeInt(stats.totalMinutesLived)); setStatTarget('matches', toNonNegativeInt(stats.matchesPlayed)); setStatTarget('coins', toNonNegativeInt(stats.coinsCollected)); setStatTarget('avg-damage-match', toNonNegativeInt(stats.averageDamagePerMatch)); setStatTarget('avg-kills-match', toNonNegativeInt(stats.averageKillsPerMatch)); setStatTarget('avg-coins-match', toNonNegativeInt(stats.averageCoinsPerMatch)); setStatTarget('avg-kills-minute', toNonNegativeInt(stats.averageKillsPerMinute)); setStatTarget('avg-damage-minute', toNonNegativeInt(stats.averageDamagePerMinute)); setStatTarget('avg-survival-match', toNonNegativeInt(stats.averageSurvivalSecondsPerMatch)); setStatTarget('best-damage', toNonNegativeInt(stats.bestMatchDamage)); setStatTarget('best-kills', toNonNegativeInt(stats.bestMatchKills)); setStatTarget('best-survival', toNonNegativeInt(stats.bestMatchSurvivalSeconds)); setStatTarget('highest-level', toNonNegativeInt(stats.highestLevelReached)); setStatTarget('best-coins', toNonNegativeInt(stats.bestMatchCoins)); setStatTarget('best-score', toNonNegativeInt(stats.bestMatchScore)); setStatTarget('short-match-ratio', toNonNegativeInt(stats.shortMatchRatioPercent)); setStatTarget('long-match-ratio', toNonNegativeInt(stats.longMatchRatioPercent)); setStatTarget('performance-volatility', toNonNegativeInt(stats.performanceVolatilityPercent));
}

function aggregateMatchStats(apiMatches) {
  if (!Array.isArray(apiMatches) || !apiMatches.length) return { damageDealt: 0, damageTaken: 0, enemiesKilled: 0, totalMinutesLived: 0, matchesPlayed: 0, coinsCollected: 0, totalLevelsReached: 0, averageDamagePerMatch: 0, averageKillsPerMatch: 0, averageCoinsPerMatch: 0, averageKillsPerMinute: 0, averageDamagePerMinute: 0, averageSurvivalSecondsPerMatch: 0, bestMatchDamage: 0, bestMatchKills: 0, bestMatchSurvivalSeconds: 0, highestLevelReached: 0, bestMatchCoins: 0, bestMatchScore: 0, shortMatchRatioPercent: 0, longMatchRatioPercent: 0, performanceVolatilityPercent: 0, recentTimelineMatches: [] };
  const SHORT_MATCH_THRESHOLD_SECONDS = 120, LONG_MATCH_THRESHOLD_SECONDS = 600; let totalDamageDealt = 0, totalDamageTaken = 0, totalEnemiesKilled = 0, totalDurationSeconds = 0, totalCoinsCollected = 0, totalLevelsReached = 0, bestMatchDamage = 0, bestMatchKills = 0, bestMatchSurvivalSeconds = 0, highestLevelReached = 0, bestMatchCoins = 0, bestMatchScore = 0, shortMatchesCount = 0, longMatchesCount = 0; const performanceScores = [];
  apiMatches.forEach((match) => {
    const damageDealt = toNonNegativeInt(match?.damageDealt), damageTaken = toNonNegativeInt(match?.damageTaken), enemiesKilled = toNonNegativeInt(match?.enemiesKilled), durationSeconds = normalizeDurationSeconds(match?.time), coinsCollected = toNonNegativeInt(match?.coinsCollected), levelReached = toNonNegativeInt(match?.level);
    totalDamageDealt += damageDealt; totalDamageTaken += damageTaken; totalEnemiesKilled += enemiesKilled; totalDurationSeconds += durationSeconds; totalCoinsCollected += coinsCollected; totalLevelsReached += levelReached; bestMatchDamage = Math.max(bestMatchDamage, damageDealt); bestMatchKills = Math.max(bestMatchKills, enemiesKilled); bestMatchSurvivalSeconds = Math.max(bestMatchSurvivalSeconds, durationSeconds); highestLevelReached = Math.max(highestLevelReached, levelReached); bestMatchCoins = Math.max(bestMatchCoins, coinsCollected);
    if (durationSeconds < SHORT_MATCH_THRESHOLD_SECONDS) shortMatchesCount += 1; if (durationSeconds > LONG_MATCH_THRESHOLD_SECONDS) longMatchesCount += 1;
    const performanceScore = damageDealt + enemiesKilled * 120 + coinsCollected * 4 + levelReached * 250; bestMatchScore = Math.max(bestMatchScore, performanceScore); performanceScores.push(performanceScore);
  });
  const matchesPlayed = apiMatches.length, totalDurationMinutes = totalDurationSeconds / 60;
  return { damageDealt: totalDamageDealt, damageTaken: totalDamageTaken, enemiesKilled: totalEnemiesKilled, totalMinutesLived: Math.round(totalDurationSeconds / 60), matchesPlayed, coinsCollected: totalCoinsCollected, totalLevelsReached, averageDamagePerMatch: toNonNegativeInt(safeDivide(totalDamageDealt, matchesPlayed)), averageKillsPerMatch: toNonNegativeInt(safeDivide(totalEnemiesKilled, matchesPlayed)), averageCoinsPerMatch: toNonNegativeInt(safeDivide(totalCoinsCollected, matchesPlayed)), averageKillsPerMinute: toNonNegativeInt(safeDivide(totalEnemiesKilled, totalDurationMinutes)), averageDamagePerMinute: toNonNegativeInt(safeDivide(totalDamageDealt, totalDurationMinutes)), averageSurvivalSecondsPerMatch: toNonNegativeInt(safeDivide(totalDurationSeconds, matchesPlayed)), bestMatchDamage, bestMatchKills, bestMatchSurvivalSeconds, highestLevelReached, bestMatchCoins, bestMatchScore, shortMatchRatioPercent: toNonNegativeInt(safeDivide(shortMatchesCount * 100, matchesPlayed)), longMatchRatioPercent: toNonNegativeInt(safeDivide(longMatchesCount * 100, matchesPlayed)), performanceVolatilityPercent: toNonNegativeInt(calculateCoefficientOfVariationPercent(performanceScores)), recentTimelineMatches: buildRecentTimelineMatches(apiMatches) };
}

function buildRecentTimelineMatches(apiMatches) {
  if (!Array.isArray(apiMatches) || !apiMatches.length) return [];
  return apiMatches.map((match, index) => {
    const createdAtRaw = typeof match?.createdAt === 'string' ? match.createdAt.trim() : '';
    const createdAt = createdAtRaw ? new Date(/(?:Z|[+\-]\d{2}:\d{2})$/i.test(createdAtRaw) ? createdAtRaw : `${createdAtRaw}Z`) : null;
    return { damage: toNonNegativeInt(match?.damageDealt), kills: toNonNegativeInt(match?.enemiesKilled), coins: toNonNegativeInt(match?.coinsCollected), level: toNonNegativeInt(match?.level), durationSeconds: normalizeDurationSeconds(match?.time), performanceScore: toNonNegativeInt(match?.damageDealt) + toNonNegativeInt(match?.enemiesKilled) * 120 + toNonNegativeInt(match?.coinsCollected) * 4 + toNonNegativeInt(match?.level) * 250, createdAtTime: createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.getTime() : index };
  }).sort((left, right) => left.createdAtTime - right.createdAtTime).slice(-10).map((entry, index) => ({ ...entry, matchNumber: index + 1 }));
}

function formatDurationLabel(totalSeconds) { const seconds = toNonNegativeInt(totalSeconds); return `${Math.floor(seconds / 60)}m ${seconds % 60}s`; }
function calculateCoefficientOfVariationPercent(values) { if (!Array.isArray(values) || values.length < 2) return 0; const normalized = values.map(Number).filter((value) => Number.isFinite(value) && value >= 0); if (normalized.length < 2) return 0; const mean = normalized.reduce((sum, value) => sum + value, 0) / normalized.length; if (mean <= 0) return 0; const variance = normalized.map((value) => Math.pow(value - mean, 2)).reduce((sum, value) => sum + value, 0) / normalized.length; return safeDivide(Math.sqrt(variance) * 100, mean); }
function safeDivide(numerator, denominator) { const left = Number(numerator), right = Number(denominator); return !Number.isFinite(left) || !Number.isFinite(right) || right <= 0 ? 0 : left / right; }
async function parseResponsePayload(response) { const raw = await response.text(); if (!raw) return []; try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; } catch { return []; } }
function resolveViewedPlayerIdFromQuery() { const userIdParam = new URLSearchParams(window.location.search).get('userId'); if (!userIdParam) return null; const value = Number(userIdParam); return Number.isInteger(value) && value > 0 ? value : null; }
function resolvePlayerId(user) { const viewedPlayerId = resolveViewedPlayerIdFromQuery(); if (viewedPlayerId !== null) return viewedPlayerId; for (const candidate of [user?.id, user?.userId, user?.playerId]) { const value = Number(candidate); if (Number.isInteger(value) && value > 0) return value; } return null; }

function loadViewedPlayerHeader(container, ctx) {
  const viewedPlayerId = resolveViewedPlayerIdFromQuery();
  if (viewedPlayerId === null) return;
  void Promise.resolve(ctx.once(`stats.viewed-player.${viewedPlayerId}`, () => fetchViewedPlayerUsername(viewedPlayerId))).then((username) => {
    applyViewedPlayerUsername(container, viewedPlayerId, username);
  });
}

async function fetchViewedPlayerUsername(userId) {
  try {
    const res = await authFetch(`${API_BASE}/api/User/name?id=${encodeURIComponent(userId)}`, { method: 'GET', headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('User not found');
    return (await res.json())?.username || `User #${userId}`;
  } catch {
    return `User #${userId}`;
  }
}

function applyViewedPlayerUsername(container, userId, username) {
  const viewingEl = container.querySelector('#st-viewing-user'), viewingNameEl = container.querySelector('#st-viewing-name');
  if (viewingEl && viewingNameEl) { viewingNameEl.textContent = username || `User #${userId}`; viewingEl.style.display = 'inline-flex'; }
}

function normalizeDurationSeconds(value) { const parsed = Number(value); if (!Number.isFinite(parsed)) return 0; const nonNegative = Math.max(0, parsed); return nonNegative >= 10_000 ? Math.round(nonNegative / 1000) : Math.round(nonNegative); }
function toNonNegativeInt(value) { const parsed = Number(value); return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0; }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function renderStatsVisuals(container, stats) {
  const matchesPlayed = toNonNegativeInt(stats.matchesPlayed), shortRatio = matchesPlayed > 0 ? clamp(toNonNegativeInt(stats.shortMatchRatioPercent), 0, 100) : 0, longRatio = matchesPlayed > 0 ? clamp(toNonNegativeInt(stats.longMatchRatioPercent), 0, 100) : 0, normalRatio = matchesPlayed > 0 ? clamp(100 - shortRatio - longRatio, 0, 100) : 0;
  const shortEl = container.querySelector('#st-ratio-short'), normalEl = container.querySelector('#st-ratio-normal'), longEl = container.querySelector('#st-ratio-long'); if (shortEl) shortEl.style.width = `${shortRatio}%`; if (normalEl) normalEl.style.width = `${normalRatio}%`; if (longEl) longEl.style.width = `${longRatio}%`;
  const shortLabel = container.querySelector('#st-ratio-short-label'), normalLabel = container.querySelector('#st-ratio-normal-label'), longLabel = container.querySelector('#st-ratio-long-label'); if (shortLabel) shortLabel.textContent = `${shortRatio}%`; if (normalLabel) normalLabel.textContent = `${normalRatio}%`; if (longLabel) longLabel.textContent = `${longRatio}%`;
  const avgDamage = toNonNegativeInt(stats.averageDamagePerMatch), avgKills = toNonNegativeInt(stats.averageKillsPerMatch), avgCoins = toNonNegativeInt(stats.averageCoinsPerMatch), damageWeighted = avgDamage, killsWeighted = avgKills * 120, coinsWeighted = avgCoins * 4, weightedBase = Math.max(damageWeighted, killsWeighted, coinsWeighted, 1);
  const damageWidth = clamp(Math.round((damageWeighted / weightedBase) * 100), 0, 100), killsWidth = clamp(Math.round((killsWeighted / weightedBase) * 100), 0, 100), coinsWidth = clamp(Math.round((coinsWeighted / weightedBase) * 100), 0, 100);
  const damageBar = container.querySelector('#st-bar-damage'), killsBar = container.querySelector('#st-bar-kills'), coinsBar = container.querySelector('#st-bar-coins'); if (damageBar) damageBar.style.width = `${damageWidth}%`; if (killsBar) killsBar.style.width = `${killsWidth}%`; if (coinsBar) coinsBar.style.width = `${coinsWidth}%`;
  const damageValue = container.querySelector('#st-bar-damage-value'), killsValue = container.querySelector('#st-bar-kills-value'), coinsValue = container.querySelector('#st-bar-coins-value'); if (damageValue) damageValue.textContent = avgDamage.toLocaleString('en-US'); if (killsValue) killsValue.textContent = avgKills.toLocaleString('en-US'); if (coinsValue) coinsValue.textContent = avgCoins.toLocaleString('en-US');
  const volatility = clamp(toNonNegativeInt(stats.performanceVolatilityPercent), 0, 100), gauge = container.querySelector('#st-gauge'); if (gauge) gauge.style.setProperty('--volatility', String(volatility));
  const gaugeValue = container.querySelector('#st-gauge-value'), gaugeNote = container.querySelector('#st-gauge-note'); if (gaugeValue) gaugeValue.textContent = String(volatility); if (gaugeNote) gaugeNote.textContent = volatility <= 15 ? 'Very stable' : volatility <= 35 ? 'Stable' : volatility <= 60 ? 'Swingy' : 'High variance';
  const timelineLine = container.querySelector('#st-timeline-line'), timelinePoints = container.querySelector('#st-timeline-points'); if (!timelineLine || !timelinePoints) return;
  const timelineMatches = Array.isArray(stats.recentTimelineMatches) ? stats.recentTimelineMatches : []; timelinePoints.innerHTML = '';
  if (timelineMatches.length < 2) { timelineLine.style.clipPath = 'polygon(0% 65%, 100% 65%, 100% 69%, 0% 69%)'; return; }
  const scores = timelineMatches.map((entry) => toNonNegativeInt(entry.performanceScore)), maxScore = Math.max(...scores, 1), minScore = Math.min(...scores, 0), range = Math.max(1, maxScore - minScore);
  const points = timelineMatches.map((entry, index) => ({ x: (index / (timelineMatches.length - 1)) * 100, y: 86 - ((toNonNegativeInt(entry.performanceScore) - minScore) / range) * 72, entry }));
  timelineLine.style.clipPath = `polygon(${points.map((point) => `${point.x.toFixed(2)}% ${point.y.toFixed(2)}%`).join(', ')}, 100% 100%, 0% 100%)`;
  points.forEach((point) => { const dot = document.createElement('span'); dot.className = 'st-timeline-point'; dot.style.left = `${point.x}%`; dot.style.top = `${point.y}%`; const tooltip = `M${point.entry.matchNumber} | Score ${toNonNegativeInt(point.entry.performanceScore).toLocaleString('en-US')} | Dmg ${toNonNegativeInt(point.entry.damage)} | K ${toNonNegativeInt(point.entry.kills)} | C ${toNonNegativeInt(point.entry.coins)} | Lv ${toNonNegativeInt(point.entry.level)} | ${formatDurationLabel(point.entry.durationSeconds)}`; dot.setAttribute('data-tip', tooltip); dot.setAttribute('aria-label', tooltip); timelinePoints.appendChild(dot); });
}

function animateStStats(container) {
  const valueEls = container.querySelectorAll('.js-st-count'); if (!valueEls.length) return;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3), formatInt = (value) => Math.round(value).toLocaleString('en-US'), formatDecimal = (value) => value.toFixed(2), formatHoursMinutes = (minsFloat) => { const mins = Math.max(0, Math.round(minsFloat)); return `${Math.floor(mins / 60)}h ${mins % 60}m`; }, formatHoursMinutesSeconds = (secsFloat) => { const totalSeconds = Math.max(0, Math.round(secsFloat)); return `${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}m ${totalSeconds % 60}s`; };
  valueEls.forEach((el, index) => { const type = el.dataset.type || 'int', targetValue = Number(el.dataset.target); if (!Number.isFinite(targetValue)) return; const startDelay = 140 + index * 80, duration = type === 'int' ? 900 : 780; el.classList.add('is-counting'); const render = (value) => { if (type === 'time-hm') el.textContent = formatHoursMinutes(value); else if (type === 'time-hms') el.textContent = formatHoursMinutesSeconds(value); else if (type === 'decimal') el.textContent = formatDecimal(value); else el.textContent = formatInt(value); }; render(0); window.setTimeout(() => { const startTs = performance.now(); const step = (now) => { const progress = Math.min(1, (now - startTs) / duration), current = targetValue * easeOutCubic(progress); render(current); if (progress < 1) return requestAnimationFrame(step); render(targetValue); el.classList.remove('is-counting'); }; requestAnimationFrame(step); }, startDelay); });
}
