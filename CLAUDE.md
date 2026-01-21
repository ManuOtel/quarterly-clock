# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build
```

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
