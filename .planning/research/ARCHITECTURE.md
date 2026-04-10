# Architecture Research

**Domain:** Anime List Tracker
**Researched:** 2026-04-09

## Component Structure

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  SearchBar  │  │  AnimeList  │  │  StatusNav  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│         │                │                │          │
│         └────────────────┼────────────────┘          │
│                          │                           │
│                   ┌──────┴──────┐                   │
│                   │  API Layer  │                   │
│                   │ (services/) │                   │
│                   └──────┬──────┘                   │
└──────────────────────────┼───────────────────────────┘
                           │ Tauri IPC
┌──────────────────────────┼───────────────────────────┐
│                   ┌──────┴──────┐                   │
│                   │   Backend   │                   │
│                   │  (Tauri/Rust)│                   │
│                   └──────┬──────┘                   │
│                          │                           │
│                   ┌──────┴──────┐                   │
│                   │   SQLite    │                   │
│                   │   Database  │                   │
│                   └─────────────┘                   │
└─────────────────────────────────────────────────────┘
```

## Data Flow

### Search Flow
1. User types in SearchBar
2. React calls Jikan API (external)
3. Results displayed in list

### Add to List Flow
1. User clicks "Add" on anime
2. React calls Tauri command `add_anime`
3. Rust backend inserts into SQLite
4. Success response → UI updates

### View List Flow
1. User navigates to list view
2. React calls Tauri command `get_anime_list`
3. Rust backend queries SQLite
4. Results displayed

## Database Schema

```sql
-- anime_list table
CREATE TABLE anime_list (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mal_id INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_english TEXT,
  image_url TEXT,
  episodes INTEGER,
  status TEXT NOT NULL DEFAULT 'plan_to_watch',
  user_status TEXT NOT NULL DEFAULT 'plan_to_watch',
  user_episodes INTEGER DEFAULT 0,
  user_rating INTEGER,
  notes TEXT,
  date_added TEXT NOT NULL,
  date_updated TEXT NOT NULL
);

-- Status values: watching, completed, plan_to_watch, on_hold, dropped
```

## Build Order

1. **Setup Tauri project** — Initialize with React template
2. **Configure SQLite** — Add plugin, create schema
3. **Build frontend UI** — Search, list, navigation components
4. **Connect search** — Integrate Jikan API
5. **Implement CRUD** — Add, view, update, delete anime
6. **Polish** — Styling, error handling

---
*Architecture research for: Anime Tracker*
*Researched: 2026-04-09*
