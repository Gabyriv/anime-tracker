# Phase 3: Enhanced Tracking - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 03-enhanced-tracking
**Areas discussed:** Episode Progress UI, Rating UI, Notes UI, Save Behavior

---

## Episode Progress UI

| Option | Description | Selected |
|--------|-------------|----------|
| Inline input | Quick, direct number field on the card | ✓ |
| Expandable section | Card expands to show progress controls | |
| Modal dialog | Full controls in a popup | |

**User's choice:** Inline input on the card

---

## Rating UI

| Option | Description | Selected |
|--------|-------------|----------|
| Clickable stars (1-10) | Visual, intuitive, popular pattern | ✓ |
| Number input field | Quick numeric entry | |
| Dropdown select | Dropdown selection | |

**User's choice:** Clickable stars (1-10)

---

## Notes UI

| Option | Description | Selected |
|--------|-------------|----------|
| Expandable textarea | Quick access, space-efficient | ✓ |
| Modal with larger area | More space, dedicated focus | |
| Click to edit inline | Direct editing like a cell | |

**User's choice:** Expandable textarea on the card

---

## Save Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-save on change | Immediately saves as user types/clicks | ✓ |
| Auto-save on blur/leave | Saves when user clicks away | |
| Manual save button | Explicit save button | |

**User's choice:** Auto-save on change

---

## Agent's Discretion

- Implementation details of the star rating component (colors, sizes, hover effects)
- Database query optimizations for updating individual fields
- Error handling for failed saves

## Deferred Ideas

None