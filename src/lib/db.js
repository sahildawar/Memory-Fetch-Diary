import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'notes.db'));

// Recreate table with userId column if needed:
db.prepare(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TEXT NOT NULL
  )
`).run();

export default db;
