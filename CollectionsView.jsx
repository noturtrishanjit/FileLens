import React, { useState, useEffect } from 'react';

export default function CollectionsView({ onViewCollection, refreshKey }) {
  const [collections, setCollections] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('📁');

  const icons = ['📁', '📚', '🚀', '🎬', '📊', '🎨', '💼', '🏠', '🎵', '🖼️'];

  useEffect(() => {
    loadCollections();
  }, [refreshKey]);

  const loadCollections = async () => {
    const cols = await window.api?.getCollections();
    setCollections(cols || []);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await window.api?.createCollection({ name: newName.trim(), description: newDesc, icon: newIcon });
    setNewName('');
    setNewDesc('');
    setShowCreate(false);
    loadCollections();
  };

  const handleDelete = async (id) => {
    await window.api?.deleteCollection(id);
    loadCollections();
  };

  return (
    <div className="dashboard animate-in">
      <div className="dashboard-section-header">
        <div className="dashboard-section-title" style={{ fontSize: '20px' }}>Collections</div>
        <button className="topbar-btn primary" onClick={() => setShowCreate(!showCreate)}>+ New Collection</button>
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>New Collection</h3>
            <input className="modal-input" placeholder="Collection name" value={newName} onChange={e => setNewName(e.target.value)} />
            <input className="modal-input" placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {icons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setNewIcon(icon)}
                  style={{
                    fontSize: '18px',
                    background: newIcon === icon ? 'var(--accent-bg)' : 'var(--bg-tertiary)',
                    border: newIcon === icon ? '1px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                >{icon}</button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn-primary btn" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {collections.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-title">No collections yet</div>
          <div className="empty-state-desc">Create a collection to group files across folders</div>
        </div>
      ) : (
        <div className="collection-grid">
          {collections.map(col => (
            <div key={col.id} className="collection-card" onClick={() => onViewCollection(col)}>
              <div className="collection-card-icon">{col.icon}</div>
              <div className="collection-card-name">{col.name}</div>
              {col.description && <div className="collection-card-desc">{col.description}</div>}
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="collection-card-count">Click to open</span>
                <button
                  className="titlebar-btn"
                  style={{ color: 'var(--text-tertiary)' }}
                  onClick={(e) => { e.stopPropagation(); handleDelete(col.id); }}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
