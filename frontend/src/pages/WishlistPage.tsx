import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface WishlistItem {
  _id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

export const WishlistPage: React.FC = () => {
  const { showToast } = useOutletContext<OutletContextType>();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch items with offline fallback
    setTimeout(() => {
      setItems([
        {
          _id: 'w-1',
          name: 'Handloom Ikkat Silk Saree',
          price: '₹8,500',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
          category: 'Weaves'
        },
        {
          _id: 'w-2',
          name: 'Designer Bridal Silk Blouse',
          price: '₹3,500 Stitching',
          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
          category: 'Tailoring'
        }
      ]);
      setLoading(false);
    }, 400);
  }, []);

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item._id !== id));
    showToast("Removed from wishlist.", "info");
  };

  return (
    <div className="wishlist-page-container fade-in">
      <style>{`
        .wishlist-page-container {
          padding: 24px;
          padding-bottom: 90px;
          max-width: 900px;
          margin: 0 auto;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .wishlist-card {
          background-color: var(--bg-secondary, #fff);
          border: 1px solid var(--border-color, rgba(0,0,0,0.1));
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          position: relative;
        }

        .wishlist-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .wishlist-info {
          padding: 16px;
        }

        .wishlist-remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .wishlist-remove-btn:hover {
          background: rgba(220,53,69,0.9);
        }
      `}</style>

      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', borderLeft: '4px solid var(--accent-gold)', paddingLeft: '12px' }}>
        My Wishlist
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>Saved designs, fabrics, and boutique products</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner"></div></div>
      ) : (
        <div className="wishlist-grid">
          {items.map(item => (
            <div key={item._id} className="wishlist-card">
              <button className="wishlist-remove-btn" onClick={() => handleRemove(item._id)} title="Remove">✕</button>
              <img className="wishlist-img" src={item.image} alt={item.name} />
              <div className="wishlist-info">
                <span className="badge badge-gold" style={{ marginBottom: '8px', display: 'inline-block' }}>{item.category}</span>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700 }}>{item.name}</h4>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--accent-gold-dark)', fontSize: '14px' }}>{item.price}</p>
                <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                  <Link to="/customer/design-lab" className="btn-primary" style={{ flex: 1, textAlign: 'center', padding: '8px', fontSize: '12px', textDecoration: 'none', borderRadius: '4px' }}>
                    Stitch Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <h3>Your wishlist is empty</h3>
          <p>Browse fashion style cards and click the ❤️ icon to save items.</p>
        </div>
      )}
    </div>
  );
};
export default WishlistPage;
