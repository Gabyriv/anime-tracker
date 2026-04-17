import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

const DB_KEY = 'anime_tracker_db';

export async function getDb(): Promise<Database> {
  if (db) return db;
  return initDb();
}

export async function initDb(): Promise<Database> {
  const wasmResponse = await fetch('/sql-wasm.wasm');
  const wasmBinary = await wasmResponse.arrayBuffer();
  
  const SQL = await initSqlJs({
    wasmBinary
  } as any);
  
  const savedDb = localStorage.getItem(DB_KEY);
  if (savedDb) {
    const data = new Uint8Array(JSON.parse(savedDb));
    db = new SQL.Database(data);
  } else {
    db = new SQL.Database();
  }
  
  db.run(`
    CREATE TABLE IF NOT EXISTS anime_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mal_id INTEGER UNIQUE NOT NULL,
      title TEXT NOT NULL,
      image_url TEXT,
      synopsis TEXT,
      episodes INTEGER,
      score REAL,
      status TEXT,
      year INTEGER,
      aired_episodes INTEGER DEFAULT NULL,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try { db.run('ALTER TABLE anime_list ADD COLUMN aired_episodes INTEGER DEFAULT NULL'); } catch {}
  
  db.run(`
    CREATE TABLE IF NOT EXISTS user_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anime_id INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('watching', 'completed', 'plan_to_watch', 'on_hold', 'dropped')),
      episodes_watched INTEGER DEFAULT 0,
      personal_rating INTEGER,
      personal_notes TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (anime_id) REFERENCES anime_list(id)
    )
  `);
  
  db.run('PRAGMA foreign_keys = ON');
  saveDb();
  
  return db;
}

export function saveDb() {
  if (!db) return;
  const data = db.export();
  const arr = Array.from(data);
  localStorage.setItem(DB_KEY, JSON.stringify(arr));
}

export type { AnimeFromApi } from '../types/anime';

// List operation functions

export async function getUserList(): Promise<any[]> {
  const database = await getDb();
  const results = database.exec(`
    SELECT 
      ul.id,
      ul.anime_id,
      al.mal_id,
      al.title,
      al.image_url,
      al.synopsis,
      al.episodes,
      al.score,
      al.status as anime_status,
      al.aired_episodes,
      al.year,
      ul.status,
      ul.episodes_watched,
      ul.personal_rating,
      ul.personal_notes,
      ul.updated_at
    FROM user_list ul
    JOIN anime_list al ON ul.anime_id = al.id
    ORDER BY ul.updated_at DESC
  `);
  
  if (results.length === 0) return [];
  
  const columns = results[0].columns;
  return results[0].values.map(row => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

export async function addToList(anime: any, status: string): Promise<number> {
  const database = await getDb();
  
  // Check if already exists
  const existing = database.exec(`SELECT id FROM anime_list WHERE mal_id = ${anime.mal_id}`);
  let animeId: number;
  
  if (existing.length > 0 && existing[0].values.length > 0) {
    animeId = existing[0].values[0][0] as number;
  } else {
    // Insert into anime_list
    database.run(`
      INSERT INTO anime_list (mal_id, title, image_url, synopsis, episodes, score, status, year)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      anime.mal_id,
      anime.title,
      anime.images?.jpg?.image_url || null,
      anime.synopsis || null,
      anime.episodes || null,
      anime.score || null,
      anime.status || null,
      anime.year || null
    ]);
    
    const newAnime = database.exec('SELECT last_insert_rowid()');
    animeId = newAnime[0].values[0][0] as number;
  }
  
  // Check if already in user_list
  const inList = database.exec(`SELECT id FROM user_list WHERE anime_id = ${animeId}`);
  if (inList.length > 0 && inList[0].values.length > 0) {
    throw new Error('Already in list');
  }
  
  // Insert into user_list
  database.run(`
    INSERT INTO user_list (anime_id, status) VALUES (?, ?)
  `, [animeId, status]);
  
  const result = database.exec('SELECT last_insert_rowid()');
  saveDb();
  return result[0].values[0][0] as number;
}

export async function updateStatus(entryId: number, status: string): Promise<void> {
  const database = await getDb();
  database.run(`
    UPDATE user_list SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `, [status, entryId]);
  saveDb();
}

export async function updateEpisodeProgress(entryId: number, episodes: number): Promise<void> {
  const database = await getDb();
  database.run(`
    UPDATE user_list SET episodes_watched = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `, [episodes, entryId]);
  saveDb();
}

export async function updatePersonalRating(entryId: number, rating: number | null): Promise<void> {
  const database = await getDb();
  database.run(`
    UPDATE user_list SET personal_rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `, [rating, entryId]);
  saveDb();
}

export async function updatePersonalNotes(entryId: number, notes: string | null): Promise<void> {
  const database = await getDb();
  database.run(`
    UPDATE user_list SET personal_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `, [notes, entryId]);
  saveDb();
}

export async function removeFromList(entryId: number): Promise<void> {
  const database = await getDb();
  database.run(`DELETE FROM user_list WHERE id = ?`, [entryId]);
  saveDb();
}

export function getAnimeByMalId(malId: number): any | null {
  if (!db) return null;
  const results = db.exec(`SELECT * FROM anime_list WHERE mal_id = ${malId}`);
  if (results.length === 0 || results[0].values.length === 0) return null;
  
  const columns = results[0].columns;
  const row = results[0].values[0];
  const obj: any = {};
  columns.forEach((col, i) => {
    obj[col] = row[i];
  });
  return obj;
}

export async function updateAiredEpisodes(malId: number, count: number): Promise<void> {
  const database = await getDb();
  database.run(`
    UPDATE anime_list SET aired_episodes = ? WHERE mal_id = ?
  `, [count, malId]);
  saveDb();
}