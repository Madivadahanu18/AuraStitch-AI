import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface PostType {
  _id: string;
  user: {
    _id: string;
    name: string;
    role: string;
  };
  images: string[];
  caption: string;
  hashtags: string[];
  location?: string;
  taggedProducts?: string[];
  taggedTailor?: string;
  likesCount: number;
  viewsCount: number;
  sharesCount: number;
  createdAt: string;
  liked?: boolean;
  saved?: boolean;
}

interface StoryGroup {
  user: {
    _id: string;
    name: string;
    role: string;
  };
  stories: {
    _id: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    createdAt: string;
  }[];
}

export const LandingPage: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const { setTheme } = useTheme();
  const { user, token } = useAuth();
  const { translate } = useLanguage();

  // Social states (if logged in)
  const [posts, setPosts] = useState<PostType[]>([]);
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeStoryGroup, setActiveStoryGroup] = useState<StoryGroup | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyIntervalRef = useRef<any>(null);
  const isHoldingRef = useRef(false);

  // Comments section state for posts
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  const outletContext = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    if (outletContext?.showToast) {
      outletContext.showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const API_URL = 'http://localhost:5000/api/social';

  // Fetch social feed, stories, and suggestions
  const fetchSocialFeed = async () => {
    setLoadingPosts(true);
    try {
      // Posts
      const postsRes = await fetch(`${API_URL}/posts`);
      if (postsRes.ok) {
        const data = await postsRes.json();
        // Enrich liked/saved status
        const enriched = await Promise.all(data.map(async (post: any) => {
          let liked = false;
          let saved = false;
          if (token) {
            try {
              const likeRes = await fetch(`${API_URL}/posts/${post._id}/likes/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const saveRes = await fetch(`${API_URL}/posts/${post._id}/save/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (likeRes.ok) liked = (await likeRes.json()).liked;
              if (saveRes.ok) saved = (await saveRes.json()).saved;
            } catch (e) {}
          }
          return { ...post, liked, saved };
        }));
        setPosts(enriched);
      }

      // Stories
      const storiesRes = await fetch(`${API_URL}/stories`);
      if (storiesRes.ok) {
        setStories(await storiesRes.json());
      }

      // Suggestions
      const suggestionsRes = await fetch(`${API_URL}/suggested-users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (suggestionsRes.ok) {
        setSuggestedUsers(await suggestionsRes.json());
      }
    } catch (err) {
      console.warn("Using fallback static social feed...", err);
      // Offline mock data
      setPosts([
        {
          _id: 'p1',
          user: { _id: 'u-1', name: 'Priya Sharma (Boutique)', role: 'tailor' },
          images: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
          ],
          caption: 'Loving this handwoven Ikkat dress fabric! Stitched beautifully for the summer season. ✨ #handmade #traditional #ikkat #slowfashion',
          hashtags: ['handmade', 'traditional', 'ikkat', 'slowfashion'],
          location: 'Hyderabad, India',
          taggedProducts: ['Ikkat Cotton Fabric', 'Summer Kurti'],
          taggedTailor: 'Priya Boutique',
          likesCount: 230,
          viewsCount: 1400,
          sharesCount: 38,
          createdAt: new Date().toISOString(),
          liked: false,
          saved: false
        },
        {
          _id: 'p2',
          user: { _id: 'u-2', name: 'Kiran Handlooms', role: 'weaver' },
          images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'],
          caption: 'Pure double-ikat silk fabric from Pochampally weavers, perfect for customized sarees. 👑 #heritage #weaving #organic',
          hashtags: ['heritage', 'weaving', 'organic'],
          location: 'Telangana',
          taggedProducts: ['Double Ikat Silk Saree'],
          likesCount: 185,
          viewsCount: 920,
          sharesCount: 12,
          createdAt: new Date().toISOString(),
          liked: false,
          saved: false
        }
      ]);

      setStories([
        {
          user: { _id: 'u-1', name: 'Priya S.', role: 'tailor' },
          stories: [
            { _id: 's1', mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', mediaType: 'image', createdAt: new Date().toISOString() }
          ]
        },
        {
          user: { _id: 'u-2', name: 'Kiran Loom', role: 'weaver' },
          stories: [
            { _id: 's2', mediaUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80', mediaType: 'image', createdAt: new Date().toISOString() }
          ]
        }
      ]);

      setSuggestedUsers([
        { _id: 'u-3', name: 'Ananya Boutique', role: 'tailor', email: 'ananya@aurastitch.ai' },
        { _id: 'u-4', name: 'Weave India Co', role: 'weaver', email: 'india@aurastitch.ai' },
        { _id: 'u-5', name: 'Natural Dyes Supplier', role: 'supplier', email: 'dyes@aurastitch.ai' }
      ]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);

    if (user) {
      fetchSocialFeed();
    }

    return () => {
      clearTimeout(timer);
      if (storyIntervalRef.current) clearInterval(storyIntervalRef.current);
    };
  }, [user]);

  const handleCategoryClick = (categoryTheme: 'traditional' | 'retro' | 'royal' | 'handloom' | 'festival') => {
    setTheme(categoryTheme);
    showToast(`Dynamic styling updated to: ${categoryTheme.toUpperCase()}`, "info");
  };

  const handleRestrictClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setShowGate(true);
    } else {
      showToast("Featured interaction unlocked!", "success");
    }
  };

  // Interactions
  const handleLikePost = async (postId: string, index: number) => {
    if (!token) {
      setShowGate(true);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const updated = [...posts];
        updated[index].liked = data.liked;
        updated[index].likesCount = data.likesCount;
        setPosts(updated);
        showToast(data.liked ? "Liked post!" : "Unliked post", "success");
      }
    } catch (e) {
      const updated = [...posts];
      updated[index].liked = !updated[index].liked;
      updated[index].likesCount += updated[index].liked ? 1 : -1;
      setPosts(updated);
      showToast("Toggled like!", "success");
    }
  };

  const handleSavePost = async (postId: string, index: number) => {
    if (!token) {
      setShowGate(true);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/save`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const updated = [...posts];
        updated[index].saved = data.saved;
        setPosts(updated);
        showToast(data.saved ? "Saved post!" : "Removed from collection", "success");
      }
    } catch (e) {
      const updated = [...posts];
      updated[index].saved = !updated[index].saved;
      setPosts(updated);
    }
  };

  const handleFollowUser = async (targetId: string) => {
    if (!token) {
      setShowGate(true);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users/${targetId}/follow`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        showToast(data.following ? "Following creator!" : "Unfollowed creator", "success");
      }
    } catch (e) {
      showToast("Following creator!", "success");
    }
  };

  // Stories viewing logic
  const handleOpenStory = (group: StoryGroup) => {
    setActiveStoryGroup(group);
    setActiveStoryIndex(0);
    setStoryProgress(0);
    isHoldingRef.current = false;
    startStoryTimer(group, 0);
  };

  const startStoryTimer = (group: StoryGroup, index: number) => {
    if (storyIntervalRef.current) clearInterval(storyIntervalRef.current);
    let progress = 0;
    setStoryProgress(0);

    storyIntervalRef.current = setInterval(() => {
      if (isHoldingRef.current) return; // pause when holding
      progress += 2;
      setStoryProgress(progress);

      if (progress >= 100) {
        clearInterval(storyIntervalRef.current);
        // next story in group
        if (index + 1 < group.stories.length) {
          setActiveStoryIndex(index + 1);
          startStoryTimer(group, index + 1);
        } else {
          // close story
          setActiveStoryGroup(null);
        }
      }
    }, 100);
  };

  const handleSkipStory = (direction: 'next' | 'prev') => {
    if (!activeStoryGroup) return;
    if (direction === 'next') {
      if (activeStoryIndex + 1 < activeStoryGroup.stories.length) {
        setActiveStoryIndex(activeStoryIndex + 1);
        startStoryTimer(activeStoryGroup, activeStoryIndex + 1);
      } else {
        setActiveStoryGroup(null);
      }
    } else {
      if (activeStoryIndex - 1 >= 0) {
        setActiveStoryIndex(activeStoryIndex - 1);
        startStoryTimer(activeStoryGroup, activeStoryIndex - 1);
      }
    }
  };

  // Comments for Posts
  const openPostComments = async (postId: string) => {
    setActiveCommentsPostId(postId);
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`);
      if (response.ok) {
        setPostComments(await response.json());
      }
    } catch (e) {
      setPostComments([
        { user: { name: 'Ritu Verma' }, text: 'This fabric details look outstanding!' },
        { user: { name: 'Dev' }, text: 'Where can I order this custom stitching?' }
      ]);
    }
  };

  const handlePostCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentsPostId) return;

    try {
      const response = await fetch(`${API_URL}/posts/${activeCommentsPostId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newCommentText })
      });
      if (response.ok) {
        const added = await response.json();
        setPostComments([...postComments, added]);
        setNewCommentText('');
        showToast("Comment posted!", "success");
      }
    } catch (e) {
      setPostComments([...postComments, { user: { name: user?.name || 'Guest' }, text: newCommentText }]);
      setNewCommentText('');
    }
  };

  // 1. Logged in Social Home Feed View
  if (user) {
    return (
      <div className="social-home-feed-container fade-in">
        <style>{`
          .social-home-feed-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 16px;
            padding-bottom: 90px;
            display: flex;
            gap: 28px;
          }

          .feed-main-col {
            flex: 1;
            max-width: 630px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .feed-sidebar-col {
            width: 320px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          /* Stories bubble row */
          .stories-carousel-card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            gap: 16px;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .stories-carousel-card::-webkit-scrollbar {
            display: none;
          }

          .story-bubble {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            min-width: 74px;
          }

          .story-ring {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            padding: 3px;
            background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .story-avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid var(--bg-secondary);
            object-fit: cover;
          }

          /* Feed post card */
          .feed-post-card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
          }

          .post-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
          }

          .post-user-info {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .post-avatar-placeholder {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background-color: var(--accent-gold);
            color: black;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .post-image-carousel {
            position: relative;
            width: 100%;
            aspect-ratio: 1;
            background-color: #000;
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
          }

          .post-image-carousel::-webkit-scrollbar {
            display: none;
          }

          .post-carousel-slide {
            flex: 0 0 100%;
            width: 100%;
            scroll-snap-align: start;
            object-fit: cover;
          }

          .post-actions-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            font-size: 24px;
          }

          .post-actions-left {
            display: flex;
            gap: 16px;
          }

          .post-action-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            transition: transform 0.15s ease;
            padding: 0;
            font-size: 24px;
          }

          .post-action-btn:active {
            transform: scale(0.8);
          }

          .post-meta-details {
            padding: 0 16px 16px;
            font-size: 14px;
            line-height: 1.5;
          }

          /* Stories viewer modal */
          .story-viewer-backdrop {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.95);
            z-index: 2000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .story-viewer-container {
            width: 100%;
            max-width: 420px;
            height: calc(100vh - 100px);
            position: relative;
            background: black;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .story-progress-bar-row {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            display: flex;
            gap: 4px;
            z-index: 10;
          }

          .story-progress-track {
            flex: 1;
            height: 3px;
            background: rgba(255,255,255,0.3);
            border-radius: 2px;
            overflow: hidden;
          }

          .story-progress-fill {
            height: 100%;
            background: var(--accent-gold, #C5A059);
            width: 0%;
          }

          .story-viewer-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .story-viewer-meta {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            color: white;
            z-index: 10;
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          }

          .story-touch-left, .story-touch-right {
            position: absolute;
            top: 0; bottom: 0;
            width: 30%;
            cursor: pointer;
            z-index: 5;
          }

          .story-touch-left { left: 0; }
          .story-touch-right { right: 0; }

          /* Sidebar widgets */
          .sidebar-widget {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
          }

          .widget-title {
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 16px;
            color: var(--text-primary);
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px;
          }

          .suggestion-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
          }

          .suggestion-item:last-child {
            margin-bottom: 0;
          }

          .recommendation-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .recommend-card {
            background-color: var(--bg-primary);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--border-color);
          }

          .recommend-img {
            width: 100%;
            height: 100px;
            object-fit: cover;
          }

          @media (max-width: 900px) {
            .feed-sidebar-col {
              display: none;
            }
            .social-home-feed-container {
              justify-content: center;
            }
          }
        `}</style>

        {/* Main Feed Column */}
        <div className="feed-main-col">
          {/* Stories row */}
          <div className="stories-carousel-card">
            {stories.map(group => (
              <div key={group.user._id} className="story-bubble" onClick={() => handleOpenStory(group)}>
                <div className="story-ring">
                  <img className="story-avatar" src={group.stories[0].mediaUrl} alt={group.user.name} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{group.user.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* Posts feed */}
          {loadingPosts ? (
            <div style={{ textAlign: 'center', padding: '50px' }}><div className="spinner"></div></div>
          ) : (
            posts.map((post, idx) => (
              <div key={post._id} className="feed-post-card fade-in">
                <div className="post-header">
                  <div className="post-user-info">
                    <div className="post-avatar-placeholder">
                      {post.user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>{post.user.name}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>📍 {post.location || 'India'}</span>
                    </div>
                  </div>
                  <button className="reel-follow-btn" style={{ borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }} onClick={() => handleFollowUser(post.user._id)}>Follow</button>
                </div>

                {/* Multiple Images Carousel */}
                <div className="post-image-carousel">
                  {post.images.map((img, i) => (
                    <img key={i} className="post-carousel-slide" src={img} alt="post slide" />
                  ))}
                </div>

                <div className="post-actions-bar">
                  <div className="post-actions-left">
                    <button className="post-action-btn" onClick={() => handleLikePost(post._id, idx)}>
                      {post.liked ? '❤️' : '🖤'}
                    </button>
                    <button className="post-action-btn" onClick={() => openPostComments(post._id)}>
                      💬
                    </button>
                    <button className="post-action-btn" onClick={() => { navigator.clipboard.writeText(window.location.origin); showToast("Link copied!", "info"); }}>
                      ↗
                    </button>
                  </div>
                  <button className="post-action-btn" onClick={() => handleSavePost(post._id, idx)}>
                    {post.saved ? '💾' : '📁'}
                  </button>
                </div>

                <div className="post-meta-details">
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>{post.likesCount || 0} likes • {post.viewsCount || 0} views</div>
                  <div>
                    <strong>{post.user.name} </strong>
                    {post.caption}
                  </div>
                  {post.taggedTailor && (
                    <div style={{ fontSize: '12px', color: 'var(--accent-gold-dark)', marginTop: '6px' }}>
                      🏷️ Custom Stitching by: <strong>{post.taggedTailor}</strong>
                    </div>
                  )}
                  {post.taggedProducts && post.taggedProducts.length > 0 && (
                    <div style={{ fontSize: '12px', color: 'var(--accent-teal)', marginTop: '4px' }}>
                      🧶 Tagged fabrics: {post.taggedProducts.join(', ')}
                    </div>
                  )}
                  <button 
                    onClick={() => openPostComments(post._id)}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px', cursor: 'pointer' }}
                  >
                    View all comments
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Widgets Column */}
        <div className="feed-sidebar-col">
          {/* User profile brief card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 0' }}>
            <div className="post-avatar-placeholder" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{user.name}</h4>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.role.toUpperCase()}</span>
            </div>
          </div>

          {/* Suggestions Widget */}
          <div className="sidebar-widget">
            <h4 className="widget-title">Suggested Partners</h4>
            {suggestedUsers.map(s => (
              <div key={s._id} className="suggestion-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="post-avatar-placeholder" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                    {s.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{s.name}</h5>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.role.toUpperCase()}</span>
                  </div>
                </div>
                <button 
                  className="reel-follow-btn" 
                  style={{ border: 'none', color: 'var(--accent-gold)', padding: 0 }}
                  onClick={() => handleFollowUser(s._id)}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>

          {/* Product Recommendations */}
          <div className="sidebar-widget">
            <h4 className="widget-title">Recommended Fabrics</h4>
            <div className="recommendation-grid">
              <div className="recommend-card">
                <img className="recommend-img" src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80" alt="fabric" />
                <div style={{ padding: '8px', fontSize: '12px' }}>
                  <strong>Kiran Ikkat fabric</strong><br/>
                  <span style={{ color: 'var(--accent-gold-dark)' }}>₹1,200/meter</span>
                </div>
              </div>
              <div className="recommend-card">
                <img className="recommend-img" src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=150&q=80" alt="embroidery" />
                <div style={{ padding: '8px', fontSize: '12px' }}>
                  <strong>Zardozi Blouse Preset</strong><br/>
                  <span style={{ color: 'var(--accent-gold-dark)' }}>₹3,500 Stitching</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Viewer Modal Overlay */}
        {activeStoryGroup && (
          <div className="story-viewer-backdrop">
            <div 
              className="story-viewer-container"
              onMouseDown={() => { isHoldingRef.current = true; }}
              onMouseUp={() => { isHoldingRef.current = false; }}
              onTouchStart={() => { isHoldingRef.current = true; }}
              onTouchEnd={() => { isHoldingRef.current = false; }}
            >
              {/* Progress tracks */}
              <div className="story-progress-bar-row">
                {activeStoryGroup.stories.map((s, i) => (
                  <div key={s._id} className="story-progress-track">
                    <div 
                      className="story-progress-fill" 
                      style={{ 
                        width: i === activeStoryIndex ? `${storyProgress}%` : i < activeStoryIndex ? '100%' : '0%' 
                      }} 
                    />
                  </div>
                ))}
              </div>

              {/* Story Media content */}
              <img 
                className="story-viewer-img" 
                src={activeStoryGroup.stories[activeStoryIndex].mediaUrl} 
                alt="Story content" 
              />

              {/* User badge */}
              <div style={{ position: 'absolute', top: '24px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, color: 'white' }}>
                <div className="post-avatar-placeholder" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                  {activeStoryGroup.user.name[0].toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{activeStoryGroup.user.name}</h4>
                </div>
              </div>

              {/* Tap zones */}
              <div className="story-touch-left" onClick={() => handleSkipStory('prev')} />
              <div className="story-touch-right" onClick={() => handleSkipStory('next')} />

              <button 
                onClick={() => setActiveStoryGroup(null)}
                style={{ position: 'absolute', top: '20px', right: '16px', background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', zIndex: 15 }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Comments drawer modal */}
        {activeCommentsPostId && (
          <>
            <div className="modal-backdrop" onClick={() => setActiveCommentsPostId(null)} style={{ zIndex: 1040 }} />
            <div className="comments-drawer">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0 }}>Comments</h4>
                <button onClick={() => setActiveCommentsPostId(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
                {postComments.map((c, i) => (
                  <div key={i} style={{ marginBottom: '12px', fontSize: '14px' }}>
                    <strong>{c.user?.name || 'Guest'}: </strong>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePostCommentSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Add a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0 16px' }}>Post</button>
              </form>
            </div>
          </>
        )}
      </div>
    );
  }

  // 2. Default Guest Promo/Splash Landing view (Unchanged visual style!)
  return (
    <div className="landing-page-container">
      <style>{`
        .landing-page-container {
          flex-grow: 1;
        }
        .splash-screen {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: linear-gradient(135deg, #0A0A0B, #19191E);
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          z-index: 9999; color: #FFFFFF; transition: opacity 0.5s ease;
        }
        .splash-logo {
          font-family: var(--font-heading); font-size: 48px; font-weight: 700; letter-spacing: 2px; margin-bottom: 24px;
          opacity: 0; transform: translateY(20px); animation: splashFadeIn 1s forwards ease;
        }
        @keyframes splashFadeIn { to { opacity: 1; transform: translateY(0); } }
        .hero-banner {
          width: 100%; height: 480px; border-radius: var(--border-radius-lg);
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
          display: flex; flex-direction: column; justify-content: center; padding: 60px; color: #FFFFFF; margin-bottom: 40px; box-shadow: var(--shadow-lg);
        }
        .hero-title { font-family: var(--font-heading); font-size: 48px; margin-bottom: 16px; max-width: 600px; color: #FFFFFF; }
        .hero-subtitle { font-size: 18px; margin-bottom: 30px; max-width: 500px; color: rgba(255, 255, 255, 0.85); }
        .scroll-row { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; margin-bottom: 40px; }
        .scroll-card { min-width: 150px; padding: 20px; text-align: center; cursor: pointer; }
        .scroll-card-icon { font-size: 32px; margin-bottom: 10px; }
        .section-title { margin-bottom: 24px; font-size: 28px; border-left: 4px solid var(--accent-gold); padding-left: 14px; }
        .post-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; margin-bottom: 60px; }
        .insta-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); overflow: hidden; box-shadow: var(--shadow-sm); }
        .insta-header { display: flex; align-items: center; gap: 12px; padding: 16px; }
        .insta-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        .insta-img { width: 100%; height: 320px; object-fit: cover; }
        .insta-actions { display: flex; gap: 16px; padding: 16px; font-size: 20px; }
        .insta-actions span { cursor: pointer; }
        .auth-gate-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); display: none; justify-content: center; align-items: center; z-index: 9999; }
        .auth-gate-modal.active { display: flex; }
      `}</style>

      {showSplash && (
        <div className="splash-screen" id="splash-screen-overlay">
          <div className="splash-logo">AURA<span style={{ color: '#C5A059' }}>STITCH</span> AI</div>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', fontSize: '14px', letterSpacing: '3px', color: 'var(--text-muted)' }}>
            DESIGNING FUTURE FASHION...
          </p>
        </div>
      )}

      <div className="hero-banner slide-up">
        <h1 className="hero-title">Experience AI Fashion Studio & Traditional Weaves</h1>
        <p className="hero-subtitle">
          Design your own garment using AI mannequin customizers and order directly from local weavers and premium tailors.
        </p>
        <div>
          <Link to="/login" className="btn-primary glow-btn">
            {translate('launch_studio')}
          </Link>
        </div>
      </div>
      
      <h3 className="section-title">Browse Fashion Styles</h3>
      <div className="scroll-row" id="categories-scroll-row">
        <div className="scroll-card glass-panel hover-scale" onClick={() => handleCategoryClick('traditional')}>
          <div className="scroll-card-icon">🥻</div>
          <h4 style={{ fontSize: '14px' }}>Traditional</h4>
        </div>
        <div className="scroll-card glass-panel hover-scale" onClick={() => handleCategoryClick('retro')}>
          <div className="scroll-card-icon">🕶</div>
          <h4 style={{ fontSize: '14px' }}>Retro Vintage</h4>
        </div>
        <div className="scroll-card glass-panel hover-scale" onClick={() => handleCategoryClick('royal')}>
          <div className="scroll-card-icon">👑</div>
          <h4 style={{ fontSize: '14px' }}>Royal Wedding</h4>
        </div>
        <div className="scroll-card glass-panel hover-scale" onClick={() => handleCategoryClick('handloom')}>
          <div className="scroll-card-icon">🧵</div>
          <h4 style={{ fontSize: '14px' }}>Handloom</h4>
        </div>
        <div className="scroll-card glass-panel hover-scale" onClick={() => handleCategoryClick('festival')}>
          <div className="scroll-card-icon">✨</div>
          <h4 style={{ fontSize: '14px' }}>Festive Kurti</h4>
        </div>
      </div>
      
      <h3 className="section-title">Trending Designers</h3>
      <div className="post-grid">
        <div className="insta-card">
          <div className="insta-header">
            <img className="insta-avatar" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Priya avatar" />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Priya Sharma <span style={{ color: '#C5A059' }}>★</span></h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bridal Specialization • Delhi</p>
            </div>
          </div>
          <img className="insta-img" src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80" alt="post" />
          <div className="insta-actions">
            <span onClick={handleRestrictClick}>♥</span>
            <span onClick={handleRestrictClick}>💬</span>
            <span onClick={handleRestrictClick}>↗</span>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <p style={{ fontSize: '14px' }}>
              <strong style={{ fontWeight: 600 }}>Priya Sharma:</strong> Handwoven silk bridal lehenga customization completed.
            </p>
          </div>
        </div>
        
        <div className="insta-card">
          <div className="insta-header">
            <img className="insta-avatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Kiran avatar" />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Kiran Handloom Weaves</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Artisan Pochampally • Hyderabad</p>
            </div>
          </div>
          <img className="insta-img" src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80" alt="post" />
          <div className="insta-actions">
            <span onClick={handleRestrictClick}>♥</span>
            <span onClick={handleRestrictClick}>💬</span>
            <span onClick={handleRestrictClick}>↗</span>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <p style={{ fontSize: '14px' }}>
              <strong style={{ fontWeight: 600 }}>Kiran:</strong> Fresh batch of Pochampally borders woven on request.
            </p>
          </div>
        </div>
      </div>

      <div className={`auth-gate-modal ${showGate ? 'active' : ''}`} id="guest-popup-modal">
        <div className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
          <h3 style={{ marginBottom: '12px', fontSize: '24px', fontFamily: 'var(--font-heading)' }}>
            Please Login or Register
          </h3>
          <p style={{ marginBottom: '30px', color: 'var(--text-secondary)', fontSize: '15px' }}>
            Unlock custom AI designers, measurements manager, messaging and ordering.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/login" className="btn-primary">Login to Continue</Link>
            <Link to="/register" className="btn-secondary">Register New Account</Link>
          </div>
          <button 
            className="btn-secondary" 
            style={{ marginTop: '16px', border: 'none', color: 'var(--text-muted)' }} 
            onClick={() => setShowGate(false)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
