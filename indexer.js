const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getDb } = require('./database');
const { FILE_CATEGORIES, SUPPORTED_EXTENSIONS } = require('../shared/constants');

let isIndexing = false;
let indexProgress = { current: 0, total: 0, folder: '' };

function getFileCategory(ext) {
  return FILE_CATEGORIES[ext.toLowerCase()] || 'other';
}

function getFileHash(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(data).digest('hex');
  } catch {
    return null;
  }
}

function scanDirectory(dirPath, results = []) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '$Recycle.Bin') continue;
      if (entry.isDirectory()) {
        scanDirectory(fullPath, results);
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  } catch {}
  return results;
}

function getFileInfo(filePath) {
  try {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return {
      path: filePath,
      name: path.basename(filePath),
      extension: ext,
      size: stat.size,
      category: getFileCategory(ext),
      created_at: stat.birthtime.toISOString(),
      modified_at: stat.mtime.toISOString(),
      accessed_at: stat.atime.toISOString(),
      parent_folder: path.dirname(filePath),
    };
  } catch {
    return null;
  }
}

async function indexLocation(locationPath, onProgress) {
  const db = getDb();
  const files = scanDirectory(locationPath);
  const total = files.length;
  let current = 0;

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO files (path, name, extension, size, category, created_at, modified_at, accessed_at, parent_folder)
    VALUES (@path, @name, @extension, @size, @category, @created_at, @modified_at, @accessed_at, @parent_folder)
  `);

  const insertMany = db.transaction((fileInfos) => {
    for (const info of fileInfos) {
      insertStmt.run(info);
    }
  });

  const batchSize = 500;
  for (let i = 0; i < files.length; i += batchSize) {
    if (!isIndexing) break;
    const batch = files.slice(i, i + batchSize);
    const infos = batch.map(getFileInfo).filter(Boolean);
    insertMany(infos);
    current += batch.length;
    indexProgress = { current, total, folder: locationPath };
    if (onProgress) onProgress(indexProgress);
  }

  return current;
}

async function startIndexing(locations, onProgress) {
  if (isIndexing) return;
  isIndexing = true;
  let totalIndexed = 0;

  for (const loc of locations) {
    if (!isIndexing) break;
    const count = await indexLocation(loc, onProgress);
    totalIndexed += count;
  }

  isIndexing = false;
  return totalIndexed;
}

function stopIndexing() {
  isIndexing = false;
}

function getIndexProgress() {
  return indexProgress;
}

function isCurrentlyIndexing() {
  return isIndexing;
}

function computeHash(filePath) {
  const hash = getFileHash(filePath);
  if (hash) {
    const db = getDb();
    db.prepare('UPDATE files SET hash = ? WHERE path = ?').run(hash, filePath);
  }
  return hash;
}

module.exports = { indexLocation, startIndexing, stopIndexing, getIndexProgress, isCurrentlyIndexing, computeHash, scanDirectory, getFileInfo };
