import React, { useState } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';

// Relative image imports from local customer images folder
import kanchipuramSareeImg from './customer/images/kanchipuramsaree.jpg';
import pochampallyDressImg from './customer/images/pochampallydress.jpg';
import mangalagiriDressImg from './customer/images/Mangalagiridress.jpg';
import dupattaImg from './customer/images/duppatta.jpg';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export type OrderStage =
  | 'Order Placed'
  | 'Tailor Accepted'
  | 'Fabric Cutting'
  | 'Stitching'
  | 'Quality Check'
  | 'Packed'
  | 'Shipped'
  | 'Out For Delivery'
  | 'Delivered';

export const STAGES_LIST: OrderStage[] = [
  'Order Placed',
  'Tailor Accepted',
  'Fabric Cutting',
  'Stitching',
  'Quality Check',
  'Packed',
  'Shipped',
  'Out For Delivery',
  'Delivered',
];

export interface CustomerOrder {
  orderId: string;
  productName: string;
  weaverName: string;
  orderedDate: string;
  expectedDeliveryDate: string;
  orderStatus: OrderStage;
  image: string;
  deliveryAddress: string;
  paymentStatus: string;
  courierPartner: string;
  trackingNumber: string;
  tailorName?: string;
  price?: string;
}

const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

const initialSampleOrders: CustomerOrder[] = [
  {
    orderId: 'AUR-2026-8891',
    productName: 'Kanchipuram Brocade Silk Saree',
    weaverName: 'Master Weaver K. Ramanathan (Kanchi Handlooms)',
    tailorName: 'StitchCraft Studio (Master Tailor Ramesh)',
    orderedDate: '28 Jul 2026',
    expectedDeliveryDate: '12 Aug 2026',
    orderStatus: 'Stitching',
    image: getImageSrc(kanchipuramSareeImg),
    deliveryAddress: 'Flat 402, Royal Palms, T. Nagar, Chennai, Tamil Nadu - 600017',
    paymentStatus: 'Paid (₹14,500 via UPI)',
    courierPartner: 'BlueDart Express',
    trackingNumber: 'BD-88910245',
    price: '₹14,500',
  },
  {
    orderId: 'AUR-2026-9042',
    productName: 'Pochampally Ikat Anarkali Suit',
    weaverName: 'Kiran Handloom Weavers Collective',
    tailorName: 'Artisan Fit Boutique (Tailor Anita)',
    orderedDate: '02 Aug 2026',
    expectedDeliveryDate: '15 Aug 2026',
    orderStatus: 'Fabric Cutting',
    image: getImageSrc(pochampallyDressImg),
    deliveryAddress: 'Villa 18, Green Meadows, Jubilee Hills, Hyderabad - 500033',
    paymentStatus: 'Paid (₹3,850 via Credit Card)',
    courierPartner: 'Delhivery Express',
    trackingNumber: 'DEL-77291038',
    price: '₹3,850',
  },
  {
    orderId: 'AUR-2026-7612',
    productName: 'Handloom Cotton Mangalagiri Suit Set',
    weaverName: 'Mangalagiri Artisan Co-op',
    tailorName: 'Heritage Tailors (Master Priya)',
    orderedDate: '15 Jul 2026',
    expectedDeliveryDate: '25 Jul 2026',
    orderStatus: 'Delivered',
    image: getImageSrc(mangalagiriDressImg),
    deliveryAddress: 'Flat 402, Royal Palms, T. Nagar, Chennai, Tamil Nadu - 600017',
    paymentStatus: 'Paid (₹2,200 via Net Banking)',
    courierPartner: 'DTDC Express',
    trackingNumber: 'DTDC-99201847',
    price: '₹2,200',
  },
  {
    orderId: 'AUR-2026-9210',
    productName: 'Royal Handloom Fine Cotton Dupatta',
    weaverName: 'Bengal Artisan Forum',
    tailorName: 'Royal Stitches',
    orderedDate: '05 Aug 2026',
    expectedDeliveryDate: '18 Aug 2026',
    orderStatus: 'Packed',
    image: getImageSrc(dupattaImg),
    deliveryAddress: 'Flat 402, Royal Palms, T. Nagar, Chennai, Tamil Nadu - 600017',
    paymentStatus: 'Paid (₹1,250 via GPay)',
    courierPartner: 'Express Cargo',
    trackingNumber: 'EXP-440912',
    price: '₹1,250',
  },
];

