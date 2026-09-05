import React, { useRef, useEffect } from 'react';

export default function TopBar({ onSearch, searchQuery, viewMode, setViewMode, onRefresh }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        onRefresh?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRefresh]);

  return (
    <div className="topbar">
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
        <span className="search-shortcut">Ctrl+K</span>
      </div>
      <div className="view-toggle">
        <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} title="Grid">▦</button>
        <button className={viewMode === 'compact' ? 'active' : ''} onClick={() => setViewMode('compact')} title="Compact">▤</button>
        <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} title="List">☰</button>
        <button className={viewMode === 'gallery' ? 'active' : ''} onClick={() => setViewMode('gallery')} title="Gallery">🖼</button>
      </div>
      <div className="topbar-actions">
        <button className="topbar-btn" onClick={onRefresh}>↻ Refresh</button>
      </div>
    </div>
  );
}
