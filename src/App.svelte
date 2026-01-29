<script lang="ts">
  import { onMount } from "svelte";
  import {
    getQuarterInfo,
    getQuarterInfoFor,
    getYearInfo,
    getQuarterDates,
    projectOverlapsQuarter
  } from "./lib/date";
  import { getMonthInfo, generateId } from "./lib/utils";
  import {
    createEmptyData,
    exportData,
    importDataFromFile,
    loadData,
    saveData
  } from "./lib/storage";
  import AnalogClock from "./lib/components/AnalogClock.svelte";
  import QuarterCards from "./lib/components/QuarterCards.svelte";
  import ProjectList from "./lib/components/ProjectList.svelte";
  import ProjectDetails from "./lib/components/ProjectDetails.svelte";

  let data = createEmptyData();
  let selectedProjectId = "";
  let hasLoaded = false;
  let newProjectName = "";
  let newProjectStartDate = "";
  let newProjectDeadline = "";
  let newSubtaskDescription = "";
  let startQuarterMode = "custom"; // "Q1" | "Q2" | "Q3" | "Q4" | "custom"
  let endQuarterMode = "custom"; // "Q1" | "Q2" | "Q3" | "Q4" | "custom"
  let selectedQuarterFilter = "all"; // "all" | "Q1" | "Q2" | "Q3" | "Q4"

  const formatDate = (date) => date.toISOString().slice(0, 10);
  const today = new Date();
  const quarter = getQuarterInfo(today);
  const yearInfo = getYearInfo(today);
  const quarters = [1, 2, 3, 4].map((value) =>
    getQuarterInfoFor(value, yearInfo.year, today)
  );

  const monthInfo = getMonthInfo(today);

  onMount(() => {
    data = loadData();
    if (!newProjectStartDate) {
      newProjectStartDate = formatDate(quarter.start);
    }
    if (!newProjectDeadline) {
      newProjectDeadline = formatDate(quarter.end);
    }
    hasLoaded = true;
  });

  $: if (hasLoaded) {
    saveData(data);
  }

  $: selectedProject =
    data.projects.find((project) => project.id === selectedProjectId) || null;

  $: filteredSubtasks = selectedProject
    ? selectedQuarterFilter === "all"
      ? selectedProject.subtasks
      : projectOverlapsQuarter(selectedProject, parseInt(selectedQuarterFilter.slice(1)), yearInfo.year)
        ? selectedProject.subtasks
        : []
    : [];

  $: projectQuarters = selectedProject
    ? [1, 2, 3, 4].filter((q) =>
        projectOverlapsQuarter(selectedProject, q, yearInfo.year)
      )
    : [];

  const selectProject = (projectId) => {
    selectedProjectId = projectId;
    newSubtaskDescription = "";
  };

  const selectStartQuarter = (q: 1 | 2 | 3 | 4) => {
    const dates = getQuarterDates(q, yearInfo.year);
    newProjectStartDate = dates.start;
    startQuarterMode = `Q${q}`;
  };

  const selectEndQuarter = (q: 1 | 2 | 3 | 4) => {
    const dates = getQuarterDates(q, yearInfo.year);
    newProjectDeadline = dates.end;
    endQuarterMode = `Q${q}`;
  };

  const addProject = () => {
    const name = newProjectName.trim();
    if (!name || !newProjectStartDate || !newProjectDeadline) return;
    const project = {
      id: generateId(),
      name,
      startDate: newProjectStartDate,
      deadline: newProjectDeadline,
      subtasks: []
    };
    data = { ...data, projects: [...data.projects, project] };
    newProjectName = "";
    selectedProjectId = project.id;
  };

  const updateProject = (projectId, updates) => {
    data = {
      ...data,
      projects: data.projects.map((project) =>
        project.id === projectId ? { ...project, ...updates } : project
      )
    };
  };

  const deleteProject = (projectId) => {
    data = {
      ...data,
      projects: data.projects.filter((project) => project.id !== projectId)
    };
    if (selectedProjectId === projectId) {
      selectedProjectId = "";
    }
  };

  const addSubtask = () => {
    if (!selectedProject) return;
    const description = newSubtaskDescription.trim();
    if (!description) return;
    const subtasks = [
      ...selectedProject.subtasks,
      { id: generateId(), description, completed: false }
    ];
    updateProject(selectedProject.id, { subtasks });
    newSubtaskDescription = "";
  };

  const updateSubtask = (subtaskId, updates) => {
    if (!selectedProject) return;
    const subtasks = selectedProject.subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
    );
    updateProject(selectedProject.id, { subtasks });
  };

  const deleteSubtask = (subtaskId) => {
    if (!selectedProject) return;
    const subtasks = selectedProject.subtasks.filter(
      (subtask) => subtask.id !== subtaskId
    );
    updateProject(selectedProject.id, { subtasks });
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    data = await importDataFromFile(file);
    selectedProjectId = "";
    event.target.value = "";
  };
</script>

