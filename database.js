const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const { DB_NAME } = require('../shared/constants');

let db;

function getDbPath() {
  return path.join(app.getPath('userData'), DB_NAME);
}

function initDatabase() {
  db = new Database(getDbPath());
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      extension TEXT,
      size INTEGER DEFAULT 0,
      category TEXT DEFAULT 'other',
      hash TEXT,
      thumbnail TEXT,
      created_at TEXT,
      modified_at TEXT,
      accessed_at TEXT,
      indexed_at TEXT DEFAULT (datetime('now')),
      parent_folder TEXT
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      color TEXT DEFAULT '#6366f1',
      icon TEXT DEFAULT '🏷️',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS file_tags (
      file_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (file_id, tag_id),
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      icon TEXT DEFAULT '📁',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS collection_files (
      collection_id INTEGER NOT NULL,
      file_id INTEGER NOT NULL,
      added_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (collection_id, file_id),
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_id INTEGER NOT NULL UNIQUE,
      pinned_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS relationships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_file_id INTEGER NOT NULL,
      target_file_id INTEGER NOT NULL,
      relationship_type TEXT DEFAULT 'related',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (source_file_id) REFERENCES files(id) ON DELETE CASCADE,
      FOREIGN KEY (target_file_id) REFERENCES files(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS indexed_locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT UNIQUE NOT NULL,
      enabled INTEGER DEFAULT 1,
      added_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      file_path TEXT,
      details TEXT,
      timestamp TEXT DEFAULT (datetime('now'))
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS files_fts USING fts5(
      name, path, extension, category,
      content='files',
      content_rowid='id'
    );

    CREATE TRIGGER IF NOT EXISTS files_ai AFTER INSERT ON files BEGIN
      INSERT INTO files_fts(rowid, name, path, extension, category)
      VALUES (new.id, new.name, new.path, new.extension, new.category);
    END;

    CREATE TRIGGER IF NOT EXISTS files_ad AFTER DELETE ON files BEGIN
      INSERT INTO files_fts(files_fts, rowid, name, path, extension, category)
      VALUES ('delete', old.id, old.name, old.path, old.extension, old.category);
    END;

    CREATE TRIGGER IF NOT EXISTS files_au AFTER UPDATE ON files BEGIN
      INSERT INTO files_fts(files_fts, rowid, name, path, extension, category)
      VALUES ('delete', old.id, old.name, old.path, old.extension, old.category);
      INSERT INTO files_fts(rowid, name, path, extension, category)
      VALUES (new.id, new.name, new.path, new.extension, new.category);
    END;
  `);

  return db;
}

function getDb() {
  if (!db) initDatabase();
  return db;
}

module.exports = { initDatabase, getDb };
