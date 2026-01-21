<script lang="ts">
  import type { YearInfo } from "../date";
  import type { MonthInfo } from "../utils";

  export let yearInfo: YearInfo;
  export let monthInfo: MonthInfo;

  let yearAngle = 0;
  let monthAngle = 0;
  let yearHandX = 0;
  let yearHandY = 0;
  let monthHandX = 0;
  let monthHandY = 0;

  const yearHandLength = 70;
  const monthHandLength = 110;

  $: yearAngle = (yearInfo.percentComplete / 100) * 360;
  $: monthAngle = (monthInfo.percentComplete / 100) * 360;
  $: yearHandX = 180 + yearHandLength * Math.sin((yearAngle * Math.PI) / 180);
  $: yearHandY = 180 - yearHandLength * Math.cos((yearAngle * Math.PI) / 180);
  $: monthHandX = 180 + monthHandLength * Math.sin((monthAngle * Math.PI) / 180);
  $: monthHandY = 180 - monthHandLength * Math.cos((monthAngle * Math.PI) / 180);
</script>

<div class="analog-clock">
  <svg width="360" height="360" viewBox="0 0 360 360" class="clock-face">
    <!-- Define gradients for quarters -->
    <defs>
      <!-- Q1 - Coral/Terracotta -->
      <linearGradient id="q1-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:var(--color-q1);stop-opacity:0.2" />
        <stop offset="100%" style="stop-color:var(--color-q1-light);stop-opacity:0.25" />
      </linearGradient>
      <!-- Q2 - Sage Green -->
      <linearGradient id="q2-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:var(--color-q2);stop-opacity:0.2" />
        <stop offset="100%" style="stop-color:var(--color-q2-light);stop-opacity:0.25" />
      </linearGradient>
      <!-- Q3 - Muted Teal -->
      <linearGradient id="q3-gradient" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" style="stop-color:var(--color-q3);stop-opacity:0.2" />
        <stop offset="100%" style="stop-color:var(--color-q3-light);stop-opacity:0.25" />
      </linearGradient>
      <!-- Q4 - Warm Purple -->
      <linearGradient id="q4-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" style="stop-color:var(--color-q4);stop-opacity:0.2" />
        <stop offset="100%" style="stop-color:var(--color-q4-light);stop-opacity:0.25" />
      </linearGradient>
      <!-- Year progress gradient (subtle terracotta) -->
      <linearGradient id="year-progress-gradient">
        <stop offset="0%" style="stop-color:var(--color-primary-dark);stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:var(--color-primary);stop-opacity:0.8" />
      </linearGradient>
    </defs>

    <!-- Quarter background arcs -->
    <path class="quarter-arc q1" d="M 180 45 A 135 135 0 0 1 315 180" stroke="url(#q1-gradient)" stroke-width="35" fill="none" />
    <path class="quarter-arc q2" d="M 315 180 A 135 135 0 0 1 180 315" stroke="url(#q2-gradient)" stroke-width="35" fill="none" />
    <path class="quarter-arc q3" d="M 180 315 A 135 135 0 0 1 45 180" stroke="url(#q3-gradient)" stroke-width="35" fill="none" />
    <path class="quarter-arc q4" d="M 45 180 A 135 135 0 0 1 180 45" stroke="url(#q4-gradient)" stroke-width="35" fill="none" />

    <!-- Quarter separators - thin lines dividing quarters like clock pie slices -->
    <line x1="180" y1="180" x2="180" y2="45" class="quarter-separator" />
    <line x1="180" y1="180" x2="315" y2="180" class="quarter-separator" />
    <line x1="180" y1="180" x2="180" y2="315" class="quarter-separator" />
    <line x1="180" y1="180" x2="45" y2="180" class="quarter-separator" />

    <!-- Clock margin circle (outer ring) - unfilled track -->
    <circle cx="180" cy="180" r="145" fill="none" stroke="var(--color-primary)" stroke-width="8" opacity="0.15" />

    <!-- Year progress arc (fills around the border) -->
    <circle
      cx="180"
      cy="180"
      r="145"
      fill="none"
      stroke="url(#year-progress-gradient)"
      stroke-width="8"
      stroke-dasharray="{2 * Math.PI * 145}"
      stroke-dashoffset="{2 * Math.PI * 145 * (1 - yearInfo.percentComplete / 100)}"
      transform="rotate(-90 180 180)"
      class="year-progress-arc"
    />

    <!-- Clock face circle -->
    <circle cx="180" cy="180" r="135" fill="white" stroke="var(--color-border)" stroke-width="2" opacity="0.95" />

    <!-- Month tick marks around the edge -->
    {#each Array(12) as _, i}
      {@const angle = (i * 30 - 90) * (Math.PI / 180)}
      {@const innerRadius = 128}
      {@const outerRadius = 135}
      {@const x1 = 180 + innerRadius * Math.cos(angle)}
      {@const y1 = 180 + innerRadius * Math.sin(angle)}
      {@const x2 = 180 + outerRadius * Math.cos(angle)}
      {@const y2 = 180 + outerRadius * Math.sin(angle)}
      <line x1={x1} y1={y1} x2={x2} y2={y2} class="month-tick" />
    {/each}

    <!-- Month markers - evenly spaced at 30° intervals -->
    {#each ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"] as month, i}
      {@const angle = (i * 30 - 90) * (Math.PI / 180)}
      {@const radius = 115}
      {@const x = 180 + radius * Math.cos(angle)}
      {@const y = 180 + radius * Math.sin(angle)}
      <text class="month-marker" x={x} y={y} text-anchor="middle" dominant-baseline="middle">{month}</text>
    {/each}

    <!-- Year hand (shorter, thicker) - points to current position in the year -->
    <line
      class="clock-hand year-hand"
      x1="180"
      y1="180"
      x2={yearHandX}
      y2={yearHandY}
    />

    <!-- Month hand (longer, thinner) - points to current day of month -->
    <line
      class="clock-hand month-hand"
      x1="180"
      y1="180"
      x2={monthHandX}
      y2={monthHandY}
    />

    <!-- Center dot -->
    <circle class="clock-center" cx="180" cy="180" r="10" />
  </svg>
</div>

<style>
  .analog-clock {
    position: relative;
    display: grid;
    place-items: center;
    filter: drop-shadow(0 8px 24px rgba(198, 93, 59, 0.12));
  }

  .clock-face {
    position: relative;
  }

  .quarter-arc {
    fill: none;
    opacity: 1;
  }

  .quarter-separator {
    stroke: var(--color-primary-dark);
    stroke-width: 1.5;
    opacity: 1;
  }

  .month-tick {
    stroke: var(--color-primary-dark);
    stroke-width: 2.5;
    opacity: 0.5;
  }

  .month-marker {
    fill: var(--color-text-primary);
    font-size: 14px;
    font-weight: 700;
    text-anchor: middle;
  }

  /* Year hand - shorter and thicker like an hour hand */
  .year-hand {
    stroke: var(--color-primary-dark);
    stroke-width: 6;
    stroke-linecap: round;
    filter: drop-shadow(0 3px 10px rgba(198, 93, 59, 0.5));
    transition: all 1s cubic-bezier(0.65, 0, 0.35, 1);
  }

  /* Month hand - longer and thinner like a minute hand */
  .month-hand {
    stroke: var(--color-primary);
    stroke-width: 3;
    stroke-linecap: round;
    filter: drop-shadow(0 2px 6px rgba(198, 93, 59, 0.4));
    transition: all 1s cubic-bezier(0.65, 0, 0.35, 1);
  }

  .clock-center {
    fill: var(--color-primary);
  }
</style>
