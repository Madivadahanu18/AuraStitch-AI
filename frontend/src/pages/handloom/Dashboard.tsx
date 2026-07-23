import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import existing handloom images from relative handloomimages folder
import cottonSareesImg from './handloomimages/cottonsarees.jpg';
import dhotiImg from './handloomimages/dhoti.jpg';
import mangalagiriDressImg from './handloomimages/Mangalagiridress.jpg';
import pattuSareeImg from './handloomimages/pattusaree.jpg';
import pochampallyImg from './handloomimages/pochampally.jpg';

// Helper to ensure Vite resolves imported local image assets into URL strings
const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface HandloomProduct {
  id: string;
  name: string;
  handloomType: string;
  state: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  soldCount: number;
  availableStock: number;
  status: 'Available' | 'Selling Fast' | 'Low Stock';
  image: string;
}

const mockHandloomProducts: HandloomProduct[] = [
  {
    id: 'hp-1',
    name: 'Pochampally Ikat Saree',
    handloomType: 'Pochampally Ikat',
    state: 'Telangana',
    price: 4850,
    originalPrice: 5600,
    discount: 13,
    rating: 4.8,
    reviewsCount: 324,
    soldCount: 1250,
    availableStock: 45,
    status: 'Available',
    image: getImageSrc(pochampallyImg)
  },
  {
    id: 'hp-2',
    name: 'Kanchipuram Pattu Saree',
    handloomType: 'Kanchipuram Silk',
    state: 'Tamil Nadu',
    price: 12450,
    originalPrice: 14800,
    discount: 16,
    rating: 4.9,
    reviewsCount: 512,
    soldCount: 1890,
    availableStock: 18,
    status: 'Selling Fast',
    image: getImageSrc(pattuSareeImg)
  },
  {
    id: 'hp-3',
    name: 'Premium Cotton Saree',
    handloomType: 'Pure Handwoven Cotton',
    state: 'West Bengal',
    price: 2250,
    originalPrice: 2800,
    discount: 20,
    rating: 4.7,
    reviewsCount: 218,
    soldCount: 940,
    availableStock: 8,
    status: 'Low Stock',
    image: getImageSrc(cottonSareesImg)
  },
  {
    id: 'hp-4',
    name: 'Mangalagiri Dress Material',
    handloomType: 'Mangalagiri Nizam Border',
    state: 'Andhra Pradesh',
    price: 1850,
    originalPrice: 2300,
    discount: 19,
    rating: 4.8,
    reviewsCount: 176,
    soldCount: 820,
    availableStock: 32,
    status: 'Available',
    image: getImageSrc(mangalagiriDressImg)
  },
  {
    id: 'hp-5',
    name: 'Handwoven Cotton Dhoti',
    handloomType: 'Traditional Handloom Cotton',
    state: 'Kerala',
    price: 1450,
    originalPrice: 1800,
    discount: 19,
    rating: 4.6,
    reviewsCount: 145,
    soldCount: 680,
    availableStock: 50,
    status: 'Available',
    image: getImageSrc(dhotiImg)
  }
];