<main>
  <header class="header">
    <div>
      <h1>Quarter Year Clock</h1>
      <p class="subtitle">Track quarterly progress and project momentum.</p>
    </div>
    <div class="header-actions">
      <button type="button" class="secondary" on:click={() => exportData(data)}>
        Export JSON
      </button>
      <label class="file-input">
        Import JSON
        <input type="file" accept="application/json" on:change={handleImport} />
      </label>
    </div>
  </header>

  <section class="card clock-card">
    <div class="clock-main">
      <div class="year-progress-header">
        <div class="year-badge">{yearInfo.year}</div>
        <h2>Year progress</h2>
        <div class="year-progress-stats">
          <div class="stat-item">
            <span class="stat-value">{yearInfo.percentComplete.toFixed(1)}%</span>
            <span class="stat-label">Complete</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{yearInfo.daysElapsed}</span>
            <span class="stat-label">Days elapsed</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{yearInfo.daysRemaining}</span>
            <span class="stat-label">Days remaining</span>
          </div>
        </div>
      </div>

      <AnalogClock {yearInfo} {monthInfo} />
    </div>
    <QuarterCards {quarters} activeQuarter={quarter} />
  </section>

  <section class="card">
    <div class="quarter-summary">
      <div>
        <h2>Current quarter: Q{quarter.quarter}</h2>
        <p>{quarter.daysElapsed} days elapsed</p>
        <p>{quarter.daysRemaining} days remaining</p>
      </div>
      <div class="progress">
        <div class="progress-bar">
          <div class="progress-fill" style={`width: ${quarter.percentComplete}%`}></div>
        </div>
        <span>{quarter.percentComplete.toFixed(1)}% complete</span>
      </div>
    </div>
  </section>

  <section class="grid">
    <span class="sr-only" data-author="Manu Otel" data-site="https://manuotel.com">
      Crafted by Manu Otel. Visit manuotel.com for more.
    </span>
    <ProjectList
      projects={data.projects}
      {selectedProjectId}
      {quarter}
      {selectProject}
      {selectStartQuarter}
      {selectEndQuarter}
      {addProject}
      {deleteProject}
      bind:newProjectName
      bind:newProjectStartDate
      bind:newProjectDeadline
      bind:startQuarterMode
      bind:endQuarterMode
    />

    <ProjectDetails
      {selectedProject}
      {projectQuarters}
      {filteredSubtasks}
      {updateProject}
      {addSubtask}
      {updateSubtask}
      {deleteSubtask}
      bind:selectedQuarterFilter
      bind:newSubtaskDescription
    />
  </section>
</main>

<footer class="credit-footer">
  <div class="credit-content">
    <div class="credit-identity">
      <span>Made by</span>
      <a href="https://manuotel.com" target="_blank" rel="noopener noreferrer">Manu Otel</a>
    </div>
    <div class="credit-links" aria-label="Follow Manu Otel">
      <a
        href="https://x.com/manuotel"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Manu Otel on X"
      >
        <span class="credit-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path
              d="M18.244 2H21l-6.588 7.53L22.75 22h-6.72l-5.157-6.6L4.92 22H2.16l7.057-8.07L1.25 2h6.89l4.66 6.1L18.244 2zm-1.2 18h1.75L7.79 4h-1.9l11.254 16z"
            />
          </svg>
        </span>
        <span>X</span>
      </a>
      <a
        href="https://www.linkedin.com/in/manuotel/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Manu Otel on LinkedIn"
      >
        <span class="credit-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path
              d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.06c.53-1 1.84-2.2 3.8-2.2 4.06 0 4.8 2.67 4.8 6.15V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V24h-4V8z"
            />
          </svg>
        </span>
        <span>LinkedIn</span>
      </a>
      <a
        href="https://github.com/ManuOtel"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Manu Otel on GitHub"
      >
        <span class="credit-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path
              d="M12 .5C5.73.5.5 5.74.5 12.21c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.26.79-.58v-2.05c-3.2.71-3.88-1.4-3.88-1.4-.53-1.37-1.3-1.73-1.3-1.73-1.06-.74.08-.73.08-.73 1.17.08 1.78 1.21 1.78 1.21 1.04 1.8 2.73 1.28 3.39.98.1-.77.4-1.28.72-1.57-2.55-.3-5.24-1.31-5.24-5.81 0-1.29.46-2.35 1.2-3.18-.12-.3-.52-1.5.11-3.12 0 0 .98-.32 3.2 1.2.93-.26 1.92-.39 2.91-.39.99 0 1.98.13 2.91.39 2.22-1.52 3.2-1.2 3.2-1.2.63 1.62.23 2.82.11 3.12.74.83 1.2 1.89 1.2 3.18 0 4.52-2.7 5.5-5.26 5.8.41.36.78 1.08.78 2.18v3.24c0 .32.21.69.8.57 4.57-1.53 7.85-5.86 7.85-10.96C23.5 5.74 18.27.5 12 .5z"
            />
          </svg>
        </span>
        <span>GitHub</span>
      </a>
      <a
        href="https://manuotel.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Manu Otel website"
      >
        <span class="credit-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path
              d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.17a15.6 15.6 0 00-1.38-5.06A8.02 8.02 0 0119.93 11zM12 4.07c.95 1.15 1.7 2.75 2.14 4.93H9.86c.44-2.18 1.19-3.78 2.14-4.93zM8.62 5.94A15.6 15.6 0 007.24 11H4.07a8.02 8.02 0 014.55-5.06zM4.07 13h3.17c.27 1.89.86 3.63 1.38 5.06A8.02 8.02 0 014.07 13zm5.79 0h4.28c-.44 2.18-1.19 3.78-2.14 4.93-.95-1.15-1.7-2.75-2.14-4.93zm5.52 5.06A15.6 15.6 0 0016.76 13h3.17a8.02 8.02 0 01-4.55 5.06z"
            />
          </svg>
        </span>
        <span>Website</span>
      </a>
      <a
        href="https://github.com/ManuOtel/quarterly-clock"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Quarter Clock repository"
      >
        <span class="credit-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path
              d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"
            />
          </svg>
        </span>
        <span>Repo</span>
      </a>
    </div>
  </div>
