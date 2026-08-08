import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import local supplier images
import beads1Img from './images/Beads1.jpg';
import beads2Img from './images/Beads2.jpg';
import lays1Img from './images/Lays1.jpg';
import machinary1Img from './images/Machinary1.jpg';
import machinary2Img from './images/Machinary2.jpg';
import threads1Img from './images/Threads1.jpg';

const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export interface InventoryItem {
  id: string;
  productName: string;
  category: 'Textile Materials' | 'Handloom Materials';
  availableQuantity: number;
  reservedQuantity: number;
  minimumStock: number;
  unit: 'kg' | 'meter' | 'piece' | 'roll' | 'packet';
  lastUpdated: string;
  image: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const initialInventory: InventoryItem[] = [
  {
    id: 'inv-101',
    productName: 'Designer Glass & Pearl Beads Pack',
    category: 'Textile Materials',
    availableQuantity: 120,
    reservedQuantity: 15,
    minimumStock: 20,
    unit: 'packet',
    lastUpdated: '07 Aug 2026',
    image: getImageSrc(beads1Img),
    status: 'In Stock'
  },
  {
    id: 'inv-102',
    productName: 'Royal Embroidered Border Laces & Trims',
    category: 'Textile Materials',
    availableQuantity: 85,
    reservedQuantity: 10,
    minimumStock: 15,
    unit: 'roll',
    lastUpdated: '06 Aug 2026',
    image: getImageSrc(lays1Img),
    status: 'In Stock'
  },
  {
    id: 'inv-103',
    productName: 'Multicolor Craft Beads & Embellishments',
    category: 'Textile Materials',
    availableQuantity: 5,
    reservedQuantity: 2,
    minimumStock: 15,
    unit: 'packet',
    lastUpdated: '07 Aug 2026',
    image: getImageSrc(beads2Img),
    status: 'Low Stock'
  },
  {
    id: 'inv-104',
    productName: 'Premium High-Count 80s Cotton Yarn',
    category: 'Handloom Materials',
    availableQuantity: 200,
    reservedQuantity: 35,
    minimumStock: 30,
    unit: 'kg',
    lastUpdated: '05 Aug 2026',
    image: getImageSrc(threads1Img),
    status: 'In Stock'
  },
  {
    id: 'inv-105',
    productName: 'Heavy-Duty Handloom Shuttle Assembly',
    category: 'Handloom Materials',
    availableQuantity: 8,
    reservedQuantity: 4,
    minimumStock: 10,
    unit: 'piece',
    lastUpdated: '04 Aug 2026',
    image: getImageSrc(machinary1Img),
    status: 'Low Stock'
  },
  {
    id: 'inv-106',
    productName: 'Industrial Loom Machinery Spare Parts',
    category: 'Handloom Materials',
    availableQuantity: 0,
    reservedQuantity: 0,
    minimumStock: 10,
    unit: 'piece',
    lastUpdated: '07 Aug 2026',
    image: getImageSrc(machinary2Img),
    status: 'Out of Stock'
  }
];

export const SupplierInventory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContextType | null>();

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (outletContext?.showToast) {
      outletContext.showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals state
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [updatingItem, setUpdatingItem] = useState<InventoryItem | null>(null);
  const [restockingItem, setRestockingItem] = useState<InventoryItem | null>(null);

  // Form states
  const [updateFormData, setUpdateFormData] = useState({
    availableQuantity: 0,
    reservedQuantity: 0,
    minimumStock: 0
  });

  const [restockAmount, setRestockAmount] = useState<number>(50);

  // Computed Statistics
  const totalInventoryUnits = useMemo(() => {
    return inventory.reduce((sum, item) => sum + item.availableQuantity, 0);
  }, [inventory]);

  const lowStockCount = useMemo(() => {
    return inventory.filter(item => item.status === 'Low Stock').length;
  }, [inventory]);

  const outOfStockCount = useMemo(() => {
    return inventory.filter(item => item.status === 'Out of Stock').length;
  }, [inventory]);

  // Filtered Rows
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = !searchQuery ||
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inventory, searchQuery, statusFilter]);

  // Actions
  const handleOpenUpdateModal = (item: InventoryItem) => {
    setUpdatingItem(item);
    setUpdateFormData({
      availableQuantity: item.availableQuantity,
      reservedQuantity: item.reservedQuantity,
      minimumStock: item.minimumStock
    });
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingItem) return;

    const newAvailable = Number(updateFormData.availableQuantity);
    const newReserved = Number(updateFormData.reservedQuantity);
    const newMin = Number(updateFormData.minimumStock);

    let newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (newAvailable === 0) {
      newStatus = 'Out of Stock';
    } else if (newAvailable <= newMin) {
      newStatus = 'Low Stock';
    }

    setInventory(prev => prev.map(item => {
      if (item.id === updatingItem.id) {
        return {
          ...item,
          availableQuantity: newAvailable,
          reservedQuantity: newReserved,
          minimumStock: newMin,
          status: newStatus,
          lastUpdated: 'Today'
        };
      }
      return item;
    }));

    showToast(`Updated stock levels for "${updatingItem.productName}"`, 'success');
    setUpdatingItem(null);
  };

  const handleOpenRestockModal = (item: InventoryItem) => {
    setRestockingItem(item);
    setRestockAmount(50);
  };

  const handleSaveRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockingItem) return;

    const amountToAdd = Number(restockAmount);
    if (amountToAdd <= 0) {
      showToast('Please enter a valid restock quantity', 'error');
      return;
    }

    setInventory(prev => prev.map(item => {
      if (item.id === restockingItem.id) {
        const updatedQty = item.availableQuantity + amountToAdd;
        let newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (updatedQty <= item.minimumStock) {
          newStatus = 'Low Stock';
        }
        return {
          ...item,
          availableQuantity: updatedQty,
          status: newStatus,
          lastUpdated: 'Today'
        };
      }
      return item;
    }));

    showToast(`Successfully added +${amountToAdd} units to "${restockingItem.productName}"!`, 'success');
    setRestockingItem(null);
  };

  return (
    <div className="supplier-inventory-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .supplier-inventory-container {
          color: var(--text-primary);
        }

        .inv-header-banner {
          margin-bottom: 28px;
        }

        .inv-main-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }

        .inv-sub-text {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Top Stats Row */
        .inv-top-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .inv-stat-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 22px;
          box-shadow: var(--shadow-sm);
        }

        .inv-stat-title {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .inv-stat-num {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
        }

        /* Search & Filter Bar */
        .inv-controls-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
          display: flex;
          gap: 16px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .inv-search-input {
          flex: 1;
          min-width: 260px;
          padding: 12px 20px;
          border-radius: 25px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
        }

        .inv-search-input:focus {
          border-color: var(--accent-gold);
        }

        .inv-filter-select {
          padding: 10px 16px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        /* Inventory Table */
        .table-responsive-box {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow-x: auto;
          box-shadow: var(--shadow-sm);
        }

        .inventory-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }

        .inventory-table th {
          background: var(--bg-primary);
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
          padding: 16px 18px;
          border-bottom: 1px solid var(--border-color);
          white-space: nowrap;
        }

        .inventory-table td {
          padding: 16px 18px;
          border-bottom: 1px solid var(--border-color);
          vertical-align: middle;
          color: var(--text-primary);
        }

        .inventory-table tr:last-child td {
          border-bottom: none;
        }

        .inventory-table tr:hover td {
          background: rgba(212, 175, 55, 0.03);
        }

        .table-prod-box {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .table-prod-img {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
          background-color: #111115;
          flex-shrink: 0;
          border: 1px solid var(--border-color);
        }

        .table-prod-name {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 14px;
        }

        .table-status-pill {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .table-status-pill.In-Stock {
          background: rgba(42, 157, 143, 0.2);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
        }

        .table-status-pill.Low-Stock {
          background: rgba(244, 162, 97, 0.2);
          border: 1px solid #f4a261;
          color: #f4a261;
        }

        .table-status-pill.Out-of-Stock {
          background: rgba(230, 57, 70, 0.2);
          border: 1px solid #e63946;
          color: #e63946;
        }

        .table-actions-cell {
          display: flex;
          gap: 6px;
          white-space: nowrap;
        }

        /* Modal Overlay */
        .modal-overlay-backdrop {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .modal-card-box {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          max-width: 500px;
          width: 100%;
          padding: 24px;
          box-shadow: var(--shadow-md);
        }

        .form-group-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .form-group-field label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .form-input-control {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
        }

        .form-input-control:focus {
          border-color: var(--accent-gold);
        }
      `}</style>

      {/* Header Banner */}
      <div className="inv-header-banner">
        <h1 className="inv-main-title">Supplier Inventory Control</h1>
        <p className="inv-sub-text">
          Monitor raw material stock levels, manage reserved quantities, reorder thresholds, and quick restock items.
        </p>
      </div>

      {/* Top Statistics Section */}
      <div className="inv-top-stats">
        <div className="inv-stat-card">
          <div className="inv-stat-title">Total Inventory Units</div>
          <div className="inv-stat-num" style={{ color: 'var(--accent-gold)' }}>
            {totalInventoryUnits}
          </div>
        </div>

        <div className="inv-stat-card">
          <div className="inv-stat-title">Low Stock Count</div>
          <div className="inv-stat-num" style={{ color: '#f4a261' }}>
            {lowStockCount}
          </div>
        </div>

        <div className="inv-stat-card">
          <div className="inv-stat-title">Out of Stock Count</div>
          <div className="inv-stat-num" style={{ color: '#e63946' }}>
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Search & Controls Bar */}
      <div className="inv-controls-panel">
        <input
          type="text"
          className="inv-search-input"
          placeholder="Search inventory by product name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="inv-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Stock Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="table-responsive-box">
        {filteredInventory.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No inventory items found matching your current search or status filter.
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Available Qty</th>
                <th>Reserved Qty</th>
                <th>Min Stock</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="table-prod-box" style={{ cursor: 'pointer' }} onClick={() => navigate('/product-details', { state: { product: { name: item.productName, category: item.category, availability: item.status, image: item.image, price: '₹450 / pack' } } })}>
                      <img src={item.image} alt={item.productName} className="table-prod-img" />
                      <span className="table-prod-name">{item.productName}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{item.category}</span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '14px', color: item.availableQuantity <= item.minimumStock ? '#e63946' : 'var(--text-primary)' }}>
                      {item.availableQuantity}
                    </strong>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.reservedQuantity}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)' }}>{item.minimumStock}</span>
                  </td>
                  <td>
                    <span>{item.unit}</span>
                  </td>
                  <td>
                    <span className={`table-status-pill ${item.status.replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.lastUpdated}</span>
                  </td>
                  <td>
                    <div className="table-actions-cell" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleOpenUpdateModal(item)}>
                        Update Stock
                      </button>
                      <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleOpenRestockModal(item)}>
                        Restock
                      </button>
                      <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => navigate('/product-details', { state: { product: { name: item.productName, category: item.category, availability: item.status, image: item.image, price: '₹450 / pack' } } })}>
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Details Modal */}
      {viewingItem && (
        <div className="modal-overlay-backdrop" onClick={() => setViewingItem(null)}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px' }}>Inventory Item Details</h3>
              <button onClick={() => setViewingItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <img src={viewingItem.image} alt={viewingItem.productName} style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{viewingItem.productName}</h4>
                <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 700 }}>{viewingItem.category}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Available Quantity</span>
                <strong style={{ display: 'block', fontSize: '18px', color: 'var(--text-primary)' }}>{viewingItem.availableQuantity} {viewingItem.unit}s</strong>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reserved Quantity</span>
                <strong style={{ display: 'block', fontSize: '18px', color: '#f4a261' }}>{viewingItem.reservedQuantity} {viewingItem.unit}s</strong>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Minimum Stock Level</span>
                <strong style={{ display: 'block', fontSize: '16px' }}>{viewingItem.minimumStock} {viewingItem.unit}s</strong>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status</span>
                <strong style={{ display: 'block', fontSize: '15px', color: viewingItem.status === 'In Stock' ? '#2a9d8f' : '#e63946' }}>{viewingItem.status}</strong>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', padding: '10px' }} onClick={() => setViewingItem(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {updatingItem && (
        <div className="modal-overlay-backdrop" onClick={() => setUpdatingItem(null)}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px' }}>Update Stock - {updatingItem.productName}</h3>
              <button onClick={() => setUpdatingItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveUpdate}>
              <div className="form-group-field">
                <label>Available Quantity ({updatingItem.unit}s)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input-control"
                  required
                  value={updateFormData.availableQuantity}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, availableQuantity: Number(e.target.value) }))}
                />
              </div>

              <div className="form-group-field">
                <label>Reserved Quantity ({updatingItem.unit}s)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input-control"
                  required
                  value={updateFormData.reservedQuantity}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, reservedQuantity: Number(e.target.value) }))}
                />
              </div>

              <div className="form-group-field">
                <label>Minimum Stock Threshold ({updatingItem.unit}s)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input-control"
                  required
                  value={updateFormData.minimumStock}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, minimumStock: Number(e.target.value) }))}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => setUpdatingItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  Save Stock Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockingItem && (
        <div className="modal-overlay-backdrop" onClick={() => setRestockingItem(null)}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px' }}>Restock Inventory</h3>
              <button onClick={() => setRestockingItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Add new inventory stock for <strong>{restockingItem.productName}</strong>. Current available quantity is <strong>{restockingItem.availableQuantity} {restockingItem.unit}s</strong>.
            </p>

            <form onSubmit={handleSaveRestock}>
              <div className="form-group-field">
                <label>Add Restock Quantity ({restockingItem.unit}s)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input-control"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => setRestockingItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierInventory;
