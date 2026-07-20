import React from 'react';
import { Link } from 'react-router-dom';

export const PendingVerificationPage: React.FC = () => {
  return (
    <div className="verification-container">
      <style>{`
        .verification-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, var(--bg-primary), var(--bg-tertiary));
        }
        
        .verification-card {
          width: 90%;
          max-width: 500px;
          padding: 40px;
          text-align: center;
          border-radius: var(--border-radius-lg);
        }
        
        .status-badge {
          display: inline-block;
          margin-bottom: 24px;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          background-color: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold-dark);
          border: 1px solid rgba(197, 160, 89, 0.3);
        }
      `}</style>
      
      <div className="verification-card glass-panel fade-in slide-up">
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛡️</div>
        <div className="status-badge">Verification Pending</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', marginBottom: '14px' }}>
          We are verifying your business documents
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '30px' }}>
          Thank you for registering as a professional partner with AuraStitch AI. Our team is currently reviewing yourTrade License / Artisan ID upload. This process usually takes 24 to 48 hours.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '240px', margin: '0 auto' }}>
          <Link to="/login" className="btn-primary">Return to Login</Link>
          <Link to="/" className="btn-secondary" style={{ border: 'none' }}>Go to Homepage</Link>
        </div>
      </div>
    </div>
  );
};
export default PendingVerificationPage;
