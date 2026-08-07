import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export interface MeasurementFields {
  height: number | string;
  weight: number | string;
  shoulderWidth: number | string;
  chest: number | string;
  waist: number | string;
  hip: number | string;
  neck: number | string;
  sleeveLength: number | string;
  armLength: number | string;
  inseam: number | string;
  thigh: number | string;
  calf: number | string;
}

export interface ProfileRecord {
  name: string;
  lastUpdated: string;
  unit: 'cm' | 'in';
  values: MeasurementFields;
}

const DEFAULT_PROFILES: Record<string, ProfileRecord> = {
  Casual: {
    name: 'Casual',
    lastUpdated: '07 Aug 2026, 11:30 AM',
    unit: 'cm',
    values: {
      height: 172,
      weight: 68,
      shoulderWidth: 42,
      chest: 96,
      waist: 82,
      hip: 98,
      neck: 38,
      sleeveLength: 62,
      armLength: 65,
      inseam: 78,
      thigh: 56,
      calf: 36,
    },
  },
  Traditional: {
    name: 'Traditional',
    lastUpdated: '07 Aug 2026, 02:15 PM',
    unit: 'cm',
    values: {
      height: 172,
      weight: 68,
      shoulderWidth: 43,
      chest: 98,
      waist: 84,
      hip: 100,
      neck: 39,
      sleeveLength: 60,
      armLength: 64,
      inseam: 76,
      thigh: 58,
      calf: 37,
    },
  },
  Wedding: {
    name: 'Wedding',
    lastUpdated: '05 Aug 2026, 05:40 PM',
    unit: 'cm',
    values: {
      height: 172,
      weight: 67,
      shoulderWidth: 42.5,
      chest: 97,
      waist: 81,
      hip: 97.5,
      neck: 38.5,
      sleeveLength: 63,
      armLength: 66,
      inseam: 79,
      thigh: 55,
      calf: 36,
    },
  },
  'Office Wear': {
    name: 'Office Wear',
    lastUpdated: '01 Aug 2026, 10:10 AM',
    unit: 'cm',
    values: {
      height: 172,
      weight: 68,
      shoulderWidth: 42,
      chest: 95,
      waist: 82,
      hip: 97,
      neck: 38,
      sleeveLength: 62,
      armLength: 65,
      inseam: 78,
      thigh: 56,
      calf: 36,
    },
  },
};

const STORAGE_KEY = 'aurastitch_customer_measurements_v1';

