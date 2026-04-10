# Anime Tracker

## What This Is

A minimal anime list tracking application that allows users to search for anime and organize them into personal lists with status categories (watching, completed, plan to watch, on hold, dropped). Similar to the list functionality on aniwatch.to or hianime.to.

## Core Value

A fast, local-first anime tracker where users can quickly search for anime and manage their watch status with minimal friction.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can search for anime by title
- [ ] User can add anime to their list with a status
- [ ] User can view their anime list filtered by status
- [ ] User can update the status of anime in their list
- [ ] User can remove anime from their list
- [ ] Data persists in local SQLite database

### Out of Scope

- [User accounts/authentication] — Single user, local-only
- [Streaming/playback] — Just tracking, not watching
- [Social features] — No sharing, comments, or following
- [Recommendations] — No algorithmic suggestions
- [Sync across devices] — Local SQLite only

## Context

- Building from scratch
- User wants minimal, fast interface
- Reference: aniwatch.to / hianime.to list functionality
- Desktop-first (but could be web app)

## Constraints

- **Database**: SQLite — simple, local, sufficient for single-user
- **Tech**: TBD during research phase
- **Scope**: Keep it minimal — focus on core list management

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SQLite over other DBs | User specified — simple, local, sufficient | — Pending |
| Single user, no auth | Local-only personal tracker | — Pending |

---
*Last updated: 2026-04-09 after initialization*
