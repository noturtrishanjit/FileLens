import React, { useState, useEffect } from 'react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function FavoritesView({ onSelect, selectedFile, onOpenPreview, refreshKey }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    window.api?.getFavorites().then(setFiles);
  }, [refreshKey]);

  if (files.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⭐</div>
        <div className="empty-state-title">No favorites yet</div>
        <div className="empty-state-desc">Add files to favorites from their details panel</div>
      </div>
    );
  }

  return (
    <div className="file-grid animate-in">
      {files.map(file => (
        <div
          key={file.id}
          className={`file-card ${selectedFile?.id === file.id ? 'selected' : ''}`}
          onClick={() => onSelect(file)}
          onDoubleClick={() => onOpenPreview(file)}
        >
          <div className="file-card-preview">
            {file.category === 'images' ? (
              <img src={`atom://${encodeURI(file.path)}`} alt="" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            ) : null}
            <span style={{ display: file.category === 'images' ? 'none' : 'flex' }}>
              {file.category === 'videos' ? '🎬' : file.category === 'audio' ? '🎵' : file.category === 'documents' ? '📄' : file.category === 'code' ? '💻' : '📁'}
            </span>
          </div>
          <div className="file-card-info">
            <div className="file-card-name" title={file.name}>{file.name}</div>
            <div className="file-card-meta">
              <span>{file.extension}</span>
              <span>{formatBytes(file.size)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
