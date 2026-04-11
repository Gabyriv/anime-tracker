<!-- GSD:project-start source:PROJECT.md -->
## Project

**Anime Tracker**

A minimal anime list tracking application that allows users to search for anime and organize them into personal lists with status categories (watching, completed, plan to watch, on hold, dropped). Similar to the list functionality on aniwatch.to or hianime.to.

**Core Value:** A fast, local-first anime tracker where users can quickly search for anime and manage their watch status with minimal friction.

### Constraints

- **Database**: SQLite — simple, local, sufficient for single-user (sql.js client-side)
- **Tech**: React 19 + Vite 8 + TailwindCSS 4 (web app, not Tauri yet)
- **Scope**: Keep it minimal — focus on core list management
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Tauri | 2.x | Desktop app framework | Lightweight, fast, uses system webview (10MB vs 100MB+ for Electron) |
| React | 18.x | Frontend UI library | Most popular, large ecosystem, familiar patterns |
| TypeScript | 5.x | Type safety | Catches bugs early, better IDE support |
| SQLite | 3.x | Local database | User-specified, sufficient for single-user |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Jikan API | v4 | Anime search | Free, no auth needed, scrapes MyAnimeList |
| Drizzle ORM | latest | Type-safe DB queries | TypeScript-first, works well with Tauri |
| @tauri-apps/plugin-sql | 2.x | SQLite in Tauri | Official Tauri SQL plugin |
| TailwindCSS | 3.x | Styling | Fast development, small bundle |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | Package manager | Faster, better monorepo support |
| Vite | Build tool | Fast dev server, optimized builds |
## Installation
# Create Tauri app
# Core dependencies
# Database
# Styling
# API
# No additional packages needed - use fetch() for Jikan API
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|------------------------|
| Tauri 2.x | Electron | Need Node.js ecosystem, complex desktop integrations |
| React | Vue/Svelte | Team expertise, simpler state management |
| Jikan API | AniList API | User prefers AniList data |
| Drizzle | raw sqlx | Need more control, simpler project |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Electron | ~100MB app size, 200-300MB memory | Tauri (10MB, 30-40MB) |
| SQLite browser (sql.js) | No persistence across sessions | @tauri-apps/plugin-sql |
| Official MAL API | Requires auth, limited | Jikan (free, no auth) |
## Stack Patterns by Variant
- Use Tauri 2.x with React
- @tauri-apps/plugin-sql for SQLite
- Use Vite + React
- sql.js for SQLite (in-browser, limited)
- Or skip SQLite, use localStorage
## Version Compatibility
| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Tauri 2.x | React 18.x | Works well |
| Drizzle | @tauri-apps/plugin-sql | Use drizzle-kit for migrations |
| TailwindCSS 3.x | Vite 5.x | Works well |
## Sources
- Jikan API docs — https://docs.jikan.moe/ (free anime data)
- Tauri 2.0 docs — https://tauri.app/ (desktop framework)
- Drizzle ORM docs — https://orm.drizzle.team/ (TypeScript ORM)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

### Code Style
- Use TypeScript with React functional components
- TailwindCSS 4.x with @theme for custom variables
- Components in `src/components/`, hooks in `src/hooks/`, lib utilities in `src/lib/`
- shadcn-style UI components in `src/components/ui/`

### Theme (Cinema Dark)
- Background: `#0a0a0f` → `#020203` gradient
- Accent: `#5e6ad2` (purple) with glow effects
- Cards: glassmorphism with `rgba(255,255,255,0.05)` bg, `rgba(255,255,255,0.08)` border
- Font: Poppins (Google Fonts)
- Animations: 150-300ms duration, scale on press (0.97)

### Database
- sql.js with wasmBinary for client-side SQLite
- localStorage persistence via `saveDb()` function

### API
- Jikan API v4 for anime search (https://api.jikan.moe/v4)

### Status Colors
- Watching: `#3b82f6` (blue)
- Completed: `#22c55e` (green)
- Plan to Watch: `#eab308` (yellow)
- On Hold: `#f97316` (orange)
- Dropped: `#ef4444` (red)
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

### Current Structure
```
src/
├── components/
│   ├── ui/           # shadcn-style components (Dialog, Dropdown)
│   ├── AnimeCard.tsx
│   ├── SearchBar.tsx
│   ├── SearchResults.tsx
│   ├── UserList.tsx
│   ├── UserListCard.tsx
│   ├── StatusFilter.tsx
│   ├── StatusDropdown.tsx
│   └── Pagination.tsx
├── hooks/
│   ├── useAnimeList.ts
│   └── useSearch.ts
├── lib/
│   ├── api.ts        # Jikan API integration
│   └── db.ts        # SQLite with sql.js
└── types/
    └── anime.ts
```

### Data Flow
1. Search: useSearch hook → Jikan API → SearchResults → AnimeCard
2. List: useAnimeList hook → SQLite → UserList → UserListCard
3. Add to list: StatusDropdown → addToList → SQLite
4. Pagination: Pagination component ↔ useSearch → API → Results

### Current Features Implemented
- Search anime via Jikan API v4
- View top/popular anime on initial load
- Pagination (20 per page, page numbers + prev/next)
- Add anime to list with status (watching, completed, plan_to_watch, on_hold, dropped)
- Episode progress tracking
- Remove from list
- Filter list by status
- View anime details in modal
- Rate limiting (350ms between API requests)
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

<!-- GSD:features-start source:FEATURES.md -->
## Feature Roadmap

### Phase 1: Search Enhancements
- [ ] **Category Search** - Filter by anime type (TV, Movie, OVA, Special, etc.)
- [ ] **Title Language Toggle** - Switch between English/Japanese titles
- [ ] **Default View Options** - Choose what shows on search tab with no query:
  - Latest anime (currently airing/recent)
  - Popular anime (top rated) - *currently implemented*
  - Seasonal anime
  - Category filters (Action, Comedy, Drama, etc.)

### Phase 2: UI/UX Improvements
- [ ] Enhanced anime cards with more info on hover
- [ ] Improved modal animations
- [ ] Skeleton loading states
- [ ] Toast notifications for actions (added to list, status changed, etc.)
- [ ] Keyboard shortcuts (e.g., Esc to close modal, / to focus search)

### Phase 3: User Accounts (Future)
- [ ] Authentication via Clerk or WorkOS
- [ ] Cloud sync for anime list
- [ ] Multi-device access
- [ ] User preferences storage

### Suggested Additions
- [ ] Anime recommendations based on list
- [ ] Watch history tracking with timestamps
- [ ] Notes/review for each anime in list
- [ ] Import/export list (JSON format)
- [ ] Sharing animated list progress to social media
- [ ] Dark/light theme toggle (currently dark only)
- [ ] Continue watching section
- [ ] Season/sequel detection and linking
<!-- GSD:features-end -->
