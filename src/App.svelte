<script>
  import { onMount } from "svelte";
  import {
    getQuarterInfo,
    getQuarterInfoFor,
    getYearInfo,
    getCompletionPercent,
    getProjectStatus,
    getDaysUntilDeadline
  } from "./lib/date";
  import {
    createEmptyData,
    exportData,
    importDataFromFile,
    loadData,
    saveData
  } from "./lib/storage";

  let data = createEmptyData();
  let selectedProjectId = "";
  let hasLoaded = false;
  let newProjectName = "";
  let newProjectDeadline = "";
  let newSubtaskDescription = "";

  const formatDate = (date) => date.toISOString().slice(0, 10);
  const today = new Date();
  const quarter = getQuarterInfo(today);
  const yearInfo = getYearInfo(today);
  const quarters = [1, 2, 3, 4].map((value) =>
    getQuarterInfoFor(value, yearInfo.year, today)
  );

  const circleDash = (percent, radius) => {
    const circumference = 2 * Math.PI * radius;
    return `${circumference} ${circumference}`;
  };

  const circleOffset = (percent, radius) => {
    const circumference = 2 * Math.PI * radius;
    return circumference - (percent / 100) * circumference;
  };

  const generateId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  onMount(() => {
    data = loadData();
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

  const selectProject = (projectId) => {
    selectedProjectId = projectId;
    newSubtaskDescription = "";
  };

  const addProject = () => {
    const name = newProjectName.trim();
    if (!name || !newProjectDeadline) return;
    const project = {
      id: generateId(),
      name,
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
      <div class="clock-ring">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle class="ring-base" cx="70" cy="70" r="54" />
          <circle
            class="ring-progress"
            cx="70"
            cy="70"
            r="54"
            stroke-dasharray={circleDash(yearInfo.percentComplete, 54)}
            stroke-dashoffset={circleOffset(yearInfo.percentComplete, 54)}
          />
        </svg>
        <div class="ring-label">
          <strong>{yearInfo.percentComplete.toFixed(1)}%</strong>
          <span>{yearInfo.year} done</span>
        </div>
      </div>
      <div class="clock-meta">
        <h2>Year progress</h2>
        <p>{yearInfo.daysElapsed} days elapsed</p>
        <p>{yearInfo.daysRemaining} days remaining</p>
      </div>
    </div>
    <div class="clock-quarters">
      {#each quarters as info}
        <div class:active={info.quarter === quarter.quarter} class="quarter-card">
          <div class="mini-ring">
            <svg width="76" height="76" viewBox="0 0 76 76">
              <circle class="ring-base" cx="38" cy="38" r="28" />
              <circle
                class="ring-progress"
                cx="38"
                cy="38"
                r="28"
                stroke-dasharray={circleDash(info.percentComplete, 28)}
                stroke-dashoffset={circleOffset(info.percentComplete, 28)}
              />
            </svg>
            <div class="ring-label small">
              <strong>{info.percentComplete.toFixed(0)}%</strong>
              <span>Q{info.quarter}</span>
            </div>
          </div>
          <div class="quarter-meta">
            <span>{info.daysElapsed} done</span>
            <span>{info.daysRemaining} left</span>
          </div>
        </div>
      {/each}
    </div>
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
          <div class="progress-fill" style={`width: ${quarter.percentComplete}%`} />
        </div>
        <span>{quarter.percentComplete.toFixed(1)}% complete</span>
      </div>
    </div>
  </section>

  <section class="grid">
    <div class="card">
      <h2>Projects</h2>
      <div class="form-row">
        <input
          type="text"
          placeholder="Project name"
          bind:value={newProjectName}
        />
        <input type="date" bind:value={newProjectDeadline} />
        <button type="button" on:click={addProject}>Add</button>
      </div>
      {#if data.projects.length === 0}
        <p class="empty">No projects yet. Add one to get started.</p>
      {:else}
        <ul class="project-list">
          {#each data.projects as project}
            <li
              class:selected={project.id === selectedProjectId}
              on:click={() => selectProject(project.id)}
            >
              <div>
                <h3>{project.name}</h3>
                <p class="meta">
                  Due {project.deadline} • {getCompletionPercent(project).toFixed(0)}%
                </p>
              </div>
              <div class="badge {getProjectStatus(project, quarter)}">
                {getProjectStatus(project, quarter).replace("_", " ")}
              </div>
              <button
                type="button"
                class="icon"
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
                  name: event.target.value
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
                  deadline: event.target.value
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
          <h3>Subtasks</h3>
          <div class="form-row">
            <input
              type="text"
              placeholder="New subtask"
              bind:value={newSubtaskDescription}
            />
            <button type="button" on:click={addSubtask}>Add</button>
          </div>
          {#if selectedProject.subtasks.length === 0}
            <p class="empty">No subtasks yet. Add one to start tracking.</p>
          {:else}
            <ul>
              {#each selectedProject.subtasks as subtask}
                <li class="subtask">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    on:change={(event) =>
                      updateSubtask(subtask.id, {
                        completed: event.target.checked
                      })}
                  />
                  <input
                    type="text"
                    value={subtask.description}
                    on:input={(event) =>
                      updateSubtask(subtask.id, {
                        description: event.target.value
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
  </section>
</main>
