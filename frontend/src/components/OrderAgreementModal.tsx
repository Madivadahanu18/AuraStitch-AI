import React, { useState, useEffect } from 'react';

export interface OrderAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  orderTitle?: string;
  orderPrice?: number | string;
  itemCount?: number;
  roleType?: 'customer' | 'tailor' | 'weaver' | 'supplier';
}

export const OrderAgreementModal: React.FC<OrderAgreementModalProps> = ({
  isOpen,
  onClose,
  onNext,
  orderTitle,
  orderPrice,
  itemCount
}) => {
  const [agreed, setAgreed] = useState(false);

  // Reset agreement checkbox whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setAgreed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNextClick = () => {
    if (agreed) {
      onNext();
    }
  };

  const formattedPrice = typeof orderPrice === 'number'
    ? `₹${orderPrice.toLocaleString()}`
    : (orderPrice || '');

  return (
    <div
      className="order-agreement-backdrop fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <style>{`
        .order-agreement-dialog {
          background: var(--bg-secondary, #141721);
          border: 1px solid var(--accent-gold, #c5a059);
          border-radius: var(--border-radius-lg, 16px);
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(197, 160, 89, 0.15);
          overflow: hidden;
          color: var(--text-primary, #ffffff);
          animation: agreementPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes agreementPop {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .agreement-header {
          padding: 22px 26px 18px;
          border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: linear-gradient(180deg, rgba(197, 160, 89, 0.08) 0%, transparent 100%);
        }

        .agreement-title {
          font-family: var(--font-heading, 'Playfair Display', serif);
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 4px;
          color: var(--text-primary, #ffffff);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .agreement-subtitle {
          font-size: 13px;
          color: var(--text-secondary, #a0aec0);
          margin: 0;
        }

        .agreement-close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary, #a0aec0);
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }

        .agreement-close-btn:hover {
          color: var(--accent-gold, #c5a059);
          background: rgba(255, 255, 255, 0.05);
        }

        .agreement-content-body {
          padding: 22px 26px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Order quick info bar */
        .agreement-order-bar {
          background: var(--bg-tertiary, #1c202e);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 10px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .agreement-terms-box {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 12px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          max-height: 360px;
          overflow-y: auto;
        }

        .term-section {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .term-icon-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(197, 160, 89, 0.12);
          border: 1px solid var(--accent-gold, #c5a059);
          color: var(--accent-gold, #c5a059);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .term-text-wrap {
          flex: 1;
        }

        .term-heading {
          font-family: var(--font-heading, 'Playfair Display', serif);
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary, #ffffff);
          margin: 0 0 4px;
        }

        .term-desc {
          font-size: 12.5px;
          color: var(--text-secondary, #b4bece);
          line-height: 1.55;
          margin: 0;
        }

        /* Checkbox acceptance row */
        .agreement-checkbox-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(197, 160, 89, 0.07);
          border: 1px solid rgba(197, 160, 89, 0.25);
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          user-select: none;
        }

        .agreement-checkbox-row:hover {
          background: rgba(197, 160, 89, 0.12);
          border-color: var(--accent-gold, #c5a059);
        }

        .agreement-checkbox-input {
          width: 19px;
          height: 19px;
          accent-color: var(--accent-gold, #c5a059);
          cursor: pointer;
          flex-shrink: 0;
        }

        .agreement-checkbox-label {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary, #ffffff);
          cursor: pointer;
          line-height: 1.4;
        }

        /* Footer buttons */
        .agreement-footer {
          padding: 16px 26px;
          border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 14px;
          background: var(--bg-secondary, #141721);
        }

        .btn-agreement-cancel {
          padding: 11px 22px;
          border-radius: 30px;
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
          background: transparent;
          color: var(--text-secondary, #a0aec0);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-agreement-cancel:hover {
          color: var(--text-primary, #ffffff);
          border-color: var(--text-secondary, #a0aec0);
          background: rgba(255, 255, 255, 0.05);
        }

        .btn-agreement-next {
          padding: 11px 32px;
          border-radius: 30px;
          border: none;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.3px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
        }

        .btn-agreement-next.enabled {
          background: linear-gradient(135deg, var(--accent-gold, #c5a059) 0%, #b38627 100%);
          color: #0b0d13;
          box-shadow: 0 4px 16px rgba(197, 160, 89, 0.35);
        }

        .btn-agreement-next.enabled:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(197, 160, 89, 0.5);
        }

        .btn-agreement-next.disabled {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.35);
          cursor: not-allowed;
          box-shadow: none;
          pointer-events: none;
        }

        @media (max-width: 600px) {
          .agreement-header, .agreement-content-body, .agreement-footer {
            padding: 16px;
          }
          .agreement-title {
            font-size: 19px;
          }
          .agreement-terms-box {
            max-height: 280px;
            padding: 12px;
          }
          .agreement-footer {
            flex-direction: row;
            justify-content: space-between;
          }
          .btn-agreement-cancel, .btn-agreement-next {
            flex: 1;
            text-align: center;
            justify-content: center;
            padding: 12px 16px;
          }
        }
      `}</style>

      <div
        className="order-agreement-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agreement-dialog-title"
      >
        {/* HEADER */}
        <div className="agreement-header">
          <div>
            <h2 id="agreement-dialog-title" className="agreement-title">
              <span>📜</span> Order Agreement & Terms
            </h2>
            <p className="agreement-subtitle">
              Please review the AuraStitch transaction terms before confirming your order.
            </p>
          </div>
          <button
            className="agreement-close-btn"
            onClick={onClose}
            aria-label="Close Agreement Modal"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="agreement-content-body">
          {/* Order Details Quick Pill */}
          {(orderTitle || formattedPrice || itemCount) && (
            <div className="agreement-order-bar">
              <div>
                {orderTitle && <strong>{orderTitle}</strong>}
                {itemCount && !orderTitle && <strong>{itemCount} item{itemCount !== 1 ? 's' : ''} in cart</strong>}
              </div>
              {formattedPrice && (
                <div style={{ color: 'var(--accent-gold, #c5a059)', fontWeight: 800 }}>
                  Order Total: {formattedPrice}
                </div>
              )}
            </div>
          )}

          {/* 5 Clear Agreement Clauses */}
          <div className="agreement-terms-box">
            {/* Clause 1: Order Confirmation */}
            <div className="term-section">
              <div className="term-icon-circle">📋</div>
              <div className="term-text-wrap">
                <h4 className="term-heading">1. Order Confirmation</h4>
                <p className="term-desc">
                  Placing this order confirms your purchase of authentic handcrafted handloom textiles,
                  custom-tailored garments, or raw materials. Garment sizing, fabric weave selections,
                  and submitted bespoke measurements are verified upon confirmation. A unique AuraStitch
                  tracking ID and digital invoice will be generated.
                </p>
              </div>
            </div>

            {/* Clause 2: Payment */}
            <div className="term-section">
              <div className="term-icon-circle">💳</div>
              <div className="term-text-wrap">
                <h4 className="term-heading">2. Payment & Escrow Protection</h4>
                <p className="term-desc">
                  All transaction values are inclusive of statutory GST and artisan facilitation fees.
                  Your payment is secured through the AuraStitch platform escrow and is disbursed to master
                  weavers, tailors, or suppliers based on verified order production milestones and successful delivery.
                </p>
              </div>
            </div>

            {/* Clause 3: Cancellation & Returns */}
            <div className="term-section">
              <div className="term-icon-circle">🔄</div>
              <div className="term-text-wrap">
                <h4 className="term-heading">3. Cancellation & Returns</h4>
                <p className="term-desc">
                  Standard handloom and material orders may be cancelled within 24 hours of placement for a full refund,
                  and are covered by a 7-day return policy for unused, intact items. For custom-tailored bespoke items,
                  cancellation is permitted prior to fabric cutting; fitting adjustments and alterations are guaranteed
                  should sizing deviate from submitted specifications.
                </p>
              </div>
            </div>

            {/* Clause 4: Delivery */}
            <div className="term-section">
              <div className="term-icon-circle">🚚</div>
              <div className="term-text-wrap">
                <h4 className="term-heading">4. Delivery Timelines & Transit</h4>
                <p className="term-desc">
                  Standard in-stock deliveries arrive within 3–5 business days. Artisan weaves and custom-stitched
                  couture are delivered within 7–12 business days. Real-time stage tracking (Weaving, Cutting, Stitching,
                  Dispatched) is accessible via your Orders Timeline. Packages are tamper-sealed and transit-insured.
                </p>
              </div>
            </div>

            {/* Clause 5: Customer & Seller Responsibilities */}
            <div className="term-section">
              <div className="term-icon-circle">🤝</div>
              <div className="term-text-wrap">
                <h4 className="term-heading">5. Customer & Seller Responsibilities</h4>
                <p className="term-desc">
                  <strong>Customer:</strong> Providing accurate delivery address, phone number, and precise sizing measurements.
                  Promptly inspecting the parcel upon delivery.<br />
                  <strong>Seller / Artisan:</strong> Handcrafting products strictly complying with certified purity standards
                  (Silk Mark / Handloom Mark), adhering to promised delivery schedules, and maintaining authentic craftsmanship.
                </p>
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <label className="agreement-checkbox-row" htmlFor="order-agreement-checkbox">
            <input
              type="checkbox"
              id="order-agreement-checkbox"
              className="agreement-checkbox-input"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="agreement-checkbox-label">
              I have read and agree to the terms and conditions.
            </span>
          </label>
        </div>

        {/* FOOTER */}
        <div className="agreement-footer">
          <button
            type="button"
            className="btn-agreement-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn-agreement-next ${agreed ? 'enabled' : 'disabled'}`}
            disabled={!agreed}
            onClick={handleNextClick}
            id="agreement-next-btn"
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderAgreementModal;
