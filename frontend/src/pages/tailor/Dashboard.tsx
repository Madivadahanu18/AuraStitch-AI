import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const TailorDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="tailor-dashboard-container fade-in">
      <h2 className="section-title">Boutique Tailor Dashboard</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Welcome back, {user?.name}. Manage your custom stitching orders, customer body profiles, and boutique portfolio.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Pending Orders</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>5</p>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Active Stitching</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-teal)' }}>3</p>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Stitched Ready</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#E65C00' }}>12</p>
        </div>
      </div>

      <h3 style={{ marginBottom: '20px' }}>Active Sizing Profiles</h3>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No active sizing calculations found. Customer measurements sync automatically on booking orders.</p>
      </div>
    </div>
  );
};
export default TailorDashboard;
