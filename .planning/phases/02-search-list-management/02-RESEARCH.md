# Phase 2: Search & List Management - Research

**Researched:** 2026-04-09
**Status:** Complete

## Jikan API Integration

### API Overview
- **Base URL:** `https://api.jikan.moe/v4`
- **Type:** REST API, free, no authentication required
- **Rate Limit:** ~3 requests/second (safe with 500ms+ debounce)

### Endpoints Used

#### Anime Search
```
GET /anime?q={query}&limit=25&page=1
```
- Query parameter: `q` (search term)
- Pagination: `page` (1-based)
- Limit: `limit` (default 25, max 25)

**Response structure:**
```json
{
  "data": [
    {
      "mal_id": 1,
      "title": "Cowboy Bebop",
      "images": {
        "jpg": {
          "image_url": "https://cdn.myanimelist.net/images/anime/1/腿.jpg",
          "small_image_url": "https://cdn.myanimelist.net/images/anime/1/腿t.jpg",
          "large_image_url": "https://cdn.myanimelist.net/images/anime/1/腿l.jpg"
        }
      },
      "synopsis": "In the year 2071...",
      "episodes": 26,
      "score": 8.75,
      "status": "Finished Airing",
      "year": 1998,
      "type": "TV",
      "rating": "R - 17+ (violence & profanity)"
    }
  ],
  "pagination": {
    "last_visible_page": 10,
    "has_next_page": true,
    "current_page": 1
  }
}
```

#### Anime Details (by ID)
```
GET /anime/{mal_id}
```
Returns full anime object with additional fields like demographics, studios, genres.

### Implementation Patterns

#### Debounce Strategy
- Type-ahead search with 500ms debounce (per D-03)
- Cancel pending requests on new input
- Show loading state during fetch

#### Error Handling
- Network errors: "Unable to connect. Check your internet."
- Rate limit (429): "Too many requests. Please wait."
- Empty results: "No anime found for '{query}'"
- API timeout: "Search timed out. Try again."

#### Data Flow
1. User types in search box
2. Debounce triggers after 500ms of no typing
3. Fetch to `https://api.jikan.moe/v4/anime?q={encodedQuery}`
4. Map response to AnimeFromApi type
5. Display in grid cards

## Database Integration

### Existing Schema
From Phase 1:
- `anime_list` table: stores cached anime data from API
- `user_list` table: user's personal list with status

### Search to Database Flow
1. When user adds anime to list:
   - Insert into `anime_list` (if not exists)
   - Insert into `user_list` with selected status

2. Duplicate prevention:
   - UNIQUE constraint on `anime_list.mal_id`
   - Check before insert, show "Already in list" if exists

## UI Architecture

### Components Needed
- SearchBar: Input with debounce logic
- SearchResults: Grid of AnimeCard components
- AnimeCard: Displays image, title, year + add dropdown
- AnimeDetails: Modal or expanded view with full info
- UserList: Filterable list grouped by status
- StatusFilter: Tab or dropdown to filter by status
- StatusDropdown: Quick status change on each card

### State Management
- React useState for search query and results
- useEffect for debounced search trigger
- State for user list, current filter, loading states

## Validation Architecture

### Functional Tests
1. Search returns results for valid query
2. Search shows empty state for no results
3. Search handles API errors gracefully
4. Debounce prevents excessive API calls
5. Add to list stores in database
6. List displays grouped by status
7. Status filter works correctly
8. Update status changes database
9. Remove deletes from user_list

### Edge Cases
- Empty search query: show recent/popular anime
- Very long query: truncate to 100 chars
- Network offline: show cached results if available
- Duplicate add attempt: show already added message

---

*Research for Phase 2: Search & List Management*