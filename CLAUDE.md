<!-- GSD:project-start source:PROJECT.md -->
## Project

**Anime Tracker**

A minimal anime list tracking application that allows users to search for anime and organize them into personal lists with status categories (watching, completed, plan to watch, on hold, dropped). Similar to the list functionality on aniwatch.to or hianime.to.

**Core Value:** A fast, local-first anime tracker where users can quickly search for anime and manage their watch status with minimal friction.

### Constraints

- **Database**: SQLite via sql.js (client-side, persisted to localStorage)
- **Tech**: React 19 + Vite 8 + TailwindCSS 4 (web app, PWA-ready)
- **Scope**: Keep it minimal — focus on core list management
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

### Core Technologies
| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| React | 19.x | Frontend UI library | ✅ Implemented |
| Vite | 8.x | Build tool | ✅ Implemented |
| TailwindCSS | 4.x | Styling | ✅ Implemented |
| TypeScript | 5.x | Type safety | ✅ Implemented |
| sql.js | 1.x | SQLite in browser | ✅ Implemented |
| Jikan API | v4 | Anime search (MyAnimeList) | ✅ Implemented |

### Development Tools
| Tool | Purpose |
|------|---------|
| pnpm | Package manager |
| Vite | Dev server + build |

### API
- **Jikan API v4** (https://api.jikan.moe/v4) — free, no auth, scrapes MyAnimeList
- Rate limiting: 350ms debounce on search, 429 backoff on rate limit errors

### Data Persistence
- **sql.js** (SQLite compiled to WebAssembly) — client-side database
- **localStorage** — persists the SQL database as base64-encoded blob via `saveDb()` function

### Sources
- Jikan API docs — https://docs.jikan.moe/
- sql.js docs — https://sql.js.org/
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
│   ├── ui/           # shadcn-style components (Dialog, Dropdown, Skeleton, Toast)
│   ├── AnimeCard.tsx
│   ├── SearchBar.tsx
│   ├── SearchResults.tsx
│   ├── UserList.tsx
│   ├── UserListCard.tsx
│   ├── StatusFilter.tsx
│   ├── StatusDropdown.tsx
│   ├── SearchHeader.tsx
│   └── Pagination.tsx
├── hooks/
│   ├── useAnimeList.ts
│   ├── useSearch.ts
│   ├── useTitleLanguageToggle.ts
│   └── useKeyboardShortcuts.ts
├── context/
│   └── ToastContext.tsx
├── lib/
│   ├── api.ts        # Jikan API v4 integration with rate limiting
│   └── db.ts        # SQLite with sql.js + localStorage persistence
├── types/
│   └── anime.ts
└── App.tsx
```

### Data Flow
1. Search: SearchHeader → useSearch → Jikan API → SearchResults → AnimeCard
2. List: App (lifted state) → useAnimeList → SQLite → UserList → UserListCard
3. Add to list: StatusDropdown → addToList → SQLite (via useAnimeList)
4. Pagination: Pagination component ↔ useSearch (separate browsePage/searchPage) → API → Results

### Current Features Implemented
- Search anime via Jikan API v4 with rate limiting (350ms debounce, 429 backoff)
- Browse mode: top/popular, latest, seasonal views with pagination
- Search mode: full-text search with pagination
- Category filter (TV, Movie, OVA, Special, ONA, Music)
- Genre filter (clickable in sidebar and on cards)
- Title language toggle (English / Japanese / Kanji)
- Add anime to list with status (watching, completed, plan_to_watch, on_hold, dropped)
- Episode progress tracking
- Personal ratings and notes
- Remove from list
- Filter list by status
- View anime details in modal
- Toast notifications for all actions
- Skeleton loading states
- Keyboard shortcuts (Esc to close modal, / to focus search)
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
- [x] **Category Search** - (TV, Movie, OVA, Special, ONA, Music)
- [x] **Title Language Toggle** - EN/JP/漢 toggle with romanized + kanji support
- [x] **Default View Options** - Popular, Latest, Seasonal views with category filters
- [x] **Genre Filter** - Clickable genre tags in sidebar and on cards

### Phase 2: UI/UX Improvements
- [x] Enhanced anime cards with more info on hover
- [x] Improved modal animations
- [x] Skeleton loading states
- [x] Toast notifications for actions (added to list, status changed, etc.)
- [x] Keyboard shortcuts (Esc to close modal, / to focus search)

### Phase 3: User Accounts (Future)
- [ ] Authentication via Clerk or WorkOS
- [ ] Cloud sync for anime list
- [ ] Multi-device access
- [ ] User preferences storage

### Implemented Features (2026-04-12)
- ✅ Search with Jikan API v4
- ✅ Pagination (browse vs search separate state, both working)
- ✅ Title language toggle (EN/JP/漢)
- ✅ Expandable search in header
- ✅ Click-outside to close search
- ✅ Enhanced anime detail modal
- ✅ Episode progress tracking
- ✅ Personal ratings and notes
- ✅ Status filtering in My List
- ✅ Toast notifications
- ✅ Skeleton loading states
- ✅ Mobile responsive design with filter panel
- ✅ Clickable genre tags on cards and in modal
- ✅ Rate limiting with 429 backoff

### Suggested Additions
- [ ] Anime recommendations based on list
- [ ] Watch history tracking with timestamps
- [ ] Notes/review for each anime in list
- [ ] Import/export list (JSON format)
- [ ] Sharing animated list progress to social media
- [ ] Dark/light theme toggle (currently dark only)
- [ ] Continue watching section
- [ ] Season/sequel detection and linking
- [ ] Performance improvements to reduce 429 errors
<!-- GSD:features-end -->
