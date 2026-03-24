import '../../css/pages/Stats.css';
import { API_BASE, getUser, logout, authFetch } from '../auth.js';
import { confirmLogout } from '../logout-confirm.js';
import { ensureGlobalStarfield } from '../global-starfield.js';

export default function Stats(container) {
  container.innerHTML = `
    

    <div class="st-root">
      <div class="st-glow"></div>

      <!-- ===== NAVBAR ===== -->
      <nav class="st-nav">
        <div class="st-nav-inner">

          <a href="/main" data-link class="st-logo">Bloodwave</a>

          <div class="st-links">
            <a href="/main" data-link class="st-link"><span>Matches</span></a>
            <a href="/stats" data-link class="st-link active"><span>Stats</span></a>
            <a href="/leaderboard" data-link class="st-link"><span>Leaderboard</span></a>
            <a href="/achievements" data-link class="st-link"><span>Achievements</span></a>
          </div>

          <div class="st-right">
            <a href="/main" data-link class="st-nav-link" id="stBackToDashboard" style="display:none;">Back to Dashboard</a>
            <div class="st-avatar-wrap">
              <button class="st-avatar" id="st-avatar-btn" aria-label="Profile menu" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
              <div class="st-avatar-dropdown" id="st-avatar-dropdown" role="menu">
                <div class="st-dd-header">
                  <div class="st-dd-username" id="st-dd-username">-</div>
                  <div class="st-dd-role">Member</div>
                </div>
                <a href="/user-panel" data-link class="st-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />
                  </svg>
                  Profile
                </a>
                <a href="/android-download" data-link class="st-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />
                  </svg>
                  Installation
                </a>
                <div class="st-dd-divider"></div>
                <button class="st-dd-item logout" id="st-dd-logout" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <button class="st-hamburger" id="st-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="st-bar"></span>
              <span class="st-bar"></span>
              <span class="st-bar"></span>
            </button>
          </div>

        </div>

        <div class="st-mobile-menu" id="st-mobile-menu">
          <div class="st-mobile-menu-inner">
            <a href="/main" data-link class="st-mobile-link">Matches</a>
            <a href="/stats" data-link class="st-mobile-link">Stats</a>
            <a href="/leaderboard" data-link class="st-mobile-link">Leaderboard</a>
            <a href="/achievements" data-link class="st-mobile-link">Achievements</a>
            <div class="st-mobile-divider"></div>
            <div class="st-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="st-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="st-mobile-username">—</span>
            </div>
            <div class="st-mobile-divider"></div>
            <a href="/user-panel" data-link class="st-mobile-link">Profile</a>
            <a href="/android-download" data-link class="st-mobile-link">Installation</a>
            <button class="st-mobile-logout" id="st-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- ===== CONTENT ===== -->
      <main class="st-content">
        <div class="st-inner">

          <!-- Header -->
          <div class="st-header">
            <div class="st-ornament">
              <div class="st-ornament-line"></div>
              <div class="st-ornament-diamond"></div>
              <div class="st-ornament-line"></div>
            </div>
            <h1 class="st-title">All&#8209;Time Stats</h1>
            <p class="st-subtitle">Lifetime&nbsp;&nbsp;performance&nbsp;&nbsp;overview</p>
            <p class="st-viewing-user" id="st-viewing-user" style="display:none;">
              <span class="st-viewing-kicker">Viewing</span>
              <span class="st-viewing-name" id="st-viewing-name">-</span>
            </p>
          </div>

          <!-- Stat cards -->
          <div class="st-sections">
            <section class="st-stat-section">
              <div class="st-section-head">
                <h2 class="st-section-title">Core Totals</h2>
                <p class="st-section-subtitle">Overall lifetime volume</p>
              </div>
              <div class="st-grid st-grid--section">

            <!-- Damage Dealt -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                  </svg>
                </div>
                <div class="st-card-name">Damage Dealt</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="damage" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">total damage</div>
              </div>
            </div>

            <!-- Damage Taken -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v6c0 5.25-3.438 8.813-7 10-3.563-1.188-7-4.75-7-10V6l7-3Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 10.5" />
                  </svg>
                </div>
                <div class="st-card-name">Damage Taken</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="damage-taken" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">total damage received</div>
              </div>
            </div>

            <!-- Enemies Killed -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </div>
                <div class="st-card-name">Enemies Killed</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="kills" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">eliminations</div>
              </div>
            </div>

            <!-- Time Lived -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Time Lived</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="time-lived" data-type="time-hm" data-target="0">0h 0m</div>
                <div class="st-card-unit">total survival time</div>
              </div>
            </div>

            <!-- Matches Played -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                </div>
                <div class="st-card-name">Matches Played</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="matches" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">total games</div>
              </div>
            </div>

            <!-- Coins Collected -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div class="st-card-name">Coins Collected</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="coins" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">total coins</div>
              </div>
            </div>

              </div>
            </section>

            <section class="st-stat-section">
              <div class="st-section-head">
                <h2 class="st-section-title">Per Match Efficiency</h2>
                <p class="st-section-subtitle">Average output and pace</p>
              </div>
              <div class="st-grid st-grid--section">

            <!-- Avg Damage / Match -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m9-9H3" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Damage / Match</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-damage-match" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">damage per game</div>
              </div>
            </div>

            <!-- Avg Kills / Match -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5v14" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Kills / Match</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-kills-match" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">kills per game</div>
              </div>
            </div>

            <!-- Avg Coins / Match -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Coins / Match</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-coins-match" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">coins per game</div>
              </div>
            </div>

            <!-- Avg Kills / Minute -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Kills / Minute</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-kills-minute" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">kills per minute</div>
              </div>
            </div>

            <!-- Avg Damage / Minute -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 16h10" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Damage / Minute</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-damage-minute" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">damage per minute</div>
              </div>
            </div>

            <!-- Avg Survival / Match -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Survival / Match</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-survival-match" data-type="time-hms" data-target="0">0h 0m 0s</div>
                <div class="st-card-unit">time per game</div>
              </div>
            </div>

              </div>
            </section>

            <section class="st-stat-section">
              <div class="st-section-head">
                <h2 class="st-section-title">Peak Records</h2>
                <p class="st-section-subtitle">Best single-run highlights</p>
              </div>
              <div class="st-grid st-grid--section">

            <!-- Best Match Damage -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2.4 4.8 5.3.8-3.8 3.7.9 5.2-4.8-2.5-4.8 2.5.9-5.2L4.3 8.6l5.3-.8L12 3z" />
                  </svg>
                </div>
                <div class="st-card-name">Best Match Damage</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="best-damage" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">top single-match damage</div>
              </div>
            </div>

            <!-- Best Match Kills -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2 6h6l-5 3.5L17 19l-5-4-5 4 2-6.5L4 9h6l2-6z" />
                  </svg>
                </div>
                <div class="st-card-name">Best Match Kills</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="best-kills" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">top single-match kills</div>
              </div>
            </div>

            <!-- Best Match Survival -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l3.5 2" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Best Match Survival</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="best-survival" data-type="time-hms" data-target="0">0h 0m 0s</div>
                <div class="st-card-unit">longest single match</div>
              </div>
            </div>

            <!-- Highest Level Reached -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 17h16M7 17V9m5 8V5m5 12v-6" />
                  </svg>
                </div>
                <div class="st-card-name">Highest Level Reached</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="highest-level" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">all-time best level</div>
              </div>
            </div>

            <!-- Best Match Coins -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2.2 4.6 5 .7-3.6 3.4.9 4.9L12 14.3l-4.5 2.3.9-4.9-3.6-3.4 5-.7L12 3z" />
                  </svg>
                </div>
                <div class="st-card-name">Best Match Coins</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="best-coins" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">top single-match coins</div>
              </div>
            </div>

            <!-- Best Match Score -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 17h16M7 17V9m5 8V5m5 12v-6" />
                  </svg>
                </div>
                <div class="st-card-name">Best Match Score</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="best-score" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">top weighted run score</div>
              </div>
            </div>

              </div>
            </section>

            <section class="st-stat-section">
              <div class="st-section-head">
                <h2 class="st-section-title">Run Shape And Stability</h2>
                <p class="st-section-subtitle">Session length distribution and consistency</p>
              </div>
              <div class="st-grid st-grid--section">

            <!-- Short Match Ratio -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v4" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 12l2 1" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Short Match Ratio</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="short-match-ratio" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">under 2 min (%)</div>
              </div>
            </div>

            <!-- Long Match Ratio -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v7" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 13l3 2" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Long Match Ratio</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="long-match-ratio" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">over 10 min (%)</div>
              </div>
            </div>

            <!-- Performance Volatility -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 17l6-6 4 4 8-8" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18" />
                  </svg>
                </div>
                <div class="st-card-name">Performance Volatility</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="performance-volatility" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">lower = more stable (%)</div>
              </div>
            </div>

              </div>
            </section>
          </div>

          <section class="st-viz" aria-label="Visual analytics">
            <div class="st-viz-head">
              <div class="st-viz-line"></div>
              <h2 class="st-viz-title">Visual Analytics</h2>
              <div class="st-viz-line"></div>
            </div>

            <div class="st-viz-grid">
              <article class="st-viz-card st-viz-card--ratio">
                <h3 class="st-viz-card-title">Match Duration Split</h3>
                <div class="st-ratio-track" id="st-ratio-track" role="img" aria-label="Short, normal and long match ratio">
                  <span class="st-ratio-segment short" id="st-ratio-short"></span>
                  <span class="st-ratio-segment normal" id="st-ratio-normal"></span>
                  <span class="st-ratio-segment long" id="st-ratio-long"></span>
                </div>
                <div class="st-ratio-legend">
                  <div class="st-ratio-item"><span class="dot short"></span><span>Short (&lt;2m)</span><strong id="st-ratio-short-label">0%</strong></div>
                  <div class="st-ratio-item"><span class="dot normal"></span><span>Normal</span><strong id="st-ratio-normal-label">0%</strong></div>
                  <div class="st-ratio-item"><span class="dot long"></span><span>Long (&gt;10m)</span><strong id="st-ratio-long-label">0%</strong></div>
                </div>
              </article>

              <article class="st-viz-card st-viz-card--bars">
                <h3 class="st-viz-card-title">Per Match Performance</h3>
                <div class="st-bars" id="st-bars">
                  <div class="st-bar-row">
                    <span class="st-bar-label">Damage</span>
                    <div class="st-bar-track"><span class="st-bar-fill damage" id="st-bar-damage"></span></div>
                    <span class="st-bar-value" id="st-bar-damage-value">0</span>
                  </div>
                  <div class="st-bar-row">
                    <span class="st-bar-label">Kills</span>
                    <div class="st-bar-track"><span class="st-bar-fill kills" id="st-bar-kills"></span></div>
                    <span class="st-bar-value" id="st-bar-kills-value">0</span>
                  </div>
                  <div class="st-bar-row">
                    <span class="st-bar-label">Coins</span>
                    <div class="st-bar-track"><span class="st-bar-fill coins" id="st-bar-coins"></span></div>
                    <span class="st-bar-value" id="st-bar-coins-value">0</span>
                  </div>
                </div>
              </article>

              <article class="st-viz-card st-viz-card--gauge">
                <h3 class="st-viz-card-title">Stability Gauge</h3>
                <div class="st-gauge" id="st-gauge" role="img" aria-label="Performance stability gauge">
                  <div class="st-gauge-inner">
                    <div class="st-gauge-value" id="st-gauge-value">0</div>
                    <div class="st-gauge-unit">volatility %</div>
                  </div>
                </div>
                <p class="st-gauge-note" id="st-gauge-note">Very stable</p>
              </article>

              <article class="st-viz-card st-viz-card--timeline">
                <h3 class="st-viz-card-title">Last 10 Matches Timeline</h3>
                <div class="st-timeline-wrap">
                  <div class="st-timeline-gridlines"></div>
                  <div class="st-timeline-line" id="st-timeline-line"></div>
                  <div class="st-timeline-points" id="st-timeline-points" role="img" aria-label="Last ten matches timeline with hover details"></div>
                </div>
                <div class="st-timeline-foot">
                  <span>older</span>
                  <strong>match flow</strong>
                  <span>newer</span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

    </div>
  `;

  // ── Canvas starfield ──────────────────────────────────────────────────────
  ensureGlobalStarfield();

  const user = getUser();
  const displayName = user?.username ?? user?.email ?? 'Member';
  const ddUsername     = container.querySelector('#st-dd-username');
  const mobileUsername = container.querySelector('#st-mobile-username');
  if (ddUsername)     ddUsername.textContent     = displayName;
  if (mobileUsername) mobileUsername.textContent = displayName;
  refreshNavbarUsername();
  reorderStatCards(container);
  updateNavbarLinksForPlayer(container);

  loadAllTimeStats(container, user);

  async function refreshNavbarUsername() {
    try {
      const res = await authFetch(`${API_BASE}/api/User/me`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) return;

      const userData = await res.json();
      const liveDisplayName = userData?.username ?? userData?.email ?? displayName;

      if (ddUsername) ddUsername.textContent = liveDisplayName;
      if (mobileUsername) mobileUsername.textContent = liveDisplayName;
    } catch {
      // Keep cached display name on fetch failure.
    }
  }

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  const hamburger  = container.querySelector('#st-hamburger');
  const mobileMenu = container.querySelector('#st-mobile-menu');
  let menuOpen = false;

  hamburger?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    hamburger.setAttribute('aria-expanded', String(menuOpen));
    mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + 'px' : '0';
  });

  mobileMenu?.querySelectorAll('.st-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.style.maxHeight = '0';
    });
  });

  // ── Desktop avatar dropdown ───────────────────────────────────────────────
  const avatarBtn  = container.querySelector('#st-avatar-btn');
  const avatarDrop = container.querySelector('#st-avatar-dropdown');
  let dropOpen = false;

  function openDrop() {
    dropOpen = true;
    avatarDrop.classList.add('open');
    avatarBtn.setAttribute('aria-expanded', 'true');
  }
  function closeDrop() {
    dropOpen = false;
    avatarDrop.classList.remove('open');
    avatarBtn.setAttribute('aria-expanded', 'false');
  }

  avatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropOpen ? closeDrop() : openDrop();
  });

  document.addEventListener('click', (e) => {
    if (dropOpen && !avatarDrop.contains(e.target) && e.target !== avatarBtn) {
      closeDrop();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropOpen) closeDrop();
  });

  // ── Logout ───────────────────────────────────────────────────────────────
  const doLogout = async () => {
    const confirmed = await confirmLogout();
    if (!confirmed) return;

    await logout();
  };

  container.querySelector('#st-dd-logout')?.addEventListener('click', doLogout);
  container.querySelector('#st-mobile-logout')?.addEventListener('click', doLogout);
}

