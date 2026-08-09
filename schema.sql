CREATE TABLE IF NOT EXISTS preregistrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'unmad.me',
  user_agent TEXT,
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_preregistrations_created_at
  ON preregistrations(created_at);
