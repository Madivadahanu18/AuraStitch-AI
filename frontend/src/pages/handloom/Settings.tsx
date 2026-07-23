import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  // SECTION 1 - Business Profile State
  const [businessName, setBusinessName] = useState('Pochampally Weavers Cooperative');
  const [storeName, setStoreName] = useState('AuraStitch Handloom House');
  const [ownerName, setOwnerName] = useState(user?.name || 'Ramu Madivadahanu');
  const [contactNumber, setContactNumber] = useState('+91 98765 43210');
  const [email, setEmail] = useState(user?.email || 'weaver@aurastitch.ai');
  const [gstNumber, setGstNumber] = useState('36AAAAA0000A1Z5');
  const [businessAddress, setBusinessAddress] = useState('Plot 42, Pit Loom Artisan Colony, Bhoodan Pochampally');
  const [state, setState] = useState('Telangana');
  const [pinCode, setPinCode] = useState('508284');

  // SECTION 2 - Bank Details State
  const [accountHolder, setAccountHolder] = useState(user?.name || 'Ramu Madivadahanu');
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('•••• •••• •••• 4829');
  const [ifscCode, setIfscCode] = useState('SBIN0020412');
  const [upiId, setUpiId] = useState('weaver@sbi');

  // SECTION 3 - Store Settings State
  const [workingHours, setWorkingHours] = useState('09:00 AM - 07:00 PM IST');
  const [currency, setCurrency] = useState('INR (₹)');
  const [language, setLanguage] = useState('English');
  const [timeZone, setTimeZone] = useState('IST (UTC +05:30)');

  // SECTION 4 - Notifications State
  const [notifyNewOrders, setNotifyNewOrders] = useState(true);
  const [notifyInventoryAlerts, setNotifyInventoryAlerts] = useState(true);
  const [notifyPayments, setNotifyPayments] = useState(true);
  const [notifySupplierUpdates, setNotifySupplierUpdates] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  // SECTION 5 - Security State
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // Modals
  const [showBankModal, setShowBankModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Save All Changes Handler
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Handloom Weaver settings updated successfully!', 'success');
  };

  // Reset Changes Handler
  const handleCancel = () => {
    showToast('Reverted unsaved settings changes.', 'info');
  };

  // Password Change Handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match!', 'error');
      return;
    }
    showToast('Password updated successfully!', 'success');
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Bank Update Handler
  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Bank details updated successfully!', 'success');
    setShowBankModal(false);
  };

  return (
    <div className="handloom-settings-container fade-in" style={{ padding: '24px', paddingBottom: '100px', maxWidth: '1100px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .settings-header-box {
          margin-bottom: 28px;
        }

        .settings-main-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 6px;
          color: var(--text-primary);
        }

        .settings-sub-title {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Settings Card Panels */
        .settings-card-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.2s ease;
        }

        .settings-card-panel:hover {
          border-color: var(--accent-gold);
        }

        .card-panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .panel-icon {
          font-size: 20px;
        }

        .panel-title {
          font-family: var(--font-heading);
          font-size: 19px;
          font-weight: 700;
          margin: 0;
          color: var(--text-primary);
        }

        /* Form Controls */
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .form-group-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .form-input-ctrl {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-input-ctrl:focus {
          border-color: var(--accent-gold);
        }

        /* Toggle Switches */
        .toggle-row-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .toggle-row-item:last-child {
          border-bottom: none;
        }

        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .toggle-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .toggle-desc {
          font-size: 12px;
          color: var(--text-muted);
        }

        .switch-toggle-label {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 26px;
        }

        .switch-toggle-label input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .switch-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          transition: .3s;
          border-radius: 26px;
        }

        .switch-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: #fff;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .switch-slider {
          background-color: var(--accent-gold);
        }

        input:checked + .switch-slider:before {
          transform: translateX(22px);
          background-color: #000;
        }

        /* Action Buttons */
        .btn-setting-outline {
          padding: 9px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-setting-outline:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-setting-gold {
          padding: 9px 16px;
          border-radius: 8px;
          border: 1px solid var(--accent-gold);
          background: rgba(197, 160, 89, 0.15);
          color: var(--accent-gold);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-setting-gold:hover {
          background: var(--accent-gold);
          color: #000;
        }

        /* Sticky Bottom Bar */
        .sticky-bottom-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          padding: 16px 24px;
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          z-index: 100;
          box-shadow: 0 -4px 12px rgba(0,0,0,0.2);
        }

        .btn-save-main {
          padding: 12px 28px;
          border-radius: 30px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #000;
          font-weight: 800;
          font-size: 14px;
          border: none;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease;
        }

        .btn-save-main:hover {
          transform: translateY(-2px);
        }

        .btn-cancel-main {
          padding: 12px 24px;
          border-radius: 30px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }

        /* Modal Overlay */
        .set-modal-backdrop {
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

        .set-modal-dialog {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          width: 100%;
          max-width: 460px;
          padding: 26px;
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; }
          .sticky-bottom-bar { justify-content: center; }
          .btn-save-main, .btn-cancel-main { flex: 1; text-align: center; }
        }
      `}</style>

      {/* Page Header */}
      <div className="settings-header-box">
        <h1 className="settings-main-title">Handloom Weaver Settings</h1>
        <p className="settings-sub-title">
          Manage your artisan business profile, bank account, store preferences, notifications, and security settings.
        </p>
      </div>

      <form onSubmit={handleSaveChanges}>
        {/* SECTION 1 - BUSINESS PROFILE */}
        <div className="settings-card-panel">
          <div className="card-panel-header">
            <span className="panel-icon">🏭</span>
            <h2 className="panel-title">Business Profile</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-grid-2">
              <div className="form-group-item">
                <label className="form-label">Weaver / Business Name</label>
                <input 
                  type="text" 
                  className="form-input-ctrl" 
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                />
              </div>

              <div className="form-group-item">
                <label className="form-label">Store Name</label>
                <input 
                  type="text" 
                  className="form-input-ctrl" 
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group-item">
                <label className="form-label">Owner Name</label>
                <input 
                  type="text" 
                  className="form-input-ctrl" 
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                />
              </div>

              <div className="form-group-item">
                <label className="form-label">Contact Number</label>
                <input 
                  type="text" 
                  className="form-input-ctrl" 
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                />
              </div>

              <div className="form-group-item">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input-ctrl" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group-item">
                <label className="form-label">GST Number</label>
                <input 
                  type="text" 
                  className="form-input-ctrl" 
                  value={gstNumber}
                  onChange={e => setGstNumber(e.target.value)}
                />
              </div>

              <div className="form-group-item">
                <label className="form-label">State</label>
                <input 
                  type="text" 
                  className="form-input-ctrl" 
                  value={state}
                  onChange={e => setState(e.target.value)}
                />
              </div>

              <div className="form-group-item">
                <label className="form-label">PIN Code</label>
                <input 
                  type="text" 
                  className="form-input-ctrl" 
                  value={pinCode}
                  onChange={e => setPinCode(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-item">
              <label className="form-label">Business Address</label>
              <textarea 
                className="form-input-ctrl" 
                rows={2} 
                value={businessAddress}
                onChange={e => setBusinessAddress(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2 - BANK DETAILS */}
        <div className="settings-card-panel">
          <div className="card-panel-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="panel-icon">🏦</span>
              <h2 className="panel-title">Bank Details</h2>
            </div>
            <button type="button" className="btn-setting-gold" onClick={() => setShowBankModal(true)}>
              ✏️ Update Bank Details
            </button>
          </div>

          <div className="form-grid-3">
            <div className="form-group-item">
              <span className="form-label">Account Holder Name</span>
              <strong style={{ fontSize: '15px' }}>{accountHolder}</strong>
            </div>

            <div className="form-group-item">
              <span className="form-label">Bank Name</span>
              <strong style={{ fontSize: '15px' }}>{bankName}</strong>
            </div>

            <div className="form-group-item">
              <span className="form-label">Account Number</span>
              <strong style={{ fontSize: '15px', fontFamily: 'monospace', color: 'var(--accent-gold)' }}>{accountNumber}</strong>
            </div>

            <div className="form-group-item">
              <span className="form-label">IFSC Code</span>
              <strong style={{ fontSize: '15px', fontFamily: 'monospace' }}>{ifscCode}</strong>
            </div>

            <div className="form-group-item">
              <span className="form-label">UPI ID</span>
              <strong style={{ fontSize: '15px', color: '#2a9d8f' }}>{upiId}</strong>
            </div>
          </div>
        </div>

        {/* SECTION 3 - STORE SETTINGS */}
        <div className="settings-card-panel">
          <div className="card-panel-header">
            <span className="panel-icon">⚙️</span>
            <h2 className="panel-title">Store Settings</h2>
          </div>

          <div className="form-grid-2">
            <div className="form-group-item">
              <label className="form-label">Business Working Hours</label>
              <input 
                type="text" 
                className="form-input-ctrl" 
                value={workingHours}
                onChange={e => setWorkingHours(e.target.value)}
              />
            </div>

            <div className="form-group-item">
              <label className="form-label">Default Currency</label>
              <select className="form-input-ctrl" value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
              </select>
            </div>

            <div className="form-group-item">
              <label className="form-label">Language</label>
              <select className="form-input-ctrl" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="English">English</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
              </select>
            </div>

            <div className="form-group-item">
              <label className="form-label">Time Zone</label>
              <select className="form-input-ctrl" value={timeZone} onChange={e => setTimeZone(e.target.value)}>
                <option value="IST (UTC +05:30)">IST (UTC +05:30) - India Standard Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4 - NOTIFICATIONS */}
        <div className="settings-card-panel">
          <div className="card-panel-header">
            <span className="panel-icon">🔔</span>
            <h2 className="panel-title">Notifications</h2>
          </div>

          <div>
            <div className="toggle-row-item">
              <div className="toggle-info">
                <span className="toggle-title">New Orders</span>
                <span className="toggle-desc">Receive instant notifications when customers place handloom saree orders.</span>
              </div>
              <label className="switch-toggle-label">
                <input type="checkbox" checked={notifyNewOrders} onChange={e => setNotifyNewOrders(e.target.checked)} />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="toggle-row-item">
              <div className="toggle-info">
                <span className="toggle-title">Inventory Alerts</span>
                <span className="toggle-desc">Get low-stock and out-of-stock warnings for yarn and product catalogs.</span>
              </div>
              <label className="switch-toggle-label">
                <input type="checkbox" checked={notifyInventoryAlerts} onChange={e => setNotifyInventoryAlerts(e.target.checked)} />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="toggle-row-item">
              <div className="toggle-info">
                <span className="toggle-title">Payment Notifications</span>
                <span className="toggle-desc">Get notified when payouts are credited to your registered bank account.</span>
              </div>
              <label className="switch-toggle-label">
                <input type="checkbox" checked={notifyPayments} onChange={e => setNotifyPayments(e.target.checked)} />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="toggle-row-item">
              <div className="toggle-info">
                <span className="toggle-title">Supplier Updates</span>
                <span className="toggle-desc">Receive alerts on raw material yarn stock availability from suppliers.</span>
              </div>
              <label className="switch-toggle-label">
                <input type="checkbox" checked={notifySupplierUpdates} onChange={e => setNotifySupplierUpdates(e.target.checked)} />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="toggle-row-item">
              <div className="toggle-info">
                <span className="toggle-title">Marketing Notifications</span>
                <span className="toggle-desc">Receive handloom expos, weaver subsidies, and seasonal campaign updates.</span>
              </div>
              <label className="switch-toggle-label">
                <input type="checkbox" checked={notifyMarketing} onChange={e => setNotifyMarketing(e.target.checked)} />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 5 - SECURITY */}
        <div className="settings-card-panel">
          <div className="card-panel-header">
            <span className="panel-icon">🔒</span>
            <h2 className="panel-title">Security Settings</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="toggle-row-item">
              <div className="toggle-info">
                <span className="toggle-title">Two-Factor Authentication (2FA)</span>
                <span className="toggle-desc">Add an extra layer of security requiring SMS OTP for login.</span>
              </div>
              <label className="switch-toggle-label">
                <input type="checkbox" checked={twoFactorAuth} onChange={e => setTwoFactorAuth(e.target.checked)} />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <div>
                <strong style={{ fontSize: '14px', display: 'block' }}>Account Password</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Last changed 45 days ago</span>
              </div>
              <button type="button" className="btn-setting-outline" onClick={() => setShowPasswordModal(true)}>
                🔑 Change Password
              </button>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Active Login Devices</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div>💻 <strong>Windows PC • Chrome Browser</strong> (Hyderabad, India - Active Now)</div>
                <button type="button" className="btn-setting-outline" style={{ fontSize: '11px', padding: '4px 10px', color: '#e63946', borderColor: '#e63946' }} onClick={() => showToast('Logged out from all other active session devices.', 'info')}>
                  Logout All Devices
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6 - ACCOUNT & SUPPORT */}
        <div className="settings-card-panel">
          <div className="card-panel-header">
            <span className="panel-icon">📄</span>
            <h2 className="panel-title">Account & Support</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            <button type="button" className="btn-setting-outline" onClick={() => showToast('Business data archive download started...', 'info')}>
              📥 Download Business Data
            </button>
            <button type="button" className="btn-setting-outline" onClick={() => showToast('Opening AuraStitch Privacy Policy...', 'info')}>
              🛡️ Privacy Policy
            </button>
            <button type="button" className="btn-setting-outline" onClick={() => showToast('Opening Help & Support Center...', 'info')}>
              ❓ Help & Support
            </button>
            <button type="button" className="btn-setting-gold" onClick={() => showToast('Connecting to AuraStitch Weaver Support Team...', 'success')}>
              📞 Contact AuraStitch Team
            </button>
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="sticky-bottom-bar">
          <button type="button" className="btn-cancel-main" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-save-main">
            Save Changes
          </button>
        </div>
      </form>

      {/* UPDATE BANK DETAILS MODAL */}
      {showBankModal && (
        <div className="set-modal-backdrop" onClick={() => setShowBankModal(false)}>
          <div className="set-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Update Bank Details</h3>
              <button onClick={() => setShowBankModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleBankSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-item">
                <label className="form-label">Account Holder Name</label>
                <input type="text" className="form-input-ctrl" value={accountHolder} onChange={e => setAccountHolder(e.target.value)} required />
              </div>

              <div className="form-group-item">
                <label className="form-label">Bank Name</label>
                <input type="text" className="form-input-ctrl" value={bankName} onChange={e => setBankName(e.target.value)} required />
              </div>

              <div className="form-group-item">
                <label className="form-label">Account Number</label>
                <input type="text" className="form-input-ctrl" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
              </div>

              <div className="form-group-item">
                <label className="form-label">IFSC Code</label>
                <input type="text" className="form-input-ctrl" value={ifscCode} onChange={e => setIfscCode(e.target.value)} required />
              </div>

              <div className="form-group-item">
                <label className="form-label">UPI ID</label>
                <input type="text" className="form-input-ctrl" value={upiId} onChange={e => setUpiId(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-setting-outline" style={{ flex: 1 }} onClick={() => setShowBankModal(false)}>Cancel</button>
                <button type="submit" className="btn-setting-gold" style={{ flex: 1, background: 'var(--accent-gold)', color: '#000' }}>Save Bank Info</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="set-modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div className="set-modal-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group-item">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input-ctrl" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
              </div>

              <div className="form-group-item">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input-ctrl" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>

              <div className="form-group-item">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input-ctrl" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-setting-outline" style={{ flex: 1 }} onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button type="submit" className="btn-setting-gold" style={{ flex: 1, background: 'var(--accent-gold)', color: '#000' }}>Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
