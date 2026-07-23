import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

// Relative image imports from ./images/
import dothiImg from './images/dothi.jpg';
import dupattaImg from './images/duppatta.jpg';
import kanchipuramSareeImg from './images/kanchipuramsaree.jpg';
import mangalagiriDressImg from './images/Mangalagiridress.jpg';
import pochampallyDressImg from './images/pochampallydress.jpg';
import sareesImg from './images/Sarees.jpg';

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

interface ProductItem {
  id: string;
  name: string;
  handloomType: string;
  state: string;
  weaverName: string;
  price: number;
  originalPrice: number;
  discount: number;
  availability: string;
  estimatedDelivery: string;
  rating: number;
  reviewsCount: number;
  soldCount: number;
  image: string;
}

const customerFeedProducts: ProductItem[] = [
  {
    id: 'c-1',
    name: 'Pochampally Dress Material',
    handloomType: 'Pochampally Ikat',
    state: 'Telangana',
    weaverName: 'Kiran Handloom Looms',
    price: 2450,
    originalPrice: 3000,
    discount: 18,
    availability: 'In Stock',
    estimatedDelivery: '7–10 Days',
    rating: 4.8,
    reviewsCount: 324,
    soldCount: 1256,
    image: getImageSrc(pochampallyDressImg)
  },
  {
    id: 'c-2',
    name: 'Kanchipuram Saree',
    handloomType: 'Kanchipuram Silk',
    state: 'Tamil Nadu',
    weaverName: 'Kanchi Silk Artisans',
    price: 12000,
    originalPrice: 15000,
    discount: 20,
    availability: 'In Stock',
    estimatedDelivery: '7–10 Days',
    rating: 4.9,
    reviewsCount: 640,
    soldCount: 1890,
    image: getImageSrc(kanchipuramSareeImg)
  },
  {
    id: 'c-3',
    name: 'Mangalagiri Dress',
    handloomType: 'Mangalagiri Cotton',
    state: 'Andhra Pradesh',
    weaverName: 'Mangalagiri Weavers Co-op',
    price: 1850,
    originalPrice: 2200,
    discount: 16,
    availability: 'In Stock',
    estimatedDelivery: '5–7 Days',
    rating: 4.7,
    reviewsCount: 210,
    soldCount: 980,
    image: getImageSrc(mangalagiriDressImg)
  },
  {
    id: 'c-4',
    name: 'Traditional Handwoven Dhoti',
    handloomType: 'Traditional Handloom Cotton',
    state: 'Kerala',
    weaverName: 'Kerala Weaver Collective',
    price: 1450,
    originalPrice: 1800,
    discount: 19,
    availability: 'In Stock',
    estimatedDelivery: '4–6 Days',
    rating: 4.6,
    reviewsCount: 145,
    soldCount: 680,
    image: getImageSrc(dothiImg)
  },
  {
    id: 'c-5',
    name: 'Handloom Dupatta',
    handloomType: 'Pure Fine Cotton Dupatta',
    state: 'West Bengal',
    weaverName: 'Bengal Artisan Forum',
    price: 1250,
    originalPrice: 1600,
    discount: 22,
    availability: 'In Stock',
    estimatedDelivery: '5–7 Days',
    rating: 4.8,
    reviewsCount: 310,
    soldCount: 840,
    image: getImageSrc(dupattaImg)
  },
  {
    id: 'c-6',
    name: 'Cotton Saree Collection',
    handloomType: 'Pure Cotton Handloom',
    state: 'Andhra Pradesh',
    weaverName: 'Heritage Weaver Society',
    price: 2800,
    originalPrice: 3500,
    discount: 20,
    availability: 'In Stock',
    estimatedDelivery: '6–8 Days',
    rating: 4.9,
    reviewsCount: 512,
    soldCount: 1420,
    image: getImageSrc(sareesImg)
  }
];

