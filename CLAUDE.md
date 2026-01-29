# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build
```

## Git Workflow

**IMPORTANT**: Follow this workflow for ALL code changes (features, bug fixes, refactoring, etc.).

### Before Starting Work

1. **Check current branch**: Run `git branch --show-current`
2. **If on `main` or `dev`**: You MUST create a new branch and worktree before making any changes
   - Branch naming: `<type>/<short-description>` (e.g., `feat/add-dark-mode`, `fix/progress-calculation`)
   - Types: `feat`, `fix`, `refactor`, `docs`, `chore`

### Creating a Worktree

```bash
# Create branch and worktree in one command
git worktree add -b <branch-name> ../quarter-clock-<branch-name> main

# Navigate to the worktree
cd ../quarter-clock-<branch-name>
```

### Working in the Worktree

- All file edits happen inside the worktree directory
- The original repo remains on main/dev untouched
- Commit frequently with meaningful messages

### After Work is Complete

1. **Commit all changes** in the worktree
2. **Return to original repo**: `cd /Users/emanuel.otel/Desktop/Manu/quarter-clock`
3. **Merge the branch**:

   ```bash
   git merge <branch-name>
   ```

4. **Clean up worktree**:

   ```bash
   git worktree remove ../quarter-clock-<branch-name>
   git branch -d <branch-name>  # Only after successful merge
   ```

### Git Identity

- **Never modify git config** (user.name, user.email)
- All commits use the user's existing git configuration
- The AI agent must not change or impersonate authorship

## Architecture

Quarter Clock is a frontend-only Svelte 5 application with no backend. All data persists in browser localStorage.

### Key Files

- **`src/App.svelte`** - Root component, main UI, and central state management
- **`src/lib/date.ts`** - Pure functions for quarter/year calculations and project status logic
- **`src/lib/storage.ts`** - localStorage persistence and JSON import/export
- **`src/lib/types.ts`** - TypeScript interfaces (Project, Subtask, ProjectStatus)
- **`src/main.js`** - Application entry point

### Data Flow

1. On mount: `loadData()` retrieves JSON from localStorage (key: `quarter-clock`)
2. State updates: Functions in App.svelte perform immutable updates to the `data` object
3. Persistence: Svelte reactive blocks auto-save via `saveData(data)` on every change

### Core Logic

- **Quarter progress**: `(days elapsed / total days in quarter) × 100`
- **Project completion**: `(completed subtasks / total subtasks) × 100`
- **Status**: Compares actual completion % with expected % based on time elapsed → `ahead | behind | on_track`

## Constraints

- No backend, database, or API calls
- Target bundle size: <100KB
- Static deployment only (GitHub Pages, Netlify, Vercel)
- No testing framework currently configured
- No linting/formatting tools configured
