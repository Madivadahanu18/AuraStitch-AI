/* AuraStitch AI - Common Utilities, Toasts, Popups & Internationalization */

// Route Protection Guard
(function() {
  const path = window.location.pathname;
  const isProtected = path.includes('/customer/') || path.includes('/tailor/') || path.includes('/handloom/') || path.includes('/supplier/') || path.includes('/admin/') || path.includes('/ai/');
  
  if (isProtected) {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      localStorage.setItem('auth_alert_msg', 'No active login session found. Please login or register to continue.');
      const prefix = '../';
      window.location.replace(prefix + 'login.html');
      return;
    }
    
    // Validate role permissions
    const userObj = JSON.parse(userJson);
    let isAuthorized = true;
    
    if (path.includes('/customer/') && userObj.role !== 'customer') isAuthorized = false;
    else if (path.includes('/tailor/') && userObj.role !== 'tailor') isAuthorized = false;
    else if (path.includes('/handloom/') && userObj.role !== 'weaver') isAuthorized = false;
    else if (path.includes('/supplier/') && userObj.role !== 'supplier') isAuthorized = false;
    else if (path.includes('/admin/') && userObj.role !== 'admin') isAuthorized = false;
    else if (path.includes('/ai/') && userObj.role !== 'customer') isAuthorized = false;
    
    if (!isAuthorized) {
      localStorage.setItem('auth_alert_msg', 'Unauthorized Access. Redirected to your dashboard.');
      const prefix = '../';
      let targetDashboard = 'customer/dashboard.html';
      if (userObj.role === 'tailor') targetDashboard = 'tailor/dashboard.html';
      else if (userObj.role === 'weaver') targetDashboard = 'handloom/dashboard.html';
      else if (userObj.role === 'supplier') targetDashboard = 'supplier/dashboard.html';
      else if (userObj.role === 'admin') targetDashboard = 'admin/dashboard.html';
      
      window.location.replace(prefix + targetDashboard);
    }
  }
})();

// Display pending auth messages on load
window.addEventListener('DOMContentLoaded', () => {
  const alertMsg = localStorage.getItem('auth_alert_msg');
  if (alertMsg) {
    localStorage.removeItem('auth_alert_msg');
    if (window.AuraToasts) {
      window.AuraToasts.show(alertMsg, 'error');
    }
  }
});

