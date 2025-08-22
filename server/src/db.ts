import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

sqlite3.verbose();

export interface Entry {
  id: string;
  name: string;
  pucks: number;
  tier: string;
  notes?: string;
}

let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function init() {
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  await db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      pucks INTEGER NOT NULL,
      tier TEXT NOT NULL,
      notes TEXT
    )
  `);
}

export async function all(): Promise<Entry[]> {
  return db.all<Entry[]>("SELECT * FROM entries");
}

export async function get(id: string): Promise<Entry | undefined> {
  return db.get<Entry>("SELECT * FROM entries WHERE id = ?", id);
}

export async function create(entry: Entry): Promise<Entry> {
  const { id, name, pucks, tier, notes } = entry;
  await db.run(
    `INSERT INTO entries (id, name, pucks, tier, notes) VALUES (?, ?, ?, ?, ?)`,
    id,
    name,
    pucks,
    tier,
    notes ?? null
  );
  return entry;
}

export async function update(
  id: string,
  entry: Omit<Entry, "id">
): Promise<void> {
  const { name, pucks, tier, notes } = entry;
  await db.run(
    `UPDATE entries SET name = ?, pucks = ?, tier = ?, notes = ? WHERE id = ?`,
    name,
    pucks,
    tier,
    notes ?? null,
    id
  );
}

export async function remove(id: string): Promise<void> {
  await db.run(`DELETE FROM entries WHERE id = ?`, id);
}
