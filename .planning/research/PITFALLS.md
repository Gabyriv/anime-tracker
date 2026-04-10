# Pitfalls Research

**Domain:** Anime List Tracker
**Researched:** 2026-04-09

## Common Mistakes to Avoid

### 1. Rate Limiting from Jikan API

**Warning signs:** API requests fail with 429 errors
**Prevention:** Implement request throttling (1 req/sec)
**Phase:** Search implementation

### 2. SQLite Path Issues in Tauri

**Warning signs:** Database file not found, permission errors
**Prevention:** Use @tauri-apps/plugin-sql with proper app data path
**Phase:** Database setup

### 3. Missing Error Handling for API Failures

**Warning signs:** App crashes when Jikan API is down
**Prevention:** Add try-catch, show user-friendly error messages
**Phase:** Search implementation

### 4. Duplicate Anime Entries

**Warning signs:** Same anime added multiple times
**Prevention:** Use UNIQUE constraint on mal_id, show error on duplicate add
**Phase:** Add to list implementation

### 5. Not Escaping User Input for Search

**Warning signs:** Search fails with special characters
**Prevention:** URL encode search query
**Phase:** Search implementation

### 6. Forgetting to Update date_updated

**Warning signs:** All entries show same date
**Prevention:** Update timestamp on every modification
**Phase:** List management

### 7. Large Image URLs Not Handled

**Warning signs:** Broken images in list
**Prevention:** Add fallback image for null/missing URLs
**Phase:** Search results display

---
*Pitfalls research for: Anime Tracker*
*Researched: 2026-04-09*