</footer>

<style>
  /* Main Layout */
  main {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    gap: var(--space-lg);
    flex-wrap: wrap;
    padding: var(--space-lg);
    background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-border-light);
  }

  .subtitle {
    margin: 0.5rem 0 0;
    color: var(--color-text-secondary);
    font-size: 1rem;
    line-height: 1.5;
  }

  .header-actions {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
    align-items: center;
  }

  .file-input {
    border-radius: var(--radius-lg);
    border: 2px dashed var(--color-border);
    padding: 0.625rem 1.125rem;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    color: var(--color-text-primary);
    background: var(--color-bg-primary);
    transition: all var(--transition-base);
  }

  .file-input:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-bg);
    transform: translateY(-1px);
  }

  .file-input input {
    display: none;
  }

  /* Clock Components */
  .clock-card {
    display: grid;
    gap: var(--space-xl);
    background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
  }

  .clock-main {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    align-items: center;
    justify-content: center;
  }

  .year-progress-header {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    align-items: center;
    text-align: center;
  }

  .year-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.25rem;
    background: linear-gradient(135deg, var(--color-q1) 0%, var(--color-q2) 50%, var(--color-q4) 100%);
    color: white;
    font-size: 1rem;
    font-weight: 700;
    border-radius: var(--radius-full);
    box-shadow: 0 4px 12px rgba(198, 93, 59, 0.3);
    letter-spacing: 0.05em;
  }

  .year-progress-stats {
    display: flex;
    gap: var(--space-lg);
    align-items: center;
    background: var(--color-bg-secondary);
    padding: var(--space-md) var(--space-xl);
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-border);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: center;
  }

  .stat-value {
    font-family: var(--font-mono);
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-divider {
    width: 1px;
    height: 2.5rem;
    background: var(--color-border);
  }

  /* Layout Grid */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-xl);
  }

  .quarter-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-lg);
    flex-wrap: wrap;
  }

  .progress {
    display: grid;
    gap: var(--space-sm);
    min-width: 240px;
  }

  .progress-bar {
    width: 100%;
    height: 10px;
    border-radius: var(--radius-full);
    background: var(--color-border);
    overflow: hidden;
    box-shadow: var(--shadow-inner);
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-secondary) 0%, var(--color-primary) 100%);
    transition: width 0.6s cubic-bezier(0.65, 0, 0.35, 1);
    border-radius: var(--radius-full);
    box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
  }

  .credit-footer {
    margin-top: var(--space-xl);
    padding: var(--space-lg) 0 var(--space-lg);
    border-top: 1px solid var(--color-border-light);
  }

  .credit-content {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }

  .credit-identity {
    display: flex;
    gap: 0.4rem;
    align-items: center;
  }

  .credit-identity a {
    color: var(--color-text-primary);
    font-weight: 600;
    text-decoration: none;
  }

  .credit-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    align-items: center;
  }

  .credit-links a {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.65rem;
    border-radius: var(--radius-full);
    border: 1px solid transparent;
    text-decoration: none;
    font-weight: 600;
    color: var(--color-text-secondary);
    background: var(--color-bg-secondary);
    transition: all var(--transition-base);
  }

  .credit-links a:hover {
    color: var(--color-primary);
    border-color: var(--color-border);
    background: var(--color-bg-primary);
    transform: translateY(-1px);
  }

  .credit-icon {
    display: inline-flex;
    width: 1rem;
    height: 1rem;
    color: currentColor;
  }

  .credit-icon svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header {
      padding: var(--space-md);
    }

    .clock-main {
      justify-content: center;
    }

    .grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .quarter-summary {
      flex-direction: column;
      align-items: flex-start;
    }

    .progress {
      width: 100%;
      min-width: unset;
    }

    .file-input {
      min-height: 44px;
    }

    .credit-content {
      flex-direction: column;
      align-items: flex-start;
    }

    .credit-links {
      width: 100%;
    }
  }
</style>