function reorderStatCards(container) {
  const sectionOrders = {
    'Core Totals': [
      'matches',
      'time-lived',
      'damage',
      'damage-taken',
      'kills',
      'coins',
    ],
    'Per Match Efficiency': [
      'avg-survival-match',
      'avg-damage-match',
      'avg-damage-minute',
      'avg-kills-match',
      'avg-kills-minute',
      'avg-coins-match',
    ],
    'Peak Records': [
      'best-score',
      'highest-level',
      'best-survival',
      'best-damage',
      'best-kills',
      'best-coins',
    ],
    'Run Shape And Stability': [
      'short-match-ratio',
      'long-match-ratio',
      'performance-volatility',
    ],
  };

  const sections = container.querySelectorAll('.st-stat-section');
  sections.forEach((sectionEl) => {
    const titleEl = sectionEl.querySelector('.st-section-title');
    const gridEl = sectionEl.querySelector('.st-grid--section');
    if (!titleEl || !gridEl) return;

    const desiredOrder = sectionOrders[titleEl.textContent?.trim()];
    if (!Array.isArray(desiredOrder) || !desiredOrder.length) return;

    const cards = Array.from(gridEl.querySelectorAll('.st-card'));
    const cardsByStat = new Map();

    cards.forEach((cardEl) => {
      const valueEl = cardEl.querySelector('.js-st-count[data-stat]');
      const statKey = valueEl?.dataset?.stat;
      if (statKey) {
        cardsByStat.set(statKey, cardEl);
      }
    });

    desiredOrder.forEach((statKey) => {
      const cardEl = cardsByStat.get(statKey);
      if (cardEl) {
        gridEl.appendChild(cardEl);
      }
    });
  });
}

