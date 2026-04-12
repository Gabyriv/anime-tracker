---
phase: quick
plan: 260412-g7r
subsystem: state-management
tags: [bug-fix, state-lifting, react-props, header-counter]
dependency_graph:
  requires: []
  provides: [single-source-of-truth-list-state]
  affects: [src/App.tsx, src/components/UserList.tsx]
tech_stack:
  added: []
  patterns: [props-drilling, stateless-child-component]
key_files:
  created: []
  modified:
    - src/App.tsx
    - src/components/UserList.tsx
decisions:
  - Lift all list state to App.tsx as single source of truth; UserList becomes pure props-driven component
metrics:
  duration: "~5 minutes"
  completed: "2026-04-12T15:44:11Z"
  tasks_completed: 2
  files_modified: 2
---

# Phase quick Plan 260412-g7r: Fix My List Counter Not Decrementing After Removal Summary

**One-liner:** Lifted useAnimeList() from UserList into App.tsx so the header "My List (N)" counter and the list view share a single React state instance, eliminating the stale-count desync on removal.

## What Was Built

The root cause of the bug was that both App.tsx and UserList.tsx independently called `useAnimeList()`, creating two separate React state instances. When UserList removed an entry, only its own local state updated — App.tsx continued to render the old count in the header.

### Changes Made

**src/App.tsx**
- Expanded the `useAnimeList()` destructure from 3 fields (`list, addToList, updateStatus`) to all 8 fields needed to drive UserList (`list, loading: listLoading, error: listError, addToList, updateStatus, removeFromList, updateEpisodeProgress, refresh: refreshList`)
- Updated the `<UserList />` JSX to pass all 7 list-related props down to the component

**src/components/UserList.tsx**
- Removed the `import { useAnimeList }` statement — hook no longer called here
- Added `UserListProps` interface with typed signatures for all 7 props
- Changed function signature from `export function UserList()` to `export function UserList({ list, loading, error, updateStatus, removeFromList, updateEpisodeProgress, refresh }: UserListProps)`
- All internal logic (useMemo computations, handlers, JSX) unchanged — only the data source moved from hook to props

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npx tsc --noEmit` passes with zero errors
- Header counter `My List ({list.length})` now reads from the single App-level `list` state
- Removing an entry in UserList triggers `refresh()` which calls `setRefreshTrigger` in the single hook instance, causing both the header counter and the list view to re-render with the updated data

## Known Stubs

None.

## Threat Flags

No new security-relevant surface introduced. All changes are internal React component wiring with no new network endpoints, auth paths, or trust boundary crossings.

## Self-Check: PASSED

- [x] `src/App.tsx` modified — confirmed
- [x] `src/components/UserList.tsx` modified — confirmed
- [x] Commit `1d53f5a` exists — confirmed
- [x] TypeScript compiles clean — confirmed
