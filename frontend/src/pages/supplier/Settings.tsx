import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface SupplierSettingsData {
  companyName: string;
  ownerName: string;
  gstNumber: string;
  mobileNumber: string;
  email: string;
  businessAddress: string;
  categories: {
    textileMaterials: boolean;
    handloomMaterials: boolean;
  };
  notifications: {
    newOrders: boolean;
    messages: boolean;
    lowStockAlerts: boolean;
    promotions: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    theme: string;
  };
}

const defaultSettings: SupplierSettingsData = {
  companyName: 'AuraStitch Raw Material Suppliers Pvt. Ltd.',
  ownerName: 'Harshitha Madivada',
  gstNumber: '36ABCDE1234F1Z5',
  mobileNumber: '+91 98765 43210',
  email: 'supplier@aurastitch.ai',
  businessAddress: 'Plot 45, Textile Industrial Park, Weavers Colony, Hyderabad, Telangana - 500033',
  categories: {
    textileMaterials: true,
    handloomMaterials: true
  },
  notifications: {
    newOrders: true,
    messages: true,
    lowStockAlerts: true,
    promotions: false
  },
  preferences: {
    language: 'English',
    currency: 'INR (₹)',
    theme: 'Dark Mode'
  }
};

export const SupplierSettings: React.FC = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext<OutletContextType | null>();

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (outletContext?.showToast) {
      outletContext.showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const [formData, setFormData] = useState<SupplierSettingsData>({
    ...defaultSettings,
    ownerName: user?.name || defaultSettings.ownerName,
    email: user?.email || defaultSettings.email
  });

  const handleInputChange = (field: keyof SupplierSettingsData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryToggle = (categoryKey: 'textileMaterials' | 'handloomMaterials') => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryKey]: !prev.categories[categoryKey]
      }
    }));
  };

  const handleNotificationToggle = (notifKey: keyof SupplierSettingsData['notifications']) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [notifKey]: !prev.notifications[notifKey]
      }
    }));
  };

  const handlePreferenceChange = (prefKey: keyof SupplierSettingsData['preferences'], value: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [prefKey]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categories.textileMaterials && !formData.categories.handloomMaterials) {
      showToast('Please select at least one Business Category', 'error');
      return;
    }

    showToast('Supplier settings saved successfully!', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset settings to default values?')) {
      setFormData(defaultSettings);
      showToast('Settings reset to defaults', 'info');
    }
  };

  return (
    <div className="supplier-settings-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .supplier-settings-container {
          color: var(--text-primary);
        }

        .settings-header-banner {
          margin-bottom: 32px;
        }

        .settings-main-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }

        .settings-sub-text {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .settings-section-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
        }

        .settings-section-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .settings-section-title::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 20px;
          background: var(--accent-gold);
          border-radius: 4px;
        }

        .form-grid-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .form-group-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .form-group-field label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .form-input-control {
          padding: 11px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-input-control:focus {
          border-color: var(--accent-gold);
        }

        /* Category Checkboxes */
        .checkbox-group-row {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }

        .custom-checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          user-select: none;
          background: var(--bg-primary);
          padding: 14px 20px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          transition: all 0.2s ease;
          flex: 1;
          min-width: 220px;
        }

        .custom-checkbox-label:hover {
          border-color: var(--accent-gold);
        }

        .custom-checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: var(--accent-gold);
          cursor: pointer;
        }

        /* Toggle Switches */
        .toggle-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }

        .toggle-item-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-primary);
          padding: 16px 20px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }

        .toggle-title {
          font-weight: 700;
          font-size: 14px;
          color: var(--text-primary);
        }

        .toggle-switch-btn {
          position: relative;
          width: 46px;
          height: 24px;
          background: #33333e;
          border-radius: 20px;
          cursor: pointer;
          transition: background 0.3s ease;
          border: none;
          outline: none;
        }

        .toggle-switch-btn.active {
          background: var(--accent-gold);
        }

        .toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          transition: transform 0.3s ease;
        }

        .toggle-switch-btn.active .toggle-knob {
          transform: translateX(22px);
        }

        /* Action Buttons */
        .settings-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 12px;
        }
      `}</style>

      {/* Header Banner */}
      <div className="settings-header-banner">
        <h1 className="settings-main-title">Supplier Account Settings</h1>
        <p className="settings-sub-text">
          Configure your B2B supplier profile, business categories, notification preferences, and regional choices.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Business Information */}
        <div className="settings-section-card">
          <h2 className="settings-section-title">Business Information</h2>

          <div className="form-grid-row">
            <div className="form-group-field">
              <label>Company Name</label>
              <input
                type="text"
                className="form-input-control"
                required
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            </div>

            <div className="form-group-field">
              <label>Owner Name</label>
              <input
                type="text"
                className="form-input-control"
                required
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-row">
            <div className="form-group-field">
              <label>GST Number</label>
              <input
                type="text"
                className="form-input-control"
                required
                value={formData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
              />
            </div>

            <div className="form-group-field">
              <label>Mobile Number</label>
              <input
                type="tel"
                className="form-input-control"
                required
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-row">
            <div className="form-group-field">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input-control"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group-field">
            <label>Business Address</label>
            <textarea
              className="form-input-control"
              rows={3}
              required
              value={formData.businessAddress}
              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            />
          </div>
        </div>

        {/* Section 2: Business Categories */}
        <div className="settings-section-card">
          <h2 className="settings-section-title">Business Categories</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Select the material sectors your supplier business operates in (select one or both):
          </p>

          <div className="checkbox-group-row">
            <label className="custom-checkbox-label">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={formData.categories.textileMaterials}
                onChange={() => handleCategoryToggle('textileMaterials')}
              />
              Textile Materials
            </label>

            <label className="custom-checkbox-label">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={formData.categories.handloomMaterials}
                onChange={() => handleCategoryToggle('handloomMaterials')}
              />
              Handloom Materials
            </label>
          </div>
        </div>

        {/* Section 3: Notification Preferences */}
        <div className="settings-section-card">
          <h2 className="settings-section-title">Notification Preferences</h2>

          <div className="toggle-options-grid">
            <div className="toggle-item-box">
              <span className="toggle-title">New Orders</span>
              <button
                type="button"
                className={`toggle-switch-btn ${formData.notifications.newOrders ? 'active' : ''}`}
                onClick={() => handleNotificationToggle('newOrders')}
              >
                <div className="toggle-knob" />
              </button>
            </div>

            <div className="toggle-item-box">
              <span className="toggle-title">Messages</span>
              <button
                type="button"
                className={`toggle-switch-btn ${formData.notifications.messages ? 'active' : ''}`}
                onClick={() => handleNotificationToggle('messages')}
              >
                <div className="toggle-knob" />
              </button>
            </div>

            <div className="toggle-item-box">
              <span className="toggle-title">Low Stock Alerts</span>
              <button
                type="button"
                className={`toggle-switch-btn ${formData.notifications.lowStockAlerts ? 'active' : ''}`}
                onClick={() => handleNotificationToggle('lowStockAlerts')}
              >
                <div className="toggle-knob" />
              </button>
            </div>

            <div className="toggle-item-box">
              <span className="toggle-title">Promotions</span>
              <button
                type="button"
                className={`toggle-switch-btn ${formData.notifications.promotions ? 'active' : ''}`}
                onClick={() => handleNotificationToggle('promotions')}
              >
                <div className="toggle-knob" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Business Preferences */}
        <div className="settings-section-card">
          <h2 className="settings-section-title">Business Preferences</h2>

          <div className="form-grid-row">
            <div className="form-group-field">
              <label>Language</label>
              <select
                className="form-input-control"
                value={formData.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              </select>
            </div>

            <div className="form-group-field">
              <label>Currency</label>
              <select
                className="form-input-control"
                value={formData.preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
              </select>
            </div>

            <div className="form-group-field">
              <label>Theme</label>
              <select
                className="form-input-control"
                value={formData.preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              >
                <option value="Dark Mode">Dark Mode</option>
                <option value="Light Mode">Light Mode</option>
                <option value="System Default">System Default</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="settings-actions-row">
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '12px 28px', fontSize: '14px' }}
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '12px 32px', fontSize: '14px' }}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierSettings;