// Toast notifications controller
window.AuraToasts = {
  container: null,
  
  init: function() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  },
  
  show: function(message, type = 'success', duration = 3500) {
    this.init();
    const toast = document.createElement('div');
    toast.className = 'glass-panel fade-in';
    
    // Choose icons & color based on alert category
    let icon = '✓';
    let color = 'var(--accent-teal)';
    if (type === 'error') { icon = '✕'; color = 'var(--accent-copper)'; }
    else if (type === 'warning') { icon = '⚠'; color = '#E65C00'; }
    else if (type === 'info') { icon = 'ℹ'; color = 'var(--accent-gold)'; }
    
    toast.style.cssText = `
      min-width: 280px;
      max-width: 380px;
      padding: 16px 20px;
      border-left: 4px solid ${color};
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: var(--shadow-lg);
      pointer-events: auto;
      transform: translateY(-20px);
      transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    toast.innerHTML = `
      <span style="font-weight:bold; color:${color}; font-size:18px;">${icon}</span>
      <span style="font-size:14px; font-weight:500;">${message}</span>
    `;
    
    this.container.appendChild(toast);
    
    // Animate slide up
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto remove after time
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }
};

// Dynamic Dialog Modal popup window
window.AuraModals = {
  showConfirm: function({ title, text, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) {
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
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
      opacity: 0;
      transition: opacity 0.2s ease;
    `;
    
    const card = document.createElement('div');
    card.className = 'glass-panel';
    card.style.cssText = `
      width: 90%;
      max-width: 420px;
      padding: 30px;
      text-align: center;
      transform: scale(0.9);
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    card.innerHTML = `
      <h3 style="margin-bottom:12px; font-size:22px;">${title}</h3>
      <p style="margin-bottom:24px; color:var(--text-secondary); font-size:15px;">${text}</p>
      <div style="display:flex; gap:12px; justify-content:center;">
        <button class="btn-secondary" id="modal-cancel-btn">${cancelText}</button>
        <button class="btn-primary" id="modal-confirm-btn">${confirmText}</button>
      </div>
    `;
    
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
    
    // Triggers
    setTimeout(() => {
      backdrop.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, 10);
    
    const close = () => {
      backdrop.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      setTimeout(() => backdrop.remove(), 200);
    };
    
    card.querySelector('#modal-cancel-btn').onclick = () => { close(); };
    card.querySelector('#modal-confirm-btn').onclick = () => {
      close();
      if (onConfirm) onConfirm();
    };
  },

  showOrderAgreement: function({ title = "Order Agreement & Terms", orderName = "", orderPrice = "", onNext, onCancel }) {
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.72);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
      box-sizing: border-box;
      opacity: 0;
      transition: opacity 0.25s ease;
    `;

    const card = document.createElement('div');
    card.className = 'glass-panel';
    card.style.cssText = `
      width: 100%;
      max-width: 640px;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--accent-gold);
      border-radius: var(--border-radius-lg, 16px);
      padding: 0;
      overflow: hidden;
      transform: scale(0.92);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: var(--shadow-lg, 0 20px 50px rgba(0,0,0,0.6));
    `;

    card.innerHTML = `
      <div style="padding:20px 24px 16px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:flex-start; background:linear-gradient(180deg, rgba(197,160,89,0.08) 0%, transparent 100%);">
        <div>
          <h3 style="margin:0 0 4px; font-size:20px; font-family:var(--font-heading); color:var(--text-primary); display:flex; align-items:center; gap:8px;">
            <span>📜</span> ${title}
          </h3>
          <p style="margin:0; font-size:12.5px; color:var(--text-secondary);">
            Please review the AuraStitch transaction terms before confirming your order.
          </p>
        </div>
        <button id="agreement-close-x" style="background:transparent; border:none; color:var(--text-secondary); font-size:20px; cursor:pointer; padding:4px;">✕</button>
      </div>

      <div style="padding:20px 24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:16px;">
        ${orderName ? `
          <div style="background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; font-size:13px;">
            <span><strong>${orderName}</strong></span>
            ${orderPrice ? `<span style="color:var(--accent-gold-dark); font-weight:800;">${orderPrice}</span>` : ''}
          </div>
        ` : ''}

        <div style="background:rgba(0,0,0,0.2); border:1px solid var(--border-color); border-radius:10px; padding:16px; display:flex; flex-direction:column; gap:16px; max-height:300px; overflow-y:auto;">
          <div style="display:flex; gap:12px;">
            <div style="font-size:18px;">📋</div>
            <div>
              <h5 style="margin:0 0 4px; font-size:14px; font-weight:700;">1. Order Confirmation</h5>
              <p style="margin:0; font-size:12px; color:var(--text-secondary); line-height:1.5;">
                Placing this order confirms your purchase of authentic handcrafted textiles or custom tailoring. Sizing, fabric weave, and submitted measurements are verified upon confirmation. A tracking timeline and digital invoice will be generated.
              </p>
            </div>
          </div>

          <div style="display:flex; gap:12px;">
            <div style="font-size:18px;">💳</div>
            <div>
              <h5 style="margin:0 0 4px; font-size:14px; font-weight:700;">2. Payment & Escrow Protection</h5>
              <p style="margin:0; font-size:12px; color:var(--text-secondary); line-height:1.5;">
                All payments are securely handled with platform escrow and released to verified artisans, tailors, and suppliers based on completed production milestones and certified delivery.
              </p>
            </div>
          </div>

          <div style="display:flex; gap:12px;">
            <div style="font-size:18px;">🔄</div>
            <div>
              <h5 style="margin:0 0 4px; font-size:14px; font-weight:700;">3. Cancellation & Returns</h5>
              <p style="margin:0; font-size:12px; color:var(--text-secondary); line-height:1.5;">
                Standard orders may be cancelled within 24 hours of placement. 7-day hassle-free returns on unused items with craft tags intact. Custom-tailored items include free fitting adjustments if sizing deviates.
              </p>
            </div>
          </div>

          <div style="display:flex; gap:12px;">
            <div style="font-size:18px;">🚚</div>
            <div>
              <h5 style="margin:0 0 4px; font-size:14px; font-weight:700;">4. Delivery Timelines</h5>
              <p style="margin:0; font-size:12px; color:var(--text-secondary); line-height:1.5;">
                Standard deliveries dispatch in 3–5 business days; bespoke handloom and custom tailoring deliver in 7–12 days. GPS milestone tracking is active throughout transit.
              </p>
            </div>
          </div>

          <div style="display:flex; gap:12px;">
            <div style="font-size:18px;">🤝</div>
            <div>
              <h5 style="margin:0 0 4px; font-size:14px; font-weight:700;">5. Customer & Seller Responsibilities</h5>
              <p style="margin:0; font-size:12px; color:var(--text-secondary); line-height:1.5;">
                Customer: Providing accurate measurements and delivery address. Seller: Handcrafting genuine certified weaves, maintaining quality assurance, and honoring delivery dates.
              </p>
            </div>
          </div>
        </div>

        <label style="display:flex; align-items:center; gap:10px; padding:12px 14px; background:rgba(197,160,89,0.08); border:1px solid rgba(197,160,89,0.25); border-radius:8px; cursor:pointer;" for="agreement-chk">
          <input type="checkbox" id="agreement-chk" style="width:18px; height:18px; cursor:pointer;" />
          <span style="font-size:13px; font-weight:600; color:var(--text-primary); cursor:pointer;">
            I have read and agree to the terms and conditions.
          </span>
        </label>
      </div>

      <div style="padding:14px 24px; border-top:1px solid var(--border-color); display:flex; justify-content:flex-end; gap:12px; background:var(--bg-secondary);">
        <button id="agreement-cancel-btn" class="btn-secondary" style="padding:9px 20px; font-size:13px;">Cancel</button>
        <button id="agreement-next-btn" class="btn-primary" style="padding:9px 28px; font-size:13px; opacity:0.45; cursor:not-allowed;" disabled>
          Next →
        </button>
      </div>
    `;

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    setTimeout(() => {
      backdrop.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, 10);

    const close = () => {
      backdrop.style.opacity = '0';
      card.style.transform = 'scale(0.92)';
      setTimeout(() => backdrop.remove(), 200);
    };

    const chk = card.querySelector('#agreement-chk');
    const nextBtn = card.querySelector('#agreement-next-btn');
    const cancelBtn = card.querySelector('#agreement-cancel-btn');
    const closeX = card.querySelector('#agreement-close-x');

    chk.onchange = () => {
      if (chk.checked) {
        nextBtn.removeAttribute('disabled');
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
      } else {
        nextBtn.setAttribute('disabled', 'true');
        nextBtn.style.opacity = '0.45';
        nextBtn.style.cursor = 'not-allowed';
      }
    };

    cancelBtn.onclick = () => {
      close();
      if (onCancel) onCancel();
    };

    closeX.onclick = () => {
      close();
      if (onCancel) onCancel();
    };

    nextBtn.onclick = () => {
      if (chk.checked) {
        close();
        if (onNext) onNext();
      }
    };
  }
};

