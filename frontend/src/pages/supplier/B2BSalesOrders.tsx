import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
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

export interface B2BOrder {
  id: string;
  buyerName: string;
  businessType: 'Handloom Weaver' | 'Tailor' | 'Boutique' | 'Fashion Brand';
  productName: string;
  productImage: string;
  quantity: string;
  orderValue: number;
  orderDate: string;
  deliveryDate: string;
  status: 'New Order' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered';
  shippingAddress: string;
  paymentStatus: 'Paid' | 'Pending Invoice' | 'Advance Paid';
}

const initialB2BOrders: B2BOrder[] = [
  {
    id: 'b2b-901',
    buyerName: 'Coimbatore Silk Weavers Co-Op',
    businessType: 'Handloom Weaver',
    productName: 'Premium High-Count 80s Cotton & Silk Yarn',
    productImage: getImageSrc(threads1Img),
    quantity: '150 kg',
    orderValue: 187500,
    orderDate: '06 Aug 2026',
    deliveryDate: '14 Aug 2026',
    status: 'New Order',
    shippingAddress: '12 Loom Workers Lane, Coimbatore, TN',
    paymentStatus: 'Advance Paid'
  },
  {
    id: 'b2b-902',
    buyerName: 'Priya Custom Tailoring & Embroidery Studio',
    businessType: 'Tailor',
    productName: 'Designer Glass & Pearl Beads Pack',
    productImage: getImageSrc(beads1Img),
    quantity: '40 packets',
    orderValue: 18000,
    orderDate: '05 Aug 2026',
    deliveryDate: '10 Aug 2026',
    status: 'Processing',
    shippingAddress: '45 Fashion Street, Jubilee Hills, Hyderabad',
    paymentStatus: 'Paid'
  },
  {
    id: 'b2b-903',
    buyerName: 'Varanasi Royal Zari Boutique',
    businessType: 'Boutique',
    productName: 'Royal Embroidered Border Laces & Trims',
    productImage: getImageSrc(lays1Img),
    quantity: '25 rolls',
    orderValue: 17000,
    orderDate: '04 Aug 2026',
    deliveryDate: '09 Aug 2026',
    status: 'Packed',
    shippingAddress: '88 Heritage Bazaar Road, Varanasi, UP',
    paymentStatus: 'Paid'
  },
  {
    id: 'b2b-904',
    buyerName: 'Aura Couture & Heritage Fashion House',
    businessType: 'Fashion Brand',
    productName: 'Heavy-Duty Handloom Shuttle Assembly',
    productImage: getImageSrc(machinary1Img),
    quantity: '12 pieces',
    orderValue: 22200,
    orderDate: '02 Aug 2026',
    deliveryDate: '08 Aug 2026',
    status: 'Shipped',
    shippingAddress: 'Unit 4B Industrial Park, Surat, Gujarat',
    paymentStatus: 'Paid'
  },
  {
    id: 'b2b-905',
    buyerName: 'Salem Artisan Weavers Guild',
    businessType: 'Handloom Weaver',
    productName: 'Multicolor Craft Beads & Embellishments',
    productImage: getImageSrc(beads2Img),
    quantity: '30 packets',
    orderValue: 15600,
    orderDate: '01 Aug 2026',
    deliveryDate: '06 Aug 2026',
    status: 'Delivered',
    shippingAddress: '7 Loom Cluster Complex, Salem, TN',
    paymentStatus: 'Paid'
  }
];

interface TopSellingProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  unitsSold: string;
  revenue: number;
  ordersCount: number;
}

const mockTopSellingProducts: TopSellingProduct[] = [
  {
    id: 'top-1',
    name: 'Premium High-Count 80s Cotton & Silk Yarn',
    category: 'Handloom Materials',
    image: getImageSrc(threads1Img),
    unitsSold: '1,450 kg',
    revenue: 1812500,
    ordersCount: 42
  },
  {
    id: 'top-2',
    name: 'Designer Glass & Pearl Beads Pack',
    category: 'Textile Materials',
    image: getImageSrc(beads1Img),
    unitsSold: '920 packets',
    revenue: 414000,
    ordersCount: 38
  },
  {
    id: 'top-3',
    name: 'Royal Embroidered Border Laces & Trims',
    category: 'Textile Materials',
    image: getImageSrc(lays1Img),
    revenue: 326400,
    unitsSold: '480 rolls',
    ordersCount: 29
  },
  {
    id: 'top-4',
    name: 'Heavy-Duty Handloom Shuttle Assembly',
    category: 'Handloom Materials',
    image: getImageSrc(machinary1Img),
    unitsSold: '185 pieces',
    revenue: 342250,
    ordersCount: 21
  }
];

