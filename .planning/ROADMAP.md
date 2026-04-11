# Roadmap: Anime Tracker

**Created:** 2026-04-09
**Granularity:** coarse

## Phases

- [x] **Phase 1: Setup & Database** - Project scaffolding, Tauri + React, SQLite schema
- [x] **Phase 2: Search & List Management** - Full anime search and list CRUD
- [x] **Phase 3: Enhanced Tracking** - Episode progress, ratings, notes

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

### Phase 3: Enhanced Tracking

**Goal:** Users can track episode progress, add personal ratings, and add personal notes
**Requirements**: ENHT-01, ENHT-02, ENHT-03
**Depends on:** Phase 2
**Status:** ✓ Complete (2026-04-10)
**Plans:** 3 plans (9 tasks)

Plans:
- [x] 03-01: Add database update functions for episode progress, rating, notes
- [x] 03-02: Extend UserListCard with inline editing UI
- [x] 03-03: Wire edit handlers from hook to UserList component

---

## Post-Phase Work (2026-04-10)

### UI/UX Refinements (Completed)

- Applied Cinema Dark theme using frontend-design + ui-ux-pro-max skills
- Added CSS variables with custom theme (deep black, purple accent)
- Implemented glassmorphism cards with borders and hover effects
- Added Poppins font, smooth animations, press feedback
- Fixed title clipping, search bar, moved + button to title area

### Next Discussion Needed

- Anime Detail Modal improvements (pending)

---

*Roadmap updated: 2026-04-10*