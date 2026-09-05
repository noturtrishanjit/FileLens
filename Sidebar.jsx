import React from 'react';

export default function Sidebar({ view, onNavigate, stats }) {
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'favorites', icon: '⭐', label: 'Favorites' },
    { id: 'recent', icon: '🕐', label: 'Recent' },
    { id: 'files', icon: '📁', label: 'All Files' },
    { id: 'tags', icon: '🏷️', label: 'Tags' },
    { id: 'collections', icon: '📚', label: 'Collections' },
    { id: 'duplicates', icon: '🔗', label: 'Duplicates' },
  ];

  const locationItems = [
    { id: 'images', icon: '🖼️', label: 'Images' },
    { id: 'videos', icon: '🎬', label: 'Videos' },
    { id: 'category', icon: '📄', label: 'Documents' },
    { id: 'code', icon: '💻', label: 'Code' },
  ];

  const toolItems = [
    { id: 'storage', icon: '📊', label: 'Storage' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${view === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
            {item.id === 'files' && stats && (
              <span className="badge">{stats.totalFiles?.toLocaleString()}</span>
            )}
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Locations</div>
        {locationItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${view === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Tools</div>
        {toolItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${view === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </div>

      {stats && (
        <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            {stats.totalFiles?.toLocaleString()} files indexed
          </div>
        </div>
      )}
    </div>
  );
}
