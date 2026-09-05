import React, { useState, useEffect } from 'react';

export default function TagsView({ refreshKey }) {
  const [tags, setTags] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6366f1');

  useEffect(() => {
    loadTags();
  }, [refreshKey]);

  const loadTags = async () => {
    const t = await window.api?.getTags();
    setTags(t || []);
  };

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    await window.api?.createTag({ name: newTagName.trim(), color: newTagColor });
    setNewTagName('');
    setShowCreate(false);
    loadTags();
  };

  const handleDelete = async (id) => {
    await window.api?.deleteTag(id);
    loadTags();
  };

  return (
    <div className="dashboard animate-in">
      <div className="dashboard-section-header">
        <div className="dashboard-section-title" style={{ fontSize: '20px' }}>Tags</div>
        <button className="topbar-btn primary" onClick={() => setShowCreate(!showCreate)}>+ New Tag</button>
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Create Tag</h3>
            <input className="modal-input" placeholder="Tag name" value={newTagName} onChange={e => setNewTagName(e.target.value)} />
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Color</label>
              <input type="color" value={newTagColor} onChange={e => setNewTagColor(e.target.value)} style={{ width: '48px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer' }} />
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn-primary btn" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {tags.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏷️</div>
          <div className="empty-state-title">No tags yet</div>
          <div className="empty-state-desc">Create tags to organize your files</div>
        </div>
      ) : (
        <div className="tag-list">
          {tags.map(tag => (
            <div key={tag.id} className="tag-item">
              <span className="tag-pill" style={{ backgroundColor: tag.color + '22', color: tag.color }}>
                {tag.icon} {tag.name}
              </span>
              <button
                className="titlebar-btn"
                style={{ color: 'var(--text-tertiary)' }}
                onClick={() => handleDelete(tag.id)}
                title="Delete tag"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
