import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard fade-in">
      <h2 className="section-title">Enterprise System Admin Console</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Approve professional artisan / tailor verification requests and monitor SaaS health metrics.
      </p>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>All system resources are healthy. No pending partner document reviews.</p>
      </div>
    </div>
  );
};
export default AdminDashboard;