// Global Translation Dictionary Mock
window.AuraLanguage = {
  current: localStorage.getItem('aurastitch-lang') || 'en',
  
  dictionary: {
    en: {
      welcome: "Welcome to AuraStitch AI",
      home: "Home", search: "Search", reels: "Reels", messages: "Messages", profile: "Profile",
      orders: "Orders", designs: "Saved Designs", settings: "Settings"
    },
    te: {
      welcome: "ఆరాస్టిచ్ AI కి స్వాగతం",
      home: "హోమ్", search: "శోధన", reels: "రీల్స్", messages: "సందేశాలు", profile: "ప్రొఫైల్",
      orders: "ఆర్డర్లు", designs: "రూపకల్పనలు", settings: "సెట్టింగులు"
    },
    hi: {
      welcome: "ऑरास्टिच AI में आपका स्वागत है",
      home: "होम", search: "खोजें", reels: "रील्स", messages: "संदेश", profile: "प्रोफ़ाइल",
      orders: "ऑर्डर", designs: "डिज़ाइन्स", settings: "सेटिंग्स"
    }
  },
  
  setLanguage: function(lang) {
    this.current = lang;
    localStorage.setItem('aurastitch-lang', lang);
    window.AuraToasts.show(`Language changed to ${lang === 'te' ? 'తెలుగు' : lang === 'hi' ? 'हिंदी' : 'English'}`, 'info');
    
    // Dispatch standard changes trigger
    window.dispatchEvent(new CustomEvent('langchanged', { detail: { lang: lang } }));
  },
  
  translate: function(key) {
    return this.dictionary[this.current]?.[key] || key;
  }
};
