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

export default function FileView({ files, loadFiles, viewMode = 'grid', onSelect, selectedFile, onOpenPreview, searchQuery }) {
  const [data, setData] = useState(files || []);
  const [tags, setTags] = useState({});

  useEffect(() => {
    if (files) {
      setData(files);
    } else if (loadFiles) {
      loadFiles().then(setData).catch(() => setData([]));
    }
  }, [files, loadFiles]);

  useEffect(() => {
    if (data.length) {
      const ids = data.slice(0, 50).map(f => f.id);
      Promise.all(ids.map(id => window.api?.getTagsForFile(id).then(t => [id, t]))).then(results => {
        const map = {};
        results.forEach(([id, t]) => { map[id] = t || []; });
        setTags(map);
      });
    }
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📂</div>
        <div className="empty-state-title">No files found</div>
        <div className="empty-state-desc">{searchQuery ? `No results for "${searchQuery}"` : 'Try indexing more locations'}</div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="animate-in">
        {data.map(file => (
          <div
            key={file.id}
            className={`file-list-item ${selectedFile?.id === file.id ? 'selected' : ''}`}
            onClick={() => onSelect(file)}
            onDoubleClick={() => onOpenPreview(file)}
          >
            {file.category === 'images' ? (
              <img className="file-list-icon" src={`atom://${encodeURI(file.path)}`} alt="" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            ) : null}
            <span className="file-list-icon" style={{ display: file.category === 'images' ? 'none' : 'block' }}>{getFileIcon(file.category, file.extension)}</span>
            <span className="file-list-name">{file.name}</span>
            <span className="file-list-meta">{file.extension}</span>
            <span className="file-list-meta">{formatBytes(file.size)}</span>
            <span className="file-list-meta">{new Date(file.modified_at).toLocaleDateString()}</span>
            <span className="file-list-meta">{file.category}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`file-grid ${viewMode === 'compact' ? 'compact' : ''} ${viewMode === 'gallery' ? 'gallery' : ''} animate-in`}>
      {data.map(file => (
        <div
          key={file.id}
          className={`file-card ${selectedFile?.id === file.id ? 'selected' : ''}`}
          onClick={() => onSelect(file)}
          onDoubleClick={() => onOpenPreview(file)}
        >
          <div className={`file-card-preview ${viewMode === 'gallery' ? 'gallery-preview' : ''}`}>
            {file.category === 'images' ? (
              <img src={`atom://${encodeURI(file.path)}`} alt="" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            ) : null}
            <span style={{ display: file.category === 'images' ? 'none' : 'flex' }}>{getFileIcon(file.category, file.extension)}</span>
          </div>
          <div className="file-card-info">
            <div className="file-card-name" title={file.path}>{file.name}</div>
            <div className="file-card-meta">
              <span>{file.extension?.toUpperCase()}</span>
              <span>{formatBytes(file.size)}</span>
            </div>
          </div>
          {tags[file.id] && tags[file.id].length > 0 && (
            <div className="file-card-tags">
              {tags[file.id].slice(0, 3).map(tag => (
                <span key={tag.id} className="file-card-tag" style={{ backgroundColor: tag.color + '22', color: tag.color }}>{tag.name}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
