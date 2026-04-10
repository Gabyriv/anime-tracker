# Roadmap: Anime Tracker

**Created:** 2026-04-09
**Granularity:** coarse

## Phases

- [x] **Phase 1: Setup & Database** - Project scaffolding, Tauri + React, SQLite schema
- [x] **Phase 2: Search & List Management** - Full anime search and list CRUD

## Phase Details

### Phase 1: Setup & Database
**Goal**: Project scaffolding complete with working SQLite database
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03
**Status**: ✓ Complete (2026-04-09)
**Plans**: 1 plan (3 tasks)

Plans:
- [x] 01-01: Initialize Tauri + React project with scaffolding
- [x] 01-02: Configure SQLite database with schema
- [x] 01-03: Verify app runs and database initializes

### Phase 2: Search & List Management
**Goal**: Users can search anime via Jikan API and manage their list
**Depends on**: Phase 1
**Requirements**: SECH-01, SECH-02, SECH-03, SECH-04, LIST-01, LIST-02, LIST-03, LIST-04, LIST-05, LIST-06
**Status**: ✓ Complete (2026-04-09)
**Plans**: 5 plans (17 tasks)

Plans:
- [x] 02-01: Implement anime search with Jikan API integration
- [x] 02-02: Display search results with title, image, year
- [x] 02-03: Add anime to list with status category
- [x] 02-04: Build user list view with filtering and grouping
- [x] 02-05: Add error handling and empty states

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Setup & Database | 1/1 | ✓ Complete | 2026-04-09 |
| 2. Search & List Management | 5/5 | ✓ Complete | 2026-04-09 |

---

*Roadmap updated: 2026-04-09*