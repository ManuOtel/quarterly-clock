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
  <span>Made by </span>
  <a href="https://manuotel.com" target="_blank" rel="noopener noreferrer">Manu Otel</a>
</footer>

<style>
  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    gap: var(--space-lg);
    flex-wrap: wrap;
    margin-bottom: var(--space-xl);
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
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--color-q1) 0%, var(--color-q2) 50%, var(--color-q4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
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
    margin-top: var(--space-xl);
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
    padding: var(--space-md) 0 var(--space-lg);
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }

  .credit-footer a {
    color: inherit;
    font-weight: 600;
    text-decoration: none;
  }

  .credit-footer a:hover {
    color: var(--color-primary);
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
  }
</style>
