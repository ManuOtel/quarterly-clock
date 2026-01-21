<script lang="ts">
  import type { Project } from "../types";
  import type { QuarterInfo } from "../date";
  import { getCompletionPercent, getProjectStatus } from "../date";

  export let projects: Project[] = [];
  export let selectedProjectId = "";
  export let newProjectName = "";
  export let newProjectStartDate = "";
  export let newProjectDeadline = "";
  export let startQuarterMode: "Q1" | "Q2" | "Q3" | "Q4" | "custom" = "custom";
  export let endQuarterMode: "Q1" | "Q2" | "Q3" | "Q4" | "custom" = "custom";
  export let quarter: QuarterInfo;

  export let selectProject: (projectId: string) => void;
  export let selectStartQuarter: (q: 1 | 2 | 3 | 4) => void;
  export let selectEndQuarter: (q: 1 | 2 | 3 | 4) => void;
  export let addProject: () => void;
  export let deleteProject: (projectId: string) => void;
</script>

<div class="card">
  <h2>Projects</h2>
  <div class="form-column" style="margin-bottom: var(--space-lg);">
    <input
      type="text"
      placeholder="Project name"
      bind:value={newProjectName}
    />

    <div class="date-row">
      <span class="field-label">Start:</span>
      <div class="quarter-buttons">
        <button type="button" class="quarter-btn" class:active={startQuarterMode === 'Q1'} on:click={() => selectStartQuarter(1)}>Q1</button>
        <button type="button" class="quarter-btn" class:active={startQuarterMode === 'Q2'} on:click={() => selectStartQuarter(2)}>Q2</button>
        <button type="button" class="quarter-btn" class:active={startQuarterMode === 'Q3'} on:click={() => selectStartQuarter(3)}>Q3</button>
        <button type="button" class="quarter-btn" class:active={startQuarterMode === 'Q4'} on:click={() => selectStartQuarter(4)}>Q4</button>
        <button type="button" class="quarter-btn" class:active={startQuarterMode === 'custom'} on:click={() => startQuarterMode = 'custom'}>Custom</button>
      </div>
      {#if startQuarterMode === 'custom'}
        <input type="date" bind:value={newProjectStartDate} />
      {/if}
    </div>

    <div class="date-row">
      <span class="field-label">End:</span>
      <div class="quarter-buttons">
        <button type="button" class="quarter-btn" class:active={endQuarterMode === 'Q1'} on:click={() => selectEndQuarter(1)}>Q1</button>
        <button type="button" class="quarter-btn" class:active={endQuarterMode === 'Q2'} on:click={() => selectEndQuarter(2)}>Q2</button>
        <button type="button" class="quarter-btn" class:active={endQuarterMode === 'Q3'} on:click={() => selectEndQuarter(3)}>Q3</button>
        <button type="button" class="quarter-btn" class:active={endQuarterMode === 'Q4'} on:click={() => selectEndQuarter(4)}>Q4</button>
        <button type="button" class="quarter-btn" class:active={endQuarterMode === 'custom'} on:click={() => endQuarterMode = 'custom'}>Custom</button>
      </div>
      {#if endQuarterMode === 'custom'}
        <input type="date" bind:value={newProjectDeadline} />
      {/if}
    </div>

    <button type="button" on:click={addProject}>Add Project</button>
  </div>
  {#if projects.length === 0}
    <p class="empty">No projects yet. Add one to get started.</p>
  {:else}
    <ul class="project-list">
      {#each projects as project}
        <li>
          <button
            type="button"
            class="project-item"
            class:selected={project.id === selectedProjectId}
            on:click={() => selectProject(project.id)}
          >
            <div class="project-content">
              <h3>{project.name}</h3>
              <div class="project-meta">
                <p class="meta">
                  Due {project.deadline} • {getCompletionPercent(project).toFixed(0)}%
                </p>
                <span class="badge {getProjectStatus(project, quarter)}">
                  {getProjectStatus(project, quarter).replace("_", " ")}
                </span>
              </div>
            </div>
          </button>
          <button
            type="button"
            class="icon delete-btn"
            title="Delete project"
            on:click|stopPropagation={() => deleteProject(project.id)}
          >
            ✕
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  /* Forms */
  .form-column {
    display: grid;
    gap: var(--space-lg);
  }

  .quarter-buttons {
    display: flex;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  .quarter-btn {
    padding: 0.5rem 0.875rem;
    border-radius: var(--radius-md);
    border: 2px solid var(--color-border);
    background: var(--color-bg-primary);
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    min-width: 48px;
  }

  .quarter-btn:hover {
    border-color: var(--color-primary-light);
    background: var(--color-primary-bg);
    color: var(--color-primary);
    transform: translateY(-1px);
  }

  .quarter-btn.active {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .date-row {
    display: grid;
    gap: var(--space-sm);
    align-items: start;
  }

  .date-row .field-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-xs);
  }

  /* Project List */
  .project-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--space-md);
  }

  .project-list li {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--space-md);
    position: relative;
  }

  .project-item {
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-lg);
    border: 2px solid var(--color-border);
    background: var(--color-bg-primary);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
    text-align: left;
    cursor: pointer;
    width: 100%;
    color: inherit;
    font: inherit;
  }

  .project-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: transparent;
    transition: all var(--transition-base);
  }

  .project-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary-light);
  }

  .project-item:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .project-item.selected {
    border-color: var(--color-primary);
    background: var(--color-primary-bg);
    box-shadow: var(--shadow-lg);
  }

  .project-item.selected::before {
    background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  }

  .project-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .project-content h3 {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .project-meta {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .meta {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .delete-btn {
    opacity: 0.5;
    transition: opacity var(--transition-base);
  }

  .project-list li:hover .delete-btn {
    opacity: 1;
  }

  /* Badges */
  .badge {
    padding: 0.375rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: capitalize;
    background: var(--color-border);
    color: var(--color-text-primary);
    letter-spacing: 0.025em;
    white-space: nowrap;
    flex-shrink: 0;
    pointer-events: none;
  }

  .badge.ahead {
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  .badge.on_track {
    background: var(--color-info-bg);
    color: var(--color-info);
  }

  .badge.behind {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  @media (max-width: 640px) {
    .project-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-xs);
    }

    .project-list li {
      padding: var(--space-md);
    }
  }
</style>
