import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import FileView from './components/FileView';
import FileDetails from './components/FileDetails';
import QuickPreview from './components/QuickPreview';
import Welcome from './components/Welcome';
import TagsView from './components/TagsView';
import CollectionsView from './components/CollectionsView';
import CollectionFilesView from './components/CollectionFilesView';
import StorageView from './components/StorageView';
import DuplicateView from './components/DuplicateView';
import SettingsView from './components/SettingsView';
import FavoritesView from './components/FavoritesView';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexProgress, setIndexProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    window.api?.onIndexProgress?.((progress) => {
      setIndexProgress(progress);
    });
  }, []);

  useEffect(() => {
    checkReadiness();
  }, []);

  useEffect(() => {
    if (isReady) loadStats();
  }, [isReady, refreshKey]);

  const checkReadiness = async () => {
    try {
      const status = await window.api?.getIndexStatus();
      const s = await window.api?.getStats();
      if (s && s.totalFiles > 0) {
        setIsReady(true);
        setStats(s);
      }
    } catch {}
  };

  const loadStats = async () => {
    try {
      const s = await window.api?.getStats();
      setStats(s);
    } catch {}
  };

  const handleStartIndexing = async (locations) => {
    setIsIndexing(true);
    try {
      await window.api?.startIndexing(locations);
      setIsIndexing(false);
      setIsReady(true);
      refresh();
    } catch {
      setIsIndexing(false);
    }
  };

  const refresh = () => setRefreshKey(k => k + 1);

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFiles([]);
      if (view === 'search') setView('dashboard');
      return;
    }
    setView('search');
    const results = await window.api?.search(query);
    setFiles(results || []);
  }, [view]);

  const handleNavigate = useCallback((newView) => {
    setView(newView);
    setSelectedFile(null);
    setSelectedCollection(null);
    setSearchQuery('');
  }, []);

  const handleViewCollection = useCallback((collection) => {
    setSelectedCollection(collection);
    setView('collection-files');
  }, []);

  const handleOpenPreview = useCallback((file) => {
    setPreviewFile(file);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewFile(null);
  }, []);

  const handleFileAction = useCallback(() => {
    refresh();
    setSelectedFile(null);
  }, []);

  if (!isReady && !isIndexing) {
    return <Welcome onStartIndexing={handleStartIndexing} isIndexing={isIndexing} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} onOpenPreview={handleOpenPreview} refreshKey={refreshKey} />;
      case 'search':
        return <FileView files={files} viewMode={viewMode} onSelect={setSelectedFile} selectedFile={selectedFile} onOpenPreview={handleOpenPreview} searchQuery={searchQuery} />;
      case 'recent':
        return <FileView loadFiles={() => window.api?.getRecent(50)} viewMode={viewMode} onSelect={setSelectedFile} selectedFile={selectedFile} onOpenPreview={handleOpenPreview} />;
      case 'favorites':
        return <FavoritesView onSelect={setSelectedFile} selectedFile={selectedFile} onOpenPreview={handleOpenPreview} refreshKey={refreshKey} />;
      case 'files':
        return <FileView loadFiles={() => window.api?.search('')} viewMode={viewMode} onSelect={setSelectedFile} selectedFile={selectedFile} onOpenPreview={handleOpenPreview} />;
      case 'tags':
        return <TagsView refreshKey={refreshKey} />;
      case 'collections':
        return <CollectionsView onViewCollection={handleViewCollection} refreshKey={refreshKey} />;
      case 'collection-files':
        return <CollectionFilesView collection={selectedCollection} onSelect={setSelectedFile} selectedFile={selectedFile} onOpenPreview={handleOpenPreview} refreshKey={refreshKey} />;
      case 'storage':
        return <StorageView refreshKey={refreshKey} />;
      case 'duplicates':
        return <DuplicateView onOpenPreview={handleOpenPreview} refreshKey={refreshKey} />;
      case 'settings':
        return <SettingsView theme={theme} setTheme={setTheme} refresh={refresh} />;
      case 'category':
        return <FileView loadFiles={() => window.api?.getByCategory('documents', 200)} viewMode={viewMode} onSelect={setSelectedFile} selectedFile={selectedFile} onOpenPreview={handleOpenPreview} />;
      case 'images':
        return <FileView loadFiles={() => window.api?.getByCategory('images', 200)} viewMode="gallery" onSelect={setSelectedFile} selectedFile={selectedFile} onOpenPreview={handleOpenPreview} />;
      case 'videos':
        return <FileView loadFiles={() => window.api?.getByCategory('videos', 200)} viewMode={viewMode} onSelect={setSelectedFile} selectedFile={selectedFile} onOpenPreview={handleOpenPreview} />;
      case 'code':
        return <FileView loadFiles={() => window.api?.getByCategory('code', 200)} viewMode={viewMode} onSelect={setSelectedFile} selectedFile={selectedFile} onOpenPreview={handleOpenPreview} />;
      default:
        return <Dashboard onNavigate={handleNavigate} onOpenPreview={handleOpenPreview} refreshKey={refreshKey} />;
    }
  };

  return (
    <div className="app-layout">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
        <div className="titlebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="./logo.png" alt="" style={{ height: '20px', width: 'auto' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="titlebar-title">FILELENS</span>
          </div>
          <div className="titlebar-controls">
            <button className="titlebar-btn" onClick={() => window.api?.minimize()}>─</button>
            <button className="titlebar-btn" onClick={() => window.api?.maximize()}>□</button>
            <button className="titlebar-btn close" onClick={() => window.api?.close()}>✕</button>
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar view={view} onNavigate={handleNavigate} stats={stats} />
          <div className="main-content">
            <TopBar
              onSearch={handleSearch}
              searchQuery={searchQuery}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onRefresh={refresh}
            />
            <div className="content-area">
              {renderContent()}
            </div>
          </div>
          {selectedFile && (
            <FileDetails file={selectedFile} onClose={() => setSelectedFile(null)} onAction={handleFileAction} onOpenPreview={handleOpenPreview} />
          )}
        </div>
      </div>
      {previewFile && <QuickPreview file={previewFile} onClose={handleClosePreview} />}
    </div>
  );
}
