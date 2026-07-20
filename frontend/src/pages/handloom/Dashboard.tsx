import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const HandloomDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="handloom-dashboard-container fade-in">
      <h2 className="section-title">Artisan Weaver Workspace</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Welcome back, {user?.name}. Check loom progress indicators, custom pattern designs, and B2B requests.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Active Looms</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>2</p>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Custom Borders Orders</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-teal)' }}>4</p>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Yarn Stocks Reels</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#E65C00' }}>32 kg</p>
        </div>
      </div>

      <h3 style={{ marginBottom: '20px' }}>Current Weave Setup</h3>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Pochampally Double-Ikat Silk Saree weave has progressed to 65% of the total warp sheets.</p>
      </div>
    </div>
  );
};
export default HandloomDashboard;
