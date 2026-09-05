const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Window
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),

  // Search
  search: (query, options) => ipcRenderer.invoke('search:query', query, options),
  getRecent: (limit) => ipcRenderer.invoke('search:recent', limit),
  getByCategory: (category, limit) => ipcRenderer.invoke('search:category', category, limit),
  getLargest: (limit) => ipcRenderer.invoke('search:largest', limit),
  getDuplicates: () => ipcRenderer.invoke('search:duplicates'),
  getStorage: () => ipcRenderer.invoke('search:storage'),

  // Indexing
  startIndexing: (locations) => ipcRenderer.invoke('index:start', locations),
  stopIndexing: () => ipcRenderer.invoke('index:stop'),
  getIndexStatus: () => ipcRenderer.invoke('index:status'),
  onIndexProgress: (callback) => ipcRenderer.on('index:progress', (_, progress) => callback(progress)),

  // Locations
  getLocations: () => ipcRenderer.invoke('locations:get'),
  addLocation: () => ipcRenderer.invoke('locations:add'),

  // Tags
  getTags: () => ipcRenderer.invoke('tags:getAll'),
  createTag: (tag) => ipcRenderer.invoke('tags:create', tag),
  deleteTag: (id) => ipcRenderer.invoke('tags:delete', id),
  assignTag: (fileId, tagId) => ipcRenderer.invoke('tags:assign', fileId, tagId),
  unassignTag: (fileId, tagId) => ipcRenderer.invoke('tags:unassign', fileId, tagId),
  getTagsForFile: (fileId) => ipcRenderer.invoke('tags:getForFile', fileId),

  // Collections
  getCollections: () => ipcRenderer.invoke('collections:getAll'),
  createCollection: (col) => ipcRenderer.invoke('collections:create', col),
  deleteCollection: (id) => ipcRenderer.invoke('collections:delete', id),
  addFileToCollection: (colId, fileId) => ipcRenderer.invoke('collections:addFile', colId, fileId),
  removeFileFromCollection: (colId, fileId) => ipcRenderer.invoke('collections:removeFile', colId, fileId),
  getCollectionFiles: (colId) => ipcRenderer.invoke('collections:getFiles', colId),

  // Favorites
  getFavorites: () => ipcRenderer.invoke('favorites:getAll'),
  toggleFavorite: (fileId) => ipcRenderer.invoke('favorites:toggle', fileId),
  isFavorite: (fileId) => ipcRenderer.invoke('favorites:isFavorite', fileId),

  // Relationships
  getRelationships: (fileId) => ipcRenderer.invoke('relationships:getForFile', fileId),
  createRelationship: (src, tgt, type) => ipcRenderer.invoke('relationships:create', src, tgt, type),
  deleteRelationship: (id) => ipcRenderer.invoke('relationships:delete', id),
  getRelationshipTypes: () => ipcRenderer.invoke('relationships:types'),

  // File operations
  openFile: (path) => ipcRenderer.invoke('file:open', path),
  showInFolder: (path) => ipcRenderer.invoke('file:showInFolder', path),
  getThumbnail: (path) => ipcRenderer.invoke('file:getThumbnail', path),
  getFileInfo: (path) => ipcRenderer.invoke('file:getInfo', path),
  renameFile: (oldPath, newName) => ipcRenderer.invoke('file:rename', oldPath, newName),
  deleteFile: (path) => ipcRenderer.invoke('file:delete', path),

  // Stats
  getStats: () => ipcRenderer.invoke('stats:overview'),

  // Settings
  getSetting: (key) => ipcRenderer.invoke('settings:get', key),
  setSetting: (key, value) => ipcRenderer.invoke('settings:set', key, value),

  // Dialog
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
});
