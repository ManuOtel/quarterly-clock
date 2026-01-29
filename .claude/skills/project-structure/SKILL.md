---
name: project-structure
description: Provides guidance on project structure, file organization, and Svelte 5 best practices. Use when creating new files or components.
---

# AI Agent Project Structure Rules

## Tech Stack

- **Framework:** Svelte 5 (with runes)
- **Build Tool:** Vite 7
- **Language:** TypeScript (via JSDoc) + JavaScript
- **Styling:** CSS with custom properties (no Tailwind)
- **Storage:** Browser localStorage (no backend)

---

## Current Folder Structure

```text
quarter-clock/
├── src/                          # Main source directory
│   ├── App.svelte                # Root component & central state
│   ├── main.js                   # Application entry point
│   │
│   ├── lib/                      # Utilities & components
│   │   ├── components/           # Reusable Svelte components
│   │   │   ├── AnalogClock.svelte
│   │   │   ├── ProjectDetails.svelte
│   │   │   ├── ProjectList.svelte
│   │   │   └── QuarterCards.svelte
│   │   │
│   │   ├── date.ts               # Quarter/year calculations
│   │   ├── storage.ts            # localStorage persistence
│   │   ├── types.ts              # TypeScript interfaces
│   │   └── utils.ts              # Generic utilities
│   │
│   ├── styles/                   # Global CSS
│   │   ├── base.css              # Reset & base styles
│   │   ├── components.css        # Component-specific styles
│   │   ├── utilities.css         # Utility classes
│   │   └── variables.css         # CSS custom properties
│   │
│   └── assets/                   # Static assets (bundled)
│       └── svelte.svg
│
├── public/                       # Static assets (copied as-is)
│   └── vite.svg
│
├── .claude/                      # AI agent configuration
│   └── skills/                   # Agent skills
│       ├── copy-rules/
│       ├── frontend-rules/
│       ├── humanizer/
│       ├── project-structure/
│       ├── tailwind-v4/
│       └── validation-rules/
│
├── blog/                         # Blog content
│   └── blog.md
│
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
├── svelte.config.js              # Svelte configuration
├── jsconfig.json                 # JS/TS path aliases
├── package.json                  # Dependencies & scripts
│
├── Dockerfile                    # Docker build config
├── docker-compose.yml            # Docker Compose config
├── nginx.conf                    # Nginx config for Docker
├── .dockerignore                 # Docker ignore patterns
│
├── CLAUDE.md                     # AI agent instructions
├── README.md                     # Project documentation
├── LICENSE                       # MIT License
└── project_description.md        # Product spec
```

---

## Component Organization

### Root Component (`src/App.svelte`)

- Central state management
- Main UI layout
- Data loading/saving coordination

### Reusable Components (`src/lib/components/`)

- All shared UI components live here
- Each component is a single `.svelte` file
- Import using the `$lib` alias: `import X from '$lib/components/X.svelte'`

### Utilities (`src/lib/`)

- **`date.ts`** - Pure functions for quarter/year calculations and project status logic
- **`storage.ts`** - localStorage persistence and JSON import/export
- **`types.ts`** - TypeScript interfaces (Project, Subtask, ProjectStatus)
- **`utils.ts`** - Generic helper functions

---

## Data Flow Pattern

1. **On mount:** `loadData()` retrieves JSON from localStorage (key: `quarter-clock`)
2. **State updates:** Functions in App.svelte perform immutable updates to the `data` object
3. **Persistence:** Svelte reactive blocks auto-save via `saveData(data)` on every change

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProjectList.svelte` |
| Utilities | camelCase | `date.ts`, `storage.ts` |
| CSS | kebab-case | `variables.css` |
| Config | dot notation | `vite.config.js` |

---

## Import Aliases

Configured in `jsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

Use `$lib` for clean imports:

```js
// Good
import { loadData } from '$lib/storage';
import ProjectList from '$lib/components/ProjectList.svelte';

// Avoid
import { loadData } from '../lib/storage';
```

---

## Svelte 5 Best Practices

### Use Runes for State

```svelte
<script>
  let count = $state(0);           // Reactive state
  let doubled = $derived(count * 2); // Computed value
</script>
```

### Props with `$props()`

```svelte
<script>
  let { title, items = [] } = $props();
</script>
```

### Effects with `$effect()`

```svelte
<script>
  $effect(() => {
    console.log('count changed:', count);
  });
</script>
```

---

## Styling Approach

- Global styles in `src/styles/` (imported in `main.js`)
- CSS custom properties in `variables.css` for theming
- Component-scoped styles use `<style>` blocks in `.svelte` files
- Utility classes available in `utilities.css`

---

## Adding New Features

### New Component

1. Create `src/lib/components/ComponentName.svelte`
2. Import in parent: `import ComponentName from '$lib/components/ComponentName.svelte'`

### New Utility Function

1. Add to existing file in `src/lib/` (e.g., `utils.ts`)
2. Or create new file if it's a distinct domain

### New Type

1. Add interface to `src/lib/types.ts`

---

## Constraints

- No backend, database, or API calls
- Target bundle size: <100KB
- Static deployment only (GitHub Pages, Netlify, Vercel, Docker/Nginx)
- All data persists in browser localStorage
