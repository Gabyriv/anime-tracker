# Phase 8: Search Enhancements - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Adding category/type filters and default view options for the search tab (SECH-05, SECH-06). Users can filter anime by type and configure what shows when search tab has no query.

</domain>

<decisions>
## Implementation Decisions

### Category Filter UI
- **D-01:** Use inline filter badges on the right side of the search bar — category filter badges placed next to the language toggle, results cards remain left-aligned

### Default View Behavior
- **D-02:** Allow user to configure their default view — options: Popular (top anime), Latest (currently airing/recent), Seasonal (current season anime)
- **D-03:** User selects preference via settings or direct toggle in search area

### Filter Persistence
- **D-04:** Session-only persistence — filter selection and default view reset when app closes, not saved to localStorage

### Agent Discretion
- Specific implementation of badge styling (colors, sizes, active state)
- Default view selection UI (dropdown, toggle, or settings panel)
- Integration with existing SearchBar component

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §SECH-05 — "User can filter search by anime type (TV, Movie, OVA, Special, ONA, Music)"
- `.planning/REQUIREMENTS.md` §SECH-06 — "User can choose default view when search tab has no query (Latest, Popular, Seasonal)"

### Prior Phases
- `.planning/phases/02-search-list-management/02-CONTEXT.md` — Type-ahead search, debounce, grid cards layout
- `.planning/phases/05-title-language-toggle/05-CONTEXT.md` — Title language toggle implementation
- `.planning/phases/07-keyboard-shortcuts/07-CONTEXT.md` — Keyboard shortcuts pattern

### Codebase
- `src/lib/api.ts` — Jikan API integration, rate limiting, search functions
- `src/components/SearchBar.tsx` — Existing search bar with language toggle
- `src/components/SearchResults.tsx` — Grid display of anime cards
- `src/types/anime.ts` — TypeScript types for anime data

No external specs — requirements fully captured in decisions above.

</canonical_refs>

## Existing Code Insights

### Reusable Assets
- `SearchBar.tsx` — Already has language toggle on right side, can extend with filter badges
- `SearchResults.tsx` — Grid layout for anime cards, existing pagination
- `api.ts` — Already handles GET /top/anime and GET /anime search
- useSearch hook manages search state and pagination

### Established Patterns
- Grid cards layout for search results (Phase 2)
- Type-ahead search with 500ms debounce (Phase 2)
- Title language toggle already positioned on right side of search bar (Phase 5)

### Integration Points
- Add category filter parameter to existing API calls in api.ts
- Extend SearchBar.tsx with filter badge buttons
- Add default view preference to useSearch hook or App state
- Jikan API supports: type=tv|movie|ona|ova|special|music

</code_context>

<specifics>
## Specific Ideas

- Category badges should be clickable toggles (active/inactive)
- When a category is selected, filter is applied to both top/anime and search results
- Default view preference UI: simple dropdown or toggle in search area header

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-search-enhancements*
*Context gathered: 2026-04-11*