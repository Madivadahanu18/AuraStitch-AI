import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const CustomerDashboard: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { showToast } = useOutletContext<OutletContextType>();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTabClick = (tabTheme: 'light' | 'traditional' | 'retro' | 'royal' | 'handloom' | 'festival') => {
    setTheme(tabTheme);
    showToast(`Dynamic styling updated to: ${tabTheme.toUpperCase()}`, "info");
  };

  const handleBookTailor = () => {
    setShowConfirm(true);
  };

  const confirmBooking = () => {
    setShowConfirm(false);
    showToast("Order placed successfully! Tracking timeline generated.", "success");
  };

  return (
    <div className="customer-dashboard">
      <style>{`
        /* Stories list circular bubbles layout */
        .stories-row {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 10px 0;
          margin-bottom: 30px;
        }
        
        .story-bubble {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          min-width: 76px;
        }
        
        .story-avatar-border {
          width: 66px;
          height: 66px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(45deg, var(--accent-gold), var(--accent-copper), var(--accent-teal));
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .story-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--bg-secondary);
        }
        
        .category-tabs {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 12px;
          margin-bottom: 30px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .category-tab-btn {
          padding: 8px 18px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition: all var(--transition-fast);
          background-color: var(--bg-secondary);
        }
        
        .category-tab-btn.active, .category-tab-btn:hover {
          border-color: var(--accent-gold);
          background-color: var(--bg-tertiary);
          color: var(--accent-gold-dark);
        }
        
        /* Pinterest style card feed layout */
        .discover-masonry-feed {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          grid-gap: 24px;
        }
        
        .discover-pin-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        
        .discover-pin-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        
        .pin-img-wrapper {
          position: relative;
          cursor: pointer;
        }
        
        .pin-img {
          width: 100%;
          object-fit: cover;
          max-height: 380px;
        }
        
        .pin-overlay-actions {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          transition: opacity var(--transition-fast);
        }
        
        .pin-img-wrapper:hover .pin-overlay-actions {
          opacity: 1;
        }
        
        .pin-action-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          border: none;
        }
        
        .pin-content-box {
          padding: 16px;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      {/* Stories circular list */}
      <div className="stories-row">
        <div className="story-bubble">
          <div className="story-avatar-border">
            <img className="story-img" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="me" />
          </div>
          <span style={{ fontSize: '12px' }}>My Story</span>
        </div>
        
        <div className="story-bubble">
          <div className="story-avatar-border">
            <img className="story-img" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="priya" />
          </div>
          <span style={{ fontSize: '12px' }}>Priya S.</span>
        </div>
        
        <div className="story-bubble">
          <div className="story-avatar-border">
            <img className="story-img" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="kiran" />
          </div>
          <span style={{ fontSize: '12px' }}>Kiran Loom</span>
        </div>
      </div>
      
      {/* Horizontal Category Tabs for Theme Shifts */}
      <div className="category-tabs">
        {[
          { key: 'light', label: 'Minimalist Modern' },
          { key: 'traditional', label: 'Traditional Clay' },
          { key: 'retro', label: 'Retro Vintage' },
          { key: 'royal', label: 'Royal Wedding' },
          { key: 'handloom', label: 'Artisan Handloom' },
          { key: 'festival', label: 'Festive Saffron' }
        ].map((tab) => (
          <button 
            key={tab.key}
            className={`category-tab-btn ${theme === tab.key ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.key as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Pinterest masonry discover feed */}
      <div className="discover-masonry-feed">
        {/* Post Pin card */}
        <div className="discover-pin-card fade-in">
          <div className="pin-img-wrapper">
            <img className="pin-img" src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=350&q=80" alt="dress" />
            <div className="pin-overlay-actions">
              <button className="pin-action-icon" onClick={() => showToast("Added to wishlist!", "success")} title="Save Design">♥</button>
              <button className="pin-action-icon" onClick={() => showToast("Link copied to clipboard!", "info")} title="Share Design">↗</button>
            </div>
          </div>
          <div className="pin-content-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-gold">Weaver</span>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Kiran Loom</span>
            </div>
            <h4 style={{ fontSize: '15px', marginBottom: '6px', fontWeight: 700 }}>Handwoven Ikkat Dress Fabric</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Pure double-ikat silk fabric from Pochampally weavers, perfect for customized kurtis.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-gold-dark)' }}>₹1,200/meter</span>
              <Link to="/customer/design-lab" className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--border-radius-sm)' }}>
                Try Preset
              </Link>
            </div>
          </div>
        </div>
        
        <div className="discover-pin-card fade-in">
          <div className="pin-img-wrapper">
            <img className="pin-img" src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=350&q=80" alt="blouse" />
            <div className="pin-overlay-actions">
              <button className="pin-action-icon" onClick={() => showToast("Added to wishlist!", "success")} title="Save Design">♥</button>
              <button className="pin-action-icon" onClick={() => showToast("Link copied to clipboard!", "info")} title="Share Design">↗</button>
            </div>
          </div>
          <div className="pin-content-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-verified">Tailor</span>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Priya Sharma</span>
            </div>
            <h4 style={{ fontSize: '15px', marginBottom: '6px', fontWeight: 700 }}>Embroidered Zardozi Blouse</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Stitched royal silk saree blouse featuring intricate zari and maggam heavy bead detailing.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-gold-dark)' }}>₹3,500 Stitching</span>
              <button 
                className="btn-primary" 
                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--border-radius-sm)' }}
                onClick={handleBookTailor}
              >
                Book Tailor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-backdrop fade-in">
          <div className="glass-panel" style={{ width: '90%', maxWidth: '420px', padding: '30px', textAlign: 'center', transform: 'scale(1)' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '22px' }}>Confirm Booking</h3>
            <p style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '15px' }}>
              Would you like to book Priya Sharma for custom stitching this blouse design? Standard measurements profile will be shared.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-primary" onClick={confirmBooking}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CustomerDashboard;
