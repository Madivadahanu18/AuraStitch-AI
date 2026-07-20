/* AuraStitch AI - Reusable Sidebar Adaptable Web Component */

class AppSidebar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  render() {
    // Detect active module role by looking at current window location path
    const path = window.location.pathname;
    let role = 'guest';
    
    if (path.includes('/customer/')) role = 'customer';
    else if (path.includes('/tailor/')) role = 'tailor';
    else if (path.includes('/handloom/')) role = 'handloom';
    else if (path.includes('/supplier/')) role = 'supplier';
    else if (path.includes('/admin/')) role = 'admin';
    else if (path.includes('/ai/')) role = 'ai';

    this.innerHTML = `
      <style>
        .sidebar-container {
          width: var(--sidebar-width);
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
        }
      </style>
      
      <div class="sidebar-container" id="sidebar-panel">
        <div class="sidebar-menu">
          ${this.getMenuHtml(role)}
        </div>
        
        <div class="sidebar-footer">
          <button class="collapse-btn" id="sidebar-collapse-trigger">
            <span class="menu-icon">◀</span>
            <span>Collapse Sidebar</span>
          </button>
        </div>
      </div>
    `;
  }

  getMenuHtml(role) {
    const currentUrl = window.location.pathname;
    
    const links = {
      guest: [
        { path: '../index.html', label: 'Home', icon: '🏠' },
        { path: '../login.html', label: 'Login', icon: '🔑' },
        { path: '../register.html', label: 'Register', icon: '📝' }
      ],
      customer: [
        { path: './dashboard.html', label: 'Feed & Discover', icon: '📱' },
        { path: './design-lab.html', label: 'AI Design Lab', icon: '🎨' },
        { path: '../ai/dashboard.html', label: 'AI Recommendation', icon: '🤖' },
        { path: '#', label: 'Wishlist', icon: '♥' },
        { path: '#', label: 'Cart', icon: '🛒' },
        { path: '#', label: 'Order Timeline', icon: '📦' },
        { path: '#', label: 'Measurements', icon: '📏' },
        { path: '#', label: 'Settings', icon: '⚙' },
        { path: 'logout', label: 'Logout', icon: '🚪' }
      ],
      tailor: [
        { path: './dashboard.html', label: 'Dashboard', icon: '📈' },
        { path: '#', label: 'Orders List', icon: '🧵' },
        { path: '#', label: 'Portfolio', icon: '👗' },
        { path: '#', label: 'Services list', icon: '✂' },
        { path: '#', label: 'Earnings & Invoices', icon: '💰' },
        { path: '#', label: 'Artisan Ratings', icon: '★' },
        { path: '#', label: 'Settings', icon: '⚙' },
        { path: 'logout', label: 'Logout', icon: '🚪' }
      ],
      handloom: [
        { path: './dashboard.html', label: 'Artisan Dashboard', icon: '🚜' },
        { path: './ai-handloom-studio.html', label: 'AI Handloom Studio', icon: '🧠' },
        { path: '#', label: 'Products', icon: '🌾' },
        { path: '#', label: 'Collections', icon: '📂' },
        { path: '#', label: 'Inventory list', icon: '📦' },
        { path: '#', label: 'Artisan Ratings', icon: '★' },
        { path: '#', label: 'Settings', icon: '⚙' },
        { path: 'logout', label: 'Logout', icon: '🚪' }
      ],
      supplier: [
        { path: './dashboard.html', label: 'Market Dashboard', icon: '🏬' },
        { path: '#', label: 'Material Products', icon: '🧶' },
        { path: '#', label: 'Categories list', icon: '📁' },
        { path: '#', label: 'Inventory Control', icon: '🗃' },
        { path: '#', label: 'B2B Sales Orders', icon: '📝' },
        { path: '#', label: 'Settings', icon: '⚙' },
        { path: 'logout', label: 'Logout', icon: '🚪' }
      ],
      admin: [
        { path: './dashboard.html', label: 'Admin Center', icon: '🖥' },
        { path: '#', label: 'User Control', icon: '👥' },
        { path: '#', label: 'Verifications Center', icon: '🛡' },
        { path: '#', label: 'Activity Logs', icon: '🗒' },
        { path: '#', label: 'Roles Matrix', icon: '🔐' },
        { path: '#', label: 'System Health', icon: '⚡' },
        { path: '#', label: 'Settings', icon: '⚙' },
        { path: 'logout', label: 'Logout', icon: '🚪' }
      ],
      ai: [
        { path: './dashboard.html', label: 'AI Center', icon: '🤖' },
        { path: '../customer/design-lab.html', label: 'Garment Designer', icon: '🎨' },
        { path: '#', label: 'Virtual Try-On', icon: '👗' },
        { path: '#', label: 'Occasion Stylist', icon: '📅' },
        { path: '#', label: 'Mood Boards', icon: '📌' },
        { path: '#', label: 'History log', icon: '⏳' },
        { path: '#', label: 'Settings', icon: '⚙' },
        { path: 'logout', label: 'Logout', icon: '🚪' }
      ]
    };

    const roleLinks = links[role] || links.guest;
    const path = window.location.pathname;
    const isNested = path.includes('/customer/') || path.includes('/tailor/') || path.includes('/handloom/') || path.includes('/supplier/') || path.includes('/admin/') || path.includes('/ai/');
    
    return roleLinks.map(link => {
      let resolvedPath = link.path;
      if (resolvedPath !== '#') {
        if (!isNested) {
          if (resolvedPath.startsWith('../')) {
            resolvedPath = './' + resolvedPath.substring(3);
          }
        }
      }
      
      // Determine if active
      const isActive = currentUrl.endsWith(resolvedPath) || (resolvedPath !== '#' && currentUrl.includes(resolvedPath.replace('./', '/')));
      return `
        <a href="${resolvedPath}" class="menu-link ${isActive ? 'active' : ''}">
          <span class="menu-icon">${link.icon}</span>
          <span>${link.label}</span>
        </a>
      `;
    }).join('');
  }

  setupListeners() {
    const trigger = this.querySelector('#sidebar-collapse-trigger');
    const layout = document.querySelector('.app-layout');
    
    if (trigger && layout) {
      trigger.addEventListener('click', () => {
        layout.classList.toggle('collapsed');
        const icon = trigger.querySelector('.menu-icon');
        if (layout.classList.contains('collapsed')) {
          icon.textContent = '▶';
        } else {
          icon.textContent = '◀';
        }
      });
    }

    // Intercept clicks on links that are styled as logout triggers
    this.querySelectorAll('.menu-link').forEach(link => {
      if (link.getAttribute('href') === 'logout') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('currentUser');
          const path = window.location.pathname;
          const isNested = path.includes('/customer/') || path.includes('/tailor/') || path.includes('/handloom/') || path.includes('/supplier/') || path.includes('/admin/') || path.includes('/ai/');
          const prefix = isNested ? '../' : './';
          
          window.AuraToasts.show("Logging out...", "info");
          setTimeout(() => {
            window.location.href = prefix + 'login.html';
          }, 800);
        });
      }
    });
  }
}

customElements.define('app-sidebar', AppSidebar);