export const Measurements: React.FC = () => {
  const context = useOutletContext<OutletContextType | null>();
  const [profiles, setProfiles] = useState<Record<string, ProfileRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved measurements', e);
    }
    return DEFAULT_PROFILES;
  });

  const [activeProfileName, setActiveProfileName] = useState<string>('Casual');
  const [activeUnit, setActiveUnit] = useState<'cm' | 'in'>('cm');
  const [activeField, setActiveField] = useState<string | null>(null);

  const currentProfile = profiles[activeProfileName] || DEFAULT_PROFILES.Casual;
  const [formValues, setFormValues] = useState<MeasurementFields>(currentProfile.values);

  // Sync form values when profile changes
  useEffect(() => {
    if (profiles[activeProfileName]) {
      setFormValues(profiles[activeProfileName].values);
      if (profiles[activeProfileName].unit) {
        setActiveUnit(profiles[activeProfileName].unit);
      }
    }
  }, [activeProfileName, profiles]);

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  const handleInputChange = (field: keyof MeasurementFields, val: string) => {
    const numVal = val === '' ? '' : Number(val);
    setFormValues((prev) => ({
      ...prev,
      [field]: numVal,
    }));
  };

  const nowFormatted = () => {
    const d = new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSave = () => {
    const updatedRecord: ProfileRecord = {
      name: activeProfileName,
      lastUpdated: nowFormatted(),
      unit: activeUnit,
      values: { ...formValues },
    };

    const nextProfiles = {
      ...profiles,
      [activeProfileName]: updatedRecord,
    };

    setProfiles(nextProfiles);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfiles));
    } catch (e) {
      console.error('Failed to save measurements', e);
    }
    showToast(`Saved measurements for profile "${activeProfileName}"!`, 'success');
  };

  const handleUpdate = () => {
    handleSave();
  };

  const handleReset = () => {
    const def = DEFAULT_PROFILES[activeProfileName]?.values || DEFAULT_PROFILES.Casual.values;
    setFormValues(def);
    showToast(`Reset ${activeProfileName} profile to default values`, 'info');
  };

  return (
    <div className="measurements-page fade-in" style={{ padding: '24px', paddingBottom: '100px', maxWidth: '1100px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        .m-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .m-title {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .m-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .profile-selector-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 24px;
          background: var(--bg-secondary);
          padding: 14px 18px;
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--border-color);
        }

        .profile-chip {
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .profile-chip.active {
          background: var(--accent-gold);
          color: #000;
          border-color: var(--accent-gold);
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(212, 160, 23, 0.3);
        }

        .unit-toggle-box {
          margin-left: auto;
          display: flex;
          gap: 4px;
          background: var(--bg-tertiary);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .unit-btn {
          padding: 4px 10px;
          border-radius: 6px;
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
        }

        .unit-btn.active {
          background: var(--accent-gold);
          color: #000;
        }

        /* Main Grid: Form + Silhouette + Preview */
        .m-grid-container {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 24px;
        }

        @media (max-width: 900px) {
          .m-grid-container {
            grid-template-columns: 1fr;
          }
        }

        .m-form-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }

        .m-inputs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 18px;
          margin-bottom: 24px;
        }

        .m-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .m-input-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .m-input-field {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .m-input-field:focus, .m-input-field:hover {
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 2px rgba(212, 160, 23, 0.15);
        }

        /* Buttons Row */
        .m-buttons-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        .btn-m-save {
          flex: 2;
          min-width: 140px;
          padding: 12px 20px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          border: none;
          color: #000;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .btn-m-save:hover {
          transform: translateY(-2px);
        }

        .btn-m-update {
          flex: 1;
          min-width: 110px;
          padding: 12px 16px;
          border-radius: 8px;
          background: rgba(42, 157, 143, 0.15);
          border: 1px solid #2a9d8f;
          color: #2a9d8f;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-m-update:hover {
          background: #2a9d8f;
          color: #fff;
        }

        .btn-m-reset {
          flex: 1;
          min-width: 100px;
          padding: 12px 16px;
          border-radius: 8px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-m-reset:hover {
          color: var(--accent-gold);
          border-color: var(--accent-gold);
        }

        /* Right Panel: Body Silhouette & Preview Summary */
        .m-side-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .silhouette-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          text-align: center;
          box-shadow: var(--shadow-sm);
        }

        .silhouette-title {
          font-size: 14px;
          font-weight: 800;
          margin: 0 0 14px;
          color: var(--text-primary);
        }

        .silhouette-box {
          position: relative;
          width: 100%;
          height: 240px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--bg-primary);
          border-radius: var(--border-radius-md);
          padding: 12px;
          border: 1px solid var(--border-color);
        }

        .preview-summary-card {
          background: var(--bg-secondary);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }

        .preview-title {
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 800;
          margin: 0 0 12px;
          color: var(--text-primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preview-badge {
          font-size: 11px;
          font-weight: 800;
          background: var(--accent-gold);
          color: #000;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .preview-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          font-size: 12px;
        }

        .preview-item {
          background: var(--bg-tertiary);
          padding: 8px 10px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .preview-item-lbl {
          color: var(--text-muted);
          font-size: 10px;
          text-transform: uppercase;
        }

        .preview-item-val {
          font-weight: 800;
          color: var(--text-primary);
        }
      `}</style>

      {/* Header */}
      <div className="m-header">
        <div>
          <h1 className="m-title">
            <span>📏</span> Customer Body Measurements
          </h1>
          <span className="m-subtitle">Set precise tailoring dimensions for custom handloom & artisan fits</span>
        </div>
      </div>

      {/* Profile Selector & Metadata */}
      <div className="profile-selector-row">
        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-secondary)', marginRight: '4px' }}>
          Profile:
        </span>

        {['Casual', 'Traditional', 'Wedding', 'Office Wear'].map((pName) => (
          <button
            key={pName}
            className={`profile-chip ${activeProfileName === pName ? 'active' : ''}`}
            onClick={() => setActiveProfileName(pName)}
          >
            {pName}
          </button>
        ))}

        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>
          🕒 Last Updated: <strong>{currentProfile.lastUpdated || 'Never'}</strong>
        </div>

        <div className="unit-toggle-box">
          <button className={`unit-btn ${activeUnit === 'cm' ? 'active' : ''}`} onClick={() => setActiveUnit('cm')}>
            CM
          </button>
          <button className={`unit-btn ${activeUnit === 'in' ? 'active' : ''}`} onClick={() => setActiveUnit('in')}>
            IN
          </button>
        </div>
      </div>

      {/* Main Form & Interactive Silhouette Layout */}
      <div className="m-grid-container">
        {/* Form Card */}
        <div className="m-form-card">
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Body Measurement Form ({activeProfileName})
          </h3>

          <div className="m-inputs-grid">
            {[
              { key: 'height', label: 'Height (cm)', icon: '📐' },
              { key: 'weight', label: 'Weight (kg)', icon: '⚖️' },
              { key: 'shoulderWidth', label: 'Shoulder Width', icon: '📏' },
              { key: 'chest', label: 'Chest', icon: '👕' },
              { key: 'waist', label: 'Waist', icon: '🎗️' },
              { key: 'hip', label: 'Hip', icon: '👖' },
              { key: 'neck', label: 'Neck', icon: '👔' },
              { key: 'sleeveLength', label: 'Sleeve Length', icon: '✂️' },
              { key: 'armLength', label: 'Arm Length', icon: '💪' },
              { key: 'inseam', label: 'Inseam', icon: '👖' },
              { key: 'thigh', label: 'Thigh', icon: '🦵' },
              { key: 'calf', label: 'Calf', icon: '👟' },
            ].map((item) => (
              <div key={item.key} className="m-input-group">
                <label className="m-input-label">
                  <span>{item.icon}</span> {item.label}
                </label>
                <input
                  type="number"
                  step="0.5"
                  className="m-input-field"
                  value={formValues[item.key as keyof MeasurementFields] ?? ''}
                  onFocus={() => setActiveField(item.key)}
                  onBlur={() => setActiveField(null)}
                  onMouseEnter={() => setActiveField(item.key)}
                  onMouseLeave={() => setActiveField(null)}
                  onChange={(e) => handleInputChange(item.key as keyof MeasurementFields, e.target.value)}
                  placeholder={`Enter ${item.label}`}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="m-buttons-row">
            <button className="btn-m-save" onClick={handleSave}>
              💾 Save Measurements
            </button>
            <button className="btn-m-update" onClick={handleUpdate}>
              🔄 Update
            </button>
            <button className="btn-m-reset" onClick={handleReset}>
              ↩️ Reset
            </button>
          </div>
        </div>

        {/* Right Side: Body Silhouette & Live Preview */}
        <div className="m-side-panel">
          {/* Silhouette Card */}
          <div className="silhouette-card">
            <h4 className="silhouette-title">Human Body Silhouette</h4>
            <div className="silhouette-box">
              <svg width="120" height="220" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Head */}
                <circle cx="50" cy="20" r="14" fill="#333" stroke="var(--accent-gold)" strokeWidth="2" />
                {/* Neck */}
                <rect
                  x="45"
                  y="34"
                  width="10"
                  height="12"
                  fill={activeField === 'neck' ? 'var(--accent-gold)' : '#555'}
                  rx="2"
                />
                {/* Shoulders & Chest */}
                <path
                  d="M20 50 Q50 42 80 50 L75 80 L25 80 Z"
                  fill={activeField === 'shoulderWidth' || activeField === 'chest' ? 'var(--accent-gold)' : '#444'}
                  stroke="var(--border-color)"
                />
                {/* Arms */}
                <rect
                  x="10"
                  y="52"
                  width="10"
                  height="55"
                  rx="4"
                  fill={activeField === 'sleeveLength' || activeField === 'armLength' ? 'var(--accent-gold)' : '#333'}
                />
                <rect
                  x="80"
                  y="52"
                  width="10"
                  height="55"
                  rx="4"
                  fill={activeField === 'sleeveLength' || activeField === 'armLength' ? 'var(--accent-gold)' : '#333'}
                />
                {/* Waist */}
                <rect
                  x="30"
                  y="80"
                  width="40"
                  height="25"
                  fill={activeField === 'waist' ? 'var(--accent-gold)' : '#555'}
                />
                {/* Hips */}
                <path
                  d="M26 105 L74 105 L70 130 L30 130 Z"
                  fill={activeField === 'hip' ? 'var(--accent-gold)' : '#444'}
                />
                {/* Legs (Thigh, Calf, Inseam) */}
                <rect
                  x="30"
                  y="130"
                  width="18"
                  height="35"
                  rx="4"
                  fill={activeField === 'thigh' || activeField === 'inseam' ? 'var(--accent-gold)' : '#333'}
                />
                <rect
                  x="52"
                  y="130"
                  width="18"
                  height="35"
                  rx="4"
                  fill={activeField === 'thigh' || activeField === 'inseam' ? 'var(--accent-gold)' : '#333'}
                />
                <rect
                  x="32"
                  y="165"
                  width="14"
                  height="30"
                  rx="3"
                  fill={activeField === 'calf' ? 'var(--accent-gold)' : '#222'}
                />
                <rect
                  x="54"
                  y="165"
                  width="14"
                  height="30"
                  rx="3"
                  fill={activeField === 'calf' ? 'var(--accent-gold)' : '#222'}
                />
              </svg>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Hover or focus any field to highlight body zone
            </div>
          </div>

          {/* Preview Summary Card */}
          <div className="preview-summary-card">
            <div className="preview-title">
              <span>Preview Summary</span>
              <span className="preview-badge">{activeProfileName}</span>
            </div>

            <div className="preview-list">
              <div className="preview-item">
                <span className="preview-item-lbl">Height / Weight</span>
                <span className="preview-item-val">
                  {formValues.height || '--'} cm / {formValues.weight || '--'} kg
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-item-lbl">Chest / Waist</span>
                <span className="preview-item-val">
                  {formValues.chest || '--'} / {formValues.waist || '--'} {activeUnit}
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-item-lbl">Hip / Shoulder</span>
                <span className="preview-item-val">
                  {formValues.hip || '--'} / {formValues.shoulderWidth || '--'} {activeUnit}
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-item-lbl">Neck / Inseam</span>
                <span className="preview-item-val">
                  {formValues.neck || '--'} / {formValues.inseam || '--'} {activeUnit}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
              ✨ <strong>Fit Recommendation:</strong> Tailored custom fit ready for artisan loom cuts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Measurements;
