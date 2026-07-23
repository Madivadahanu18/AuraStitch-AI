import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

// Relative image imports from customer images folder
import kanchipuramSareeImg from './customer/images/kanchipuramsaree.jpg';
import pochampallyDressImg from './customer/images/pochampallydress.jpg';
import mangalagiriDressImg from './customer/images/Mangalagiridress.jpg';
import dhotiImg from './customer/images/dothi.jpg';
import dupattaImg from './customer/images/duppatta.jpg';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface CartItem {
  id: string;
  name: string;
  clothType: string;
  weaverName: string;
  price: number;
  quantity: number;
  image: string;
  statusBadge: 'Price Updated' | 'Only 2 Left' | 'In Stock' | 'Out of Stock';
}

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Helper to ensure Vite resolves imported local image assets into URL strings
const getImageSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'default' in img) return (img as any).default;
  return String(img);
};

const preloadedCartItems: CartItem[] = [
  {
    id: 'cart-101',
    name: 'Traditional Handwoven Cotton Dhoti',
    clothType: 'Traditional Handloom Cotton',
    weaverName: 'Kerala Weaver Collective',
    price: 1450,
    quantity: 1,
    image: getImageSrc(dhotiImg),
    statusBadge: 'In Stock'
  }
];

const mockRecommendations: RecommendedProduct[] = [
  {
    id: 'rec-1',
    name: 'Pochampally Ikat Dress Material',
    price: 2450,
    image: getImageSrc(pochampallyDressImg)
  },
  {
    id: 'rec-2',
    name: 'Mangalagiri Nizam Border Suit',
    price: 1850,
    image: getImageSrc(mangalagiriDressImg)
  },
  {
    id: 'rec-3',
    name: 'Traditional Handwoven Cotton Dhoti',
    price: 1450,
    image: getImageSrc(dhotiImg)
  },
  {
    id: 'rec-4',
    name: 'Zari Border Fine Cotton Dupatta',
    price: 1250,
    image: getImageSrc(dupattaImg)
  }
];

