import React, { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

interface OutletContextType {
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export interface CartItem {
  id: string;
  name: string;
  clothType: string;
  sellerName: string;
  price: number;
  quantity: number;
  image: string;
}

export const Cart: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aurastitch_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Keep state in sync with localStorage and custom cart events
  useEffect(() => {
    const syncCart = () => {
      try {
        const saved = localStorage.getItem('aurastitch_cart');
        setCartItems(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setCartItems([]);
      }
    };

    window.addEventListener('storage', syncCart);
    window.addEventListener('cartUpdated', syncCart);
    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('cartUpdated', syncCart);
    };
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('aurastitch_cart', JSON.stringify(items));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  };

  // Quantity Handlers
  const handleIncreaseQty = (id: string) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(updated);
  };

  const handleDecreaseQty = (id: string) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        if (item.quantity <= 1) return item;
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveItem = (id: string, name: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    saveCart(updated);
    showToast(`Removed "${name}" from Cart.`, 'info');
  };

  const handleCheckout = () => {
    showToast(`Proceeding to Checkout with ${totalItemsCount} item(s)!`, 'success');
  };

  // Order Summary Calculations
  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const deliveryCharges = subtotal > 0 ? (subtotal >= 2000 ? 0 : 150) : 0;
  const grandTotal = subtotal + deliveryCharges;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-container fade-in" style={{ padding: '40px 24px', paddingBottom: '90px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', color: 'var(--text-primary)' }}>
        <style>{`
          .empty-cart-box {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-lg, 16px);
            padding: 60px 24px;
            box-shadow: var(--shadow-sm);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .empty-cart-icon {
            font-size: 64px;
            margin-bottom: 16px;
          }
          .empty-cart-title {
            font-family: var(--font-heading);
            font-size: 28px;
            font-weight: 800;
            margin: 0 0 12px;
            color: var(--text-primary);
          }
          .empty-cart-desc {
            color: var(--text-secondary);
            font-size: 15px;
            max-width: 480px;
            margin: 0 0 28px;
            line-height: 1.5;
          }
          .btn-continue-shopping {
            display: inline-block;
            padding: 14px 32px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
            color: #000;
            font-weight: 800;
            font-size: 15px;
            text-decoration: none;
            box-shadow: var(--shadow-md);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .btn-continue-shopping:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
          }
        `}</style>
        <div className="empty-cart-box">
          <div className="empty-cart-icon">🛒</div>
          <h2 className="empty-cart-title">Your cart is empty.</h2>
          <p className="empty-cart-desc">
            Explore our handcrafted collections and add authentic handloom products to your cart.
          </p>
          <Link to="/discover" className="btn-continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1180px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .cart-header-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 24px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cart-count-badge {
          font-size: 14px;
          background: rgba(197, 160, 89, 0.2);
          color: var(--accent-gold);
          border: 1px solid var(--accent-gold);
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 700;
        }

        .cart-main-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cart-item-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg, 12px);
          padding: 20px;
          display: flex;
          gap: 20px;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.2s ease;
        }

        .cart-item-card:hover {
          border-color: var(--accent-gold);
        }

        .cart-item-img {
          width: 120px;
          height: 120px;
          border-radius: 10px;
          object-fit: cover;
          background: #111;
          flex-shrink: 0;
          border: 1px solid var(--border-color);
        }

        .cart-item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .cart-cloth-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .cart-item-name {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 6px;
          color: var(--text-primary);
        }

        .cart-seller-info {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .cart-price-line {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 14px;
        }

        .cart-controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          flex-wrap: wrap;
          gap: 12px;
        }

        .qty-control-group {
          display: flex;
          align-items: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }

        .btn-qty {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .btn-qty:hover {
          background: var(--border-color);
          color: var(--accent-gold);
        }

        .qty-val-text {
          padding: 0 12px;
          font-weight: 700;
          font-size: 14px;
          color: var(--text-primary);
        }

        .item-total-price {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .btn-remove-item {
          background: transparent;
          border: 1px solid #e63946;
          color: #e63946;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-remove-item:hover {
          background: #e63946;
          color: #ffffff;
        }

        /* Summary Sidebar */
        .cart-summary-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg, 12px);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }

        .summary-card-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 20px;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .summary-row.grand-total-row {
          border-top: 1px dashed var(--border-color);
          padding-top: 16px;
          margin-top: 16px;
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .btn-checkout {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #000;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          margin-top: 20px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-checkout:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 868px) {
          .cart-main-grid {
            grid-template-columns: 1fr;
          }
          .cart-item-card {
            flex-direction: column;
          }
          .cart-item-img {
            width: 100%;
            height: 180px;
          }
        }
      `}</style>

      <h1 className="cart-header-title">
        <span>Shopping Cart</span>
        <span className="cart-count-badge">{totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''}</span>
      </h1>

      <div className="cart-main-grid">
        {/* Left Column: Product List */}
        <div className="cart-items-list">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item-card">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-content">
                <span className="cart-cloth-badge">{item.clothType}</span>
                <h3 className="cart-item-name">{item.name}</h3>
                <div className="cart-seller-info">
                  Seller: <strong>{item.sellerName}</strong>
                </div>
                <div className="cart-price-line">
                  Price: ₹{item.price.toLocaleString()}
                </div>

                <div className="cart-controls-row">
                  <div className="qty-control-group">
                    <button className="btn-qty" onClick={() => handleDecreaseQty(item.id)} title="Decrease Quantity">-</button>
                    <span className="qty-val-text">{item.quantity}</span>
                    <button className="btn-qty" onClick={() => handleIncreaseQty(item.id)} title="Increase Quantity">+</button>
                  </div>

                  <div className="item-total-price">
                    Total: ₹{(item.price * item.quantity).toLocaleString()}
                  </div>

                  <button className="btn-remove-item" onClick={() => handleRemoveItem(item.id, item.name)}>
                    🗑️ Remove Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="cart-summary-card">
          <h2 className="summary-card-title">Order Summary</h2>

          <div className="summary-row">
            <span>Total Items</span>
            <strong>{totalItemsCount}</strong>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal.toLocaleString()}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery Charges</span>
            <strong style={{ color: deliveryCharges === 0 ? '#2a9d8f' : 'var(--text-primary)' }}>
              {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges.toLocaleString()}`}
            </strong>
          </div>

          <div className="summary-row grand-total-row">
            <span>Grand Total</span>
            <span style={{ color: 'var(--accent-gold)' }}>₹{grandTotal.toLocaleString()}</span>
          </div>

          <button className="btn-checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