export const SupplierB2BSalesOrders: React.FC = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContextType | null>();

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (outletContext?.showToast) {
      outletContext.showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const [orders, setOrders] = useState<B2BOrder[]>(initialB2BOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [businessFilter, setBusinessFilter] = useState<string>('All');

  // Modals state
  const [viewingOrder, setViewingOrder] = useState<B2BOrder | null>(null);
  const [contactingOrder, setContactingOrder] = useState<B2BOrder | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = useMemo(() => {
    return orders.filter(o => o.status === 'New Order' || o.status === 'Processing' || o.status === 'Packed').length;
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter(o => o.status === 'Shipped' || o.status === 'Delivered').length;
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = !searchQuery ||
        o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      const matchesBusiness = businessFilter === 'All' || o.businessType === businessFilter;

      return matchesSearch && matchesStatus && matchesBusiness;
    });
  }, [orders, searchQuery, statusFilter, businessFilter]);

  // Actions
  const handleAcceptOrder = (orderId: string, buyerName: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Processing' };
      }
      return o;
    }));
    showToast(`Accepted wholesale order from ${buyerName}!`, 'success');
  };

  const handleRejectOrder = (orderId: string, buyerName: string) => {
    if (window.confirm(`Are you sure you want to reject the order from "${buyerName}"?`)) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      showToast(`Rejected order from ${buyerName}`, 'warning');
    }
  };

  const handleSendContactMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactingOrder || !contactMessage.trim()) return;

    showToast(`Message sent to ${contactingOrder.buyerName}!`, 'success');
    setContactingOrder(null);
    setContactMessage('');
  };

  return (
    <div className="b2b-sales-orders-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .b2b-sales-orders-container {
          color: var(--text-primary);
        }

        .b2b-header-banner {
          margin-bottom: 28px;
        }

        .b2b-main-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }

        .b2b-sub-text {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Top Stats Row */
        .b2b-top-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .b2b-stat-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 22px;
          box-shadow: var(--shadow-sm);
        }

        .b2b-stat-title {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .b2b-stat-num {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
        }

        /* Most Sold Products Section */
        .most-sold-section {
          margin-bottom: 40px;
        }

        .section-heading-title {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 20px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-heading-title::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 22px;
          background: var(--accent-gold);
          border-radius: 4px;
        }

        .most-sold-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .most-sold-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          padding: 16px;
          display: flex;
          gap: 16px;
          align-items: center;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .most-sold-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .most-sold-img-box {
          width: 80px;
          height: 80px;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          flex-shrink: 0;
          background-color: #111115;
          position: relative;
        }

        .most-sold-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .most-sold-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .most-sold-name {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .most-sold-cat {
          font-size: 11px;
          color: var(--accent-gold);
          font-weight: 700;
          text-transform: uppercase;
        }

        .most-sold-stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-top: 4px;
        }

        /* Controls & Filter Panel */
        .b2b-controls-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-sm);
          display: flex;
          gap: 16px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .b2b-search-input {
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

        .b2b-search-input:focus {
          border-color: var(--accent-gold);
        }

        .b2b-select-dropdown {
          padding: 10px 16px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        /* Orders Grid */
        .b2b-orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .b2b-order-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .b2b-order-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .card-top-bar {
          padding: 16px 20px;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .buyer-type-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid var(--accent-gold);
          padding: 3px 10px;
          border-radius: 12px;
          text-transform: uppercase;
        }

        .order-status-pill {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }

        .order-status-pill.New-Order {
          background: rgba(244, 162, 97, 0.2);
          border: 1px solid #f4a261;
          color: #f4a261;
        }

        .order-status-pill.Processing {
          background: rgba(234, 179, 8, 0.2);
          border: 1px solid #eab308;
          color: #eab308;
        }

        .order-status-pill.Packed {
          background: rgba(168, 85, 247, 0.2);
          border: 1px solid #a855f7;
          color: #a855f7;
        }

        .order-status-pill.Shipped {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid #3b82f6;
          color: #3b82f6;
        }

        .order-status-pill.Delivered {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid #22c55e;
          color: #22c55e;
        }

        .card-body-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
        }

        .buyer-name-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .product-meta-flex {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--bg-primary);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .prod-thumb-img {
          width: 55px;
          height: 55px;
          border-radius: 6px;
          object-fit: cover;
          background-color: #111115;
          flex-shrink: 0;
        }

        .prod-info-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .prod-name {
          font-weight: 700;
          font-size: 14px;
          color: var(--text-primary);
        }

        .prod-qty {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .order-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          font-size: 13px;
        }

        .detail-label {
          color: var(--text-muted);
          font-size: 11px;
          display: block;
        }

        .detail-value {
          font-weight: 700;
          color: var(--text-primary);
        }

        .card-actions-grid {
          padding: 16px 20px;
          background: var(--bg-primary);
          border-top: 1px solid var(--border-color);
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-top: auto;
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
          max-width: 540px;
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
      <div className="b2b-header-banner">
        <h1 className="b2b-main-title">B2B Wholesale Sales Orders</h1>
        <p className="b2b-sub-text">
          Manage raw material procurement purchase orders from handloom weavers, custom tailors, boutiques, and fashion brands.
        </p>
      </div>

      {/* Top Statistics Section */}
      <div className="b2b-top-stats">
        <div className="b2b-stat-card">
          <div className="b2b-stat-title">Total Orders</div>
          <div className="b2b-stat-num" style={{ color: 'var(--accent-gold)' }}>
            {totalOrders}
          </div>
        </div>

        <div className="b2b-stat-card">
          <div className="b2b-stat-title">Pending Orders</div>
          <div className="b2b-stat-num" style={{ color: '#f4a261' }}>
            {pendingOrders}
          </div>
        </div>

        <div className="b2b-stat-card">
          <div className="b2b-stat-title">Completed Orders</div>
          <div className="b2b-stat-num" style={{ color: '#22c55e' }}>
            {completedOrders}
          </div>
        </div>
      </div>

      {/* Most Sold Products Section */}
      <div className="most-sold-section">
        <h2 className="section-heading-title">🔥 Most Sold Raw Materials (B2B Demand)</h2>
        <div className="most-sold-grid">
          {mockTopSellingProducts.map(prod => (
            <div key={prod.id} className="most-sold-card">
              <div className="most-sold-img-box">
                <img src={prod.image} alt={prod.name} className="most-sold-img" />
              </div>
              <div className="most-sold-info">
                <span className="most-sold-cat">{prod.category}</span>
                <h4 className="most-sold-name">{prod.name}</h4>
                <div className="most-sold-stat-row">
                  <span>📦 <strong>{prod.unitsSold}</strong> sold</span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>₹{prod.revenue.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Total Orders: <strong>{prod.ordersCount} B2B Purchases</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Panel */}
      <div className="b2b-controls-panel">
        <input
          type="text"
          className="b2b-search-input"
          placeholder="Search by buyer name, product, or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="b2b-select-dropdown"
          value={businessFilter}
          onChange={(e) => setBusinessFilter(e.target.value)}
        >
          <option value="All">All Business Types</option>
          <option value="Handloom Weaver">Handloom Weaver</option>
          <option value="Tailor">Tailor</option>
          <option value="Boutique">Boutique</option>
          <option value="Fashion Brand">Fashion Brand</option>
        </select>

        <select
          className="b2b-select-dropdown"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="New Order">New Order</option>
          <option value="Processing">Processing</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* B2B Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '50px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No wholesale sales orders match your current search or filter criteria.
        </div>
      ) : (
        <div className="b2b-orders-grid">
          {filteredOrders.map(order => (
            <div key={order.id} className="b2b-order-card">
              <div className="card-top-bar">
                <span className="buyer-type-badge">{order.businessType}</span>
                <span className={`order-status-pill ${order.status.replace(/\s+/g, '-')}`}>
                  {order.status}
                </span>
              </div>

              <div className="card-body-content">
                <h3 className="buyer-name-title">{order.buyerName}</h3>

                <div className="product-meta-flex">
                  <img src={order.productImage} alt={order.productName} className="prod-thumb-img" />
                  <div className="prod-info-text">
                    <span className="prod-name">{order.productName}</span>
                    <span className="prod-qty">📦 Qty: <strong>{order.quantity}</strong></span>
                  </div>
                </div>

                <div className="order-details-grid">
                  <div>
                    <span className="detail-label">Order Value</span>
                    <span className="detail-value" style={{ color: 'var(--accent-gold)', fontSize: '15px' }}>
                      ₹{order.orderValue.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="detail-label">Payment</span>
                    <span className="detail-value">{order.paymentStatus}</span>
                  </div>
                  <div>
                    <span className="detail-label">Order Date</span>
                    <span className="detail-value">{order.orderDate}</span>
                  </div>
                  <div>
                    <span className="detail-label">Delivery Date</span>
                    <span className="detail-value">{order.deliveryDate}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions-grid">
                <button
                  className="btn-secondary"
                  style={{ padding: '8px', fontSize: '12px' }}
                  onClick={() => setViewingOrder(order)}
                >
                  View Order
                </button>

                <button
                  className="btn-secondary"
                  style={{ padding: '8px', fontSize: '12px' }}
                  onClick={() => setContactingOrder(order)}
                >
                  Contact Buyer
                </button>

                {order.status === 'New Order' ? (
                  <>
                    <button
                      className="btn-primary"
                      style={{ padding: '8px', fontSize: '12px' }}
                      onClick={() => handleAcceptOrder(order.id, order.buyerName)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '8px', fontSize: '12px', color: '#e63946', borderColor: '#e63946' }}
                      onClick={() => handleRejectOrder(order.id, order.buyerName)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-primary"
                    style={{ gridColumn: 'span 2', padding: '8px', fontSize: '12px' }}
                    onClick={() => setViewingOrder(order)}
                  >
                    Manage Order Status
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Order Modal */}
      {viewingOrder && (
        <div className="modal-overlay-backdrop" onClick={() => setViewingOrder(null)}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px' }}>
                B2B Invoice - #{viewingOrder.id}
              </h3>
              <button onClick={() => setViewingOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                {viewingOrder.businessType}
              </div>
              <h4 style={{ margin: '4px 0 8px 0', fontSize: '18px' }}>{viewingOrder.buyerName}</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                📍 {viewingOrder.shippingAddress}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <img src={viewingOrder.productImage} alt={viewingOrder.productName} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>{viewingOrder.productName}</strong>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Quantity: {viewingOrder.quantity}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Wholesale Value</span>
                <strong style={{ display: 'block', fontSize: '18px', color: 'var(--accent-gold)' }}>₹{viewingOrder.orderValue.toLocaleString()}</strong>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Payment Status</span>
                <strong style={{ display: 'block', fontSize: '15px' }}>{viewingOrder.paymentStatus}</strong>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Order Date</span>
                <strong style={{ display: 'block', fontSize: '14px' }}>{viewingOrder.orderDate}</strong>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Delivery Date</span>
                <strong style={{ display: 'block', fontSize: '14px' }}>{viewingOrder.deliveryDate}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => setViewingOrder(null)}>
                Close
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '10px' }}
                onClick={() => {
                  setViewingOrder(null);
                  showToast(`Printed B2B shipping invoice for ${viewingOrder.buyerName}`, 'info');
                }}
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Buyer Modal */}
      {contactingOrder && (
        <div className="modal-overlay-backdrop" onClick={() => setContactingOrder(null)}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px' }}>
                Contact Buyer - {contactingOrder.buyerName}
              </h3>
              <button onClick={() => setContactingOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSendContactMessage}>
              <div className="form-group-field">
                <label>Direct Message / Delivery Dispatch Update</label>
                <textarea
                  className="form-input-control"
                  rows={4}
                  required
                  placeholder={`Write a message to ${contactingOrder.buyerName} regarding order #${contactingOrder.id}...`}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => setContactingOrder(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierB2BSalesOrders;
