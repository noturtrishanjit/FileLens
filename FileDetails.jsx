import React, { useState, useEffect } from 'react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function FileDetails({ file, onClose, onAction, onOpenPreview }) {
  const [info, setInfo] = useState(null);
  const [fileTags, setFileTags] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [related, setRelated] = useState([]);
  const [relationsTypes, setRelationTypes] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [collections, setCollections] = useState([]);
  const [showCollections, setShowCollections] = useState(false);

  useEffect(() => {
    loadDetails();
  }, [file]);

  const loadDetails = async () => {
    try {
      const [info, tags, fav, related, types, allTags, collections] = await Promise.all([
        window.api?.getFileInfo(file.path),
        window.api?.getTagsForFile(file.id),
        window.api?.isFavorite(file.id),
        window.api?.getRelationships(file.id),
        window.api?.getRelationshipTypes(),
        window.api?.getTags(),
        window.api?.getCollections(),
      ]);
      setInfo(info);
      setFileTags(tags || []);
      setIsFavorite(fav);
      setRelated(related || []);
      setRelationTypes(types || []);
      setAllTags(allTags || []);
      setCollections(collections || []);
    } catch {}
  };

  const handleTagToggle = async (tagId) => {
    const hasTag = fileTags.some(t => t.id === tagId);
    if (hasTag) {
      await window.api?.unassignTag(file.id, tagId);
    } else {
      await window.api?.assignTag(file.id, tagId);
    }
    const tags = await window.api?.getTagsForFile(file.id);
    setFileTags(tags || []);
  };

  const handleFavorite = async () => {
    await window.api?.toggleFavorite(file.id);
    setIsFavorite(!isFavorite);
  };

  const handleAddToCollection = async (colId) => {
    await window.api?.addFileToCollection(colId, file.id);
    setShowCollections(false);
  };

  const handleDelete = async () => {
    await window.api?.deleteFile(file.path);
    onAction?.();
    onClose?.();
  };

  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];
  const isImage = imageExts.includes(file.extension?.toLowerCase());

  return (
    <div className="details-panel animate-in">
      <div className="details-header">
        <h3>File Details</h3>
        <button className="details-close" onClick={onClose}>✕</button>
      </div>

      <div className="details-preview">
        {isImage ? (
          <img src={`atom://${encodeURI(file.path)}`} alt="" />
        ) : (
          <span>{file.category === 'videos' ? '🎬' : file.category === 'audio' ? '🎵' : file.category === 'documents' ? '📄' : file.category === 'code' ? '💻' : '📁'}</span>
        )}
      </div>

      <div className="details-section">
        <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', wordBreak: 'break-all' }}>{file.name}</div>
        <div className="detail-row">
          <span className="detail-label">Type</span>
          <span className="detail-value">{file.category || 'File'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Size</span>
          <span className="detail-value">{formatBytes(file.size)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Modified</span>
          <span className="detail-value">{new Date(file.modified_at).toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Location</span>
          <span className="detail-value" style={{ whiteSpace: 'normal' }}>{file.parent_folder}</span>
        </div>
      </div>

      <div className="details-section">
        <div className="details-section-title">Tags</div>
        <div className="details-tags">
          {fileTags.map(tag => (
            <span key={tag.id} className="detail-tag" style={{ backgroundColor: tag.color + '22', color: tag.color, cursor: 'pointer' }} onClick={() => handleTagToggle(tag.id)}>
              {tag.icon} {tag.name} ✕
            </span>
          ))}
        </div>
        {allTags.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div className="details-section-title" style={{ marginBottom: '4px' }}>Add tag</div>
            <div className="details-tags">
              {allTags.filter(t => !fileTags.some(ft => ft.id === t.id)).slice(0, 8).map(tag => (
                <span key={tag.id} className="detail-tag" style={{ backgroundColor: tag.color + '22', color: tag.color, cursor: 'pointer' }} onClick={() => handleTagToggle(tag.id)}>
                  {tag.icon} {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="details-section">
        <div className="details-section-title">Related Files ({related.length})</div>
        {related.length === 0 && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>No related files</div>}
        {related.map(rel => (
          <div key={rel.id} className="file-list-item" style={{ marginBottom: '4px', padding: '6px 10px' }} onClick={() => onOpenPreview(rel)}>
            <span className="file-list-name" style={{ fontSize: '12px' }}>{rel.name}</span>
          </div>
        ))}
      </div>

      <div className="details-actions">
        <button className="detail-action-btn" onClick={() => window.api?.openFile(file.path)}>📂 Open</button>
        <button className="detail-action-btn" onClick={() => window.api?.showInFolder(file.path)}>📍 Show in Folder</button>
        <button className="detail-action-btn" onClick={() => onOpenPreview(file)}>👁 Quick Preview</button>
        <button className="detail-action-btn" onClick={handleFavorite}>{isFavorite ? '⭐ Remove from Favorites' : '☆ Add to Favorites'}</button>
        <button className="detail-action-btn" onClick={() => setShowCollections(!showCollections)}>📚 Add to Collection {showCollections ? '▴' : '▾'}</button>
        {showCollections && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {collections.map(col => (
              <button key={col.id} className="detail-action-btn" style={{ padding: '6px 12px' }} onClick={() => handleAddToCollection(col.id)}>
                {col.icon} {col.name}
              </button>
            ))}
          </div>
        )}
        <button className="detail-action-btn danger" onClick={handleDelete}>🗑 Move to Trash</button>
      </div>
    </div>
  );
}
