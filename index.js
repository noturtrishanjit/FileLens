const { app, BrowserWindow, ipcMain, dialog, shell, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const { initDatabase, getDb } = require('./database');
const { startIndexing, stopIndexing, isCurrentlyIndexing, getIndexProgress } = require('./indexer');
const { searchFiles, getRecentFiles, getFilesByCategory, getLargestFiles, getDuplicateFiles, getStorageBreakdown } = require('./search');
const { DEFAULT_LOCATIONS, RELATIONSHIP_TYPES } = require('../shared/constants');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0f0f14',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../../build/icon.png'),
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
}

app.whenReady().then(() => {
  initDatabase();
  registerFileProtocol();
  createWindow();
  registerIpcHandlers();
  seedDefaultData();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function registerFileProtocol() {
  protocol.registerFileProtocol('atom', (request, callback) => {
    const filePath = decodeURIComponent(request.url.replace('atom://', ''));
    callback({ path: filePath });
  });
}

function seedDefaultData() {
  const db = getDb();
  const existingTags = db.prepare('SELECT COUNT(*) as count FROM tags').get();
  if (existingTags.count === 0) {
    const defaultTags = [
      { name: 'important', color: '#ef4444', icon: '⭐' },
      { name: 'school', color: '#3b82f6', icon: '📚' },
      { name: 'work', color: '#f59e0b', icon: '💼' },
      { name: 'personal', color: '#10b981', icon: '🏠' },
      { name: 'project', color: '#8b5cf6', icon: '🚀' },
    ];
    const stmt = db.prepare('INSERT OR IGNORE INTO tags (name, color, icon) VALUES (?, ?, ?)');
    for (const t of defaultTags) stmt.run(t.name, t.color, t.icon);
  }

  const existingLocations = db.prepare('SELECT COUNT(*) as count FROM indexed_locations').get();
  if (existingLocations.count === 0) {
    const stmt = db.prepare('INSERT OR IGNORE INTO indexed_locations (path) VALUES (?)');
    for (const loc of DEFAULT_LOCATIONS) {
      if (fs.existsSync(loc)) stmt.run(loc);
    }
  }
}

function registerIpcHandlers() {
  // Window controls
  ipcMain.on('window:minimize', () => mainWindow?.minimize());
  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) mainWindow.unmaximize();
    else mainWindow?.maximize();
  });
  ipcMain.on('window:close', () => mainWindow?.close());

  // Search
  ipcMain.handle('search:query', (_, query, options) => searchFiles(query, options));
  ipcMain.handle('search:recent', (_, limit) => getRecentFiles(limit));
  ipcMain.handle('search:category', (_, category, limit) => getFilesByCategory(category, limit));
  ipcMain.handle('search:largest', (_, limit) => getLargestFiles(limit));
  ipcMain.handle('search:duplicates', () => getDuplicateFiles());
  ipcMain.handle('search:storage', () => getStorageBreakdown());

  // Indexing
  ipcMain.handle('index:start', async (_, locations) => {
    return await startIndexing(locations || getDefaultLocations(), (progress) => {
      mainWindow?.webContents.send('index:progress', progress);
    });
  });
  ipcMain.handle('index:stop', () => stopIndexing());
  ipcMain.handle('index:status', () => ({
    isIndexing: isCurrentlyIndexing(),
    progress: getIndexProgress(),
  }));

  // Locations
  ipcMain.handle('locations:get', () => getDefaultLocations());
  ipcMain.handle('locations:add', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select folder to index',
    });
    if (!result.canceled && result.filePaths.length) {
      const db = getDb();
      db.prepare('INSERT OR IGNORE INTO indexed_locations (path) VALUES (?)').run(result.filePaths[0]);
      return result.filePaths[0];
    }
    return null;
  });

  // Tags
  ipcMain.handle('tags:getAll', () => getDb().prepare('SELECT * FROM tags ORDER BY name').all());
  ipcMain.handle('tags:create', (_, tag) => {
    const result = getDb().prepare('INSERT INTO tags (name, color, icon) VALUES (?, ?, ?)').run(tag.name, tag.color || '#6366f1', tag.icon || '🏷️');
    return { id: result.lastInsertRowid, ...tag };
  });
  ipcMain.handle('tags:delete', (_, id) => getDb().prepare('DELETE FROM tags WHERE id = ?').run(id));
  ipcMain.handle('tags:assign', (_, fileId, tagId) => {
    getDb().prepare('INSERT OR IGNORE INTO file_tags (file_id, tag_id) VALUES (?, ?)').run(fileId, tagId);
  });
  ipcMain.handle('tags:unassign', (_, fileId, tagId) => {
    getDb().prepare('DELETE FROM file_tags WHERE file_id = ? AND tag_id = ?').run(fileId, tagId);
  });
  ipcMain.handle('tags:getForFile', (_, fileId) => {
    return getDb().prepare(`
      SELECT t.* FROM tags t
      JOIN file_tags ft ON t.id = ft.tag_id
      WHERE ft.file_id = ?
    `).all(fileId);
  });

  // Collections
  ipcMain.handle('collections:getAll', () => getDb().prepare('SELECT * FROM collections ORDER BY name').all());
  ipcMain.handle('collections:create', (_, col) => {
    const result = getDb().prepare('INSERT INTO collections (name, description, icon) VALUES (?, ?, ?)').run(col.name, col.description || '', col.icon || '📁');
    return { id: result.lastInsertRowid, ...col };
  });
  ipcMain.handle('collections:delete', (_, id) => getDb().prepare('DELETE FROM collections WHERE id = ?').run(id));
  ipcMain.handle('collections:addFile', (_, collectionId, fileId) => {
    getDb().prepare('INSERT OR IGNORE INTO collection_files (collection_id, file_id) VALUES (?, ?)').run(collectionId, fileId);
  });
  ipcMain.handle('collections:removeFile', (_, collectionId, fileId) => {
    getDb().prepare('DELETE FROM collection_files WHERE collection_id = ? AND file_id = ?').run(collectionId, fileId);
  });
  ipcMain.handle('collections:getFiles', (_, collectionId) => {
    return getDb().prepare(`
      SELECT f.* FROM files f
      JOIN collection_files cf ON f.id = cf.file_id
      WHERE cf.collection_id = ?
      ORDER BY f.name
    `).all(collectionId);
  });

  // Favorites
  ipcMain.handle('favorites:getAll', () => {
    return getDb().prepare(`
      SELECT f.* FROM files f
      JOIN favorites fav ON f.id = fav.file_id
      ORDER BY fav.pinned_at DESC
    `).all();
  });
  ipcMain.handle('favorites:toggle', (_, fileId) => {
    const exists = getDb().prepare('SELECT 1 FROM favorites WHERE file_id = ?').get(fileId);
    if (exists) {
      getDb().prepare('DELETE FROM favorites WHERE file_id = ?').run(fileId);
      return false;
    } else {
      getDb().prepare('INSERT INTO favorites (file_id) VALUES (?)').run(fileId);
      return true;
    }
  });
  ipcMain.handle('favorites:isFavorite', (_, fileId) => {
    return !!getDb().prepare('SELECT 1 FROM favorites WHERE file_id = ?').get(fileId);
  });

  // Relationships
  ipcMain.handle('relationships:getForFile', (_, fileId) => {
    return getDb().prepare(`
      SELECT f.*, r.relationship_type FROM files f
      JOIN relationships r ON (f.id = r.target_file_id OR f.id = r.source_file_id)
      WHERE (r.source_file_id = ? OR r.target_file_id = ?) AND f.id != ?
    `).all(fileId, fileId, fileId);
  });
  ipcMain.handle('relationships:create', (_, sourceId, targetId, type) => {
    getDb().prepare('INSERT INTO relationships (source_file_id, target_file_id, relationship_type) VALUES (?, ?, ?)').run(sourceId, targetId, type || 'related');
  });
  ipcMain.handle('relationships:delete', (_, id) => {
    getDb().prepare('DELETE FROM relationships WHERE id = ?').run(id);
  });
  ipcMain.handle('relationships:types', () => RELATIONSHIP_TYPES);

  // File operations
  ipcMain.handle('file:open', (_, filePath) => shell.openPath(filePath));
  ipcMain.handle('file:showInFolder', (_, filePath) => shell.showItemInFolder(filePath));
  ipcMain.handle('file:getThumbnail', (_, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];
    if (imageExts.includes(ext)) {
      return `atom://${encodeURI(filePath)}`;
    }
    return null;
  });
  ipcMain.handle('file:getInfo', (_, filePath) => {
    try {
      const stat = fs.statSync(filePath);
      const db = getDb();
      const fileRecord = db.prepare('SELECT * FROM files WHERE path = ?').get(filePath);
      const tags = fileRecord ? getDb().prepare(`
        SELECT t.* FROM tags t JOIN file_tags ft ON t.id = ft.tag_id WHERE ft.file_id = ?
      `).all(fileRecord.id) : [];
      return { stat, fileRecord, tags };
    } catch (e) {
      return null;
    }
  });
  ipcMain.handle('file:rename', async (_, oldPath, newName) => {
    const dir = path.dirname(oldPath);
    const newPath = path.join(dir, newName);
    try {
      fs.renameSync(oldPath, newPath);
      const db = getDb();
      db.prepare('UPDATE files SET path = ?, name = ? WHERE path = ?').run(newPath, newName, oldPath);
      return newPath;
    } catch (e) {
      return null;
    }
  });
  ipcMain.handle('file:delete', async (_, filePath) => {
    try {
      shell.moveItemToTrash(filePath);
      const db = getDb();
      db.prepare('DELETE FROM files WHERE path = ?').run(filePath);
      return true;
    } catch {
      return false;
    }
  });

  // Stats
  ipcMain.handle('stats:overview', () => {
    const db = getDb();
    const totalFiles = db.prepare('SELECT COUNT(*) as count FROM files').get().count;
    const totalSize = db.prepare('SELECT SUM(size) as total FROM files').get().total || 0;
    const totalTags = db.prepare('SELECT COUNT(*) as count FROM tags').get().count;
    const totalCollections = db.prepare('SELECT COUNT(*) as count FROM collections').get().count;
    const totalFavorites = db.prepare('SELECT COUNT(*) as count FROM favorites').get().count;
    return { totalFiles, totalSize, totalTags, totalCollections, totalFavorites };
  });

  // Settings
  ipcMain.handle('settings:get', (_, key) => {
    const row = getDb().prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row ? row.value : null;
  });
  ipcMain.handle('settings:set', (_, key, value) => {
    getDb().prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, String(value));
  });

  // Dialog
  ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
    });
    return result.canceled ? [] : result.filePaths;
  });
}

function getDefaultLocations() {
  const db = getDb();
  const locs = db.prepare('SELECT path FROM indexed_locations WHERE enabled = 1').all();
  return locs.map(l => l.path).filter(p => fs.existsSync(p));
}
