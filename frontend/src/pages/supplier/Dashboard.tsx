import React from 'react';

export const SupplierDashboard: React.FC = () => {
  return (
    <div className="supplier-dashboard fade-in">
      <h2 className="section-title">Supplier Warehouse</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Track B2B material fabric roll orders, yarn shipments, and inventory levels.
      </p>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>All yarn supplies and textile stock metrics are up to date. No pending B2B shipment approvals.</p>
      </div>
    </div>
  );
};
export default SupplierDashboard;
