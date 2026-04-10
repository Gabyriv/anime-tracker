# Stack Research

**Domain:** Anime List Tracker
**Researched:** 2026-04-09
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Tauri | 2.x | Desktop app framework | Lightweight, fast, uses system webview (10MB vs 100MB+ for Electron) |
| React | 18.x | Frontend UI library | Most popular, large ecosystem, familiar patterns |
| TypeScript | 5.x | Type safety | Catches bugs early, better IDE support |
| SQLite | 3.x | Local database | User-specified, sufficient for single-user |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Jikan API | v4 | Anime search | Free, no auth needed, scrapes MyAnimeList |
| Drizzle ORM | latest | Type-safe DB queries | TypeScript-first, works well with Tauri |
| @tauri-apps/plugin-sql | 2.x | SQLite in Tauri | Official Tauri SQL plugin |
| TailwindCSS | 3.x | Styling | Fast development, small bundle |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | Package manager | Faster, better monorepo support |
| Vite | Build tool | Fast dev server, optimized builds |

## Installation

```bash
# Create Tauri app
npm create tauri-app@latest anime-tracker -- --template react-ts

# Core dependencies
pnpm add react react-dom
pnpm add -D typescript @types/react @types/react-dom

# Database
pnpm add drizzle-orm @tauri-apps/plugin-sql
pnpm add -D drizzle-kit

# Styling
pnpm add -D tailwindcss postcss autoprefixer

# API
# No additional packages needed - use fetch() for Jikan API
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|------------------------|
| Tauri 2.x | Electron | Need Node.js ecosystem, complex desktop integrations |
| React | Vue/Svelte | Team expertise, simpler state management |
| Jikan API | AniList API | User prefers AniList data |
| Drizzle | raw sqlx | Need more control, simpler project |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Electron | ~100MB app size, 200-300MB memory | Tauri (10MB, 30-40MB) |
| SQLite browser (sql.js) | No persistence across sessions | @tauri-apps/plugin-sql |
| Official MAL API | Requires auth, limited | Jikan (free, no auth) |

## Stack Patterns by Variant

**If desktop-first:**
- Use Tauri 2.x with React
- @tauri-apps/plugin-sql for SQLite

**If web-only:**
- Use Vite + React
- sql.js for SQLite (in-browser, limited)
- Or skip SQLite, use localStorage

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Tauri 2.x | React 18.x | Works well |
| Drizzle | @tauri-apps/plugin-sql | Use drizzle-kit for migrations |
| TailwindCSS 3.x | Vite 5.x | Works well |

## Sources

- Jikan API docs — https://docs.jikan.moe/ (free anime data)
- Tauri 2.0 docs — https://tauri.app/ (desktop framework)
- Drizzle ORM docs — https://orm.drizzle.team/ (TypeScript ORM)

---
*Stack research for: Anime Tracker*
*Researched: 2026-04-09*
