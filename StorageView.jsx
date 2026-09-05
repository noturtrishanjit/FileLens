import React, { useState, useEffect } from 'react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function StorageView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    window.api?.getStorage().then(setData);
  }, []);

  if (!data) {
    return <div className="empty-state"><div className="empty-state-title">Loading storage...</div></div>;
  }

  const maxSize = data.totalSize || 1;

  return (
    <div className="dashboard animate-in">
      <div className="dashboard-section-header">
        <div className="dashboard-section-title" style={{ fontSize: '20px' }}>Storage Analyzer</div>
      </div>

      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Total indexed: <strong style={{ color: 'var(--text-primary)' }}>{formatBytes(data.totalSize)}</strong>
      </div>

      <div className="storage-bar">
        {data.categories.map((cat, i) => (
          <div
            key={cat.category}
            className="storage-bar-segment"
            style={{
              width: `${(cat.total_size / maxSize) * 100}%`,
              backgroundColor: COLORS[i % COLORS.length],
            }}
          />
        ))}
      </div>

      <div className="storage-legend">
        {data.categories.map((cat, i) => (
          <div key={cat.category} className="storage-legend-item">
            <span className="storage-legend-dot" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <strong>{cat.category}</strong> — {formatBytes(cat.total_size)} ({cat.file_count} files)
          </div>
        ))}
      </div>

      <div className="dashboard-section" style={{ marginTop: '32px' }}>
        <div className="dashboard-section-title" style={{ marginBottom: '12px' }}>Categories</div>
        {data.categories.map((cat, i) => (
          <div key={cat.category} className="duplicate-group">
            <div className="duplicate-group-header">
              <strong>{cat.category}</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                {formatBytes(cat.total_size)} • {cat.file_count} files
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
