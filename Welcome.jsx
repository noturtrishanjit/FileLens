import React, { useState, useEffect } from 'react';

export default function Welcome({ onStartIndexing, isIndexing }) {
  const [checkboxes, setCheckboxes] = useState({});
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [indexedCount, setIndexedCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    window.api?.getLocations().then(locs => {
      if (!mounted) return;
      setLocations(locs || []);
      const cbs = {};
      (locs || []).forEach(l => { cbs[l] = true; });
      setCheckboxes(cbs);
      setLoading(false);
    }).catch(() => setLoading(false));

    window.api?.onIndexProgress?.((p) => {
      if (mounted) setIndexedCount(p.current);
    });
    return () => { mounted = false; };
  }, []);

  const handleToggle = (path) => {
    setCheckboxes(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const handleContinue = () => {
    const selected = Object.entries(checkboxes).filter(([, v]) => v).map(([p]) => p);
    if (selected.length === 0) return;
    onStartIndexing(selected);
  };

  return (
    <div className="welcome">
      <img src="./logo.png" alt="FileLens" className="welcome-logo-img" onError={(e) => { e.target.style.display = 'none'; document.getElementById('welcome-fallback').style.display = 'block'; }} />
      <h1 id="welcome-fallback" style={{ display: 'none' }}>Welcome to FileLens</h1>
      <p>Your files stay on your PC. FileLens provides a visual layer to find, organize, and manage everything.</p>

      {!isIndexing && !loading && locations.length > 0 && (
        <>
          <div className="welcome-locations">
            <div className="details-section-title">Choose locations to index</div>
            {locations.map(loc => (
              <label key={loc} className="welcome-location">
                <input
                  type="checkbox"
                  checked={!!checkboxes[loc]}
                  onChange={() => handleToggle(loc)}
                />
                📁 {loc}
              </label>
            ))}
          </div>
          <button className="welcome-btn" onClick={handleContinue}>Continue</button>
        </>
      )}

      {isIndexing && (
        <div className="indexing-progress">
          <div>FileLens is indexing your files...</div>
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            {indexedCount?.toLocaleString()} files found
          </div>
          <button className="welcome-btn" style={{ marginTop: '16px' }} onClick={() => window.api?.stopIndexing?.()}>
            {indexedCount > 0 ? 'Explore Files' : 'Stop'}
          </button>
        </div>
      )}

      {!isIndexing && locations.length === 0 && !loading && (
        <div className="indexing-progress">
          <div>No locations configured. Please add folders to index.</div>
          <button className="welcome-btn" style={{ marginTop: '16px' }} onClick={async () => { const added = await window.api?.addLocation(); if (added) { setLocations(prev => [...prev, added]); setCheckboxes(prev => ({ ...prev, [added]: true })); } }}>
            + Add Folder
          </button>
        </div>
      )}
    </div>
  );
}
