<script lang="ts">
  import type { QuarterInfo } from "../date";
  import { circleDash, circleOffset } from "../utils";

  export let quarters: QuarterInfo[] = [];
  export let activeQuarter: QuarterInfo;
</script>

<div class="clock-quarters">
  {#each quarters as info}
    <div class:active={info.quarter === activeQuarter.quarter} class="quarter-card" data-quarter={info.quarter}>
      <div class="mini-ring">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="gradient-q{info.quarter}" x1="0%" y1="0%" x2="100%" y2="100%">
              {#if info.quarter === 1}
                <stop offset="0%" style="stop-color:var(--color-q1);stop-opacity:1" />
                <stop offset="100%" style="stop-color:var(--color-q1-light);stop-opacity:1" />
              {:else if info.quarter === 2}
                <stop offset="0%" style="stop-color:var(--color-q2);stop-opacity:1" />
                <stop offset="100%" style="stop-color:var(--color-q2-light);stop-opacity:1" />
              {:else if info.quarter === 3}
                <stop offset="0%" style="stop-color:var(--color-q3);stop-opacity:1" />
                <stop offset="100%" style="stop-color:var(--color-q3-light);stop-opacity:1" />
              {:else}
                <stop offset="0%" style="stop-color:var(--color-q4);stop-opacity:1" />
                <stop offset="100%" style="stop-color:var(--color-q4-light);stop-opacity:1" />
              {/if}
            </linearGradient>
          </defs>
          <circle class="ring-base" cx="50" cy="50" r="38" />
          <circle
            class="ring-progress"
            cx="50"
            cy="50"
            r="38"
            stroke="url(#gradient-q{info.quarter})"
            stroke-dasharray={circleDash(info.percentComplete, 38)}
            stroke-dashoffset={circleOffset(info.percentComplete, 38)}
          />
        </svg>
        <div class="ring-label small">
          <strong>{info.percentComplete.toFixed(0)}%</strong>
          <span>Q{info.quarter}</span>
        </div>
      </div>
      <div class="quarter-meta">
        <span>{info.daysElapsed} gone</span>
        <span>{info.daysRemaining} left</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .clock-quarters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--space-lg);
  }

  .quarter-card {
    border-radius: var(--radius-xl);
    border: 2px solid var(--color-border);
    padding: var(--space-lg);
    display: grid;
    gap: var(--space-md);
    place-items: center;
    background: linear-gradient(135deg, #ffffff 0%, var(--color-bg-secondary) 100%);
    transition: all var(--transition-slow);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-md);
  }

  .quarter-card::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--color-border);
    transition: all var(--transition-base);
  }

  .quarter-card::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(198, 93, 59, 0.03) 0%, transparent 70%);
    opacity: 0;
    transition: opacity var(--transition-slow);
  }

  .quarter-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary-light);
  }

  .quarter-card:hover::after {
    opacity: 1;
  }

  .quarter-card.active {
    border-color: var(--color-primary);
    background: linear-gradient(135deg, #fff8f5 0%, var(--color-primary-bg) 100%);
    box-shadow: 0 8px 24px rgba(198, 93, 59, 0.2), 0 0 0 1px rgba(198, 93, 59, 0.1);
    transform: scale(1.05);
  }

  .quarter-card.active::before {
    background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    width: 5px;
    box-shadow: 2px 0 8px rgba(198, 93, 59, 0.3);
  }

  .quarter-card.active::after {
    opacity: 1;
  }

  .mini-ring {
    position: relative;
    display: grid;
    place-items: center;
    filter: drop-shadow(0 4px 12px rgba(198, 93, 59, 0.15));
  }

  .ring-base {
    fill: none;
    stroke: var(--color-border-light);
    stroke-width: 8;
    opacity: 0.4;
  }

  .ring-progress {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke-width 0.3s ease;
    filter: drop-shadow(0 2px 6px rgba(198, 93, 59, 0.4));
  }

  .quarter-card:hover .ring-progress {
    stroke-width: 10;
    filter: drop-shadow(0 3px 10px rgba(198, 93, 59, 0.5));
  }

  .quarter-card.active .ring-progress {
    stroke-width: 10;
    filter: drop-shadow(0 4px 12px rgba(198, 93, 59, 0.6));
  }

  .ring-label {
    position: absolute;
    display: grid;
    gap: 0.125rem;
    text-align: center;
    color: var(--color-text-primary);
    transition: all var(--transition-base);
  }

  .ring-label strong {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    transition: all var(--transition-base);
  }

  .ring-label span {
    font-size: 0.6875rem;
    color: var(--color-text-tertiary);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    line-height: 1;
  }

  .ring-label.small strong {
    font-size: 1.25rem;
    font-weight: 800;
  }

  .ring-label.small span {
    font-size: 0.625rem;
    letter-spacing: 0.08em;
  }

  .quarter-card:hover .ring-label strong {
    transform: scale(1.1);
  }

  .quarter-card.active .ring-label strong {
    transform: scale(1.15);
    filter: drop-shadow(0 2px 4px rgba(198, 93, 59, 0.3));
  }

  .quarter-card.active .ring-label span {
    color: var(--color-primary);
  }

  .quarter-meta {
    display: flex;
    gap: var(--space-md);
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
    font-weight: 600;
    width: 100%;
    justify-content: center;
  }

  .quarter-meta span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  @media (max-width: 640px) {
    .clock-quarters {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
