import React, { useState } from 'react';

export const AIHandloomStudio: React.FC = () => {
  const [motif, setMotif] = useState('peacock');
  const [borderSize, setBorderSize] = useState('medium');
  const [color, setColor] = useState('#386A63');

  return (
    <div className="handloom-studio fade-in">
      <h2 className="section-title">AI Weaver Motif Designer</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Create custom pattern sheets, motif matrices, and organic dye palettes for digital loom mappings.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '340px' }}>
          <div style={{ width: '220px', height: '220px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF9F6', position: 'relative', overflow: 'hidden', borderRadius: 'var(--border-radius-md)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: borderSize === 'small' ? '20px' : borderSize === 'medium' ? '40px' : '60px', backgroundColor: color, opacity: 0.85 }}></div>
            <div style={{ fontSize: '72px', color: '#1A1A1A', marginTop: borderSize === 'small' ? '20px' : '40px' }}>
              {motif === 'peacock' ? '🦚' : motif === 'lotus' ? '🪷' : '🏛️'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', position: 'absolute', bottom: 10 }}>Motif Render Grid</div>
          </div>
          <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => alert("Pattern exported to Loom Controller API!")}>Export Pattern to Loom</button>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Design Controls</h3>
          
          <div className="form-group">
            <label className="form-label">Traditional Motif</label>
            <select className="form-input" value={motif} onChange={(e) => setMotif(e.target.value)} style={{ appearance: 'auto' }}>
              <option value="peacock">Peacock (Mayuri)</option>
              <option value="lotus">Lotus (Kamal)</option>
              <option value="temple">Temple (Gopuram)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Border Width</label>
            <select className="form-input" value={borderSize} onChange={(e) => setBorderSize(e.target.value)} style={{ appearance: 'auto' }}>
              <option value="small">Narrow (2 inches)</option>
              <option value="medium">Standard (4 inches)</option>
              <option value="large">Broad (6 inches)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Natural Dye Shade</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {['#386A63', '#B85A38', '#C5A059', '#19233C', '#E65C00'].map((c) => (
                <div 
                  key={c} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: c, border: color === c ? '3px solid white' : '1px solid var(--border-color)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIHandloomStudio;
