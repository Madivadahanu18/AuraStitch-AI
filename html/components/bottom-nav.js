/* AuraStitch AI - Reusable Mobile Bottom Navigation Component */

class AppBottomNav extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const path = window.location.pathname;
    const isNested = path.includes('/customer/') || path.includes('/tailor/') || path.includes('/handloom/') || path.includes('/supplier/') || path.includes('/admin/') || path.includes('/ai/');
    const prefix = isNested ? '../' : './';

    this.innerHTML = `
      <style>
        .bottom-nav-container {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-top: 1px solid var(--border-color);
          z-index: 1000;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.05);
        }
        
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 500;
          text-decoration: none;
          transition: color var(--transition-fast);
          flex: 1;
        }
        
        .bottom-nav-item:hover, .bottom-nav-item.active {
          color: var(--accent-gold);
        }
        
        .bottom-nav-icon {
          font-size: 20px;
        }
        
        @media (max-width: 768px) {
          .bottom-nav-container {
            display: flex;
          }
        }
      </style>
      
      <div class="bottom-nav-container">
        <a href="${prefix}index.html" class="bottom-nav-item">
          <span class="bottom-nav-icon">🏠</span>
          <span>Home</span>
        </a>
        <a href="#" class="bottom-nav-item" id="mobile-search-btn">
          <span class="bottom-nav-icon">🔍</span>
          <span>Search</span>
        </a>
        <a href="#" class="bottom-nav-item" id="mobile-reels-btn">
          <span class="bottom-nav-icon">🎥</span>
          <span>Reels</span>
        </a>
        <a href="#" class="bottom-nav-item" id="mobile-chat-btn">
          <span class="bottom-nav-icon">💬</span>
          <span>Messages</span>
        </a>
        <a href="${prefix}login.html" class="bottom-nav-item">
          <span class="bottom-nav-icon">👤</span>
          <span>Profile</span>
        </a>
      </div>
    `;
    
    this.setupListeners();
  }
  
  setupListeners() {
    const chatBtn = this.querySelector('#mobile-chat-btn');
    if (chatBtn) {
      chatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('togglechat'));
      });
    }
  }
}

customElements.define('app-bottom-nav', AppBottomNav);
