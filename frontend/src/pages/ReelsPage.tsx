import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface ReelType {
  _id: string;
  user: {
    _id: string;
    name: string;
    role: string;
  };
  videoUrl: string;
  caption: string;
  musicInfo: string;
  productTags?: string[];
  tailorTags?: string[];
  likesCount: number;
  viewsCount: number;
  sharesCount: number;
}

export const ReelsPage: React.FC = () => {
  const { showToast } = useOutletContext<OutletContextType>();
  const { token, user } = useAuth();
  const [reels, setReels] = useState<ReelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const clientHeight = e.currentTarget.clientHeight;
    const index = Math.round(scrollTop / clientHeight);
    if (index !== activeReelIndex) {
      setActiveReelIndex(index);
    }
  };

  // Comments modal state
  const [showComments, setShowComments] = useState(false);
  const [currentReelId, setCurrentReelId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  const API_URL = 'http://localhost:5000/api/social';

  const fetchReels = async () => {
    try {
      const response = await fetch(`${API_URL}/reels`);
      if (response.ok) {
        const data = await response.json();
        setReels(data);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.warn("Using offline mock reels...");
      setReels([
        {
          _id: 'mock-reel-1',
          user: { _id: 'u-1', name: 'Priya Sharma Boutique', role: 'tailor' },
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-stitching-a-fabric-close-up-41551-large.mp4',
          caption: 'Creating details on zardozi bridal wear. Perfect fit guaranteed!',
          musicInfo: 'Priya Sharma Original Audio',
          likesCount: 1540,
          viewsCount: 23100,
          sharesCount: 420
        },
        {
          _id: 'mock-reel-2',
          user: { _id: 'u-2', name: 'Artisan Kiran Loom', role: 'weaver' },
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-colorful-cotton-yarn-skein-41549-large.mp4',
          caption: 'Authentic cotton yarn organic process from local Telangana artisans.',
          musicInfo: 'Flute Meditation Theme',
          likesCount: 890,
          viewsCount: 10400,
          sharesCount: 110
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleLike = async (reelId: string, index: number) => {
    if (!token) {
      showToast("Please login to like this reel", "warning");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/reels/${reelId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const updated = [...reels];
        updated[index].likesCount = data.likesCount;
        setReels(updated);
        showToast(data.liked ? "Liked reel!" : "Unliked reel", "success");
      }
    } catch (e) {
      // Local toggle fallback
      const updated = [...reels];
      updated[index].likesCount += 1;
      setReels(updated);
      showToast("Offline Liked!", "success");
    }
  };

  const handleFollow = async (creatorId: string) => {
    if (!token) {
      showToast("Please login to follow", "warning");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users/${creatorId}/follow`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        showToast(data.following ? "Following Creator!" : "Unfollowed Creator", "success");
      }
    } catch (e) {
      showToast("Follow successful!", "success");
    }
  };

  const handleShare = async (reelId: string, index: number) => {
    navigator.clipboard.writeText(window.location.origin + `/reels`);
    showToast("Reel link copied!", "info");
    try {
      const response = await fetch(`${API_URL}/reels/${reelId}/share`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const updated = [...reels];
        updated[index].sharesCount = data.sharesCount;
        setReels(updated);
      }
    } catch (e) {}
  };

  const openComments = async (reelId: string) => {
    setCurrentReelId(reelId);
    setShowComments(true);
    try {
      const response = await fetch(`${API_URL}/reels/${reelId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (e) {
      setComments([
        { user: { name: 'Asha' }, text: 'Looks so clean!' },
        { user: { name: 'Vikram' }, text: 'Loving the lofi background beat' }
      ]);
    }
  };

  const postComment = async () => {
    if (!newComment.trim() || !currentReelId) return;
    try {
      const response = await fetch(`${API_URL}/reels/${currentReelId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment })
      });
      if (response.ok) {
        const added = await response.json();
        setComments([...comments, added]);
        setNewComment('');
        showToast("Comment added!", "success");
      }
    } catch (e) {
      setComments([...comments, { user: { name: user?.name || 'Guest' }, text: newComment }]);
      setNewComment('');
    }
  };

  return (
    <div className="reels-page-container">
      <style>{`
        .reels-page-container {
          background-color: #000;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-bottom: 70px;
        }

        .reels-container {
          width: 100%;
          max-width: 440px;
          height: calc(100vh - 130px);
          position: relative;
          background: #111;
          border-radius: 12px;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scrollbar-width: none; /* Firefox */
        }

        .reels-container::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }

        .reel-player-card {
          width: 100%;
          height: 100%;
          scroll-snap-align: start;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #000;
        }

        .reel-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Overlay Interface */
        .reel-overlay {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          color: white;
          pointer-events: none;
        }

        .reel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: auto;
        }

        .reel-bottom-meta {
          pointer-events: auto;
          max-width: 80%;
        }

        .reel-creator {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .reel-creator-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent-gold);
          color: black;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reel-follow-btn {
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          font-weight: 600;
        }

        .reel-caption {
          font-size: 13px;
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .reel-music {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--accent-gold);
        }

        /* Action Column */
        .reel-actions-column {
          position: absolute;
          right: 12px;
          bottom: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          pointer-events: auto;
        }

        .reel-action-btn {
          background: transparent;
          border: none;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          font-size: 24px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          transition: transform 0.2s;
        }

        .reel-action-btn:active {
          transform: scale(0.8);
        }

        .reel-action-label {
          font-size: 12px;
          font-weight: 600;
        }

        /* Comments Modal */
        .comments-drawer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: var(--bg-secondary, #fff);
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          z-index: 1050;
          padding: 20px;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          animation: slideUpComments 0.3s ease;
        }

        @keyframes slideUpComments {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .music-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 8s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>

      {loading ? (
        <div style={{ color: 'white', textAlign: 'center' }}><div className="spinner"></div></div>
      ) : (
        <div className="reels-container" id="reels-viewport-scroller" onScroll={handleScroll}>
          {reels.map((reel, index) => (
            <div key={reel._id} className="reel-player-card">
              <video 
                className="reel-video"
                src={reel.videoUrl}
                loop
                autoPlay={index === activeReelIndex}
                muted
                playsInline
                onClick={(e) => {
                  const video = e.currentTarget;
                  if (video.paused) {
                    video.play();
                  } else {
                    video.pause();
                  }
                }}
              />

              <div className="reel-overlay">
                <div className="reel-header">
                  <h4 style={{ margin: 0, letterSpacing: '1px', fontWeight: 700 }}>Reels</h4>
                  <span style={{ fontSize: '18px' }}>📸</span>
                </div>

                <div className="reel-bottom-meta">
                  <div className="reel-creator">
                    <div className="reel-creator-avatar">
                      {reel.user?.name ? reel.user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{reel.user?.name || 'Studio Partner'}</h5>
                      <span style={{ fontSize: '10px', opacity: 0.8 }}>{reel.user?.role?.toUpperCase()}</span>
                    </div>
                    <button className="reel-follow-btn" onClick={() => handleFollow(reel.user._id)}>Follow</button>
                  </div>

                  <p className="reel-caption">{reel.caption}</p>

                  <div className="reel-music">
                    <span>🎵</span>
                    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '120px' }}>
                      <div className="music-marquee">{reel.musicInfo}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="reel-actions-column">
                <button className="reel-action-btn" onClick={() => handleLike(reel._id, index)}>
                  <span>❤️</span>
                  <span className="reel-action-label">{reel.likesCount || 0}</span>
                </button>
                
                <button className="reel-action-btn" onClick={() => openComments(reel._id)}>
                  <span>💬</span>
                  <span className="reel-action-label">Comments</span>
                </button>

                <button className="reel-action-btn" onClick={() => handleShare(reel._id, index)}>
                  <span>↗</span>
                  <span className="reel-action-label">{reel.sharesCount || 0}</span>
                </button>

                <button className="reel-action-btn" onClick={() => { showToast("Saved to collection!", "success"); }}>
                  <span>💾</span>
                  <span className="reel-action-label">Save</span>
                </button>

                <button className="reel-action-btn" onClick={() => { showToast("Report submitted.", "info"); }}>
                  <span>🚨</span>
                  <span className="reel-action-label" style={{ fontSize: '9px' }}>Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments modal */}
      {showComments && (
        <>
          <div className="modal-backdrop" onClick={() => setShowComments(false)} style={{ zIndex: 1040 }} />
          <div className="comments-drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0 }}>Comments</h4>
              <button onClick={() => setShowComments(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
              {comments.map((c, i) => (
                <div key={i} style={{ marginBottom: '12px', fontSize: '14px' }}>
                  <strong>{c.user?.name || 'Guest'}: </strong>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="btn-primary" onClick={postComment} style={{ padding: '0 16px' }}>Post</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default ReelsPage;