export const HandloomDashboard: React.FC = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContextType | null>();

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (outletContext?.showToast) {
      outletContext.showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const [products, setProducts] = useState<HandloomProduct[]>(mockHandloomProducts);
  const [editingProduct, setEditingProduct] = useState<HandloomProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<HandloomProduct | null>(null);

  // Edit form state
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<'Available' | 'Selling Fast' | 'Low Stock'>('Available');

  const openEditModal = (product: HandloomProduct) => {
    setEditingProduct(product);
    setEditPrice(product.price);
    setEditStock(product.availableStock);
    setEditStatus(product.status);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;

    setProducts(prev => prev.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          price: editPrice,
          availableStock: editStock,
          status: editStatus
        };
      }
      return p;
    }));

    showToast(`Updated details for "${editingProduct.name}"!`, "success");
    setEditingProduct(null);
  };

  const handleRestock = (productName: string) => {
    showToast(`Restock order request dispatched for ${productName}!`, "info");
  };

  return (
    <div className="handloom-dashboard-container fade-in" style={{ paddingBottom: '80px', color: 'var(--text-primary)' }}>
      <style>{`
        .handloom-dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header-block {
          margin-bottom: 24px;
        }

        .dashboard-main-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .dashboard-sub-text {
          color: var(--text-secondary);
          font-size: 14px;
        }

        /* Summary Cards */
        .summary-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .summary-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease;
        }

        .summary-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent-gold);
        }

        .summary-card-title {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
          margin-bottom: 8px;
        }

        .summary-card-value {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
        }

        /* Section Titles */
        .section-heading {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 20px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-heading::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 22px;
          background: var(--accent-gold);
          border-radius: 4px;
        }

        /* Products Grid */
        .handloom-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 55px;
        }

        .artisan-prod-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .artisan-prod-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .artisan-img-box {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background-color: #111115;
        }

        .artisan-prod-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .artisan-prod-card:hover .artisan-prod-img {
          transform: scale(1.05);
        }

        .status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          backdrop-filter: blur(4px);
        }

        .status-badge.Available {
          background: rgba(42, 157, 143, 0.2);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
        }

        .status-badge.Selling-Fast {
          background: rgba(244, 162, 97, 0.2);
          border: 1px solid #f4a261;
          color: #f4a261;
        }

        .status-badge.Low-Stock {
          background: rgba(230, 57, 70, 0.2);
          border: 1px solid #e63946;
          color: #e63946;
        }

        .state-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(10, 15, 25, 0.85);
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }

        .artisan-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .artisan-type {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .artisan-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .metrics-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px dashed var(--border-color);
        }

        .rating-box {
          color: #ffb703;
          font-weight: 700;
        }

        .price-stock-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 16px;
        }

        .price-block {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .price-current {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .price-original {
          font-size: 13px;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .discount-pill {
          background: rgba(230, 57, 70, 0.15);
          color: #e63946;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .stock-info {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .artisan-card-btns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: auto;
        }

        /* Best Selling Horizontal Scroll */
        .best-selling-track {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 16px;
          margin-bottom: 55px;
          scrollbar-width: thin;
        }

        .best-selling-card {
          min-width: 220px;
          max-width: 220px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }

        .best-selling-img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .best-selling-body {
          padding: 14px;
        }

        /* Inventory Alerts Grid */
        .alerts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .alert-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: var(--shadow-sm);
          position: relative;
        }

        .alert-card.warning {
          border-left: 4px solid #e63946;
        }

        .alert-card.fast {
          border-left: 4px solid #f4a261;
        }

        .alert-card.restock {
          border-left: 4px solid var(--accent-gold);
        }

        .alert-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .alert-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .alert-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
      `}</style>

      {/* Header Block */}
      <div className="dashboard-header-block">
        <h2 className="dashboard-main-title">Artisan Weaver Workspace</h2>
        <p className="dashboard-sub-text">
          Welcome back, {user?.name || 'Master Weaver'}. Manage your authentic handloom product catalog, track stock, and review inventory alerts.
        </p>
      </div>

      {/* Summary Cards (Preserved) */}
      <div className="summary-cards-grid">
        <div className="summary-card">
          <div className="summary-card-title">Active Pit Looms</div>
          <div className="summary-card-value" style={{ color: 'var(--accent-gold)' }}>2</div>
        </div>

        <div className="summary-card">
          <div className="summary-card-title">Custom Borders Orders</div>
          <div className="summary-card-value" style={{ color: 'var(--accent-teal)' }}>4</div>
        </div>

        <div className="summary-card">
          <div className="summary-card-title">Yarn Stocks Reels</div>
          <div className="summary-card-value" style={{ color: '#E65C00' }}>32 kg</div>
        </div>

        <div className="summary-card">
          <div className="summary-card-title">Total Products Woven</div>
          <div className="summary-card-value" style={{ color: '#2a9d8f' }}>{products.length}</div>
        </div>
      </div>

      {/* Current Weave Setup Card */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '45px', borderLeft: '4px solid var(--accent-gold)' }}>
        <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700 }}>Current Weave Setup</h4>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>
          Pochampally Double-Ikat Silk Saree weave has progressed to <strong>65%</strong> of the total warp sheets.
        </p>
      </div>

      {/* SECTION 1: My Handloom Products */}
      <div style={{ marginBottom: '55px' }}>
        <h3 className="section-heading">My Handloom Products</h3>

        <div className="handloom-products-grid">
          {products.map(product => (
            <div key={product.id} className="artisan-prod-card">
              <div className="artisan-img-box">
                <img src={getImageSrc(product.image)} alt={product.name} className="artisan-prod-img" />
                <span className="state-tag">📍 {product.state}</span>
                <span className={`status-badge ${product.status.replace(/\s+/g, '-')}`}>
                  {product.status}
                </span>
              </div>

              <div className="artisan-body">
                <div className="artisan-type">{product.handloomType}</div>
                <h4 className="artisan-title">{product.name}</h4>

                <div className="metrics-row">
                  <span className="rating-box">
                    ⭐ {product.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>({product.reviewsCount} Reviews)</span>
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {product.soldCount.toLocaleString()} Sold
                  </span>
                </div>

                <div className="price-stock-row">
                  <div>
                    <div className="price-block">
                      <span className="price-current">₹{product.price.toLocaleString()}</span>
                      <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                      <span className="discount-pill">{product.discount}% OFF</span>
                    </div>
                  </div>
                  <div className="stock-info">
                    Stock: <strong style={{ color: product.availableStock <= 10 ? '#e63946' : 'var(--text-primary)' }}>{product.availableStock}</strong>
                  </div>
                </div>

                <div className="artisan-card-btns">
                  <button className="btn-secondary" style={{ padding: '8px', fontSize: '12px' }} onClick={() => openEditModal(product)}>
                    ✏️ Edit Product
                  </button>
                  <button className="btn-primary" style={{ padding: '8px', fontSize: '12px' }} onClick={() => setViewingProduct(product)}>
                    👁️ View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Best Selling Products (Horizontal Scroll) */}
      <div style={{ marginBottom: '55px' }}>
        <h3 className="section-heading">Best Selling Products</h3>

        <div className="best-selling-track">
          {[...products]
            .sort((a, b) => b.soldCount - a.soldCount)
            .map(item => (
              <div key={item.id} className="best-selling-card">
                <img src={getImageSrc(item.image)} alt={item.name} className="best-selling-img" />
                <div className="best-selling-body">
                  <h5 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h5>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{item.price.toLocaleString()}</span>
                    <span style={{ color: '#ffb703', fontWeight: 700 }}>⭐ {item.rating}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    🔥 <strong>{item.soldCount.toLocaleString()}</strong> Sold
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* SECTION 3: Inventory Alerts */}
      <div style={{ marginBottom: '40px' }}>
        <h3 className="section-heading">Inventory Alerts</h3>

        <div className="alerts-grid">
          <div className="alert-card warning">
            <div className="alert-header">
              <div className="alert-title">
                ⚠️ Cotton Sarees Running Low
              </div>
              <span className="badge" style={{ background: 'rgba(230, 57, 70, 0.15)', color: '#e63946' }}>8 Units Left</span>
            </div>
            <p className="alert-desc">
              Stock for <strong>Premium Cotton Saree</strong> is down to 8 units. High customer demand this week. Restock recommended.
            </p>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', width: 'fit-content', borderColor: '#e63946', color: '#e63946' }} onClick={() => handleRestock('Premium Cotton Saree')}>
              Restock Now
            </button>
          </div>

          <div className="alert-card fast">
            <div className="alert-header">
              <div className="alert-title">
                🔥 Pochampally Collection Selling Fast
              </div>
              <span className="badge" style={{ background: 'rgba(244, 162, 97, 0.15)', color: '#f4a261' }}>1,250 Sold</span>
            </div>
            <p className="alert-desc">
              <strong>Pochampally Ikat Saree</strong> sales surged by 24% this week. 45 units remaining in active weaver inventory.
            </p>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', width: 'fit-content', borderColor: '#f4a261', color: '#f4a261' }} onClick={() => handleRestock('Pochampally Ikat Saree')}>
              Allocate Loom
            </button>
          </div>

          <div className="alert-card restock">
            <div className="alert-header">
              <div className="alert-title">
                🧵 Restock Silk Sarees
              </div>
              <span className="badge" style={{ background: 'rgba(197, 160, 89, 0.15)', color: 'var(--accent-gold)' }}>18 Units Left</span>
            </div>
            <p className="alert-desc">
              <strong>Kanchipuram Pattu Saree</strong> stock down to 18 units. Order tested zari yarn replenishment from suppliers.
            </p>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', width: 'fit-content', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }} onClick={() => handleRestock('Kanchipuram Pattu Saree')}>
              Order Raw Materials
            </button>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '440px', padding: '28px', border: '1px solid var(--accent-gold)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', fontSize: '20px', fontFamily: 'var(--font-heading)' }}>
              Edit Handloom Product
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Updating inventory details for <strong>{editingProduct.name}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Price (₹)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={editPrice}
                  onChange={e => setEditPrice(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Available Stock Units</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={editStock}
                  onChange={e => setEditStock(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Product Status</label>
                <select 
                  className="form-input"
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as any)}
                  style={{ width: '100%' }}
                >
                  <option value="Available">Available</option>
                  <option value="Selling Fast">Selling Fast</option>
                  <option value="Low Stock">Low Stock</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditingProduct(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Details Modal */}
      {viewingProduct && (
        <div className="modal-overlay" onClick={() => setViewingProduct(null)}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '480px', padding: '24px', border: '1px solid var(--border-color)' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={getImageSrc(viewingProduct.image)} alt={viewingProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>{viewingProduct.handloomType} • 📍 {viewingProduct.state}</span>
            <h3 style={{ margin: '4px 0 12px', fontSize: '20px', fontFamily: 'var(--font-heading)' }}>{viewingProduct.name}</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
              <div>Selling Price: <strong>₹{viewingProduct.price.toLocaleString()}</strong></div>
              <div>Original Price: <strong>₹{viewingProduct.originalPrice.toLocaleString()}</strong></div>
              <div>Rating: <strong>⭐ {viewingProduct.rating} ({viewingProduct.reviewsCount})</strong></div>
              <div>Total Sold: <strong>{viewingProduct.soldCount.toLocaleString()}</strong></div>
              <div>Stock Available: <strong>{viewingProduct.availableStock} Units</strong></div>
              <div>Status: <strong>{viewingProduct.status}</strong></div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setViewingProduct(null)}>Close Details</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandloomDashboard;
