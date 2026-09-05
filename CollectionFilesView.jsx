import React, { useState, useEffect } from 'react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function CollectionFilesView({ collection, onSelect, selectedFile, onOpenPreview }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (collection?.id) {
      window.api?.getCollectionFiles(collection.id).then(setFiles);
    }
  }, [collection]);

  if (!collection) {
    return <div className="empty-state"><div className="empty-state-title">Select a collection</div></div>;
  }

  return (
    <div className="dashboard animate-in">
      <div className="dashboard-section-header">
        <div>
          <div className="dashboard-section-title" style={{ fontSize: '20px' }}>{collection.icon} {collection.name}</div>
          {collection.description && <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{collection.description}</div>}
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{files.length} files</div>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <div className="empty-state-title">Collection is empty</div>
          <div className="empty-state-desc">Add files from their details panel</div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