export const OrderTimeline: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<CustomerOrder[]>(initialSampleOrders);
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [selectedOrderModal, setSelectedOrderModal] = useState<{ type: 'view' | 'track'; order: CustomerOrder } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const activeOrders = orders.filter((o) => o.orderStatus !== 'Delivered');
  const displayedOrders = filter === 'active' ? activeOrders : orders;

  const handleClearOrders = () => {
    setOrders([]);
    showToast('Orders cleared for demonstration', 'info');
  };

  const handleRestoreOrders = () => {
    setOrders(initialSampleOrders);
    showToast('Sample orders restored', 'success');
  };

  return (
    <div className="order-timeline-page fade-in" style={{ padding: '24px', paddingBottom: '100px', maxWidth: '1050px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .ot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .ot-title-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ot-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ot-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .ot-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ot-tab-btn {
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ot-tab-btn.active {
          background: var(--accent-gold);
          color: #000;
          border-color: var(--accent-gold);
          font-weight: 800;
        }

        .ot-demo-btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px dashed var(--border-color);
          background: transparent;
          color: var(--text-muted);
          font-size: 12px;
          cursor: pointer;
        }

        .ot-demo-btn:hover {
          color: var(--accent-gold);
          border-color: var(--accent-gold);
        }

        /* Order Cards List */
        .ot-cards-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .ot-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 25px rgba(212, 163, 115, 0.08);
          transition: all 0.35s ease;
        }

        .ot-card:hover {
          border-color: #D4A373;
          box-shadow: 0 14px 35px rgba(212, 163, 115, 0.18);
          transform: translateY(-4px);
        }

        /* Top Order Info Row */
        .ot-top-info {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .ot-prod-img {
          width: 110px;
          height: 110px;
          border-radius: 14px;
          object-fit: cover;
          border: 1px solid var(--border-color);
          background: #111;
          flex-shrink: 0;
        }

        .ot-prod-details {
          flex: 1;
          min-width: 240px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ot-prod-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .ot-weaver-tag {
          font-size: 13px;
          color: #D4A373;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ot-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 8px;
          margin-top: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .ot-status-pill {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          align-self: flex-start;
          background: rgba(212, 163, 115, 0.18);
          color: #B88555;
          border: 1px solid #D4A373;
        }

        .ot-status-pill.delivered {
          background: rgba(46, 139, 87, 0.15);
          color: #2E8B57;
          border-color: #2E8B57;
        }

        /* Progress Tracker Flow */
        .ot-tracker-section {
          margin-bottom: 24px;
          padding: 20px;
          background: var(--bg-tertiary);
          border-radius: 16px;
          border: 1px solid var(--border-color);
        }

        .ot-tracker-title {
          font-size: 14px;
          font-weight: 800;
          margin: 0 0 16px;
          color: var(--text-primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ot-tracker-steps {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          overflow-x: auto;
          padding: 10px 0 16px;
          gap: 12px;
        }

        .ot-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-width: 85px;
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .ot-step-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .ot-step-item.completed .ot-step-icon {
          background: #2a9d8f;
          color: #fff;
          box-shadow: 0 0 8px rgba(42, 157, 143, 0.4);
        }

        .ot-step-item.current .ot-step-icon {
          background: var(--accent-gold);
          color: #000;
          font-size: 14px;
          box-shadow: 0 0 12px rgba(212, 160, 23, 0.7);
          transform: scale(1.15);
          animation: pulseGlow 2s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(212, 160, 23, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(212, 160, 23, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 160, 23, 0); }
        }

        .ot-step-item.pending .ot-step-icon {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
        }

        .ot-step-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          line-height: 1.3;
        }

        .ot-step-item.completed .ot-step-label {
          color: var(--text-primary);
        }

        .ot-step-item.current .ot-step-label {
          color: var(--accent-gold);
          font-weight: 800;
        }

        /* Additional Information Section */
        .ot-extra-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          background: var(--bg-tertiary);
          padding: 16px;
          border-radius: var(--border-radius-md);
          margin-bottom: 20px;
          border: 1px solid var(--border-color);
        }

        .ot-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ot-info-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          font-weight: 700;
        }

        .ot-info-val {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          word-break: break-word;
        }

        /* Action Buttons Row */
        .ot-actions-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-ot-action {
          flex: 1;
          min-width: 140px;
          padding: 11px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn-ot-view {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .btn-ot-view:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-ot-track {
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          border: none;
          color: #000;
          font-weight: 800;
        }

        .btn-ot-track:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3);
        }

        .btn-ot-contact {
          background: rgba(42, 157, 143, 0.1);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
        }

        .btn-ot-contact:hover {
          background: #2a9d8f;
          color: #ffffff;
        }

        /* Empty State */
        .ot-empty-box {
          background: var(--bg-secondary);
          border: 1px dashed var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 60px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
        }

        .ot-empty-icon {
          font-size: 54px;
          line-height: 1;
        }

        .ot-empty-msg {
          font-size: 22px;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-primary);
          margin: 0;
        }

        .ot-empty-sub {
          font-size: 14px;
          color: var(--text-secondary);
          max-width: 400px;
          margin: 0 0 8px;
        }

        .btn-start-shopping {
          padding: 12px 28px;
          border-radius: 24px;
          font-size: 15px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #000;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-start-shopping:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(212, 160, 23, 0.4);
        }

        /* Modal styling */
        .ot-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .ot-modal-content {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          max-width: 520px;
          width: 100%;
          padding: 28px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
      `}</style>

      {/* Page Header */}
      <div className="ot-header">
        <div className="ot-title-box">
          <h1 className="ot-title">
            <span>📦</span> Order Timeline
          </h1>
          <span className="ot-subtitle">Track live handloom crafting, tailoring & shipment updates</span>
        </div>

        <div className="ot-controls">
          <button
            className={`ot-tab-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            className={`ot-tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders ({orders.length})
          </button>

          {orders.length > 0 ? (
            <button className="ot-demo-btn" onClick={handleClearOrders} title="Simulate empty state">
              Clear (Empty State)
            </button>
          ) : (
            <button className="ot-demo-btn" onClick={handleRestoreOrders} title="Restore sample orders">
              Restore Orders
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {displayedOrders.length === 0 ? (
        /* Empty State */
        <div className="ot-empty-box fade-in">
          <div className="ot-empty-icon">🛍️</div>
          <h2 className="ot-empty-msg">You have no active orders.</h2>
          <p className="ot-empty-sub">Explore handloom sarees, dress materials, and custom artisan clothing crafted specially for you.</p>
          <button className="btn-start-shopping" onClick={() => navigate('/customer')}>
            <span>✨</span> Start Shopping
          </button>
        </div>
      ) : (
        /* Orders List */
        <div className="ot-cards-list">
          {displayedOrders.map((order) => {
            const currentStageIndex = STAGES_LIST.indexOf(order.orderStatus);

            return (
              <div key={order.orderId} className="ot-card fade-in">
                {/* Top Section */}
                <div className="ot-top-info">
                  <img src={order.image} alt={order.productName} className="ot-prod-img" />

                  <div className="ot-prod-details">
                    <h2 className="ot-prod-title">{order.productName}</h2>
                    <div className="ot-weaver-tag">
                      <span>🧵 Weaver:</span> {order.weaverName}
                    </div>

                    <div className="ot-meta-grid">
                      <div>Order ID: <strong>{order.orderId}</strong></div>
                      <div>Ordered Date: <strong>{order.orderedDate}</strong></div>
                      <div>Expected Delivery: <strong>{order.expectedDeliveryDate}</strong></div>
                    </div>
                  </div>

                  <div className={`ot-status-pill ${order.orderStatus === 'Delivered' ? 'delivered' : ''}`}>
                    {order.orderStatus}
                  </div>
                </div>

                {/* Progress Tracker Pipeline (9 Stages) */}
                <div className="ot-tracker-section">
                  <div className="ot-tracker-title">
                    <span>Crafting & Fulfillment Pipeline</span>
                    <span style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>
                      Stage {currentStageIndex + 1} of {STAGES_LIST.length}: {order.orderStatus}
                    </span>
                  </div>

                  <div className="ot-tracker-steps">
                    {STAGES_LIST.map((stage, idx) => {
                      let state: 'completed' | 'current' | 'pending' = 'pending';
                      if (idx < currentStageIndex) state = 'completed';
                      else if (idx === currentStageIndex) state = 'current';

                      return (
                        <div key={stage} className={`ot-step-item ${state}`}>
                          <div className="ot-step-icon">
                            {state === 'completed' && '✓'}
                            {state === 'current' && '⚡'}
                            {state === 'pending' && idx + 1}
                          </div>
                          <span className="ot-step-label">{stage}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Information Grid */}
                <div className="ot-extra-info">
                  <div className="ot-info-item">
                    <span className="ot-info-label">📍 Delivery Address</span>
                    <span className="ot-info-val">{order.deliveryAddress}</span>
                  </div>

                  <div className="ot-info-item">
                    <span className="ot-info-label">💳 Payment Status</span>
                    <span className="ot-info-val">{order.paymentStatus}</span>
                  </div>

                  <div className="ot-info-item">
                    <span className="ot-info-label">🚚 Courier Partner</span>
                    <span className="ot-info-val">{order.courierPartner}</span>
                  </div>

                  <div className="ot-info-item">
                    <span className="ot-info-label">🏷️ Tracking Number</span>
                    <span className="ot-info-val" style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                      {order.trackingNumber}
                    </span>
                  </div>
                </div>

                {/* Required Buttons */}
                <div className="ot-actions-row">
                  <button className="btn-ot-action btn-ot-view" onClick={() => setSelectedOrderModal({ type: 'view', order })}>
                    👁️ View Order
                  </button>
                  <button className="btn-ot-action btn-ot-track" onClick={() => setSelectedOrderModal({ type: 'track', order })}>
                    📍 Track Shipment
                  </button>
                  <Link to="/messages" className="btn-ot-action btn-ot-contact">
                    💬 Contact Tailor
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals for View Order & Track Shipment */}
      {selectedOrderModal && (
        <div className="ot-modal-overlay fade-in" onClick={() => setSelectedOrderModal(null)}>
          <div className="ot-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>
                {selectedOrderModal.type === 'view' ? '📋 Order Details' : '🚚 Live Shipment Tracking'}
              </h3>
              <button
                onClick={() => setSelectedOrderModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {selectedOrderModal.type === 'view' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img src={selectedOrderModal.order.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{selectedOrderModal.order.productName}</h4>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>ID: {selectedOrderModal.order.orderId}</span>
                  </div>
                </div>
                <hr style={{ borderColor: 'var(--border-color)', margin: '4px 0' }} />
                <div><strong>Weaver:</strong> {selectedOrderModal.order.weaverName}</div>
                {selectedOrderModal.order.tailorName && <div><strong>Tailor Studio:</strong> {selectedOrderModal.order.tailorName}</div>}
                <div><strong>Ordered Date:</strong> {selectedOrderModal.order.orderedDate}</div>
                <div><strong>Estimated Delivery:</strong> {selectedOrderModal.order.expectedDeliveryDate}</div>
                <div><strong>Payment:</strong> {selectedOrderModal.order.paymentStatus}</div>
                <div><strong>Delivery Address:</strong> {selectedOrderModal.order.deliveryAddress}</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
                  <div>Partner: <strong>{selectedOrderModal.order.courierPartner}</strong></div>
                  <div>Tracking #: <strong>{selectedOrderModal.order.trackingNumber}</strong></div>
                  <div>Status: <strong style={{ color: 'var(--accent-gold)' }}>{selectedOrderModal.order.orderStatus}</strong></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '8px', borderLeft: '2px solid var(--accent-gold)' }}>
                  <div style={{ fontSize: '13px' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Package In Transit</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Location: Hub Facility, Chennai • 2 hrs ago</div>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Dispatched from Artisan Studio</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quality check passed • Yesterday</div>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Order Confirmed & Processed</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedOrderModal.order.orderedDate}</div>
                  </div>
                </div>
              </div>
            )}

            <button
              className="btn-ot-action btn-ot-track"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={() => setSelectedOrderModal(null)}
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;

