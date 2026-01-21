# Quarter Year Clock - Project Description

## Overview

A frontend-only web application for tracking projects and tasks within quarterly timeframes (Q1, Q2, Q3, Q4). No backend, no database, no authentication. All data stored in browser localStorage.

## Core Functionality

### Quarter Tracking

- Display current quarter (Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec)
- Show days elapsed in current quarter
- Show days remaining in current quarter
- Calculate and display percentage of quarter completed

### Project Management

- Users can create multiple projects
- Each project has:
  - Project name
  - Target completion date
  - List of subtasks
  - Status (derived from completion and timeline)

### Subtask Management

- Each project contains multiple subtasks
- Each subtask has:
  - Task description
  - Completed/incomplete state (boolean)
- Users can add, edit, delete, and toggle subtasks

### Progress Tracking

- Calculate project completion percentage based on: (completed subtasks / total subtasks) × 100
- Calculate days until project deadline
- Determine if project is on track, behind, or ahead based on:
  - Current completion percentage
  - Time elapsed vs time remaining
  - Expected progress vs actual progress

### Data Persistence

- All data stored in browser localStorage
- Data structure: JSON format containing array of projects
- Each project object contains its subtasks array
- No server communication required
- Optional: Export data as JSON file
- Optional: Import data from JSON file

## Technical Requirements

- Frontend-only (no backend, no API calls)
- Lightweight framework (Svelte recommended)
- Data persists in localStorage
- Static deployment (can be served from any static host)
- No build complexity beyond standard bundling

## Deployment & Performance Requirements

- **Server-side: Absolute minimum resource usage**
  - Static file serving only (no server-side logic)
  - Can run on the smallest available server instances
  - Minimal memory footprint (should work with <128MB RAM)
  - Minimal CPU usage (no processing, just file serving)
  - Can be served by nginx, Apache, or any static file server
  - Should work on free-tier hosting (Netlify, Vercel, GitHub Pages, etc.)
- **Client-side: Can be heavier, but still reasonable**
  - JavaScript bundle should be optimized but doesn't need to be extreme
  - Initial load should be fast (target <100KB total bundle size)
  - Runtime performance should be smooth for calculations and UI updates
- **Build output**
  - Final build produces static HTML, CSS, JS files only
  - No server runtime required
  - No database connections
  - No environment variables needed
  - No serverless functions

## Key Calculations

1. Quarter progress: (days since quarter start / total days in quarter) × 100
2. Project completion: (completed subtasks / total subtasks) × 100
3. Time remaining: deadline date - current date
4. Status determination: Compare actual completion % with expected completion % based on time elapsed

## Data Storage Schema (localStorage)

```json
{
  "projects": [
    {
      "id": "unique-id",
      "name": "Project Name",
      "deadline": "2026-03-31",
      "subtasks": [
        {
          "id": "unique-id",
          "description": "Task description",
          "completed": false
        }
      ]
    }
  ]
}
```

## Out of Scope

- User accounts
- Backend/database
- Syncing across devices
- Collaboration features
- Notifications/reminders
- Complex project dependencies
- Resource allocation
- Time tracking (hours logged)
- Budget tracking
