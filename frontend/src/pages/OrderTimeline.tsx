import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';

// Relative image import from local customer images folder
import kanchipuramSareeImg from './customer/images/kanchipuramsaree.jpg';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface TimelineStage {
  label: string;
  completed: boolean;
}

interface SingleOrder {
  orderId: string;
  productName: string;
  orderedDate: string;
  estimatedDelivery: string;
  image: string;
  stages: TimelineStage[];
}

// Helper to ensure Vite resolves imported local image assets into URL strings
const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

const singleMockOrder: SingleOrder = {
  orderId: 'AUR-2026-8891',
  productName: 'Kanchipuram Brocade Silk Saree',
  orderedDate: '18 Jul 2026',
  estimatedDelivery: '28 Jul 2026',
  image: getImageSrc(kanchipuramSareeImg),
  stages: [
    { label: 'Order Confirmed', completed: true },
    { label: 'Weaver Accepted', completed: true },
    { label: 'Production Started', completed: true },
    { label: 'Tailoring', completed: true },
    { label: 'Shipped', completed: false },
    { label: 'Delivered', completed: false }
  ]
};

export const OrderTimeline: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  return (
    <div className="order-timeline-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .ot-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 24px;
          color: var(--text-primary);
        }

        .ot-card {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }

        /* Order Header Row */
        .ot-header-row {
          display: flex;
          gap: 20px;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .ot-img {
          width: 90px;
          height: 90px;
          border-radius: 12px;
          object-fit: cover;
          background: #111;
          border: 1px solid var(--border-color);
        }

        .ot-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ot-prod-name {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .ot-meta-info {
          font-size: 13px;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-top: 4px;
        }

        /* Timeline List */
        .ot-timeline-section {
          margin-bottom: 28px;
        }

        .ot-timeline-heading {
          font-size: 15px;
          font-weight: 800;
          margin: 0 0 16px;
          color: var(--text-primary);
        }

        .ot-timeline-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding-left: 8px;
        }

        .ot-stage-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 700;
        }

        .ot-icon-completed {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #2a9d8f;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .ot-icon-pending {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .ot-text-completed {
          color: var(--text-primary);
        }

        .ot-text-pending {
          color: var(--text-muted);
        }

        /* Buttons Footer */
        .ot-buttons-row {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px dashed var(--border-color);
        }

        .btn-ot-track {
          flex: 1;
          padding: 12px;
          font-size: 14px;
          font-weight: 800;
          border-radius: 8px;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #000;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .btn-ot-track:hover {
          transform: translateY(-2px);
        }

        .btn-ot-contact {
          flex: 1;
          padding: 12px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          text-align: center;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s ease;
        }

        .btn-ot-contact:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        @media (max-width: 600px) {
          .ot-buttons-row { flex-direction: column; }
        }
      `}</style>

      <h1 className="ot-title">Order Timeline</h1>

      <div className="ot-card">
        {/* Header Details */}
        <div className="ot-header-row">
          <img src={singleMockOrder.image} alt={singleMockOrder.productName} className="ot-img" />

          <div className="ot-details">
            <h2 className="ot-prod-name">{singleMockOrder.productName}</h2>
            <div className="ot-meta-info">
              <span>Order ID: <strong>{singleMockOrder.orderId}</strong></span>
              <span>Order Date: <strong>{singleMockOrder.orderedDate}</strong></span>
              <span>Estimated Delivery: <strong>{singleMockOrder.expectedDelivery}</strong></span>
            </div>
          </div>
        </div>

        {/* Order Status Timeline (6 Stages) */}
        <div className="ot-timeline-section">
          <h3 className="ot-timeline-heading">Order Status Timeline</h3>
          <div className="ot-timeline-list">
            {singleMockOrder.stages.map((stage, idx) => (
              <div key={idx} className="ot-stage-item">
                {stage.completed ? (
                  <div className="ot-icon-completed">✓</div>
                ) : (
                  <div className="ot-icon-pending">○</div>
                )}
                <span className={stage.completed ? 'ot-text-completed' : 'ot-text-pending'}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ot-buttons-row">
          <button className="btn-ot-track" onClick={() => showToast(`Tracking Order #${singleMockOrder.orderId}: Current status is Tailoring`, 'info')}>
            📍 Track Order
          </button>
          <Link to="/messages" className="btn-ot-contact">
            💬 Contact Weaver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
