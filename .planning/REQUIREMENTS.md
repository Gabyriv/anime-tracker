# Requirements: Anime Tracker

**Defined:** 2026-04-09
**Core Value:** A fast, local-first anime tracker where users can quickly search for anime and manage their watch status with minimal friction.

## v1 Requirements

### Search

- [ ] **SECH-01**: User can search for anime by title using Jikan API
- [ ] **SECH-02**: Search results display title, image, and year for each anime
- [ ] **SECH-03**: User can view anime details (synopsis, episodes, score, status)
- [ ] **SECH-04**: Search handles API errors gracefully with user-friendly messages

### List Management

- [ ] **LIST-01**: User can add anime to their list with a status category
- [ ] **LIST-02**: User can view their complete anime list
- [ ] **LIST-03**: User can filter list by status (watching, completed, plan to watch, on hold, dropped)
- [ ] **LIST-04**: User can update the status of anime in their list
- [ ] **LIST-05**: User can remove anime from their list
- [ ] **LIST-06**: Duplicate anime entries are prevented (UNIQUE constraint)

### Data Persistence

- [ ] **DATA-01**: All user data persists in local SQLite database
- [ ] **DATA-02**: Database auto-creates schema on first run
- [ ] **DATA-03**: Changes save immediately (no manual save needed)

## v2 Requirements

### Enhanced Tracking

- **ENHT-01**: User can track current episode progress for "watching" anime
- **ENHT-02**: User can add personal rating (1-10 stars)
- **ENHT-03**: User can add personal notes to any anime

### List Features

- **LST2-01**: User can sort list by title, date added, or score
- **LST2-02**: User can search within their list

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts/authentication | Single user, local-only personal tracker |
| Streaming/playback | Just tracking, not watching |
| Social features | No sharing, comments, or following |
| Recommendations | No algorithmic suggestions |
| Sync across devices | Local SQLite only |
| AniList/MAL sync | Complexity not worth it for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SECH-01 | Phase 2 | Pending |
| SECH-02 | Phase 2 | Pending |
| SECH-03 | Phase 2 | Pending |
| SECH-04 | Phase 2 | Pending |
| LIST-01 | Phase 2 | Pending |
| LIST-02 | Phase 2 | Pending |
| LIST-03 | Phase 2 | Pending |
| LIST-04 | Phase 2 | Pending |
| LIST-05 | Phase 2 | Pending |
| LIST-06 | Phase 2 | Pending |
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13 ✓
- Unmapped: 0

---
*Requirements defined: 2026-04-09*
*Last updated: 2026-04-09 after initial definition*
