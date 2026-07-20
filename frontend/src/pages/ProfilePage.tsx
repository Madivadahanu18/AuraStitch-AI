import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface ProfileDataType {
  user: {
    name: string;
    email: string;
    role: string;
  };
  posts: any[];
  reels: any[];
  saved: any[];
  followersCount: number;
  followingCount: number;
}

export const ProfilePage: React.FC = () => {
  const { showToast } = useOutletContext<OutletContextType>();
  const { user, logout, token } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved' | 'wishlist' | 'orders' | 'reviews' | 'settings'>('posts');
  const [profileData, setProfileData] = useState<ProfileDataType | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/social';

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/profile/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn("Using offline mock profile data...");
      setProfileData({
        user: {
          name: user.name || 'Professional Partner',
          email: user.email || 'partner@aurastitch.ai',
          role: user.role || 'customer'
        },
        posts: [
          { _id: 'p1', images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'], caption: 'Handmade collection weave.' },
          { _id: 'p2', images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80'], caption: 'Boutique bridal custom design.' }
        ],
        reels: [
          { _id: 'r1', videoUrl: 'https://assets.mixkit.co/...', caption: 'Sewing progress!' }
        ],
        saved: [],
        followersCount: 342,
        followingCount: 198
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleLogoutClick = () => {
    logout();
    showToast("Successfully logged out.", "success");
    navigate('/');
  };

  if (loading || !profileData) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}><div className="spinner"></div></div>;
  }

  return (
    <div className="profile-page-container fade-in">
      <style>{`
        .profile-page-container {
          padding: 24px;
          padding-bottom: 90px;
          max-width: 935px;
          margin: 0 auto;
        }

        .profile-header-card {
          display: flex;
          align-items: center;
          gap: 40px;
          margin-bottom: 44px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.1));
        }

        .profile-avatar-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-gold, #C5A059), #B85A38);
          color: white;
          font-weight: 700;
          font-size: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
        }

        .profile-user-stats {
          flex: 1;
        }

        .profile-user-row1 {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .profile-username {
          font-size: 28px;
          font-weight: 300;
          margin: 0;
        }

        .profile-stat-numbers {
          display: flex;
          gap: 40px;
          margin-bottom: 20px;
          font-size: 16px;
        }

        .profile-stat-numbers span strong {
          font-weight: 700;
        }

        .profile-bio-details {
          font-size: 14px;
          line-height: 1.5;
        }

        .profile-tabs-header {
          display: flex;
          justify-content: center;
          gap: 50px;
          border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.1));
          margin-bottom: 28px;
        }

        .profile-tab-header-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 12px 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .profile-tab-header-btn.active {
          color: var(--text-primary);
        }

        .profile-tab-header-btn.active::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background-color: var(--text-primary);
        }

        .profile-grid-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .profile-grid-item {
          aspect-ratio: 1;
          background-color: var(--bg-primary);
          overflow: hidden;
          border-radius: 8px;
          box-shadow: var(--shadow-sm);
          position: relative;
          cursor: pointer;
        }

        .profile-grid-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .profile-grid-item:hover .profile-grid-img {
          transform: scale(1.05);
        }

        .profile-grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          color: white;
          font-weight: bold;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .profile-grid-item:hover .profile-grid-overlay {
          opacity: 1;
        }

        .settings-card-body {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 30px;
        }

        @media (max-width: 768px) {
          .profile-header-card {
            flex-direction: column;
            gap: 20px;
            text-align: center;
            align-items: center;
          }
          .profile-user-row1 {
            flex-direction: column;
            gap: 12px;
          }
          .profile-stat-numbers {
            justify-content: center;
            gap: 20px;
          }
          .profile-grid-list {
            gap: 8px;
          }
          .profile-tabs-header {
            gap: 16px;
          }
        }
      `}</style>

      {/* Profile Header Details */}
      <div className="profile-header-card">
        <div className="profile-avatar-circle">
          {profileData.user.name[0].toUpperCase()}
        </div>
        <div className="profile-user-stats">
          <div className="profile-user-row1">
            <h2 className="profile-username">{profileData.user.name}</h2>
            <span className="badge badge-gold">{profileData.user.role.toUpperCase()}</span>
          </div>
          <div className="profile-stat-numbers">
            <span><strong>{profileData.posts.length}</strong> posts</span>
            <span><strong>{profileData.reels.length}</strong> reels</span>
            <span><strong>{profileData.followersCount}</strong> followers</span>
            <span><strong>{profileData.followingCount}</strong> following</span>
          </div>
          <div className="profile-bio-details">
            <strong>Contact: </strong>{profileData.user.email}<br/>
            <span>Luxury Custom Design Studio Profile. Tag designs, review orders, and connect with handloom artisans. ✨</span>
          </div>
        </div>
      </div>

      {/* Tabs Header Navigation */}
      <div className="profile-tabs-header">
        <button className={`profile-tab-header-btn ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>📁 Posts</button>
        <button className={`profile-tab-header-btn ${activeTab === 'reels' ? 'active' : ''}`} onClick={() => setActiveTab('reels')}>🎥 Reels</button>
        <button className={`profile-tab-header-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>💾 Saved</button>
        <button className={`profile-tab-header-btn ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>❤️ Wishlist</button>
        <button className={`profile-tab-header-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>🛍️ Orders</button>
        <button className={`profile-tab-header-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>⭐ Reviews</button>
        <button className={`profile-tab-header-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>⚙️ Settings</button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'posts' && (
        <div className="profile-grid-list">
          {profileData.posts.map(post => (
            <div key={post._id} className="profile-grid-item">
              <img className="profile-grid-img" src={post.images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80'} alt="post" />
              <div className="profile-grid-overlay">💬 Views</div>
            </div>
          ))}
          {profileData.posts.length === 0 && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No posts uploaded yet.</div>
          )}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="profile-grid-list">
          {profileData.reels.map(reel => (
            <div key={reel._id} className="profile-grid-item" style={{ aspectRatio: '0.6' }}>
              <video className="profile-grid-img" src={reel.videoUrl} muted playsInline />
              <div className="profile-grid-overlay">🎥 Watch</div>
            </div>
          ))}
          {profileData.reels.length === 0 && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No reels uploaded yet.</div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="profile-grid-list">
          {profileData.saved.map(item => (
            <div key={item._id} className="profile-grid-item">
              <img className="profile-grid-img" src={item.post?.images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80'} alt="saved" />
              <div className="profile-grid-overlay">💾 Saved</div>
            </div>
          ))}
          {profileData.saved.length === 0 && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No saved posts.</div>
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h4>Use Wishlist tab to check saved boutique products and fabrics.</h4>
          <p>Redirecting link to the Wishlist bottom navigation icon is fully active!</p>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="settings-card-body">
          <h3 style={{ marginTop: 0 }}>My Active Orders</h3>
          <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '12px' }}>
            <strong>Order ID: #AS-9831</strong><br/>
            <span>Item: Custom Embroidered Pochampally Silk Saree Stitching</span><br/>
            <span>Status: <span style={{ color: 'var(--accent-gold-dark)', fontWeight: 'bold' }}>Stitching In Progress</span></span>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="settings-card-body">
          <h3 style={{ marginTop: 0 }}>Boutique Reviews</h3>
          <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <strong>★★★★★ Priya M.</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>The zardozi border is detailed beautifully, fitting is extremely comfortable!</p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="settings-card-body">
          <h3 style={{ marginTop: 0 }}>AuraStitch Settings</h3>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Theme Options</label>
            <select className="form-input" value={theme} onChange={(e) => setTheme(e.target.value as any)}>
              <option value="light">Minimalist Light Theme</option>
              <option value="traditional">Clay Theme</option>
              <option value="retro">Vintage Retro</option>
              <option value="royal">Royal Silk Theme</option>
              <option value="handloom">Natural Artisan Handloom</option>
              <option value="festival">Saffron Festive</option>
            </select>
          </div>
          <button className="btn-primary" style={{ backgroundColor: 'var(--accent-copper)', color: 'white', border: 'none', padding: '12px 24px', cursor: 'pointer', borderRadius: '4px' }} onClick={handleLogoutClick}>
            Sign Out Account
          </button>
        </div>
      )}
    </div>
  );
};
export default ProfilePage;
