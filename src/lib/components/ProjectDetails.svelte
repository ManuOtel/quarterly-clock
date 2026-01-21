<script lang="ts">
  import type { Project, Subtask } from "../types";
  import { getCompletionPercent, getDaysUntilDeadline } from "../date";

  export let selectedProject: Project | null = null;
  export let selectedQuarterFilter: "all" | "Q1" | "Q2" | "Q3" | "Q4" = "all";
  export let projectQuarters: Array<1 | 2 | 3 | 4> = [];
  export let filteredSubtasks: Subtask[] = [];
  export let newSubtaskDescription = "";

  export let updateProject: (projectId: string, updates: Partial<Project>) => void;
  export let addSubtask: () => void;
  export let updateSubtask: (subtaskId: string, updates: Partial<Subtask>) => void;
  export let deleteSubtask: (subtaskId: string) => void;
</script>

<div class="card">
  <h2>Project details</h2>
  {#if !selectedProject}
    <p class="empty">Select a project to edit its details.</p>
  {:else}
    <div class="form-column">
      <label>
        Project name
        <input
          type="text"
          value={selectedProject.name}
          on:input={(event) =>
            updateProject(selectedProject.id, {
              name: (event.currentTarget as HTMLInputElement).value
            })}
        />
      </label>
      <label>
        Deadline
        <input
          type="date"
          value={selectedProject.deadline}
          on:input={(event) =>
            updateProject(selectedProject.id, {
              deadline: (event.currentTarget as HTMLInputElement).value
            })}
        />
      </label>
      <div class="stats">
        <div>
          <span class="label">Completion</span>
          <strong>{getCompletionPercent(selectedProject).toFixed(0)}%</strong>
        </div>
        <div>
          <span class="label">Days to deadline</span>
          <strong>{getDaysUntilDeadline(selectedProject)}</strong>
        </div>
      </div>
    </div>

    <div class="subtasks">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
        <h3>Subtasks</h3>
        <div class="quarter-buttons">
          <button type="button" class="quarter-btn" class:active={selectedQuarterFilter === 'all'} on:click={() => selectedQuarterFilter = 'all'}>All</button>
          {#each [1, 2, 3, 4] as q}
            <button
              type="button"
              class="quarter-btn"
              class:active={selectedQuarterFilter === `Q${q}`}
              disabled={!projectQuarters.includes(q)}
              on:click={() => selectedQuarterFilter = `Q${q}`}
            >
              Q{q}
            </button>
          {/each}
        </div>
      </div>
      <div class="form-row">
        <input
          type="text"
          placeholder="New subtask"
          bind:value={newSubtaskDescription}
        />
        <button type="button" on:click={addSubtask}>Add</button>
      </div>
      {#if filteredSubtasks.length === 0}
        <p class="empty">
          {selectedQuarterFilter === 'all'
            ? 'No subtasks yet. Add one to start tracking.'
            : `No subtasks for ${selectedQuarterFilter}. This project doesn't span this quarter.`}
        </p>
      {:else}
        <ul>
          {#each filteredSubtasks as subtask}
            <li class="subtask">
              <input
                type="checkbox"
                checked={subtask.completed}
                on:change={(event) =>
                  updateSubtask(subtask.id, {
                    completed: (event.currentTarget as HTMLInputElement).checked
                  })}
              />
              <input
                type="text"
                value={subtask.description}
                on:input={(event) =>
                  updateSubtask(subtask.id, {
                    description: (event.currentTarget as HTMLInputElement).value
                  })}
              />
              <button
                type="button"
                class="icon"
                title="Delete subtask"
                on:click={() => deleteSubtask(subtask.id)}
              >
                ✕
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Forms */
  .form-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: var(--space-sm);
    margin: var(--space-md) 0;
    align-items: start;
  }

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

  /* Stats */
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--space-lg);
    padding: var(--space-md);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-border);
  }

  .stats > div {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .stats .label {
    display: block;
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .stats strong {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  /* Subtasks */
  .subtasks {
    margin-top: var(--space-lg);
  }

  .subtasks h3 {
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-sm);
    border-bottom: 2px solid var(--color-border);
  }

  .subtasks ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--space-sm);
  }

  .subtask {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-sm);
    border-radius: var(--radius-lg);
    background: var(--color-bg-secondary);
    transition: all var(--transition-base);
  }

  .subtask:hover {
    background: var(--color-bg-primary);
    box-shadow: var(--shadow-sm);
  }

  .subtask input[type="text"] {
    background: transparent;
    border: none;
    padding: 0.375rem 0.5rem;
  }

  .subtask input[type="text"]:focus {
    background: var(--color-bg-primary);
    border: 2px solid var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-bg);
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
