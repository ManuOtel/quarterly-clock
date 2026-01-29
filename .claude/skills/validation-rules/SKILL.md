---
name: validation-rules
description: Defines mandatory verification steps (linting, building) that must be run after code changes. Use to ensure code quality and stability.
---

# AI Agent Validation Rules

## Purpose

This document defines **mandatory verification rules** for all AI agents working on this repository.  
**After** completing any code changes, the agent must verify the app builds, runs, lints, and is formatted correctly.  
Don't waste tokens on pre-checks — the codebase is assumed to be working when you start.

---

## Post-Change Verification (Mandatory)

After making code changes, run these checks **in order**. Fix any failures before considering the task complete.

**Do not run these commands in a sandbox environment.** Execute them in the actual project directory.

1. **Lint Check**

   ```bash
   npm run lint
   ```

   Fix all linting errors or warnings. No exceptions. When done, there should be zero linting errors or warnings.

2. **Build Check**

   ```bash
   npm run build
   ```

   If the build fails, fix it immediately. Don't move on until it passes.

---

## Workflow Rules

- **Skip pre-work checks.** Assume the codebase works when you start. Don't burn tokens verifying what's already passing.
- **Always verify after changes.** Build, lint, and run checks are mandatory after every code modification.
- If a check fails, fix it before marking the task done.
- Keep commits atomic — one logical change per commit.

---

## Philosophy

Pre-checks on a working codebase waste time and tokens. Post-checks catch real problems you introduced.  
**Verify what you changed, not what was already working.**
