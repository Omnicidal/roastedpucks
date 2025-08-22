import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

interface Entry {
  id: string;
  name: string;
  pucks: number;
  tier: string;
  notes?: string | null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, "../entries.db");
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath);

export const init = (): void => {
  db.serialize(() => {
    db.run(`
CREATE TABLE IF NOT EXISTS entries (
id TEXT PRIMARY KEY,
name TEXT NOT NULL,
pucks INTEGER NOT NULL CHECK(pucks >= 0),
tier TEXT NOT NULL,
notes TEXT
)
`);
  });
};

export const all = (): Promise<Pick<Entry, "id" | "name" | "pucks">[]> =>
  new Promise((resolve, reject) => {
    db.all(
      "SELECT id, name, pucks FROM entries ORDER BY name ASC",
      [],
      (err, rows: Pick<Entry, "id" | "name" | "pucks">[]) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });

export const get = (id: string): Promise<Entry | undefined> =>
  new Promise((resolve, reject) => {
    db.get("SELECT * FROM entries WHERE id = ?", [id], (err, row: Entry) => {
      if (err) return reject(err);
      resolve(row);
    });
  });

export const create = (entry: Entry): Promise<Entry> =>
  new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO entries (id, name, pucks, tier, notes) VALUES (?,?,?,?,?)",
      [entry.id, entry.name, entry.pucks, entry.tier, entry.notes ?? null],
      function (err) {
        if (err) return reject(err);
        resolve(entry);
      }
    );
  });

export const update = (id: string, entry: Omit<Entry, "id">): Promise<void> =>
  new Promise((resolve, reject) => {
    db.run(
      "UPDATE entries SET name = ?, pucks = ?, tier = ?, notes = ? WHERE id = ?",
      [entry.name, entry.pucks, entry.tier, entry.notes ?? null, id],
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });

export const remove = (id: string): Promise<void> =>
  new Promise((resolve, reject) => {
    db.run("DELETE FROM entries WHERE id = ?", [id], function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