export const CartPage: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const [cartItems, setCartItems] = useState<CartItem[]>(preloadedCartItems);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);

  // Quantity Handlers
  const handleIncreaseQty = (id: string) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecreaseQty = (id: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        if (item.quantity <= 1) return item;
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string, name: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast(`Removed "${name}" from your cart.`, 'info');
  };

  // Feature 1: Save for Later
  const handleSaveForLater = (item: CartItem) => {
    setCartItems(prev => prev.filter(i => i.id !== item.id));
    setSavedItems(prev => [...prev, item]);
    showToast(`Moved "${item.name}" to Saved for Later.`, 'success');
  };

  const handleMoveSavedToCart = (item: CartItem) => {
    setSavedItems(prev => prev.filter(i => i.id !== item.id));
    setCartItems(prev => [...prev, item]);
    showToast(`Moved "${item.name}" back to your active cart!`, 'success');
  };

  const handleRemoveSavedItem = (id: string, name: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
    showToast(`Removed "${name}" from saved list.`, 'info');
  };

  const handleAddRecommendationToCart = (product: RecommendedProduct) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}`,
      name: product.name,
      clothType: 'Handloom Collection',
      weaverName: 'Artisan Guild',
      price: product.price,
      quantity: 1,
      image: product.image,
      statusBadge: 'Price Updated'
    };
    setCartItems(prev => [...prev, newItem]);
    showToast(`Added "${product.name}" to your cart!`, 'success');
  };

  // Order Summary Calculations
  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((sum, i) => sum + i.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const deliveryCharges = subtotal > 0 ? 0 : 0; // FREE Express Delivery
  const estimatedTax = useMemo(() => Math.round(subtotal * 0.05), [subtotal]); // 5% GST
  const grandTotal = subtotal + deliveryCharges + estimatedTax;

  return (
    <div className="cart-page-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1180px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        /* Top Section */
        .cart-top-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .cart-header-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .cart-top-meta-flex {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: var(--text-secondary);
          align-items: center;
        }

        /* Feature 2: Cross-Device Sync Badge */
        .cross-device-sync-pill {
          background: rgba(42, 157, 143, 0.12);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        /* Main Grid Layout */
        .cart-main-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 32px;
          margin-bottom: 50px;
        }

        /* Left Column: Cart Items Stack & Saved Items */
        .cart-left-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .cart-item-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          display: flex;
          gap: 20px;
          box-shadow: var(--shadow-sm);
          position: relative;
          transition: border-color 0.2s ease;
        }

        .cart-item-card:hover {
          border-color: var(--accent-gold);
        }

        .cart-item-img {
          width: 110px;
          height: 110px;
          border-radius: 10px;
          object-fit: cover;
          background: #111;
          flex-shrink: 0;
          border: 1px solid var(--border-color);
        }

        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .cart-cloth-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cart-prod-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          margin: 2px 0 6px;
          color: var(--text-primary);
        }

        .cart-weaver-name {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        /* Feature 3: Status Badges */
        .status-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
          width: fit-content;
          margin-bottom: 12px;
        }

        .badge-only-left { background: rgba(230, 57, 70, 0.15); color: #e63946; border: 1px solid #e63946; }
        .badge-price-updated { background: rgba(197, 160, 89, 0.2); color: var(--accent-gold-dark); border: 1px solid var(--accent-gold); }
        .badge-in-stock { background: rgba(42, 157, 143, 0.15); color: #2a9d8f; border: 1px solid #2a9d8f; }

        .cart-item-actions-flex {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }

        .btn-action-sm {
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .btn-action-sm:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-action-remove {
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid #e63946;
          background: rgba(230, 57, 70, 0.1);
          color: #e63946;
          transition: all 0.2s ease;
        }

        .btn-action-remove:hover {
          background: #e63946;
          color: #ffffff;
        }

        /* Qty and Price Controls Right Side */
        .cart-item-price-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
        }

        .qty-control-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 3px 8px;
        }

        .btn-qty {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-qty:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .qty-val-num {
          font-size: 14px;
          font-weight: 800;
          min-width: 18px;
          text-align: center;
        }

        .item-price-sum {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
        }

        /* Feature 1: Saved for Later Section */
        .saved-for-later-block {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          margin-top: 12px;
        }

        .saved-block-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 16px;
          color: var(--text-primary);
        }

        /* Right Column: Right Side Order Summary */
        .order-summary-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          height: fit-content;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 90px;
        }

        .summary-title {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 20px;
          color: var(--text-primary);
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 12px;
          color: var(--text-secondary);
        }

        .summary-line-grand {
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          font-weight: 800;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px dashed var(--border-color);
          color: var(--text-primary);
        }

        .btn-checkout-primary {
          width: 100%;
          padding: 14px;
          border-radius: 30px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #000;
          font-size: 15px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          margin-top: 24px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease;
        }

        .btn-checkout-primary:hover {
          transform: translateY(-2px);
        }

        .btn-continue-shop {
          width: 100%;
          padding: 12px;
          border-radius: 30px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          display: block;
          margin-top: 10px;
          transition: all 0.2s ease;
        }

        .btn-continue-shop:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        /* Feature 4: Personalized Recommendations */
        .recommendations-section {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid var(--border-color);
        }

        .recs-heading {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 20px;
          color: var(--text-primary);
        }

        .recs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .rec-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .rec-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
        }

        .rec-img-box {
          width: 100%;
          height: 170px;
          overflow: hidden;
          background: #111;
        }

        .rec-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .rec-card:hover .rec-img {
          transform: scale(1.05);
        }

        .rec-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .rec-title {
          font-size: 14px;
          font-weight: 700;
          margin: 0 0 8px;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .rec-price {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 14px;
        }

        .btn-add-rec {
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid var(--accent-gold);
          background: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold);
          text-align: center;
          margin-top: auto;
          transition: all 0.2s ease;
        }

        .btn-add-rec:hover {
          background: var(--accent-gold);
          color: #000;
        }

        @media (max-width: 900px) {
          .cart-main-grid { grid-template-columns: 1fr; }
          .cart-item-card { flex-direction: column; }
          .cart-item-price-col { width: 100%; flex-direction: row; align-items: center; margin-top: 12px; }
        }
      `}</style>

      {/* TOP SECTION */}
      <div className="cart-top-header-row">
        <h1 className="cart-header-title">Shopping Cart</h1>
        <div className="cart-top-meta-flex">
          <span><strong>Total Items:</strong> {totalItemsCount}</span>
          <span>•</span>
          <span><strong>Estimated Delivery:</strong> 3–5 Business Days</span>
        </div>
      </div>

      {/* Feature 2: Cross-Device Sync Badge */}
      <div className="cross-device-sync-pill">
        <span>📲</span>
        <span>Your cart is synced across all your AuraStitch devices.</span>
      </div>

      {/* MAIN CART GRID */}
      <div className="cart-main-grid">
        {/* LEFT COLUMN: ACTIVE CART & SAVED FOR LATER */}
        <div className="cart-left-column">
          {cartItems.length === 0 ? (
            <div style={{ background: 'var(--bg-secondary)', padding: '50px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛒</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Your active cart is empty</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Explore products below and add them to your cart.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--accent-gold)', background: 'var(--bg-secondary)' }}>
                {/* Top Image Banner with Badges */}
                <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', background: '#111' }}>
                  <img src={getImageSrc(dhotiImg)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(10, 15, 25, 0.85)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', padding: '5px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                    📍 Tamil Nadu
                  </span>
                  <span style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(42, 157, 143, 0.2)', border: '1px solid #2a9d8f', color: '#2a9d8f', padding: '5px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 800, backdropFilter: 'blur(4px)' }}>
                    In Stock
                  </span>
                </div>

                {/* Card Body Info */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    {item.clothType}
                  </span>

                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {item.name}
                  </h3>

                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    👨‍🌾 Weaver: <strong>{item.weaverName}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '4px 0 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ₹{item.price.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₹{(item.price * 1.2).toFixed(0)}
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffb703' }}>
                      ⭐ 4.9
                    </span>
                  </div>

                  {/* Quantity selector row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Item Quantity:</span>
                    <div className="qty-control-box">
                      <button className="btn-qty" onClick={() => handleDecreaseQty(item.id)} title="Decrease Quantity">-</button>
                      <span className="qty-val-num">{item.quantity}</span>
                      <button className="btn-qty" onClick={() => handleIncreaseQty(item.id)} title="Increase Quantity">+</button>
                    </div>
                  </div>

                  {/* Action Buttons styled exactly as in user screenshot */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Big Gold Button */}
                    <button className="btn-checkout-primary" style={{ margin: 0, padding: '12px', fontSize: '14px', width: '100%', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => handleSaveForLater(item)}>
                      🛒 Move to Cart
                    </button>

                    {/* 2-column secondary buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button className="btn-action-sm" style={{ padding: '10px', textAlign: 'center', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }} onClick={() => showToast(`Viewing ${item.name}`, 'info')}>
                        👁️ View Product
                      </button>
                      <Link to="/messages" className="btn-action-sm" style={{ padding: '10px', textAlign: 'center', textDecoration: 'none', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                        💬 Message Seller
                      </Link>
                    </div>

                    {/* Red Outlined Remove Button */}
                    <button className="btn-action-remove" style={{ padding: '10px', width: '100%', borderRadius: '10px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }} onClick={() => handleRemoveItem(item.id, item.name)}>
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Feature 1: Save for Later Section */}
          {savedItems.length > 0 && (
            <div className="saved-for-later-block">
              <h2 className="saved-block-title">📌 Saved for Later ({savedItems.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {savedItems.map(sItem => (
                  <div key={sItem.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'var(--bg-primary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <img src={sItem.image} alt={sItem.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>{sItem.clothType}</span>
                      <h4 style={{ margin: '2px 0', fontSize: '15px', fontWeight: 700 }}>{sItem.name}</h4>
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>₹{sItem.price.toLocaleString()}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-action-sm" onClick={() => handleMoveSavedToCart(sItem)}>
                        🛒 Move to Cart
                      </button>
                      <button className="btn-action-remove" onClick={() => handleRemoveSavedItem(sItem.id, sItem.name)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY */}
        <div className="order-summary-panel">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-line">
            <span>Total Items</span>
            <strong>{totalItemsCount}</strong>
          </div>

          <div className="summary-line">
            <span>Subtotal</span>
            <strong>₹{subtotal.toLocaleString()}</strong>
          </div>

          <div className="summary-line">
            <span>Delivery Charges</span>
            <strong style={{ color: '#2a9d8f' }}>FREE</strong>
          </div>

          <div className="summary-line">
            <span>Estimated Tax (5% GST)</span>
            <strong>₹{estimatedTax.toLocaleString()}</strong>
          </div>

          <div className="summary-line-grand">
            <span>Grand Total</span>
            <span style={{ color: 'var(--accent-gold-dark)' }}>₹{grandTotal.toLocaleString()}</span>
          </div>

          <button className="btn-checkout-primary" onClick={() => showToast(`Order placed for ₹${grandTotal.toLocaleString()}!`, 'success')}>
            Proceed to Checkout
          </button>

          <Link to="/discover" className="btn-continue-shop">
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Feature 4: Personalized Recommendations */}
      <div className="recommendations-section">
        <h2 className="recs-heading">You may also like</h2>
        <div className="recs-grid">
          {mockRecommendations.map(rec => (
            <div key={rec.id} className="rec-card">
              <div className="rec-img-box">
                <img src={rec.image} alt={rec.name} className="rec-img" />
              </div>
              <div className="rec-body">
                <h3 className="rec-title">{rec.name}</h3>
                <div className="rec-price">₹{rec.price.toLocaleString()}</div>
                <button className="btn-add-rec" onClick={() => handleAddRecommendationToCart(rec)}>
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
