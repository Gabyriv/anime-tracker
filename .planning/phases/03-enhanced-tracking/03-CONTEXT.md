# Phase 3: Enhanced Tracking - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can track episode progress for "watching" anime, add personal ratings (1-10 stars), and add personal notes to any anime in their list. These are enhancements to the existing user list functionality.

</domain>

<decisions>
## Implementation Decisions

### Episode Progress UI
- **D-01:** Use inline number input on the card — Quick, direct number field for setting episode progress

### Rating UI
- **D-02:** Use clickable star rating (1-10 stars) — Visual, intuitive, popular pattern for personal ratings

### Notes UI
- **D-03:** Use expandable textarea on the card — Quick access, space-efficient for adding notes

### Save Behavior
- **D-04:** Auto-save on change — Immediately saves as user types/clicks

### Agent's Discretion
- Implementation details of the star rating component (colors, sizes, hover effects)
- Database query optimizations for updating individual fields
- Error handling for failed saves

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Files
- `.planning/REQUIREMENTS.md` — ENHT-01, ENHT-02, ENHT-03 requirements
- `.planning/PROJECT.md` — Core value: fast, local-first anime tracker

### Implementation References
- `src/types/anime.ts` — Existing TypeScript types (UserAnime type already has episodes_watched, personal_rating, personal_notes)
- `src/lib/db.ts` — Existing database utilities
- `src/components/UserListCard.tsx` — Existing card component (already displays personal_rating)

### Technical Stack
- Tauri 2.x with React 18.x
- TailwindCSS for styling (dark theme)
- Jikan API v4 for anime data

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `UserListCard.tsx` — Already displays personal_rating, can be extended for editing
- `UserList.tsx` — Existing list component with filtering
- `useAnimeList` hook — Manages list state, can add update methods

### Established Patterns
- TailwindCSS dark theme throughout
- Direct state mutations with list refresh
- Component-based architecture with clear separation

### Integration Points
- Extend UserListCard component for episode progress, rating, notes
- Add update methods to useAnimeList hook
- Database already has columns: episodes_watched, personal_rating, personal_notes

</code_context>

<specifics>
## Specific Ideas

- Star rating should be clickable with hover state showing the rating
- Episode progress should show "X / Y episodes" format when total is known
- Notes textarea should expand when focused

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-enhanced-tracking*
*Context gathered: 2026-04-10*