export const CustomerDashboard: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { showToast } = useOutletContext<OutletContextType>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const handleTabClick = (tabTheme: 'light' | 'traditional' | 'retro' | 'royal' | 'handloom' | 'festival') => {
    setTheme(tabTheme);
    showToast(`Dynamic styling updated to: ${tabTheme.toUpperCase()}`, "info");
  };

  const handleAddToCart = (productName: string) => {
    showToast(`Added "${productName}" to Cart!`, "success");
  };

  const handleBuyNow = (prod: ProductItem) => {
    setSelectedProduct(prod);
    setShowConfirm(true);
  };

  const confirmBooking = () => {
    setShowConfirm(false);
    showToast(`Order confirmed for "${selectedProduct?.name || 'Handloom Item'}"! Tracking timeline generated.`, "success");
  };

  return (
    <div className="customer-dashboard">
      <style>{`
        /* Stories circular list */
        .stories-row {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 10px 0;
          margin-bottom: 24px;
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
        
        /* Grid Feed Layout */
        .customer-feed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .customer-prod-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .customer-prod-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .cust-img-box {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: #111;
        }

        .cust-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .customer-prod-card:hover .cust-img {
          transform: scale(1.04);
        }

        .cust-state-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(10, 15, 30, 0.85);
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
          backdrop-filter: blur(4px);
        }

        .cust-discount-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #e63946;
          color: #ffffff;
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 800;
        }

        .cust-body-box {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background-color: rgba(0, 0, 0, 0.6);
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
            <img className="story-img" src={getImageSrc(pochampallyDressImg)} alt="pochampally" />
          </div>
          <span style={{ fontSize: '12px' }}>Pochampally</span>
        </div>
        
        <div className="story-bubble">
          <div className="story-avatar-border">
            <img className="story-img" src={getImageSrc(kanchipuramSareeImg)} alt="kanchi" />
          </div>
          <span style={{ fontSize: '12px' }}>Kanchi Silk</span>
        </div>
        
        <div className="story-bubble">
          <div className="story-avatar-border">
            <img className="story-img" src={getImageSrc(mangalagiriDressImg)} alt="mangalagiri" />
          </div>
          <span style={{ fontSize: '12px' }}>Mangalagiri</span>
        </div>
      </div>
      
      {/* Preloaded Cart Section */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px', borderLeft: '4px solid var(--accent-gold)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🛒 My Active Shopping Cart <span style={{ fontSize: '12px', background: 'var(--accent-gold)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>1 Item</span>
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Preloaded Customer Order</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-primary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', alignItems: 'center', flexWrap: 'wrap' }}>
          <img src={getImageSrc(dothiImg)} alt="Traditional Handwoven Cotton Dhoti" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>Traditional Handloom Cotton</span>
            <h4 style={{ margin: '2px 0 4px', fontSize: '16px', fontWeight: 700 }}>Traditional Handwoven Cotton Dhoti</h4>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Seller: <strong>Kerala Weaver Collective</strong> • Qty: <strong>1</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Price: ₹1,450</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Total: ₹1,450</div>
          </div>
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
      
      {/* Feed Product Grid */}
      <div className="customer-feed-grid">
        {customerFeedProducts.map(prod => (
          <div key={prod.id} className="customer-prod-card fade-in">
            <div className="cust-img-box">
              <img src={prod.image} alt={prod.name} className="cust-img" />
              <span className="cust-state-badge">📍 {prod.state}</span>
              <span className="cust-discount-badge">{prod.discount}% OFF</span>
            </div>

            <div className="cust-body-box">
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                {prod.handloomType}
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 6px', color: 'var(--text-primary)' }}>
                {prod.name}
              </h4>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                🧑‍🌾 Weaver: <strong>{prod.weaverName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ color: '#ffb703', fontWeight: 700 }}>⭐ {prod.rating} ({prod.reviewsCount} Reviews)</span>
                <span style={{ color: 'var(--text-muted)' }}>{prod.soldCount.toLocaleString()} Sold</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800 }}>₹{prod.price.toLocaleString()}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{prod.originalPrice.toLocaleString()}</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#2a9d8f', background: 'rgba(42, 157, 143, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                  🚚 {prod.estimatedDelivery}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                <button className="btn-secondary" style={{ padding: '8px', fontSize: '12px', fontWeight: 700 }} onClick={() => handleAddToCart(prod.name)}>
                  Add to Cart
                </button>
                <button className="btn-primary" style={{ padding: '8px', fontSize: '12px', fontWeight: 700 }} onClick={() => handleBuyNow(prod)}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedProduct && (
        <div className="modal-backdrop fade-in">
          <div className="glass-panel" style={{ width: '90%', maxWidth: '420px', padding: '30px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>Confirm Order</h3>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Would you like to purchase <strong>{selectedProduct.name}</strong> woven by {selectedProduct.weaverName}?
            </p>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '20px' }}>
              Total: ₹{selectedProduct.price.toLocaleString()}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-primary" onClick={confirmBooking}>Confirm Purchase</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
