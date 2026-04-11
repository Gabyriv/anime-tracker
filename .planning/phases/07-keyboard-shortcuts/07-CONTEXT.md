# Phase 7: Keyboard Shortcuts - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Implementing keyboard shortcuts for common UI actions (UX-05, UX-06). Users can press Escape to close any open modal/dialog, and press "/" to focus the search bar from anywhere in the app.

</domain>

<decisions>
## Implementation Decisions

### Shortcut Set
- **D-01:** **Single Escape** — Press Escape once to close any open modal/view (anime detail dialog)
- **D-02:** **"/" shortcut** — Press "/" key to focus and expand the search bar from anywhere in the app
- **D-03:** **Minimal set** — Only these two shortcuts (Escape + "/"). No additional navigation keys (J/K, Enter, etc.)

### Conflict Handling
- **D-04:** **Context-aware** — Escape always works (closes modal). The "/" shortcut is disabled when user is typing in any input or textarea element (checks `document.activeElement`)

### Implementation Approach
- Use `useEffect` with `keydown` event listener in App.tsx
- Check active element: `const tag = document.activeElement?.tagName?.toLowerCase(); return tag === 'input' || tag === 'textarea';`
- Global listener in App component (or ToastProvider) to capture shortcuts from anywhere

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §UX-05 — "User can press Escape to close any open modal/dialog"
- `.planning/REQUIREMENTS.md` §UX-06 — "User can press / to focus the search input"

### Project Conventions
- `.planning/CONVENTIONS.md` — Animation duration 150-300ms, scale on press (0.97)
- `.planning/ARCHITECTURE.md` — Current component structure

### No external specs — requirements fully captured in decisions above

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Dialog.tsx` — Existing Dialog component with `onOpenChange` prop
- `src/components/SearchHeader.tsx` — Has local search focus/expand logic with `inputRef` and `expanded` state

### Established Patterns
- React `useEffect` for event listeners
- State lifted to App.tsx (selectedAnime, viewMode)
- Toast notifications for user feedback

### Integration Points
- Add keyboard handler in App.tsx (parent component)
- Or create reusable `useKeyboardShortcuts` hook in `src/hooks/`
- Connect to existing `selectedAnime` state and `setSelectedAnime(null)` handler

</code_context>

<specifics>
## Specific Ideas

No specific references — standard keyboard shortcut implementation following industry patterns (/ for search, Escape for close).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 07-keyboard-shortcuts*
*Context gathered: 2026-04-11*