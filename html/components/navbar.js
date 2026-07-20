/* AuraStitch AI - Reusable Top Header Web Component */

class AppNavbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  render() {
    const path = window.location.pathname;
    const isNested = path.includes('/customer/') || path.includes('/tailor/') || path.includes('/handloom/') || path.includes('/supplier/') || path.includes('/admin/') || path.includes('/ai/');
    const prefix = isNested ? '../' : './';

    this.innerHTML = `
      <style>
        .navbar-container {
          height: var(--navbar-height);
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .logo-gold {
          color: var(--accent-gold);
        }
        
        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 400px;
        }
        
        .search-bar-input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border-radius: var(--border-radius-lg);
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          transition: border-color var(--transition-fast), background-color var(--transition-fast);
        }
        
        .search-bar-input:focus {
          border-color: var(--accent-gold);
          background-color: var(--bg-secondary);
        }
        
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .actions-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .nav-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--border-radius-round);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }
        
        .nav-icon-btn:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        
        .profile-img-preview {
          width: 36px;
          height: 36px;
          border-radius: var(--border-radius-round);
          object-fit: cover;
          border: 2px solid var(--accent-gold);
          cursor: pointer;
        }
        
        .lang-dropdown-wrapper {
          position: relative;
        }
        
        .lang-menu {
          position: absolute;
          top: 48px;
          right: 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          box-shadow: var(--shadow-lg);
          display: none;
          flex-direction: column;
          min-width: 120px;
        }
        
        .lang-menu.active {
          display: flex;
        }
        
        .lang-menu-item {
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        
        .lang-menu-item:hover {
          background-color: var(--bg-tertiary);
          color: var(--accent-gold);
        }
      </style>
      
      <div class="navbar-container">
        <a href="${prefix}index.html" class="brand-logo">
          <span>Aura<span class="logo-gold">Stitch</span></span>
        </a>
        
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text" class="search-bar-input" placeholder="Search tailors, fabrics, designs..." id="global-search-input">
        </div>
        
        <div class="actions-wrapper">
          <!-- Theme Switcher -->
          <button class="nav-icon-btn" id="theme-toggle-btn" title="Toggle Dark/Light Mode">🌓</button>
          
          <!-- Language Selector -->
          <div class="lang-dropdown-wrapper">
            <button class="nav-icon-btn" id="lang-menu-btn" title="Switch Language">🌐</button>
            <div class="lang-menu" id="lang-dropdown-menu">
              <button class="lang-menu-item" data-lang="en">English</button>
              <button class="lang-menu-item" data-lang="te">తెలుగు</button>
              <button class="lang-menu-item" data-lang="hi">हिंदी</button>
            </div>
          </div>
          
          <!-- Notifications Center Bell -->
          <button class="nav-icon-btn" id="notify-bell-btn" title="Notifications">🔔</button>
          
          <!-- User Profile Icon router -->
          <a href="${prefix}login.html" id="nav-profile-link">
            <img class="profile-img-preview" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Profile">
          </a>
        </div>
      </div>
    `;
  }

  setupListeners() {
    const themeBtn = this.querySelector('#theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        window.AuraTheme.toggleDarkMode();
      });
    }

    const langBtn = this.querySelector('#lang-menu-btn');
    const langMenu = this.querySelector('#lang-dropdown-menu');
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('active');
      });
      
      document.addEventListener('click', () => {
        langMenu.classList.remove('active');
      });
      
      this.querySelectorAll('.lang-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const selectedLang = e.target.getAttribute('data-lang');
          window.AuraLanguage.setLanguage(selectedLang);
        });
      });
    }
    
    // Notifications toggle
    const notifyBtn = this.querySelector('#notify-bell-btn');
    if (notifyBtn) {
      notifyBtn.addEventListener('click', () => {
        window.AuraToasts.show("No new notifications.", "info");
      });
    }
    
    // Autocomplete search listener trigger
    const searchInput = this.querySelector('#global-search-input');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim() !== "") {
          window.AuraToasts.show(`Searching for "${searchInput.value}"...`, "info");
        }
      });
    }
  }
}

customElements.define('app-navbar', AppNavbar);
