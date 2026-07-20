import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Customer specific
  const [phone, setPhone] = useState('');

  // Tailor specific
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('');

  // Weaver specific
  const [businessName, setBusinessName] = useState('');
  const [stateOfOrigin, setStateOfOrigin] = useState('');
  const [weavingType, setWeavingType] = useState('');

  // Supplier specific
  const [productCategories, setProductCategories] = useState('');

  // File upload state (mocked)
  const [govIdFile, setGovIdFile] = useState<File | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useOutletContext<OutletContextType>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      showToast("Please select an account type first.", "warning");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    
    showToast("Creating account...", "info");

    const extraFields: Record<string, any> = {};
    if (role === 'customer') {
      extraFields.phone = phone;
    } else if (role === 'tailor') {
      extraFields.shopName = shopName;
      extraFields.address = address;
      extraFields.experience = Number(experience) || 0;
      extraFields.specialization = specialization;
      extraFields.govId = govIdFile ? govIdFile.name : '';
    } else if (role === 'weaver') {
      extraFields.businessName = businessName;
      extraFields.stateOfOrigin = stateOfOrigin;
      extraFields.weavingType = weavingType;
      extraFields.govId = govIdFile ? govIdFile.name : '';
    } else if (role === 'supplier') {
      extraFields.shopName = shopName;
      extraFields.productCategories = productCategories;
      extraFields.govId = govIdFile ? govIdFile.name : '';
    }

    try {
      const user = await register(name, email.trim().toLowerCase(), password, role, extraFields);
      showToast("Account created successfully!", "success");
      routeUser(user);
    } catch (error: any) {
      console.warn("Backend register failed, using offline fallback...", error);
      
      const mockUser = {
        _id: 'mock-id-123',
        name: name,
        email: email.trim().toLowerCase(),
        role: role as any,
        verificationStatus: (role === 'customer' ? 'verified' : 'pending') as any,
        onboardingCompleted: false,
        ...extraFields
      };

      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-jwt-token-xyz');
      
      showToast("Offline Registration Successful.", "success");
      
      setTimeout(() => {
        routeUser(mockUser);
        window.location.reload();
      }, 500);
    }
  };

  const routeUser = (user: any) => {
    if (user.role === 'customer') {
      navigate('/onboarding');
    } else {
      navigate('/pending-verification');
    }
  };

  return (
    <div className="register-container">
      <style>{`
        .register-container {
          width: 100vw;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, var(--bg-primary), var(--bg-tertiary));
        }
        
        .register-card {
          width: 100%;
          max-width: 600px;
          padding: 40px;
          border-radius: var(--border-radius-lg);
        }
        
        .role-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 30px;
        }
        
        .role-card {
          padding: 20px;
          text-align: center;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .role-card:hover, .role-card.active {
          border-color: var(--accent-gold);
          background-color: var(--bg-tertiary);
        }
        
        .role-card.active {
          box-shadow: 0 0 15px var(--accent-gold-glow);
        }
        
        .role-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
        
        .dynamic-form-section {
          display: none;
        }
        
        .dynamic-form-section.active {
          display: block;
        }
      `}</style>

      <div className="register-card glass-panel fade-in slide-up">
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Aura<span style={{ color: 'var(--accent-gold)' }}>Stitch</span>
          </Link>
        </div>
        
        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '32px', marginBottom: '8px' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '30px' }}>Choose account type to start</p>
        
        {/* Step 1: Account Type Selection Grid */}
        <div className="role-grid">
          <div className={`role-card ${role === 'customer' ? 'active' : ''}`} onClick={() => setRole('customer')}>
            <div className="role-icon">👤</div>
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Customer</h4>
          </div>
          <div className={`role-card ${role === 'tailor' ? 'active' : ''}`} onClick={() => setRole('tailor')}>
            <div className="role-icon">✂</div>
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Fashion Tailor</h4>
          </div>
          <div className={`role-card ${role === 'weaver' ? 'active' : ''}`} onClick={() => setRole('weaver')}>
            <div className="role-icon">🥻</div>
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Handloom Weaver</h4>
          </div>
          <div className={`role-card ${role === 'supplier' ? 'active' : ''}`} onClick={() => setRole('supplier')}>
            <div className="role-icon">🧶</div>
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Textile Supplier</h4>
          </div>
        </div>
        
        {/* Step 2: Dynamic Form Fields based on role selection */}
        <form onSubmit={handleSubmit}>
          {/* Customer Form Fields */}
          {role === 'customer' && (
            <div className="dynamic-form-section active" id="form-customer">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="e.g. customer@aurastitch.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
          )}
          
          {/* Tailor Form Fields */}
          {role === 'tailor' && (
            <div className="dynamic-form-section active" id="form-tailor">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Tailor Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="e.g. tailor@aurastitch.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Shop Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Fashion Shop Name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Shop Street Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="e.g. 5"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Bridal Blouses, Lehenga"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload Government ID File</label>
                <input 
                  type="file" 
                  className="form-input"
                  onChange={(e) => setGovIdFile(e.target.files ? e.target.files[0] : null)}
                  required 
                />
              </div>
            </div>
          )}
          
          {/* Weaver Form Fields */}
          {role === 'weaver' && (
            <div className="dynamic-form-section active" id="form-weaver">
              <div className="form-group">
                <label className="form-label">Artisan Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Weaver Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="e.g. weaver@aurastitch.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Weaving Loom Business"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">State of Origin</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Andhra Pradesh"
                  value={stateOfOrigin}
                  onChange={(e) => setStateOfOrigin(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Traditional Weaving Type</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Pochampally, Ikat, silk"
                  value={weavingType}
                  onChange={(e) => setWeavingType(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload Artisan ID / Govt ID</label>
                <input 
                  type="file" 
                  className="form-input"
                  onChange={(e) => setGovIdFile(e.target.files ? e.target.files[0] : null)}
                  required 
                />
              </div>
            </div>
          )}
          
          {/* Supplier Form Fields */}
          {role === 'supplier' && (
            <div className="dynamic-form-section active" id="form-supplier">
              <div className="form-group">
                <label className="form-label">Owner Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Wholesaler Owner Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="e.g. supplier@aurastitch.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Shop Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Textiles Shop Name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Product Categories</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Silk fabrics, Borders, Beads"
                  value={productCategories}
                  onChange={(e) => setProductCategories(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload Trade License / Govt ID</label>
                <input 
                  type="file" 
                  className="form-input"
                  onChange={(e) => setGovIdFile(e.target.files ? e.target.files[0] : null)}
                  required 
                />
              </div>
            </div>
          )}
          
          {/* Common Credentials Fields */}
          {role !== '' && (
            <div id="credentials-common-section" style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>Complete Registration</button>
            </div>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>Login Here</Link>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
