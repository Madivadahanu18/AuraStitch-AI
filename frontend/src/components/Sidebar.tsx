import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, showToast }) => {
  const { user, logout } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const role = user?.role || 'guest';

  const menuItems: Record<string, Array<{ path: string; label: string; icon: string; isLogout?: boolean }>> = {
    guest: [
      { path: '/', label: translate('home'), icon: '🏠' },
      { path: '/login', label: 'Login', icon: '🔑' },
      { path: '/register', label: 'Register', icon: '📝' }
    ],
    customer: [
      { path: '/customer', label: 'Feed & Discover', icon: '📱' },
      { path: '/customer/design-lab', label: 'AI Design Lab', icon: '🎨' },
      { path: '/ai', label: 'AI Recommendation', icon: '🤖' },
      { path: '/customer/cart', label: 'Cart', icon: '🛒' },
      { path: '/customer/orders', label: 'Order Timeline', icon: '📦' },
      { path: '/customer/measurements', label: 'Measurements', icon: '📏' },
      { path: '/customer/settings', label: 'Settings', icon: '⚙' },
      { path: '/logout', label: 'Logout', icon: '🚪', isLogout: true }
    ],
    tailor: [
      { path: '/tailor', label: 'Dashboard', icon: '📈' },
      { path: '/tailor/orders', label: 'Orders List', icon: '🧵' },
      { path: '/tailor/portfolio', label: 'Portfolio', icon: '👗' },
      { path: '/tailor/services', label: 'Services list', icon: '✂' },
      { path: '/tailor/earnings', label: 'Earnings & Invoices', icon: '💰' },
      { path: '/tailor/ratings', label: 'Artisan Ratings', icon: '★' },
      { path: '/tailor/settings', label: 'Settings', icon: '⚙' },
      { path: '/logout', label: 'Logout', icon: '🚪', isLogout: true }
    ],
    weaver: [
      { path: '/handloom', label: 'Artisan Dashboard', icon: '🚜' },
      { path: '/handloom/ai-handloom-studio', label: 'AI Handloom Studio', icon: '🧠' },
      { path: '/handloom/products', label: 'Products', icon: '🌾' },
      { path: '/handloom/collections', label: 'Collections', icon: '📂' },
      { path: '/handloom/inventory', label: 'Inventory list', icon: '📦' },
      { path: '/handloom/ratings', label: 'Raw Materials Marketplace', icon: '🧶' },
      { path: '/handloom/settings', label: 'Settings', icon: '⚙' },
      { path: '/logout', label: 'Logout', icon: '🚪', isLogout: true }
    ],
    supplier: [
      { path: '/supplier', label: 'Market Dashboard', icon: '🏬' },
      { path: '/supplier/materials', label: 'Material Products', icon: '🧶' },
      { path: '/supplier/categories', label: 'Categories list', icon: '📁' },
      { path: '/supplier/inventory', label: 'Inventory Control', icon: '🗃' },
      { path: '/supplier/orders', label: 'B2B Sales Orders', icon: '📝' },
      { path: '/supplier/settings', label: 'Settings', icon: '⚙' },
      { path: '/logout', label: 'Logout', icon: '🚪', isLogout: true }
    ],
    admin: [
      { path: '/admin', label: 'Admin Center', icon: '🖥' },
      { path: '/admin/users', label: 'User Control', icon: '👥' },
      { path: '/admin/verifications', label: 'Verifications Center', icon: '🛡' },
      { path: '/admin/logs', label: 'Activity Logs', icon: '🗒' },
      { path: '/admin/roles', label: 'Roles Matrix', icon: '🔐' },
      { path: '/admin/health', label: 'System Health', icon: '⚡' },
      { path: '/admin/settings', label: 'Settings', icon: '⚙' },
      { path: '/logout', label: 'Logout', icon: '🚪', isLogout: true }
    ]
  };

  // Weaver alias fallback support matching db schema role
  const activeRole = role === 'weaver' ? 'weaver' : (role === 'customer' || role === 'tailor' || role === 'supplier' || role === 'admin') ? role : 'guest';
  const links = menuItems[activeRole] || menuItems.guest;

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast("Logging out...", "info");
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 800);
  };

  return (
    <div className="sidebar-container" id="sidebar-panel">
      <style>{`
        .sidebar-container {
          width: ${collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'};
          height: calc(100vh - var(--navbar-height));
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-right: 1px solid var(--border-color);
          position: fixed;
          top: var(--navbar-height);
          left: 0;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          justify-content: space-between;
          z-index: 90;
          transition: width var(--transition-normal);
        }
        
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
          flex-grow: 1;
        }
        
        .menu-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: var(--border-radius-sm);
          font-size: 15px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }
        
        .menu-link:hover, .menu-link.active {
          background-color: var(--bg-tertiary);
          color: var(--accent-gold);
        }
        
        .menu-icon {
          font-size: 18px;
        }
        
        .sidebar-footer {
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
          margin-top: 16px;
        }
        
        .collapse-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          background: transparent;
        }
      `}</style>

      <div className="sidebar-menu">
        {links.map((link) => {
          if (link.isLogout) {
            return (
              <a href="/logout" key={link.path} className="menu-link" onClick={handleLogout}>
                <span className="menu-icon">{link.icon}</span>
                {!collapsed && <span>{link.label}</span>}
              </a>
            );
          }
          
          return (
            <NavLink
              to={link.path}
              key={link.path}
              className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
              end
            >
              <span className="menu-icon">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <span className="menu-icon">{collapsed ? '▶' : '◀'}</span>
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
