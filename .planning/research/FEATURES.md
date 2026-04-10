# Features Research

**Domain:** Anime List Tracker
**Researched:** 2026-04-09

## Table Stakes

These features are expected — users will leave if missing:

### Search
- **Search anime by title** — Query Jikan API, display results with title, image, year
- **View anime details** — Show synopsis, episodes, score, status when selecting

### List Management
- **Add anime to list** — Save anime to local database with status category
- **View list** — Display all anime in user's list
- **Filter by status** — Filter list by: watching, completed, plan to watch, on hold, dropped
- **Update status** — Change anime's status category
- **Remove from list** — Delete anime from local list

### Data Persistence
- **Local SQLite storage** — All user data stored locally
- **Automatic save** — Changes saved immediately

## Differentiators

Features that could set this apart:

- **Quick add** — One-click add from search results
- **Episode tracking** — Track current episode (for watching)
- **Rating** — Personal rating (1-10)
- **Notes** — Personal notes per anime
- **Sort options** — Sort by title, date added, score

## Anti-Features

Things to NOT build (explicit exclusions):

- **User accounts/auth** — Single user, local only
- **Social features** — No sharing, following, comments
- **Streaming** — Just tracking, not playback
- **Recommendations** — No algorithmic suggestions
- **Sync** — No cloud sync (local SQLite only)

## Feature Complexity

| Feature | Complexity | Dependencies |
|---------|------------|--------------|
| Search by title | Low | Jikan API |
| Add to list | Low | SQLite |
| View list | Low | SQLite |
| Filter by status | Low | SQLite query |
| Update status | Low | SQLite update |
| Remove from list | Low | SQLite delete |
| Episode tracking | Medium | SQLite schema change |
| Personal rating | Medium | SQLite schema change |
| Notes | Medium | SQLite schema change |

## Dependencies

- Jikan API for anime search (free, no auth)
- SQLite for local storage
- No other external dependencies

---
*Features research for: Anime Tracker*
*Researched: 2026-04-09*
