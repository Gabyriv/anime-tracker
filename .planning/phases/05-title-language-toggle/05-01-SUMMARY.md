---
phase: 05-title-language-toggle
plan: 01
subsystem: search
tags: [search, internationalization, ui]
dependency_graph:
  requires: []
  provides:
    - useTitleLanguageToggle hook
    - titleLanguage prop in AnimeCard
    - titleLanguage prop in SearchBar
    - titleLanguage prop in SearchResults
  affects:
    - src/App.tsx
    - src/components/SearchBar.tsx
    - src/components/AnimeCard.tsx
    - src/components/SearchResults.tsx
    - src/types/anime.ts
tech_stack:
  - React hooks (useState, useCallback)
  - localStorage persistence
  - TypeScript interfaces
patterns:
  - Lazy initial state for localStorage
  - Prop drilling pattern for titleLanguage
key_files:
  created:
    - src/hooks/useTitleLanguageToggle.ts
  modified:
    - src/types/anime.ts
    - src/App.tsx
    - src/components/SearchBar.tsx
    - src/components/AnimeCard.tsx
    - src/components/SearchResults.tsx
decisions:
  - UsedJP/EN toggle pattern in SearchBar
  - Fallback chain: title_japanese → title_english → title
metrics:
  duration: ~3 minutes
  completed: 2026-04-11
  tasks: 6/6
---

# Phase 05 Plan 01: Title Language Toggle Summary

Add a title language toggle feature that allows users to switch between English and Japanese titles in search results and the anime detail modal.

## Implementation

### Hook (useTitleLanguageToggle)
- Returns `{ isJapanese, toggle }` - boolean state + toggle function
- Persists to `localStorage.getItem('anime-tracker-title-language')` with values `'japanese'` | `'english'`
- Defaults to `'english'` if no preference stored

### UI Components
- SearchBar: Toggle button (JP/EN) in top-right of search input
- AnimeCard: Respects `titleLanguage` prop, displays `title_japanese || title_english || title` when Japanese
- SearchResults: Passes `titleLanguage` through to each AnimeCard

### Modal Integration
- App.tsx: Uses `getModalTitle()` helper to show correct title in anime detail modal

## Verification

- [x] Build passes without TypeScript errors
- [x] Toggle button appears in search bar area
- [x] Clicking toggle switches title language in search results
- [x] Clicking anime card opens detail modal with same title language
- [x] Refreshing page preserves language preference
- [x] Both EN→JP and JP→EN toggle works correctly

## Commits

- 3fdb71c feat(05-01): add useTitleLanguageToggle hook with localStorage
- 17cf8f3 feat(05-01): add title_english and title_japanese to AnimeFromApi
- 650f88c feat(05-01): add title language toggle to search results
- 74b2c00 feat(05-01): wire toggle through App to search and modal

## Deviation Documentation

None - plan executed exactly as written.