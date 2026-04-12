# Roadmap: Anime Tracker

**Created:** 2026-04-09
**Granularity:** coarse

## Phases

- [x] **Phase 1: Setup & Database** - Project scaffolding, Tauri + React, SQLite schema
- [x] **Phase 2: Search & List Management** - Full anime search and list CRUD
- [x] **Phase 3: Enhanced Tracking** - Episode progress, ratings, notes
- [x] **Phase 4: UI/UX Improvements** - Enhanced modal, skeletons, toasts, pagination
- [x] **Phase 5: Title Language Toggle** - EN/JP/Kanji toggle with romanized titles
- [x] **Phase 6: Search Header Redesign** - Expandable search in header, clickable title, Home tab

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

### Phase 4: UI/UX Improvements
**Goal:** Enhanced anime detail modal, skeleton loading states, toast notifications
**Requirements**: UX-01, UX-02, UX-03, UX-04
**Depends on:** Phase 3
**Status:** ✓ Complete (2026-04-11)
**Plans:** 2 plans (13 tasks)

Plans:
- [x] 04-01: Enhanced anime detail modal with two-column layout, user data display
- [x] 04-02: Loading states + toast notifications (skeletons, toasts, pagination)

### Phase 5: Title Language Toggle
**Goal:** Toggle between English, Japanese (romanized), and Kanji titles
**Depends on:** Phase 4
**Status:** ✓ Complete (2026-04-11)
**Plans:** 1 plan (4 tasks)

Plans:
- [x] 05-01: Add EN/JP/漢 toggle with proper title display logic

### Phase 6: Search Header Redesign
**Goal:** Move search to header, clickable title, Home tab rename
**Depends on:** Phase 5
**Status:** ✓ Complete (2026-04-11)
**Plans:** 1 plan (4 tasks)

Plans:
- [x] 06-01: Search header redesign with expandable search, fixed toggle bug

### Phase 7: Keyboard Shortcuts
**Goal:** Add keyboard shortcuts for common actions (Esc to close modal, / to focus search)
**Depends on:** Phase 6
**Status:** ✓ Complete (2026-04-11)
**Plans:** 1 plan (1 task)

Plans:
- [x] 07-01: Keyboard shortcuts hook + App integration

### Phase 8: Search Enhancements
**Goal:** Add category/type filters and default view options for search tab
**Depends on:** Phase 7
**Status:** ✓ Complete (2026-04-11)
**Plans:** 1 plan

Plans:
- [x] 08-01: Category filters + default view options

### Phase 8.1: Layout Fix + Genre Filters
**Goal:** Reposition cards left, add genre filter badges, right-side filter space
**Depends on:** Phase 8
**Status:** ✓ Complete (2026-04-11)
**Requirements:** UX-07, UX-08
**Plans:** 1 plan (4 tasks)

Plans:
- [x] 08.1-01: Genre filters + right sidebar + left-aligned cards

---

## Current Features (as of 2026-04-11)

### Search Tab
- Search anime via Jikan API v4
- Pagination (20 per page) for top anime and search results
- Separate page state for browse vs search modes
- Title language toggle (EN/JP/Kanji)
- Expandable search bar in header with click-outside-to-close

### My List Tab
- View all added anime with status categories
- Filter by status (watching, completed, plan to watch, on hold, dropped)
- Episode progress tracking
- Personal ratings (1-10 stars)
- Personal notes
- Remove from list

### Anime Detail Modal
- Enhanced two-column layout (image + details)
- Shows user data if anime is in list (status, progress, rating)
- Synopsis with expand/collapse (Show more/less)
- Add to list directly from modal

### UI/UX
- Cinema Dark theme (deep black, purple accent)
- Glassmorphism cards
- Poppins font
- Skeleton loading states
- Toast notifications for actions
- Responsive design

---

## Next Features (from FEATURES.md)

### Phase 1: Search Enhancements (Future)
- [ ] Category Search - Filter by anime type (TV, Movie, OVA, Special, etc.)
- [ ] Default View Options - Choose what shows on search tab with no query (Latest, Popular, Seasonal)

### Phase 2: User Accounts (Future)
- [ ] Authentication via Clerk or WorkOS
- [ ] Cloud sync for anime list

### Suggested Additions
- [ ] Anime recommendations based on list
- [ ] Watch history tracking with timestamps
- [ ] Import/export list (JSON format)
- [ ] Dark/light theme toggle (currently dark only)
- [ ] Continue watching section

---

*Roadmap updated: 2026-04-11*