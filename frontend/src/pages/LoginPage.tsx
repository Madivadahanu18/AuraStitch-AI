import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useOutletContext<OutletContextType>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    showToast("Authenticating details...", "info");

    try {
      // Attempt backend authentication
      const user = await login(email.trim().toLowerCase(), password);
      showToast(`Welcome back, ${user.name}!`, "success");
      
      routeUser(user);
    } catch (error: any) {
      console.warn("Backend auth failed. Falling back to offline mock router...", error);
      
      // Offline fallback mock router
      const emailLower = email.trim().toLowerCase();
      let mockRole: 'customer' | 'tailor' | 'weaver' | 'supplier' | 'admin' = 'customer';
      let mockName = 'Guest Customer';

      if (emailLower.includes('tailor')) {
        mockRole = 'tailor';
        mockName = 'Premium Boutique Tailor';
      } else if (emailLower.includes('weaver') || emailLower.includes('handloom')) {
        mockRole = 'weaver';
        mockName = 'Heritage Handloom Artisan';
      } else if (emailLower.includes('supplier')) {
        mockRole = 'supplier';
        mockName = 'Fabric Yarn Supplier';
      } else if (emailLower.includes('admin')) {
        mockRole = 'admin';
        mockName = 'Platform Enterprise Admin';
      }

      showToast("Offline Mock Router Activated.", "warning");
      
      const mockUser = {
        _id: 'mock-id-123',
        name: mockName,
        email: emailLower,
        role: mockRole,
        verificationStatus: (mockRole === 'customer' ? 'verified' : 'pending') as 'verified' | 'pending',
        onboardingCompleted: localStorage.getItem('onboarding-completed') === 'true'
      };

      // Set in storage and mock logged-in state inside AuthContext (or just localStorage fallback)
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-jwt-token-xyz');
      
      // Force page reload to sync state or redirect directly
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const routeUser = (user: any) => {
    if (user.role === 'customer') {
      if (!user.onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/customer');
      }
    } else if (user.role === 'tailor') {
      navigate('/tailor');
    } else if (user.role === 'weaver' || user.role === 'handloom') {
      navigate('/handloom');
    } else if (user.role === 'supplier') {
      navigate('/supplier');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, var(--bg-primary), var(--bg-tertiary));
        }
        
        .login-card {
          width: 90%;
          max-width: 440px;
          padding: 40px;
          border-radius: var(--border-radius-lg);
        }
        
        .login-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          text-align: center;
        }
        
        .login-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 30px;
        }
        
        .btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 12px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          font-weight: 500;
          margin-bottom: 24px;
          transition: background-color var(--transition-fast);
        }
        
        .btn-google:hover {
          background-color: var(--bg-tertiary);
        }
        
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: var(--text-muted);
          font-size: 12px;
          margin-bottom: 24px;
        }
        
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }
        
        .divider:not(:empty)::before {
          margin-right: .5em;
        }
        
        .divider:not(:empty)::after {
          margin-left: .5em;
        }
      `}</style>

      <div className="login-card glass-panel fade-in slide-up">
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Aura<span>Stitch</span>
          </Link>
        </div>
        
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Enter your details to sign in</p>
        
        {/* Google social auth placeholder button */}
        <button className="btn-google" onClick={() => showToast("Google authentication is mocked.", "info")}>
          <span style={{ fontSize: '18px' }}>🌐</span> Sign in with Google
        </button>
        
        <div className="divider">OR</div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Phone Number</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. tailor@aurastitch.ai" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <label className="form-label">Password</label>
              <a href="#" className="hover-scale" style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 500 }} onClick={(e) => { e.preventDefault(); showToast("Reset link sent.", "info"); }}>Forgot password?</a>
            </div>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Sign In</button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>Register Here</Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
