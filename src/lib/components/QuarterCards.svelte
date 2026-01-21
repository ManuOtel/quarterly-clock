<script lang="ts">
  import type { QuarterInfo } from "../date";
  import { circleDash, circleOffset } from "../utils";

  export let quarters: QuarterInfo[] = [];
  export let activeQuarter: QuarterInfo;
</script>

<div class="clock-quarters">
  {#each quarters as info}
    <div
      class:active={info.quarter === activeQuarter.quarter}
      class="quarter-card"
      data-quarter={info.quarter}
      style={`--quarter-color: var(--color-q${info.quarter}); --quarter-color-light: var(--color-q${info.quarter}-light); --quarter-color-bg: var(--color-q${info.quarter}-bg);`}
    >
      <div class="quarter-title">Q{info.quarter}</div>
      <div class="mini-ring">
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle class="ring-base" cx="64" cy="64" r="52" />
          <circle
            class="ring-progress"
            cx="64"
            cy="64"
            r="52"
            stroke-dasharray={circleDash(info.percentComplete, 52)}
            stroke-dashoffset={circleOffset(info.percentComplete, 52)}
          />
        </svg>
        <div class="ring-label">
          <strong>{info.percentComplete.toFixed(0)}%</strong>
          <span>complete</span>
        </div>
      </div>
      <div class="quarter-meta">
        <span><strong>{info.daysElapsed}</strong> days in</span>
        <span><strong>{info.daysRemaining}</strong> days left</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .clock-quarters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-lg);
  }

  .quarter-card {
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-border-light);
    padding: var(--space-lg);
    display: grid;
    gap: var(--space-md);
    place-items: center;
    background: linear-gradient(145deg, #ffffff 0%, var(--quarter-color-bg, var(--color-bg-secondary)) 100%);
    transition: all var(--transition-slow);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-md);
  }

  .quarter-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.03) 0%, transparent 65%);
    opacity: 0.5;
    transition: opacity var(--transition-base);
  }

  .quarter-card::after {
    content: "";
    position: absolute;
    left: var(--space-lg);
    right: var(--space-lg);
    top: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent 0%, var(--quarter-color, var(--color-primary)) 50%, transparent 100%);
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .quarter-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-xl);
    border-color: var(--quarter-color, var(--color-primary-light));
  }

  .quarter-card:hover::after {
    opacity: 0.7;
  }

  .quarter-card.active {
    border-color: var(--quarter-color, var(--color-primary));
    background: linear-gradient(150deg, #fffdfb 0%, var(--quarter-color-bg, var(--color-primary-bg)) 100%);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(198, 93, 59, 0.1);
    transform: translateY(-2px) scale(1.02);
  }

  .quarter-card.active::after {
    opacity: 1;
  }

  .quarter-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 700;
    color: var(--quarter-color, var(--color-primary));
  }

  .mini-ring {
    position: relative;
    display: grid;
    place-items: center;
  }

  .ring-base {
    fill: none;
    stroke: var(--color-border-light);
    stroke-width: 10;
    opacity: 0.3;
  }

  .ring-progress {
    fill: none;
    stroke-width: 10;
    stroke-linecap: round;
    stroke: var(--quarter-color, var(--color-primary));
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke-width 0.3s ease;
  }

  .quarter-card:hover .ring-progress {
    stroke-width: 12;
  }

  .quarter-card.active .ring-progress {
    stroke-width: 12;
  }

  .ring-label {
    position: absolute;
    display: grid;
    gap: 0.25rem;
    text-align: center;
    color: var(--color-text-primary);
  }

  .ring-label strong {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--quarter-color, var(--color-primary));
    line-height: 1;
  }

  .ring-label span {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    line-height: 1;
  }

  .quarter-card:hover .ring-label strong {
    transform: scale(1.08);
  }

  .quarter-card.active .ring-label strong {
    transform: scale(1.12);
  }

  .quarter-meta {
    display: grid;
    gap: 0.25rem;
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    font-weight: 500;
    width: 100%;
    justify-items: center;
  }

  .quarter-meta span {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
  }

  .quarter-meta strong {
    font-size: 1rem;
    color: var(--color-text-primary);
  }

  @media (max-width: 640px) {
    .clock-quarters {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
