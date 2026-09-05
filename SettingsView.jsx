import React, { useState, useEffect } from 'react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function SettingsView({ theme, setTheme, refresh }) {
  const [locations, setLocations] = useState([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    loadLocations();
    window.api?.getIndexStatus().then(s => setIsIndexing(s?.isIndexing));
    window.api?.onIndexProgress?.((p) => {
      setProgress(p);
      setIsIndexing(true);
    });
  }, []);

  const loadLocations = async () => {
    const locs = await window.api?.getLocations();
    setLocations(locs || []);
  };

  const handleThemeChange = (t) => {
    setTheme(t);
    window.api?.setSetting('theme', t);
    refresh();
  };

  const handleAddLocation = async () => {
    const added = await window.api?.addLocation();
    if (added) {
      loadLocations();
      const status = await window.api?.getIndexStatus();
      if (!status?.isIndexing) {
        setIsIndexing(true);
        window.api?.startIndexing([added]);
      }
    }
  };

  const handleIndexAll = async () => {
    setIsIndexing(true);
    window.api?.startIndexing(locations);
  };

  return (
    <div className="dashboard animate-in">
      <div className="dashboard-section-header">
        <div className="dashboard-section-title" style={{ fontSize: '20px' }}>Settings</div>
      </div>

      <div className="dashboard-section">
        <div className="settings-group-title" style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Appearance</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['dark', 'light', 'system'].map(t => (
            <button
              key={t}
              className={`btn ${theme === t ? 'btn-primary' : ''}`}
              onClick={() => handleThemeChange(t)}
            >
              {t === 'dark' ? '🌙 Dark' : t === 'light' ? '☀️ Light' : '🖥 System'}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="settings-group-title" style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Indexed Locations</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          {locations.map(loc => (
            <div key={loc} className="file-list-item" style={{ cursor: 'default' }}>
              <span className="file-list-icon">📁</span>
              <span className="file-list-name">{loc}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="topbar-btn primary" onClick={handleAddLocation}>+ Add Location</button>
          <button className="topbar-btn" onClick={handleIndexAll} disabled={isIndexing}>↻ Re-index All</button>
        </div>
        {isIndexing && progress && (
          <div className="indexing-progress" style={{ marginTop: '12px' }}>
            <div>Indexing... {progress.current?.toLocaleString()} / {progress.total?.toLocaleString()}</div>
            <div className="progress-bar" style={{ width: '300px' }}>
              <div className="progress-bar-fill" style={{ width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <div className="settings-group-title" style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>About</div>
        <div className="duplicate-group" style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <img src="./logo.png" alt="FileLens" style={{ width: '80px', height: 'auto' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <strong style={{ color: 'var(--text-primary)', fontSize: '15px' }}>FileLens v1.0.0</strong><br />
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>See • Organize • Find</span>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            A visual workspace for everything on your PC.<br />
            Your files stay on your device. FileLens provides the intelligence on top.
          </div>
        </div>
      </div>
    </div>
  );
}
