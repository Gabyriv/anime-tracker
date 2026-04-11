# Phase 1: Setup & Database - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Project scaffolding complete with working SQLite database. Phase 1 delivers:
- Initialized Tauri 2.x + React project
- SQLite database with auto-created schema
- All data changes save immediately

</domain>

<decisions>
## Implementation Decisions

### Project Initialization
- **D-01:** Use web-only approach (Vite + React) — no desktop framework due to missing system dependencies (libgtk-3-dev, libwebkit2gtk-4.1-dev)
- **D-02:** Use sql.js for in-browser SQLite (replaces @tauri-apps/plugin-sql)
- **D-03:** Use plain SQL queries (no Drizzle ORM - simpler for sql.js)
- **D-04:** Use pnpm as package manager
- **D-05:** Use Vite for build tooling

### Styling
- **D-06:** Use TailwindCSS for styling (deferred to implementation)

### Database Location
- **D-07:** Use Tauri's app data directory for SQLite file (deferred to implementation)

### Component Structure
- **D-08:** Organize components with feature-based structure (deferred to implementation)

### Agent Discretion
- Styling implementation details
- Database file path configuration
- Component organization patterns

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Research
- `.planning/research/STACK.md` — Recommended tech stack with versions
- `.planning/research/ARCHITECTURE.md` — Component structure and data flow
- `.planning/research/FEATURES.md` — Feature categories and complexity

### Requirements
- `.planning/REQUIREMENTS.md` — v1 requirements (DATA-01, DATA-02, DATA-03)
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria

### No external specs — requirements fully captured in decisions above

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — building from scratch

### Established Patterns
- New project — no existing patterns yet
- Research recommends: Vite + React + sql.js (web-only)

### Integration Points
- Frontend: React components → sql.js (browser SQLite via localStorage for persistence)
- External: Jikan API for anime search (Phase 2)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

Reference: User wants similar functionality to aniwatch.to / hianime.to list tracking.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-setup-database*
*Context gathered: 2026-04-09*