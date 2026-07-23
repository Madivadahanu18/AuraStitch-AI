import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

// Relative image import from customer images folder
import kanchipuramSareeImg from './customer/images/kanchipuramsaree.jpg';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface WishlistItem {
  id: string;
  name: string;
  clothType: string;
  weaverName: string;
  state: string;
  price: number;
  originalPrice?: number;
  rating: number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}

// Helper to ensure Vite resolves imported local image assets into URL strings
const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

const preloadedWishlistItems: WishlistItem[] = [
  {
    id: 'wish-1',
    name: 'Kanchipuram Brocade Silk Saree',
    clothType: 'Silk Saree',
    weaverName: 'Kanchi Silk Artisans',
    state: 'Tamil Nadu',
    price: 12450,
    originalPrice: 15000,
    rating: 4.9,
    availability: 'In Stock',
    image: getImageSrc(kanchipuramSareeImg)
  }
];

export const WishlistPage: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(preloadedWishlistItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingProduct, setViewingProduct] = useState<WishlistItem | null>(null);

  // Filtered Wishlist Items
  const filteredItems = useMemo(() => {
    if (!searchQuery) return wishlistItems;
    return wishlistItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clothType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.weaverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [wishlistItems, searchQuery]);

  // Handlers
  const handleMoveToCart = (item: WishlistItem) => {
    setWishlistItems(prev => prev.filter(i => i.id !== item.id));
    showToast(`Moved "${item.name}" to your active shopping cart!`, 'success');
  };

  const handleRemoveFromWishlist = (id: string, name: string) => {
    setWishlistItems(prev => prev.filter(i => i.id !== id));
    showToast(`Removed "${name}" from your wishlist.`, 'info');
  };

  return (
    <div className="wishlist-page-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1140px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        /* Top Section */
        .wishlist-top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .wishlist-header-left {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }

        .wishlist-page-title {
          font-family: var(--font-heading);
          font-size: 30px;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .wishlist-count-badge {
          background: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold);
          border: 1px solid var(--accent-gold);
          padding: 4px 14px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 700;
        }

        /* Search Section */
        .wishlist-search-box {
          margin-bottom: 28px;
          max-width: 600px;
        }

        .wishlist-search-input {
          width: 100%;
          padding: 12px 20px;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.2s ease;
        }

        .wishlist-search-input:focus {
          border-color: var(--accent-gold);
        }

        /* Responsive Product Cards Grid */
        .wishlist-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .wishlist-prod-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .wishlist-prod-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
        }

        .wishlist-img-box {
          position: relative;
          width: 100%;
          height: 230px;
          overflow: hidden;
          background: #111;
        }

        .wishlist-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .wishlist-prod-card:hover .wishlist-card-img {
          transform: scale(1.04);
        }

        .badge-state {
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
          backdrop-filter: blur(4px);
        }

        .badge-availability {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(42, 157, 143, 0.2);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 800;
          backdrop-filter: blur(4px);
        }

        .wishlist-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .wishlist-cloth-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 4px;
        }

        .wishlist-prod-name {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 6px;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .wishlist-weaver-line {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .wishlist-price-rating-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 16px;
        }

        .wishlist-price-text {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .wishlist-orig-price {
          font-size: 13px;
          color: var(--text-muted);
          text-decoration: line-through;
          margin-left: 6px;
        }

        .wishlist-rating {
          font-size: 12px;
          font-weight: 700;
          color: #ffb703;
        }

        /* 4 Action Buttons Layout */
        .wishlist-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: auto;
        }

        .btn-wish-cart {
          grid-column: span 2;
          padding: 10px;
          font-size: 13px;
          font-weight: 800;
          border-radius: 8px;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #000;
          transition: transform 0.2s ease;
          text-align: center;
        }

        .btn-wish-cart:hover {
          transform: translateY(-2px);
        }

        .btn-wish-action {
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          transition: all 0.2s ease;
          text-align: center;
          text-decoration: none;
          display: block;
        }

        .btn-wish-action:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-wish-remove {
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid #e63946;
          background: rgba(230, 57, 70, 0.1);
          color: #e63946;
          transition: all 0.2s ease;
          text-align: center;
        }

        .btn-wish-remove:hover {
          background: #e63946;
          color: #fff;
        }

        /* Modal Overlay */
        .wish-modal-backdrop {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .wish-modal-dialog {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          width: 100%;
          max-width: 460px;
          padding: 24px;
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .wishlist-top-header { flex-direction: column; align-items: flex-start; }
          .wishlist-actions-grid { grid-template-columns: 1fr; }
          .btn-wish-cart { grid-column: auto; }
        }
      `}</style>

      {/* TOP SECTION */}
      <div className="wishlist-top-header">
        <div className="wishlist-header-left">
          <h1 className="wishlist-page-title">Wishlist</h1>
          <span className="wishlist-count-badge">Total Saved Items: {filteredItems.length}</span>
        </div>
      </div>

      {/* Search Wishlist */}
      <div className="wishlist-search-box">
        <input 
          type="text" 
          className="wishlist-search-input" 
          placeholder="Search Wishlist..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Wishlist Product Cards Grid */}
      {filteredItems.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '60px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>❤️</div>
          <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Your wishlist is empty</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>Browse handloom products and click ❤️ to save items to your wishlist.</p>
        </div>
      ) : (
        <div className="wishlist-cards-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="wishlist-prod-card">
              <div className="wishlist-img-box">
                <img src={item.image} alt={item.name} className="wishlist-card-img" />
                <span className="badge-state">📍 {item.state}</span>
                <span className="badge-availability">{item.availability}</span>
              </div>

              <div className="wishlist-card-body">
                <span className="wishlist-cloth-tag">{item.clothType}</span>
                <h3 className="wishlist-prod-name">{item.name}</h3>

                <div className="wishlist-weaver-line">
                  🧑‍🌾 Weaver: <strong>{item.weaverName}</strong>
                </div>

                <div className="wishlist-price-rating-row">
                  <div>
                    <span className="wishlist-price-text">₹{item.price.toLocaleString()}</span>
                    {item.originalPrice && (
                      <span className="wishlist-orig-price">₹{item.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <span className="wishlist-rating">⭐ {item.rating}</span>
                </div>

                {/* 4 Required Action Buttons */}
                <div className="wishlist-actions-grid">
                  <button className="btn-wish-cart" onClick={() => handleMoveToCart(item)}>
                    🛒 Move to Cart
                  </button>

                  <button className="btn-wish-action" onClick={() => setViewingProduct(item)}>
                    👁️ View Product
                  </button>

                  <Link to="/messages" className="btn-wish-action">
                    💬 Message Seller
                  </Link>

                  <button className="btn-wish-remove" onClick={() => handleRemoveFromWishlist(item.id, item.name)}>
                    🗑️ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW PRODUCT PREVIEW MODAL */}
      {viewingProduct && (
        <div className="wish-modal-backdrop" onClick={() => setViewingProduct(null)}>
          <div className="wish-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ width: '100%', height: '220px', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={viewingProduct.image} alt={viewingProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>{viewingProduct.clothType} • 📍 {viewingProduct.state}</span>
            <h2 style={{ margin: '4px 0 10px', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>{viewingProduct.name}</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Handcrafted by <strong>{viewingProduct.weaverName}</strong> (⭐ {viewingProduct.rating})
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Price:</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>₹{viewingProduct.price.toLocaleString()}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2a9d8f', background: 'rgba(42, 157, 143, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                {viewingProduct.availability}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-wish-action" style={{ flex: 1 }} onClick={() => setViewingProduct(null)}>Close</button>
              <button className="btn-wish-cart" style={{ flex: 1 }} onClick={() => { handleMoveToCart(viewingProduct); setViewingProduct(null); }}>
                🛒 Move to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
