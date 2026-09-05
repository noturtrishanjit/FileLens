import React, { useState, useEffect } from 'react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(category, ext) {
  const icons = {
    images: '🖼️', videos: '🎬', audio: '🎵', documents: '📄',
    code: '💻', archives: '📦', other: '📁',
  };
  return icons[category] || '📄';
}

const spaces = [
  { icon: '📚', name: 'Documents', view: 'category', count: null },
  { icon: '🖼️', name: 'Images', view: 'images', count: null },
  { icon: '🎬', name: 'Videos', view: 'videos', count: null },
  { icon: '💻', name: 'Code', view: 'code', count: null },
  { icon: '📦', name: 'Duplicates', view: 'duplicates', count: null },
  { icon: '📊', name: 'Storage', view: 'storage', count: null },
];

export default function Dashboard({ onNavigate, onOpenPreview, refreshKey }) {
  const [recentFiles, setRecentFiles] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = async () => {
    try {
      const [recent, s] = await Promise.all([
        window.api?.getRecent(12),
        window.api?.getStats(),
      ]);
      setRecentFiles(recent || []);
      setStats(s || null);
    } catch {}
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard animate-in">
      <div className="dashboard-greeting">{greeting}</div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-label">Total Files</div>
            <div className="stat-card-value">{stats.totalFiles?.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Total Size</div>
            <div className="stat-card-value">{formatBytes(stats.totalSize)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Tags</div>
            <div className="stat-card-value">{stats.totalTags}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Collections</div>
            <div className="stat-card-value">{stats.totalCollections}</div>
          </div>
        </div>
      )}

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <div className="dashboard-section-title">Your Spaces</div>
        </div>
        <div className="dashboard-spaces">
          {spaces.map(space => (
            <div key={space.name} className="space-card" onClick={() => onNavigate(space.view)}>
              <div className="space-card-icon">{space.icon}</div>
              <div className="space-card-name">{space.name}</div>
            </div>
          ))}
        </div>
      </div>

      {recentFiles.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <div className="dashboard-section-title">Recently Modified</div>
            <button className="dashboard-section-link" onClick={() => onNavigate('recent')}>View all →</button>
          </div>
          <div className="file-grid">
            {recentFiles.slice(0, 8).map(file => (
              <div key={file.id} className="file-card" onClick={() => onOpenPreview(file)}>
                <div className="file-card-preview">
                  {file.category === 'images' ? (
                    <img src={`atom://${encodeURI(file.path)}`} alt="" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  ) : null}
                  <span style={{ display: file.category === 'images' ? 'none' : 'flex' }}>{getFileIcon(file.category, file.extension)}</span>
                </div>
                <div className="file-card-info">
                  <div className="file-card-name" title={file.name}>{file.name}</div>
                  <div className="file-card-meta">
                    <span>{formatBytes(file.size)}</span>
                    <span>{new Date(file.modified_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
