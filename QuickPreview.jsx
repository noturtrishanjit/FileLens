import React, { useState, useEffect } from 'react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];
const textExts = ['.txt', '.md', '.json', '.js', '.ts', '.py', '.html', '.css', '.xml', '.yml', '.yaml', '.csv', '.java', '.cpp', '.c', '.cs'];

export default function QuickPreview({ file, onClose }) {
  const [content, setContent] = useState(null);
  const [isImage] = useState(() => imageExts.includes(file.extension?.toLowerCase()));
  const [isText] = useState(() => textExts.includes(file.extension?.toLowerCase()));

  useEffect(() => {
    if (isText) {
      // Fetch text content through a lightweight approach
    }
  }, [file, isText]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const getPreviewContent = () => {
    if (isImage) {
      return <img src={`atom://${encodeURI(file.path)}`} alt={file.name} />;
    }
    if (isText) {
      return <pre>Preview for {file.name}\n\nQuick preview not available for this file type in the renderer. Open the file to view its contents.</pre>;
    }
    const icons = {
      videos: '🎬', audio: '🎵', documents: '📄', code: '💻',
      archives: '📦', images: '🖼️', other: '📁',
    };
    return (
      <div style={{ textAlign: 'center', fontSize: '64px' }}>
        {icons[file.category] || '📁'}
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          {file.category} • {formatBytes(file.size)}
        </div>
      </div>
    );
  };

  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={e => e.stopPropagation()}>
        <div className="preview-header">
          <span className="preview-header-title">{file.name}</span>
          <button className="details-close" onClick={onClose}>✕</button>
        </div>
        <div className="preview-content">
          {getPreviewContent()}
        </div>
      </div>
    </div>
  );
}
