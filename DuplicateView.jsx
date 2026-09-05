import React, { useState, useEffect } from 'react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function DuplicateView({ onOpenPreview }) {
  const [duplicates, setDuplicates] = useState([]);

  useEffect(() => {
    loadDuplicates();
  }, []);

  const loadDuplicates = async () => {
    const dups = await window.api?.getDuplicates();
    setDuplicates(dups || []);
  };

  return (
    <div className="dashboard animate-in">
      <div className="dashboard-section-header">
        <div className="dashboard-section-title" style={{ fontSize: '20px' }}>Potential Duplicates</div>
        <button className="topbar-btn" onClick={loadDuplicates}>↻ Rescan</button>
      </div>

      {duplicates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <div className="empty-state-title">No duplicates found</div>
          <div className="empty-state-desc">Duplicate detection requires file hashing during indexing</div>
        </div>
      ) : (
        duplicates.map((dup, i) => (
          <div key={i} className="duplicate-group animate-in">
            <div className="duplicate-group-header">
              <strong style={{ color: 'var(--warning)' }}>⚠ {dup.count} matching files</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Hash: {dup.hash?.slice(0, 8)}...</span>
            </div>
            {dup.paths.map((p, j) => (
              <div key={j} className="duplicate-file">
                <span className="duplicate-file-icon">📄</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p}>{p}</span>
                <button className="titlebar-btn" style={{ color: 'var(--danger)' }} onClick={async () => { await window.api?.deleteFile(p); loadDuplicates(); }}>🗑</button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
