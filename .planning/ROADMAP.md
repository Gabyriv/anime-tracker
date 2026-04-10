# Roadmap: Anime Tracker

**Created:** 2026-04-09
**Granularity:** coarse

## Phases

- [ ] **Phase 1: Setup & Database** - Project scaffolding, Tauri + React, SQLite schema
- [ ] **Phase 2: Search & List Management** - Full anime search and list CRUD

## Phase Details

### Phase 1: Setup & Database
**Goal**: Project scaffolding complete with working SQLite database
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03
**Success Criteria** (what must be TRUE):
  1. User can run the app and see a working interface
  2. SQLite database auto-creates on first run with proper schema
  3. All data changes save immediately without manual action
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 01-01: Initialize Tauri + React project with scaffolding
- [ ] 01-02: Configure SQLite database with schema
- [ ] 01-03: Verify app runs and database initializes

### Phase 2: Search & List Management
**Goal**: Users can search anime via Jikan API and manage their list
**Depends on**: Phase 1
**Requirements**: SECH-01, SECH-02, SECH-03, SECH-04, LIST-01, LIST-02, LIST-03, LIST-04, LIST-05, LIST-06
**Success Criteria** (what must be TRUE):
  1. User can search for anime by title and see results (title, image, year)
  2. User can view anime details (synopsis, episodes, score, status)
  3. User can add anime to their list with a status category
  4. User can view their complete anime list filtered by status
  5. User can update status of any anime in their list
  6. User can remove anime from their list
  7. Search handles API errors gracefully with user-friendly messages
  8. Duplicate anime entries are prevented
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 02-01: Implement anime search with Jikan API integration
- [ ] 02-02: Display search results with title, image, year
- [ ] 02-03: Show anime details on selection
- [ ] 02-04: Build list management (add, view, filter, update, remove)
- [ ] 02-05: Add duplicate prevention (UNIQUE constraint)
- [ ] 02-06: Handle API errors gracefully

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Setup & Database | 0/3 | Not started | - |
| 2. Search & List Management | 0/6 | Not started | - |

---

*Roadmap created: 2026-04-09*