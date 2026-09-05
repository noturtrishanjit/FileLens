const { getDb } = require('./database');

function searchFiles(query, options = {}) {
  const db = getDb();
  const { category, location, tag, sizeMin, sizeMax, dateFrom, dateTo, limit = 100 } = options;

  let results = [];

  if (query && query.trim()) {
    const ftsQuery = query.trim().split(/\s+/).map(t => `"${t}"`).join(' OR ');
    try {
      const ftsResults = db.prepare(`
        SELECT f.*, rank
        FROM files_fts
        JOIN files f ON files_fts.rowid = f.id
        WHERE files_fts MATCH ?
        ORDER BY rank
        LIMIT ?
      `).all(ftsQuery, limit);
      results = ftsResults;
    } catch {
      results = db.prepare(`
        SELECT * FROM files
        WHERE name LIKE ? OR path LIKE ?
        LIMIT ?
      `).all(`%${query}%`, `%${query}%`, limit);
    }
  } else {
    results = db.prepare('SELECT * FROM files ORDER BY modified_at DESC LIMIT ?').all(limit);
  }

  if (category) {
    results = results.filter(r => r.category === category);
  }
  if (location) {
    results = results.filter(r => r.path.toLowerCase().includes(location.toLowerCase()));
  }
  if (sizeMin) {
    results = results.filter(r => r.size >= sizeMin);
  }
  if (sizeMax) {
    results = results.filter(r => r.size <= sizeMax);
  }
  if (dateFrom) {
    results = results.filter(r => new Date(r.modified_at) >= new Date(dateFrom));
  }
  if (dateTo) {
    results = results.filter(r => new Date(r.modified_at) <= new Date(dateTo));
  }

  if (tag) {
    const taggedIds = db.prepare(`
      SELECT file_id FROM file_tags
      JOIN tags ON file_tags.tag_id = tags.id
      WHERE tags.name = ?
    `).all(tag).map(r => r.file_id);
    results = results.filter(r => taggedIds.includes(r.id));
  }

  return results;
}

function getRecentFiles(limit = 20) {
  const db = getDb();
  return db.prepare('SELECT * FROM files ORDER BY modified_at DESC LIMIT ?').all(limit);
}

function getRecentlyModified(limit = 20) {
  const db = getDb();
  return db.prepare('SELECT * FROM files WHERE modified_at IS NOT NULL ORDER BY modified_at DESC LIMIT ?').all(limit);
}

function getFilesByCategory(category, limit = 100) {
  const db = getDb();
  return db.prepare('SELECT * FROM files WHERE category = ? ORDER BY modified_at DESC LIMIT ?').all(category, limit);
}

function getLargestFiles(limit = 50) {
  const db = getDb();
  return db.prepare('SELECT * FROM files ORDER BY size DESC LIMIT ?').all(limit);
}

function getDuplicateFiles() {
  const db = getDb();
  const dupes = db.prepare(`
    SELECT hash, COUNT(*) as count, GROUP_CONCAT(path) as paths
    FROM files
    WHERE hash IS NOT NULL
    GROUP BY hash
    HAVING count > 1
  `).all();

  return dupes.map(d => ({
    hash: d.hash,
    count: d.count,
    paths: d.paths.split(','),
  }));
}

function getStorageBreakdown() {
  const db = getDb();
  const categories = db.prepare(`
    SELECT category, SUM(size) as total_size, COUNT(*) as file_count
    FROM files
    GROUP BY category
    ORDER BY total_size DESC
  `).all();

  const totalSize = categories.reduce((sum, c) => sum + c.total_size, 0);

  return { categories, totalSize };
}

module.exports = { searchFiles, getRecentFiles, getRecentlyModified, getFilesByCategory, getLargestFiles, getDuplicateFiles, getStorageBreakdown };
