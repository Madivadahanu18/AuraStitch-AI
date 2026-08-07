import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export interface AccountState {
  photo: string;
  name: string;
  email: string;
  mobile: string;
  isEditing: boolean;
}

export interface PreferencesState {
  language: string;
  currency: string;
  themeMode: 'light' | 'dark' | 'system';
}

export interface NotificationsState {
  orderUpdates: boolean;
  promotions: boolean;
  messages: boolean;
  aiRecommendations: boolean;
}

export interface PrivacyState {
  twoFactorEnabled: boolean;
}

const STORAGE_KEY = 'aurastitch_customer_settings_v1';

const DEFAULT_SETTINGS = {
  account: {
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    mobile: '+91 98765 43210',
    isEditing: false,
  },
  preferences: {
    language: 'English',
    currency: 'INR (₹)',
    themeMode: 'dark' as 'light' | 'dark' | 'system',
  },
  notifications: {
    orderUpdates: true,
    promotions: false,
    messages: true,
    aiRecommendations: true,
  },
  privacy: {
    twoFactorEnabled: false,
  },
};

export const CustomerSettings: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const { user } = useAuth();
  const { setTheme } = useTheme();

  // Load from localStorage or defaults
  const [account, setAccount] = useState<AccountState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.account) return parsed.account;
      }
    } catch (e) {}
    return {
      ...DEFAULT_SETTINGS.account,
      name: user?.name || DEFAULT_SETTINGS.account.name,
      email: user?.email || DEFAULT_SETTINGS.account.email,
    };
  });

  const [preferences, setPreferences] = useState<PreferencesState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.preferences) return parsed.preferences;
      }
    } catch (e) {}
    return DEFAULT_SETTINGS.preferences;
  });

  const [notifications, setNotifications] = useState<NotificationsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.notifications) return parsed.notifications;
      }
    } catch (e) {}
    return DEFAULT_SETTINGS.notifications;
  });

  const [privacy, setPrivacy] = useState<PrivacyState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.privacy) return parsed.privacy;
      }
    } catch (e) {}
    return DEFAULT_SETTINGS.privacy;
  });

  // UI state for password change & modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFields, setPasswordFields] = useState({ current: '', next: '', confirm: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeAppModal, setActiveAppModal] = useState<'policy' | 'terms' | 'help' | 'about' | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  // Sync theme selection with ThemeContext if light/dark
  useEffect(() => {
    if (preferences.themeMode === 'light') {
      setTheme('light');
    } else if (preferences.themeMode === 'dark') {
      setTheme('traditional'); // AuraStitch dark theme mapping
    }
  }, [preferences.themeMode, setTheme]);

  const handleSaveAll = () => {
    const fullState = { account, preferences, notifications, privacy };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullState));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
    showToast('All customer settings saved successfully!', 'success');
  };

  const handleResetAll = () => {
    setAccount(DEFAULT_SETTINGS.account);
    setPreferences(DEFAULT_SETTINGS.preferences);
    setNotifications(DEFAULT_SETTINGS.notifications);
    setPrivacy(DEFAULT_SETTINGS.privacy);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    showToast('Settings reset to defaults', 'info');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAccount((prev) => ({ ...prev, photo: reader.result as string }));
        showToast('Profile photo updated!', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordFields.current || !passwordFields.next) {
      showToast('Please fill out password fields', 'error');
      return;
    }
    if (passwordFields.next !== passwordFields.confirm) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setShowPasswordModal(false);
    setPasswordFields({ current: '', next: '', confirm: '' });
    showToast('Password updated successfully!', 'success');
  };

  return (
    <div className="customer-settings-page fade-in" style={{ padding: '24px', paddingBottom: '100px', maxWidth: '950px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .cs-title-box {
          margin-bottom: 28px;
        }

        .cs-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 4px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cs-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .cs-section-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 26px;
          margin-bottom: 24px;
          box-shadow: 0 8px 25px rgba(212, 163, 115, 0.08);
          transition: all 0.3s ease;
        }

        .cs-section-card:hover {
          border-color: #D4A373;
          box-shadow: 0 12px 32px rgba(212, 163, 115, 0.18);
        }

        .cs-section-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 20px;
          color: #D4A373;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        /* Account Layout */
        .account-flex {
          display: flex;
          gap: 24px;
          align-items: center;
          flex-wrap: wrap;
        }

        .avatar-box {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #D4A373;
          box-shadow: 0 4px 15px rgba(212, 163, 115, 0.25);
          flex-shrink: 0;
          background: #111;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-upload-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          font-size: 11px;
          text-align: center;
          padding: 4px 0;
          cursor: pointer;
        }

        .account-fields-grid {
          flex: 1;
          min-width: 250px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .cs-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cs-field-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cs-input {
          padding: 11px 16px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          transition: all 0.25s ease;
        }

        .cs-input:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .cs-input:focus {
          border-color: #D4A373;
          box-shadow: 0 0 0 3px rgba(212, 163, 115, 0.2);
        }

        .account-btn-row {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        /* Controls Grid */
        .cs-controls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }

        /* Toggle Switches */
        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          background: var(--bg-tertiary);
          border-radius: 16px;
          border: 1px solid var(--border-color);
        }

        .toggle-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .switch-input {
          width: 46px;
          height: 24px;
          appearance: none;
          background: var(--border-color);
          outline: none;
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .switch-input:checked {
          background: linear-gradient(135deg, #D4A373 0%, #C06C84 100%);
        }

        .switch-input::before {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          background: #fff;
          transition: transform 0.3s ease;
        }

        .switch-input:checked::before {
          transform: translateX(22px);
          background: #FFFFFF;
        }

        /* Application List */
        .app-info-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .app-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .app-info-item:hover {
          border-color: var(--accent-gold);
        }

        /* Global Action Buttons */
        .global-actions-row {
          display: flex;
          gap: 16px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .btn-cs-primary {
          flex: 2;
          min-width: 160px;
          padding: 14px 24px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          border: none;
          color: #000;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-cs-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(212, 160, 23, 0.35);
        }

        .btn-cs-secondary {
          flex: 1;
          min-width: 140px;
          padding: 14px 20px;
          border-radius: 8px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cs-secondary:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-cs-danger {
          background: rgba(230, 57, 70, 0.15);
          border: 1px solid #e63946;
          color: #e63946;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-cs-danger:hover {
          background: #e63946;
          color: #fff;
        }

        /* Modal Overlay */
        .cs-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .cs-modal-content {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          max-width: 480px;
          width: 100%;
          padding: 28px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>

      {/* Header */}
      <div className="cs-title-box">
        <h1 className="cs-title">
          <span>⚙️</span> Customer Settings
        </h1>
        <span className="cs-subtitle">Manage your account profile, preferences, notifications & security</span>
      </div>

      {/* 1. ACCOUNT */}
      <div className="cs-section-card">
        <div className="cs-section-title">
          <span>👤</span> ACCOUNT
        </div>

        <div className="account-flex">
          <div className="avatar-box">
            <img src={account.photo} alt={account.name} className="avatar-img" />
            <label className="avatar-upload-overlay">
              📷 Change
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
            </label>
          </div>

          <div className="account-fields-grid">
            <div className="cs-field-group">
              <label className="cs-field-label">Full Name</label>
              <input
                type="text"
                className="cs-input"
                disabled={!account.isEditing}
                value={account.name}
                onChange={(e) => setAccount({ ...account, name: e.target.value })}
              />
            </div>

            <div className="cs-field-group">
              <label className="cs-field-label">Email Address</label>
              <input
                type="email"
                className="cs-input"
                disabled={!account.isEditing}
                value={account.email}
                onChange={(e) => setAccount({ ...account, email: e.target.value })}
              />
            </div>

            <div className="cs-field-group">
              <label className="cs-field-label">Mobile Number</label>
              <input
                type="text"
                className="cs-input"
                disabled={!account.isEditing}
                value={account.mobile}
                onChange={(e) => setAccount({ ...account, mobile: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="account-btn-row">
          <button
            className="btn-cs-secondary"
            onClick={() => {
              setAccount((prev) => ({ ...prev, isEditing: !prev.isEditing }));
              if (!account.isEditing) showToast('Editing enabled for profile fields', 'info');
            }}
          >
            {account.isEditing ? '🔒 Lock Editing' : '✏️ Edit Profile'}
          </button>
          <button
            className="btn-cs-primary"
            style={{ flex: 1 }}
            onClick={() => {
              setAccount((prev) => ({ ...prev, isEditing: false }));
              showToast('Account changes saved!', 'success');
            }}
          >
            💾 Save Changes
          </button>
        </div>
      </div>

      {/* 2. PREFERENCES */}
      <div className="cs-section-card">
        <div className="cs-section-title">
          <span>🎨</span> PREFERENCES
        </div>

        <div className="cs-controls-grid">
          <div className="cs-field-group">
            <label className="cs-field-label">Language</label>
            <select
              className="cs-input"
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
            </select>
          </div>

          <div className="cs-field-group">
            <label className="cs-field-label">Currency</label>
            <select
              className="cs-input"
              value={preferences.currency}
              onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
            >
              <option value="INR (₹)">INR (₹) - Indian Rupee</option>
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
              <option value="GBP (£)">GBP (£) - British Pound</option>
            </select>
          </div>

          <div className="cs-field-group">
            <label className="cs-field-label">Theme Mode</label>
            <select
              className="cs-input"
              value={preferences.themeMode}
              onChange={(e) => setPreferences({ ...preferences, themeMode: e.target.value as any })}
            >
              <option value="dark">Dark Theme (Royal Artisan)</option>
              <option value="light">Light Theme (Minimalist)</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. NOTIFICATIONS */}
      <div className="cs-section-card">
        <div className="cs-section-title">
          <span>🔔</span> NOTIFICATIONS
        </div>

        <div className="cs-controls-grid">
          <div className="toggle-row">
            <span className="toggle-label">Order Updates</span>
            <input
              type="checkbox"
              className="switch-input"
              checked={notifications.orderUpdates}
              onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
            />
          </div>

          <div className="toggle-row">
            <span className="toggle-label">Promotions & Offers</span>
            <input
              type="checkbox"
              className="switch-input"
              checked={notifications.promotions}
              onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
            />
          </div>

          <div className="toggle-row">
            <span className="toggle-label">Messages</span>
            <input
              type="checkbox"
              className="switch-input"
              checked={notifications.messages}
              onChange={(e) => setNotifications({ ...notifications, messages: e.target.checked })}
            />
          </div>

          <div className="toggle-row">
            <span className="toggle-label">AI Recommendations</span>
            <input
              type="checkbox"
              className="switch-input"
              checked={notifications.aiRecommendations}
              onChange={(e) => setNotifications({ ...notifications, aiRecommendations: e.target.checked })}
            />
          </div>
        </div>
      </div>

      {/* 4. PRIVACY */}
      <div className="cs-section-card">
        <div className="cs-section-title">
          <span>🛡️</span> PRIVACY & SECURITY
        </div>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn-cs-secondary" onClick={() => setShowPasswordModal(true)}>
            🔑 Change Password
          </button>

          <div className="toggle-row" style={{ flex: 1, minWidth: '220px' }}>
            <span className="toggle-label">Two-Factor Authentication (2FA)</span>
            <input
              type="checkbox"
              className="switch-input"
              checked={privacy.twoFactorEnabled}
              onChange={(e) => {
                setPrivacy({ ...privacy, twoFactorEnabled: e.target.checked });
                showToast(e.target.checked ? '2FA Enabled for account' : '2FA Disabled', 'info');
              }}
            />
          </div>

          <button className="btn-cs-danger" onClick={() => setShowDeleteModal(true)}>
            🗑️ Delete Account
          </button>
        </div>
      </div>

      {/* 5. APPLICATION */}
      <div className="cs-section-card">
        <div className="cs-section-title">
          <span>📱</span> APPLICATION
        </div>

        <div className="app-info-list">
          <div className="app-info-item" style={{ cursor: 'default' }}>
            <span style={{ fontWeight: 600 }}>App Version</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>v2.4.0 (Build 2026.08)</span>
          </div>

          <div className="app-info-item" onClick={() => setActiveAppModal('policy')}>
            <span>🔒 Privacy Policy</span>
            <span style={{ color: 'var(--text-muted)' }}>Read Policy ➔</span>
          </div>

          <div className="app-info-item" onClick={() => setActiveAppModal('terms')}>
            <span>📜 Terms & Conditions</span>
            <span style={{ color: 'var(--text-muted)' }}>View Terms ➔</span>
          </div>

          <div className="app-info-item" onClick={() => setActiveAppModal('help')}>
            <span>💬 Help & Support</span>
            <span style={{ color: 'var(--text-muted)' }}>Contact Support ➔</span>
          </div>

          <div className="app-info-item" onClick={() => setActiveAppModal('about')}>
            <span>ℹ️ About AuraStitch</span>
            <span style={{ color: 'var(--text-muted)' }}>Platform Details ➔</span>
          </div>
        </div>
      </div>

      {/* GLOBAL BUTTONS */}
      <div className="global-actions-row">
        <button className="btn-cs-primary" onClick={handleSaveAll}>
          💾 Save Settings
        </button>
        <button className="btn-cs-secondary" onClick={handleResetAll}>
          ↩️ Reset Settings
        </button>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="cs-modal-overlay fade-in" onClick={() => setShowPasswordModal(false)}>
          <form className="cs-modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleSavePassword}>
            <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>🔑 Change Password</h3>
            <div className="cs-field-group">
              <label className="cs-field-label">Current Password</label>
              <input
                type="password"
                required
                className="cs-input"
                value={passwordFields.current}
                onChange={(e) => setPasswordFields({ ...passwordFields, current: e.target.value })}
              />
            </div>
            <div className="cs-field-group">
              <label className="cs-field-label">New Password</label>
              <input
                type="password"
                required
                className="cs-input"
                value={passwordFields.next}
                onChange={(e) => setPasswordFields({ ...passwordFields, next: e.target.value })}
              />
            </div>
            <div className="cs-field-group">
              <label className="cs-field-label">Confirm New Password</label>
              <input
                type="password"
                required
                className="cs-input"
                value={passwordFields.confirm}
                onChange={(e) => setPasswordFields({ ...passwordFields, confirm: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn-cs-secondary" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-cs-primary">
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Account Modal (UI only) */}
      {showDeleteModal && (
        <div className="cs-modal-overlay fade-in" onClick={() => setShowDeleteModal(false)}>
          <div className="cs-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#e63946', fontFamily: 'var(--font-heading)' }}>
              ⚠️ Delete Account
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Are you sure you want to delete your AuraStitch account? This action cannot be undone and will permanently remove your orders, saved measurements, and custom designs.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="btn-cs-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="btn-cs-danger"
                style={{ flex: 1 }}
                onClick={() => {
                  setShowDeleteModal(false);
                  showToast('Account deletion request submitted (UI Demo)', 'warning');
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Info Modals */}
      {activeAppModal && (
        <div className="cs-modal-overlay fade-in" onClick={() => setActiveAppModal(null)}>
          <div className="cs-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>
              {activeAppModal === 'policy' && '🔒 Privacy Policy'}
              {activeAppModal === 'terms' && '📜 Terms & Conditions'}
              {activeAppModal === 'help' && '💬 Help & Support'}
              {activeAppModal === 'about' && 'ℹ️ About AuraStitch AI'}
            </h3>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, maxHeight: '300px', overflowY: 'auto' }}>
              {activeAppModal === 'policy' && (
                <p>AuraStitch AI respects your privacy. All custom body measurements and design preferences are encrypted and only shared with assigned master tailors and handloom weavers for fulfilling custom orders.</p>
              )}
              {activeAppModal === 'terms' && (
                <p>By using AuraStitch AI, you agree to connect directly with heritage artisans. Custom handloom garments are woven on order with authentic GI-tagged fabrics.</p>
              )}
              {activeAppModal === 'help' && (
                <div>
                  <p>Need assistance with your orders or measurements?</p>
                  <div>📧 Email: support@aurastitch.ai</div>
                  <div>📞 Helpline: +91 (800) 108-AURA</div>
                </div>
              )}
              {activeAppModal === 'about' && (
                <p>AuraStitch AI is an intelligent handloom and custom tailoring ecosystem bridging traditional weavers, master tailors, and fashion enthusiasts through generative design technology.</p>
              )}
            </div>
            <button className="btn-cs-primary" style={{ width: '100%' }} onClick={() => setActiveAppModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSettings;
