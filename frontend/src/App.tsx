import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import ChatSystem from './components/ChatSystem';
import CallOverlay from './components/CallOverlay';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import PendingVerificationPage from './pages/PendingVerificationPage';
import CustomerDashboard from './pages/customer/Dashboard';
import DesignLab from './pages/customer/DesignLab';
import TailorDashboard from './pages/tailor/Dashboard';
import HandloomDashboard from './pages/handloom/Dashboard';
import AIHandloomStudio from './pages/handloom/AIHandloomStudio';
import HandloomProducts from './pages/handloom/Products';
import HandloomCollections from './pages/handloom/Collections';
import HandloomInventory from './pages/handloom/Inventory';
import RawMaterialsMarketplace from './pages/handloom/RawMaterialsMarketplace';
import HandloomSettings from './pages/handloom/Settings';
import SupplierDashboard from './pages/supplier/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AIDashboard from './pages/ai/Dashboard';

import DiscoverPage from './pages/DiscoverPage';
import ReelsPage from './pages/ReelsPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import OrderTimeline from './pages/OrderTimeline';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

interface ToastType {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const AppContent: React.FC = () => {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const { user, loading } = useAuth();

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Route Guard: Authentication check
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
    if (!user) {
      localStorage.setItem('auth_alert_msg', 'No active login session found. Please login or register.');
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  // Route Guard: Role check
  const RoleRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
    if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
    
    // Support weaver alias check
    const currentRole = user?.role === 'weaver' ? 'weaver' : user?.role;
    const isAllowed = allowedRoles.includes(currentRole || '');

    if (!isAllowed && user) {
      localStorage.setItem('auth_alert_msg', 'Unauthorized Access. Redirected to your dashboard.');
      return <Navigate to={`/${user.role}`} replace />;
    }
    return <>{children}</>;
  };

  // Dashboard layout wrapper
  const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [activeCall, setActiveCall] = useState<{ isOpen: boolean; mode: 'voice' | 'video' }>({ isOpen: false, mode: 'voice' });

    return (
      <div className={`app-layout ${collapsed ? 'collapsed' : ''}`}>
        <Navbar showToast={showToast} />
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} showToast={showToast} />
        
        <main className="app-main">
          <Outlet context={{ showToast }} />
        </main>

        <div className="chat-widget-container">
          <button className="chat-trigger-btn" onClick={() => setChatOpen(!chatOpen)}>
            💬
          </button>
        </div>

        <ChatSystem 
          isOpen={chatOpen} 
          onClose={() => setChatOpen(false)} 
          onStartCall={(mode) => setActiveCall({ isOpen: true, mode })} 
          showToast={showToast}
        />

        <CallOverlay 
          isOpen={activeCall.isOpen} 
          mode={activeCall.mode} 
          onHangup={() => setActiveCall({ isOpen: false, mode: 'voice' })} 
          showToast={showToast}
        />

        <BottomNav onToggleChat={() => setChatOpen(!chatOpen)} />
      </div>
    );
  };

  // Guest layout with Navbar (e.g. LandingPage)
  const LandingLayout = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [activeCall, setActiveCall] = useState<{ isOpen: boolean; mode: 'voice' | 'video' }>({ isOpen: false, mode: 'voice' });

    return (
      <div>
        <Navbar showToast={showToast} />
        <main style={{ paddingTop: 'var(--navbar-height)', minHeight: 'calc(100vh - var(--navbar-height))', padding: '30px', backgroundColor: 'var(--bg-primary)' }}>
          <Outlet context={{ showToast }} />
        </main>

        {user && (
          <>
            <div className="chat-widget-container">
              <button className="chat-trigger-btn" onClick={() => setChatOpen(!chatOpen)}>💬</button>
            </div>
            <ChatSystem isOpen={chatOpen} onClose={() => setChatOpen(false)} onStartCall={(mode) => setActiveCall({ isOpen: true, mode })} showToast={showToast} />
            <CallOverlay isOpen={activeCall.isOpen} mode={activeCall.mode} onHangup={() => setActiveCall({ isOpen: false, mode: 'voice' })} showToast={showToast} />
          </>
        )}
        <BottomNav onToggleChat={() => setChatOpen(!chatOpen)} />
      </div>
    );
  };

  return (
    <>
      <Routes>
        {/* Landing Page */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Public auth pages */}
        <Route element={<Outlet context={{ showToast }} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pending-verification" element={<PendingVerificationPage />} />
        </Route>

        {/* Customer preferences onboarding */}
        <Route element={<ProtectedRoute><Outlet context={{ showToast }} /></ProtectedRoute>}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Secured Dashboards Layout */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          {/* Customer */}
          <Route path="/customer" element={<RoleRoute allowedRoles={['customer']}><CustomerDashboard /></RoleRoute>} />
          <Route path="/customer/design-lab" element={<RoleRoute allowedRoles={['customer']}><DesignLab /></RoleRoute>} />
          
          {/* Tailor */}
          <Route path="/tailor" element={<RoleRoute allowedRoles={['tailor']}><TailorDashboard /></RoleRoute>} />
          
          {/* Weaver */}
          <Route path="/handloom" element={<RoleRoute allowedRoles={['weaver']}><HandloomDashboard /></RoleRoute>} />
          <Route path="/handloom/products" element={<RoleRoute allowedRoles={['weaver']}><HandloomProducts /></RoleRoute>} />
          <Route path="/handloom/collections" element={<RoleRoute allowedRoles={['weaver']}><HandloomCollections /></RoleRoute>} />
          <Route path="/handloom/inventory" element={<RoleRoute allowedRoles={['weaver']}><HandloomInventory /></RoleRoute>} />
          <Route path="/handloom/ratings" element={<RoleRoute allowedRoles={['weaver']}><RawMaterialsMarketplace /></RoleRoute>} />
          <Route path="/handloom/settings" element={<RoleRoute allowedRoles={['weaver']}><HandloomSettings /></RoleRoute>} />
          <Route path="/handloom/ai-handloom-studio" element={<RoleRoute allowedRoles={['weaver']}><AIHandloomStudio /></RoleRoute>} />

          {/* Supplier */}
          <Route path="/supplier" element={<RoleRoute allowedRoles={['supplier']}><SupplierDashboard /></RoleRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>} />

          {/* AI recommendations */}
          <Route path="/ai" element={<RoleRoute allowedRoles={['customer']}><AIDashboard /></RoleRoute>} />

          {/* Social Media routes */}
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-timeline" element={<OrderTimeline />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Render Dynamic Toasts */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
      }}>
        {toasts.map((toast) => {
          let icon = '✓';
          let color = 'var(--accent-teal)';
          if (toast.type === 'error') { icon = '✕'; color = 'var(--accent-copper)'; }
          else if (toast.type === 'warning') { icon = '⚠'; color = '#E65C00'; }
          else if (toast.type === 'info') { icon = 'ℹ'; color = 'var(--accent-gold)'; }
          
          return (
            <div 
              key={toast.id} 
              className="glass-panel fade-in"
              style={{
                minWidth: '280px',
                maxWidth: '380px',
                padding: '16px 20px',
                borderLeft: `4px solid ${color}`,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: 'var(--shadow-lg)',
                pointerEvents: 'auto',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ fontWeight: 'bold', color, fontSize: '18px' }}>{icon}</span>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
export default App;
