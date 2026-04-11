# Phase 2: Search & List Management - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can search anime via Jikan API and manage their personal list with full CRUD operations. This phase delivers the core user-facing functionality: search, view details, add to list with status, filter list, update status, and remove entries.

</domain>

<decisions>
## Implementation Decisions

### Search Results Display
- **D-01:** Use grid cards layout — best for browsing with images visible, compact grid with image + title below each card

### Search Trigger Behavior
- **D-02:** Use type-ahead search — results appear automatically as user types
- **D-03:** Debounce search by 500ms — balances responsiveness with API call efficiency

### List Display Style
- **D-04:** Group entries by status — sections like "Watching", "Completed", "Plan to Watch", etc. for good overview

### Add/Assign Status UX
- **D-05:** Use dropdown on card — quick access dropdown menu on each card keeps user in context

### Agent Discretion
- Error handling approach for API failures
- Loading states and skeleton UI
- Empty state messaging
- Card component styling details

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — v1 requirements (SECH-01 to SECH-04, LIST-01 to LIST-06)

### Roadmap
- `.planning/ROADMAP.md` — Phase 2 goal and success criteria

### Prior Phase
- `.planning/phases/01-setup-database/01-CONTEXT.md` — Project initialization decisions (web-only, sql.js)

### Codebase
- `src/lib/db.ts` — SQLite database with anime_list and user_list tables
- `src/types/anime.ts` — TypeScript types for anime data

No external specs — requirements fully captured in decisions above.

</canonical_refs>

## Existing Code Insights

### Reusable Assets
- `src/lib/db.ts` — initDb(), saveDb() functions for database operations
- `src/types/anime.ts` — AnimeStatus type, AnimeFromApi, AnimeInDb, UserAnimeEntry interfaces

### Established Patterns
- TailwindCSS for styling (bg-gray-900, text-white pattern in App.tsx)
- sql.js for in-browser SQLite with localStorage persistence

### Integration Points
- Search will fetch from Jikan API (https://api.jikan.moe/v4/anime)
- List data stored in existing user_list table with foreign key to anime_list
- Status changes update user_list.status field

</code_context>

<specifics>
## Specific Ideas

Reference: aniwatch.to / hianime.to list functionality — minimal, fast interface

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-search-list-management*
*Context gathered: 2026-04-09*