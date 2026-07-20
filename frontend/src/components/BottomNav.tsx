import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  onToggleChat: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCreateTab, setActiveCreateTab] = useState<'post' | 'reel' | 'story' | 'other'>('post');

  // Form states
  const [caption, setCaption] = useState('');
  const [mediaUrls, setMediaUrls] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [taggedProducts, setTaggedProducts] = useState('');
  const [taggedTailor, setTaggedTailor] = useState('');
  const [musicInfo, setMusicInfo] = useState('');

  const API_URL = 'http://localhost:5000/api/social';

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      if (activeCreateTab === 'post') {
        const response = await fetch(`${API_URL}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            images: mediaUrls.split(',').map(url => url.trim()).filter(Boolean),
            caption,
            location,
            hashtags: hashtags.split(',').map(h => h.trim().replace('#', '')).filter(Boolean),
            taggedProducts: taggedProducts.split(',').map(p => p.trim()).filter(Boolean),
            taggedTailor
          })
        });
        if (response.ok) {
          alert("Post created successfully! Reloading home feed...");
          setShowCreateModal(false);
          window.location.reload();
        } else {
          const err = await response.json();
          alert(err.message || "Failed to create post.");
        }
      } else if (activeCreateTab === 'reel') {
        const response = await fetch(`${API_URL}/reels`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            videoUrl: mediaUrls.trim(),
            caption,
            musicInfo,
            productTags: taggedProducts.split(',').map(p => p.trim()).filter(Boolean),
            tailorTags: taggedTailor.split(',').map(t => t.trim()).filter(Boolean)
          })
        });
        if (response.ok) {
          alert("Reel uploaded successfully! Navigate to Reels to watch.");
          setShowCreateModal(false);
          navigate('/reels');
          window.location.reload();
        } else {
          const err = await response.json();
          alert(err.message || "Failed to upload reel.");
        }
      } else if (activeCreateTab === 'story') {
        const response = await fetch(`${API_URL}/stories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            mediaUrl: mediaUrls.trim(),
            mediaType: mediaUrls.toLowerCase().includes('.mp4') ? 'video' : 'image'
          })
        });
        if (response.ok) {
          alert("Story posted successfully! Check stories ring.");
          setShowCreateModal(false);
          window.location.reload();
        } else {
          const err = await response.json();
          alert(err.message || "Failed to post story.");
        }
      } else {
        alert("Upload submitted successfully!");
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting creation.");
    }
  };

  return (
    <div className="bottom-nav-container">
      <style>{`
        .bottom-nav-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 68px;
          background: var(--glass-bg, rgba(255,255,255,0.85));
          backdrop-filter: var(--glass-blur, blur(20px));
          -webkit-backdrop-filter: var(--glass-blur, blur(20px));
          border-top: 1px solid var(--border-color, rgba(0,0,0,0.1));
          z-index: 999;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 16px;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dark-mode .bottom-nav-container {
          background: rgba(20,20,25,0.85);
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: var(--text-secondary, #666);
          font-size: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          flex: 1;
          border: none;
          background: transparent;
          cursor: pointer;
          position: relative;
          padding: 6px 0;
        }

        .dark-mode .bottom-nav-item {
          color: #aaa;
        }
        
        .bottom-nav-item:hover {
          color: var(--accent-gold, #C5A059);
          transform: translateY(-2px);
        }

        .bottom-nav-item.active {
          color: var(--accent-gold, #C5A059);
        }

        .bottom-nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          width: 16px;
          height: 3px;
          background-color: var(--accent-gold, #C5A059);
          border-radius: 2px;
          animation: scaleIn 0.2s forwards;
        }

        @keyframes scaleIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        .bottom-nav-icon {
          font-size: 22px;
          transition: transform 0.2s ease;
        }

        .bottom-nav-item:active .bottom-nav-icon {
          transform: scale(0.85);
        }
        
        /* Create Plus Button Highlight */
        .bottom-nav-create-btn {
          background: linear-gradient(135deg, var(--accent-gold, #C5A059), #B85A38);
          color: white !important;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(197, 160, 89, 0.4);
          transform: translateY(-8px);
          flex-grow: 0;
          flex-basis: 42px;
        }

        .bottom-nav-create-btn .bottom-nav-icon {
          font-size: 24px;
          color: white;
        }

        .bottom-nav-create-btn:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 6px 14px rgba(197, 160, 89, 0.5);
        }

        /* Modal styling */
        .social-create-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1100;
          animation: fadeIn 0.3s ease;
        }

        .social-create-card {
          background: var(--bg-secondary, #fff);
          border: 1px solid var(--border-color, rgba(0,0,0,0.1));
          border-radius: 16px;
          width: 90%;
          max-width: 520px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dark-mode .social-create-card {
          background: #1e1e24;
          border-color: rgba(255,255,255,0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.1));
          padding-bottom: 12px;
        }

        .create-tab-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          margin-bottom: 16px;
          padding-bottom: 8px;
        }

        .create-tab-btn {
          padding: 8px 14px;
          border-radius: 20px;
          border: 1px solid var(--border-color, rgba(0,0,0,0.1));
          background: var(--bg-primary, #f5f5f5);
          color: var(--text-primary);
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .create-tab-btn.active {
          background: var(--accent-gold, #C5A059);
          color: white;
          border-color: var(--accent-gold, #C5A059);
        }

        .create-form-group {
          margin-bottom: 14px;
        }

        .create-form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
          color: var(--text-primary);
        }

        .create-form-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color, rgba(0,0,0,0.15));
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .create-form-input:focus {
          border-color: var(--accent-gold, #C5A059);
          outline: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">🏠</span>
        <span>Home</span>
      </NavLink>

      <NavLink to="/discover" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">🔍</span>
        <span>Discover</span>
      </NavLink>

      <button className="bottom-nav-item bottom-nav-create-btn" onClick={() => setShowCreateModal(true)}>
        <span className="bottom-nav-icon">➕</span>
      </button>

      <NavLink to="/reels" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">🎥</span>
        <span>Reels</span>
      </NavLink>

      <NavLink to="/wishlist" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">❤️</span>
        <span>Wishlist</span>
      </NavLink>

      <NavLink to="/messages" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">💬</span>
        <span>Messages</span>
      </NavLink>

      <NavLink to="/notifications" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">🔔</span>
        <span>Alerts</span>
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">👤</span>
        <span>Profile</span>
      </NavLink>

      {/* Social Create Modal */}
      {showCreateModal && (
        <div className="social-create-modal" onClick={() => setShowCreateModal(false)}>
          <div className="social-create-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Create New Content</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <div className="create-tab-row">
              <button className={`create-tab-btn ${activeCreateTab === 'post' ? 'active' : ''}`} onClick={() => setActiveCreateTab('post')}>Post</button>
              <button className={`create-tab-btn ${activeCreateTab === 'reel' ? 'active' : ''}`} onClick={() => setActiveCreateTab('reel')}>Reel</button>
              <button className={`create-tab-btn ${activeCreateTab === 'story' ? 'active' : ''}`} onClick={() => setActiveCreateTab('story')}>Story</button>
              <button className={`create-tab-btn ${activeCreateTab === 'other' ? 'active' : ''}`} onClick={() => setActiveCreateTab('other')}>Other Uploads</button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              {activeCreateTab === 'post' && (
                <>
                  <div className="create-form-group">
                    <label>Image URLs (comma separated for carousel)</label>
                    <input 
                      type="text" 
                      className="create-form-input" 
                      placeholder="e.g. https://example.com/img1.jpg, https://example.com/img2.jpg"
                      value={mediaUrls}
                      onChange={(e) => setMediaUrls(e.target.value)}
                      required
                    />
                  </div>
                  <div className="create-form-group">
                    <label>Caption</label>
                    <textarea 
                      className="create-form-input" 
                      placeholder="Write a caption..."
                      rows={3}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>
                  <div className="create-form-group">
                    <label>Hashtags (comma separated)</label>
                    <input 
                      type="text" 
                      className="create-form-input" 
                      placeholder="e.g. fashion, traditional, handloom"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                    />
                  </div>
                  <div className="create-form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      className="create-form-input" 
                      placeholder="e.g. Mumbai, India"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="create-form-group">
                    <label>Tagged Products (comma separated)</label>
                    <input 
                      type="text" 
                      className="create-form-input" 
                      placeholder="e.g. Cotton Saree, Designer Blouse"
                      value={taggedProducts}
                      onChange={(e) => setTaggedProducts(e.target.value)}
                    />
                  </div>
                  <div className="create-form-group">
                    <label>Tagged Tailor</label>
                    <input 
                      type="text" 
                      className="create-form-input" 
                      placeholder="e.g. Priya Sharma Boutique"
                      value={taggedTailor}
                      onChange={(e) => setTaggedTailor(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeCreateTab === 'reel' && (
                <>
                  <div className="create-form-group">
                    <label>Video URL (direct mp4 link)</label>
                    <input 
                      type="text" 
                      className="create-form-input" 
                      placeholder="e.g. https://assets.mixkit.co/...mp4"
                      value={mediaUrls}
                      onChange={(e) => setMediaUrls(e.target.value)}
                      required
                    />
                  </div>
                  <div className="create-form-group">
                    <label>Caption</label>
                    <textarea 
                      className="create-form-input" 
                      placeholder="Write a reel description..."
                      rows={3}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>
                  <div className="create-form-group">
                    <label>Music / Audio Title</label>
                    <input 
                      type="text" 
                      className="create-form-input" 
                      placeholder="e.g. Original Audio - Lofi Vibe"
                      value={musicInfo}
                      onChange={(e) => setMusicInfo(e.target.value)}
                    />
                  </div>
                  <div className="create-form-group">
                    <label>Product Tags (comma separated)</label>
                    <input 
                      type="text" 
                      className="create-form-input" 
                      placeholder="e.g. Ikkat Silk Saree"
                      value={taggedProducts}
                      onChange={(e) => setTaggedProducts(e.target.value)}
                    />
                  </div>
                  <div className="create-form-group">
                    <label>Tailor Tags (comma separated)</label>
                    <input 
                      type="text" 
                      className="create-form-input" 
                      placeholder="e.g. Priya Boutique"
                      value={taggedTailor}
                      onChange={(e) => setTaggedTailor(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeCreateTab === 'story' && (
                <>
                  <div className="create-form-group">
                    <label>Story Image/Video URL</label>
                    <input 
                      type="text" 
                      className="create-form-input" 
                      placeholder="e.g. https://images.unsplash.com/... or .mp4 link"
                      value={mediaUrls}
                      onChange={(e) => setMediaUrls(e.target.value)}
                      required
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '-8px' }}>
                    Note: Stories automatically expire after 24 hours.
                  </p>
                </>
              )}

              {activeCreateTab === 'other' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 0 20px' }}>
                  <button type="button" className="btn-secondary" style={{ padding: '12px' }} onClick={() => { alert("Product Upload Wizard Launched"); setShowCreateModal(false); }}>Upload Product</button>
                  <button type="button" className="btn-secondary" style={{ padding: '12px' }} onClick={() => { alert("AI Preset Design Wizard Launched"); setShowCreateModal(false); }}>Upload Design</button>
                  <button type="button" className="btn-secondary" style={{ padding: '12px' }} onClick={() => { alert("Traditional Weaver Loom Inventory Wizard Launched"); setShowCreateModal(false); }}>Upload Handloom Product</button>
                </div>
              )}

              {activeCreateTab !== 'other' && (
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
                  Upload & Publish
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default BottomNav;