async function loadAllTimeStats(container, user) {
  const playerId = resolvePlayerId(user);
  const fallbackStats = {
    damageDealt: 0,
    damageTaken: 0,
    enemiesKilled: 0,
    totalMinutesLived: 0,
    matchesPlayed: 0,
    coinsCollected: 0,
    totalLevelsReached: 0,
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

  if (!playerId) {
    applyStatsToCards(container, fallbackStats);
    renderStatsVisuals(container, fallbackStats);
    animateStStats(container);
    return;
  }

  try {
    const response = await authFetch(`${API_BASE}/api/Match/player?playerId=${encodeURIComponent(playerId)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch player matches');
    }

    const apiMatches = await parseResponsePayload(response);
    const stats = aggregateMatchStats(apiMatches);
    applyStatsToCards(container, stats);
    renderStatsVisuals(container, stats);
  } catch {
    applyStatsToCards(container, fallbackStats);
    renderStatsVisuals(container, fallbackStats);
  }

  animateStStats(container);
}

function applyStatsToCards(container, stats) {
  const setStatTarget = (statKey, value) => {
    const valueEl = container.querySelector(`.js-st-count[data-stat="${statKey}"]`);
    if (!valueEl) return;
    valueEl.dataset.target = String(value);
  };

  setStatTarget('damage', toNonNegativeInt(stats.damageDealt));
  setStatTarget('damage-taken', toNonNegativeInt(stats.damageTaken));
  setStatTarget('kills', toNonNegativeInt(stats.enemiesKilled));
  setStatTarget('time-lived', toNonNegativeInt(stats.totalMinutesLived));
  setStatTarget('matches', toNonNegativeInt(stats.matchesPlayed));
  setStatTarget('coins', toNonNegativeInt(stats.coinsCollected));
  setStatTarget('avg-damage-match', toNonNegativeInt(stats.averageDamagePerMatch));
  setStatTarget('avg-kills-match', toNonNegativeInt(stats.averageKillsPerMatch));
  setStatTarget('avg-coins-match', toNonNegativeInt(stats.averageCoinsPerMatch));
  setStatTarget('avg-kills-minute', toNonNegativeInt(stats.averageKillsPerMinute));
  setStatTarget('avg-damage-minute', toNonNegativeInt(stats.averageDamagePerMinute));
  setStatTarget('avg-survival-match', toNonNegativeInt(stats.averageSurvivalSecondsPerMatch));
  setStatTarget('best-damage', toNonNegativeInt(stats.bestMatchDamage));
  setStatTarget('best-kills', toNonNegativeInt(stats.bestMatchKills));
  setStatTarget('best-survival', toNonNegativeInt(stats.bestMatchSurvivalSeconds));
  setStatTarget('highest-level', toNonNegativeInt(stats.highestLevelReached));
  setStatTarget('best-coins', toNonNegativeInt(stats.bestMatchCoins));
  setStatTarget('best-score', toNonNegativeInt(stats.bestMatchScore));
  setStatTarget('short-match-ratio', toNonNegativeInt(stats.shortMatchRatioPercent));
  setStatTarget('long-match-ratio', toNonNegativeInt(stats.longMatchRatioPercent));
  setStatTarget('performance-volatility', toNonNegativeInt(stats.performanceVolatilityPercent));
}

function aggregateMatchStats(apiMatches) {
  if (!Array.isArray(apiMatches)) {
    return {
      damageDealt: 0,
      damageTaken: 0,
      enemiesKilled: 0,
      totalMinutesLived: 0,
      matchesPlayed: 0,
      coinsCollected: 0,
      totalLevelsReached: 0,
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
  let totalLevelsReached = 0;
  let bestMatchDamage = 0;
  let bestMatchKills = 0;
  let bestMatchSurvivalSeconds = 0;
  let highestLevelReached = 0;
  let bestMatchCoins = 0;
  let bestMatchScore = 0;
  let shortMatchesCount = 0;
  let longMatchesCount = 0;
  const performanceScores = [];

  apiMatches.forEach((match) => {
    const damageDealt = toNonNegativeInt(match?.damageDealt);
    const damageTaken = toNonNegativeInt(match?.damageTaken);
    const enemiesKilled = toNonNegativeInt(match?.enemiesKilled);
    const durationSeconds = normalizeDurationSeconds(match?.time);
    const coinsCollected = toNonNegativeInt(match?.coinsCollected);
    const levelReached = toNonNegativeInt(match?.level);

    totalDamageDealt += damageDealt;
    totalDamageTaken += damageTaken;
    totalEnemiesKilled += enemiesKilled;
    totalDurationSeconds += durationSeconds;
    totalCoinsCollected += coinsCollected;
    totalLevelsReached += levelReached;

    bestMatchDamage = Math.max(bestMatchDamage, damageDealt);
    bestMatchKills = Math.max(bestMatchKills, enemiesKilled);
    bestMatchSurvivalSeconds = Math.max(bestMatchSurvivalSeconds, durationSeconds);
    highestLevelReached = Math.max(highestLevelReached, levelReached);
    bestMatchCoins = Math.max(bestMatchCoins, coinsCollected);

    if (durationSeconds < SHORT_MATCH_THRESHOLD_SECONDS) {
      shortMatchesCount += 1;
    }
    if (durationSeconds > LONG_MATCH_THRESHOLD_SECONDS) {
      longMatchesCount += 1;
    }

    const performanceScore =
      damageDealt +
      enemiesKilled * 120 +
      coinsCollected * 4 +
      levelReached * 250;
    bestMatchScore = Math.max(bestMatchScore, performanceScore);
    performanceScores.push(performanceScore);
  });

  const matchesPlayed = apiMatches.length;
  const totalDurationMinutes = totalDurationSeconds / 60;
  const recentTimelineMatches = buildRecentTimelineMatches(apiMatches);

  return {
    damageDealt: totalDamageDealt,
    damageTaken: totalDamageTaken,
    enemiesKilled: totalEnemiesKilled,
    totalMinutesLived: Math.round(totalDurationSeconds / 60),
    matchesPlayed,
    coinsCollected: totalCoinsCollected,
    totalLevelsReached,
    averageDamagePerMatch: toNonNegativeInt(safeDivide(totalDamageDealt, matchesPlayed)),
    averageKillsPerMatch: toNonNegativeInt(safeDivide(totalEnemiesKilled, matchesPlayed)),
    averageCoinsPerMatch: toNonNegativeInt(safeDivide(totalCoinsCollected, matchesPlayed)),
    averageKillsPerMinute: toNonNegativeInt(safeDivide(totalEnemiesKilled, totalDurationMinutes)),
    averageDamagePerMinute: toNonNegativeInt(safeDivide(totalDamageDealt, totalDurationMinutes)),
    averageSurvivalSecondsPerMatch: toNonNegativeInt(safeDivide(totalDurationSeconds, matchesPlayed)),
    bestMatchDamage,
    bestMatchKills,
    bestMatchSurvivalSeconds,
    highestLevelReached,
    bestMatchCoins,
    bestMatchScore,
    shortMatchRatioPercent: toNonNegativeInt(safeDivide(shortMatchesCount * 100, matchesPlayed)),
    longMatchRatioPercent: toNonNegativeInt(safeDivide(longMatchesCount * 100, matchesPlayed)),
    performanceVolatilityPercent: toNonNegativeInt(calculateCoefficientOfVariationPercent(performanceScores)),
    recentTimelineMatches,
  };
}

function buildRecentTimelineMatches(apiMatches) {
  if (!Array.isArray(apiMatches) || !apiMatches.length) return [];

  const withDate = apiMatches.map((match, index) => {
    const createdAtRaw = typeof match?.createdAt === 'string' ? match.createdAt.trim() : '';
    const createdAt = createdAtRaw ? new Date(/(?:Z|[+\-]\d{2}:\d{2})$/i.test(createdAtRaw) ? createdAtRaw : `${createdAtRaw}Z`) : null;
    const createdAtTime = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.getTime() : index;

    const damage = toNonNegativeInt(match?.damageDealt);
    const kills = toNonNegativeInt(match?.enemiesKilled);
    const coins = toNonNegativeInt(match?.coinsCollected);
    const level = toNonNegativeInt(match?.level);
    const durationSeconds = normalizeDurationSeconds(match?.time);
    const performanceScore = damage + kills * 120 + coins * 4 + level * 250;

    return {
      damage,
      kills,
      coins,
      level,
      durationSeconds,
      performanceScore,
      createdAtTime,
    };
  });

  return withDate
    .sort((left, right) => left.createdAtTime - right.createdAtTime)
    .slice(-10)
    .map((entry, index) => ({
      ...entry,
      matchNumber: index + 1,
    }));
}

function formatDurationLabel(totalSeconds) {
  const seconds = toNonNegativeInt(totalSeconds);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function calculateCoefficientOfVariationPercent(values) {
  if (!Array.isArray(values) || values.length < 2) return 0;

  const normalized = values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0);

  if (normalized.length < 2) return 0;

  const mean = normalized.reduce((sum, value) => sum + value, 0) / normalized.length;
  if (mean <= 0) return 0;

  const variance = normalized
    .map((value) => Math.pow(value - mean, 2))
    .reduce((sum, value) => sum + value, 0) / normalized.length;

  const standardDeviation = Math.sqrt(variance);
  return safeDivide(standardDeviation * 100, mean);
}

function safeDivide(numerator, denominator) {
  const left = Number(numerator);
  const right = Number(denominator);
  if (!Number.isFinite(left) || !Number.isFinite(right) || right <= 0) {
    return 0;
  }

  return left / right;
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

function resolvePlayerId(user) {
  // Check if a userId query parameter is provided
  const queryParams = new URLSearchParams(window.location.search);
  const userIdParam = queryParams.get('userId');
  if (userIdParam) {
    const value = Number(userIdParam);
    if (Number.isInteger(value) && value > 0) {
      return value;
    }
  }

  // Fall back to current user's ID
  const candidates = [user?.id, user?.userId, user?.playerId];
  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isInteger(value) && value > 0) {
      return value;
    }
  }

  return null;
}

function updateNavbarLinksForPlayer(container) {
  const queryParams = new URLSearchParams(window.location.search);
  const userIdParam = queryParams.get('userId');

  if (!userIdParam) return;

  // Back-only navbar in viewed-player mode.
  const navLinks = container.querySelector('.st-links');
  const backLink = container.querySelector('#stBackToDashboard');
  const avatarWrap = container.querySelector('.st-avatar-wrap');
  const hamburger = container.querySelector('#st-hamburger');
  const mobileMenu = container.querySelector('#st-mobile-menu');
  const root = container.querySelector('.st-root');

  if (root) root.classList.add('st-view-mode');
  if (navLinks) navLinks.style.display = 'none';
  if (avatarWrap) avatarWrap.style.display = 'none';
  if (hamburger) hamburger.style.display = 'none';
  if (mobileMenu) mobileMenu.style.display = 'none';
  if (backLink) {
    backLink.style.display = 'inline-block';
    backLink.setAttribute('href', '/main');
  }

  // Fetch and display viewed player's username
  loadViewedPlayerUsername(userIdParam, container);
}

async function loadViewedPlayerUsername(userId, container) {
  try {
    const res = await authFetch(`${API_BASE}/api/User/name?id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('User not found');
    
    const data = await res.json();
    const username = data?.username || `User #${userId}`;
    
    const viewingEl = container.querySelector('#st-viewing-user');
    const viewingNameEl = container.querySelector('#st-viewing-name');
    if (viewingEl && viewingNameEl) {
      viewingNameEl.textContent = username;
      viewingEl.style.display = 'inline-flex';
    }
  } catch {
    const viewingEl = container.querySelector('#st-viewing-user');
    const viewingNameEl = container.querySelector('#st-viewing-name');
    if (viewingEl && viewingNameEl) {
      viewingNameEl.textContent = `User #${userId}`;
      viewingEl.style.display = 'inline-flex';
    }
  }
}

function normalizeDurationSeconds(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;

  const nonNegative = Math.max(0, parsed);

  // Backend match time is stored in ms in current API responses.
  // For compatibility with potential legacy second-based values,
  // only convert to seconds when the number is clearly ms-sized.
  if (nonNegative >= 10_000) {
    return Math.round(nonNegative / 1000);
  }

  return Math.round(nonNegative);
}

function toNonNegativeInt(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function renderStatsVisuals(container, stats) {
  const matchesPlayed = toNonNegativeInt(stats.matchesPlayed);
  const shortRatio = matchesPlayed > 0 ? clamp(toNonNegativeInt(stats.shortMatchRatioPercent), 0, 100) : 0;
  const longRatio = matchesPlayed > 0 ? clamp(toNonNegativeInt(stats.longMatchRatioPercent), 0, 100) : 0;
  const normalRatio = matchesPlayed > 0 ? clamp(100 - shortRatio - longRatio, 0, 100) : 0;

  const shortEl = container.querySelector('#st-ratio-short');
  const normalEl = container.querySelector('#st-ratio-normal');
  const longEl = container.querySelector('#st-ratio-long');
  if (shortEl) shortEl.style.width = `${shortRatio}%`;
  if (normalEl) normalEl.style.width = `${normalRatio}%`;
  if (longEl) longEl.style.width = `${longRatio}%`;

  const shortLabel = container.querySelector('#st-ratio-short-label');
  const normalLabel = container.querySelector('#st-ratio-normal-label');
  const longLabel = container.querySelector('#st-ratio-long-label');
  if (shortLabel) shortLabel.textContent = `${shortRatio}%`;
  if (normalLabel) normalLabel.textContent = `${normalRatio}%`;
  if (longLabel) longLabel.textContent = `${longRatio}%`;

  const avgDamage = toNonNegativeInt(stats.averageDamagePerMatch);
  const avgKills = toNonNegativeInt(stats.averageKillsPerMatch);
  const avgCoins = toNonNegativeInt(stats.averageCoinsPerMatch);

  // Weight values to put different units onto one comparable visual scale.
  const damageWeighted = avgDamage;
  const killsWeighted = avgKills * 120;
  const coinsWeighted = avgCoins * 4;
  const weightedBase = Math.max(damageWeighted, killsWeighted, coinsWeighted, 1);

  const damageWidth = clamp(Math.round((damageWeighted / weightedBase) * 100), 0, 100);
  const killsWidth = clamp(Math.round((killsWeighted / weightedBase) * 100), 0, 100);
  const coinsWidth = clamp(Math.round((coinsWeighted / weightedBase) * 100), 0, 100);

  const damageBar = container.querySelector('#st-bar-damage');
  const killsBar = container.querySelector('#st-bar-kills');
  const coinsBar = container.querySelector('#st-bar-coins');
  if (damageBar) damageBar.style.width = `${damageWidth}%`;
  if (killsBar) killsBar.style.width = `${killsWidth}%`;
  if (coinsBar) coinsBar.style.width = `${coinsWidth}%`;

  const damageValue = container.querySelector('#st-bar-damage-value');
  const killsValue = container.querySelector('#st-bar-kills-value');
  const coinsValue = container.querySelector('#st-bar-coins-value');
  if (damageValue) damageValue.textContent = avgDamage.toLocaleString('en-US');
  if (killsValue) killsValue.textContent = avgKills.toLocaleString('en-US');
  if (coinsValue) coinsValue.textContent = avgCoins.toLocaleString('en-US');

  const volatility = clamp(toNonNegativeInt(stats.performanceVolatilityPercent), 0, 100);
  const gauge = container.querySelector('#st-gauge');
  if (gauge) {
    gauge.style.setProperty('--volatility', String(volatility));
  }

  const gaugeValue = container.querySelector('#st-gauge-value');
  if (gaugeValue) gaugeValue.textContent = String(volatility);

  const gaugeNote = container.querySelector('#st-gauge-note');
  if (gaugeNote) {
    if (volatility <= 15) {
      gaugeNote.textContent = 'Very stable';
    } else if (volatility <= 35) {
      gaugeNote.textContent = 'Stable';
    } else if (volatility <= 60) {
      gaugeNote.textContent = 'Swingy';
    } else {
      gaugeNote.textContent = 'High variance';
    }
  }

  const timelineLine = container.querySelector('#st-timeline-line');
  const timelinePoints = container.querySelector('#st-timeline-points');
  if (!timelineLine || !timelinePoints) return;

  const timelineMatches = Array.isArray(stats.recentTimelineMatches) ? stats.recentTimelineMatches : [];
  timelinePoints.innerHTML = '';

  if (timelineMatches.length < 2) {
    timelineLine.style.clipPath = 'polygon(0% 65%, 100% 65%, 100% 69%, 0% 69%)';
    return;
  }

  const scores = timelineMatches.map((entry) => toNonNegativeInt(entry.performanceScore));
  const maxScore = Math.max(...scores, 1);
  const minScore = Math.min(...scores, 0);
  const range = Math.max(1, maxScore - minScore);

  const points = timelineMatches.map((entry, index) => {
    const x = (index / (timelineMatches.length - 1)) * 100;
    const y = 86 - ((toNonNegativeInt(entry.performanceScore) - minScore) / range) * 72;
    return { x, y, entry };
  });

  const polygonTop = points.map((point) => `${point.x.toFixed(2)}% ${point.y.toFixed(2)}%`).join(', ');
  timelineLine.style.clipPath = `polygon(${polygonTop}, 100% 100%, 0% 100%)`;

  points.forEach((point) => {
    const dot = document.createElement('span');
    dot.className = 'st-timeline-point';
    dot.style.left = `${point.x}%`;
    dot.style.top = `${point.y}%`;

    const tooltip =
      `M${point.entry.matchNumber} | Score ${toNonNegativeInt(point.entry.performanceScore).toLocaleString('en-US')} | ` +
      `Dmg ${toNonNegativeInt(point.entry.damage)} | K ${toNonNegativeInt(point.entry.kills)} | ` +
      `C ${toNonNegativeInt(point.entry.coins)} | Lv ${toNonNegativeInt(point.entry.level)} | ` +
      `${formatDurationLabel(point.entry.durationSeconds)}`;

    dot.setAttribute('data-tip', tooltip);
    dot.setAttribute('aria-label', tooltip);
    timelinePoints.appendChild(dot);
  });
}

/* ======================================================================
   CANVAS — Starry background from Profile
   ====================================================================== */
function initStCanvas() {
  const canvas = document.getElementById('st-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let stars = [];

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 85; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }
  }

  function anim() {
    // Full clear each frame so stars remain points without motion trails.
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgb(8,6,6)';
    ctx.fillRect(0, 0, W, H);

    stars.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;

      const glowRadius = s.r * 6;
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
      glow.addColorStop(0, `rgba(212,175,55,${Math.min(1, s.opacity * 0.75)})`);
      glow.addColorStop(0.35, `rgba(212,175,55,${s.opacity * 0.35})`);
      glow.addColorStop(1, 'rgba(212,175,55,0)');

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255,230,150,${Math.min(1, s.opacity + 0.2)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(anim);
  }

  measure();
  initStars();
  anim();

  window.addEventListener('resize', () => {
    measure();
    initStars();
  });
}


function spawnStParticles() {
  const root = document.querySelector('.st-root');
  if (!root) return;
  for (let i = 0; i < 18; i++) {
    const p        = document.createElement('div');
    p.className    = 'bw-particle';
    const size     = Math.random() * 2.2 + 0.4;
    const isRed    = Math.random() < 0.28;
    const isGold   = !isRed && Math.random() < 0.15;
    const col      = isRed  ? 'rgba(192,57,43,0.55)'
                   : isGold ? 'rgba(212,175,55,0.4)'
                   :          'rgba(255,230,210,0.28)';
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:-12px;
      background:${col};
      animation-duration:${18 + Math.random() * 22}s;
      animation-delay:${Math.random() * 20}s;
      --drift:${(Math.random() - 0.5) * 90}px;
    `;
    root.appendChild(p);
  }
}

function animateStStats(container) {
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

    const startDelay = 140 + index * 80;
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

