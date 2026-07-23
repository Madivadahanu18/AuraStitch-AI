import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
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

interface HandloomProduct {
  id: string;
  name: string;
  handloomType: string;
  state: string;
  weaverName: string;
  price: number;
  originalPrice: number;
  discount: number;
  availability: string;
  estimatedDelivery: string;
  rating: number;
  reviewsCount: number;
  soldCount: number;
  image: string;
}

interface Supplier {
  id: string;
  name: string;
  location: string;
  products: string[];
  experience: string;
  rating: number;
  ordersDelivered: string;
  verified: boolean;
  logo: string;
}

interface SupplierProduct {
  id: string;
  name: string;
  supplier: string;
  price: string;
  rating: number;
  availability: string;
  image: string;
}

const featuredHandlooms: HandloomProduct[] = [
  {
    id: 'hl-1',
    name: 'Pochampally Ikat Silk Saree',
    handloomType: 'Pochampally Ikat',
    state: 'Telangana',
    weaverName: 'Master Weaver Pochampally',
    price: 2450,
    originalPrice: 3000,
    discount: 18,
    availability: 'In Stock',
    estimatedDelivery: '7–10 Days',
    rating: 4.8,
    reviewsCount: 324,
    soldCount: 1256,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hl-2',
    name: 'Mangalagiri Fine Cotton Fabric',
    handloomType: 'Mangalagiri Cotton',
    state: 'Andhra Pradesh',
    weaverName: 'Mangalagiri Weavers Co-op',
    price: 1850,
    originalPrice: 2200,
    discount: 16,
    availability: 'In Stock',
    estimatedDelivery: '5–7 Days',
    rating: 4.7,
    reviewsCount: 210,
    soldCount: 980,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hl-3',
    name: 'Royal Banarasi Pure Silk Brocade',
    handloomType: 'Banarasi Silk',
    state: 'Uttar Pradesh',
    weaverName: 'Varanasi Heritage Looms',
    price: 8500,
    originalPrice: 10500,
    discount: 19,
    availability: 'In Stock',
    estimatedDelivery: '7–10 Days',
    rating: 4.9,
    reviewsCount: 512,
    soldCount: 2140,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hl-4',
    name: 'Kanchipuram Heavy Zari Silk Saree',
    handloomType: 'Kanchipuram Silk',
    state: 'Tamil Nadu',
    weaverName: 'Kanchi Silk Artisans Guild',
    price: 12000,
    originalPrice: 15000,
    discount: 20,
    availability: 'In Stock',
    estimatedDelivery: '7–10 Days',
    rating: 4.9,
    reviewsCount: 640,
    soldCount: 1890,
    image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hl-5',
    name: 'Gadwal Handwoven Zari Border Saree',
    handloomType: 'Gadwal',
    state: 'Telangana',
    weaverName: 'Gadwal Guild Weavers',
    price: 4200,
    originalPrice: 5000,
    discount: 16,
    availability: 'In Stock',
    estimatedDelivery: '6–8 Days',
    rating: 4.8,
    reviewsCount: 185,
    soldCount: 740,
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hl-6',
    name: 'Narayanpet Traditional Border Saree',
    handloomType: 'Narayanpet',
    state: 'Telangana',
    weaverName: 'Narayanpet Cotton Weavers',
    price: 2100,
    originalPrice: 2600,
    discount: 19,
    availability: 'In Stock',
    estimatedDelivery: '5–7 Days',
    rating: 4.6,
    reviewsCount: 142,
    soldCount: 620,
    image: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hl-7',
    name: 'Venkatagiri Fine Cotton Silk',
    handloomType: 'Venkatagiri',
    state: 'Andhra Pradesh',
    weaverName: 'Venkatagiri Zari Looms',
    price: 3600,
    originalPrice: 4400,
    discount: 18,
    availability: 'In Stock',
    estimatedDelivery: '6–8 Days',
    rating: 4.8,
    reviewsCount: 198,
    soldCount: 830,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hl-8',
    name: 'Bhagalpuri Tussar Linen Fabric',
    handloomType: 'Bhagalpuri Linen',
    state: 'Bihar',
    weaverName: 'Bhagalpur Silk & Linen Guild',
    price: 2800,
    originalPrice: 3500,
    discount: 20,
    availability: 'In Stock',
    estimatedDelivery: '7–9 Days',
    rating: 4.7,
    reviewsCount: 275,
    soldCount: 1100,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hl-9',
    name: 'Paithani Peacock Brocade Silk Saree',
    handloomType: 'Paithani',
    state: 'Maharashtra',
    weaverName: 'Yeola Paithani Heritage',
    price: 9800,
    originalPrice: 12000,
    discount: 18,
    availability: 'In Stock',
    estimatedDelivery: '8–12 Days',
    rating: 4.9,
    reviewsCount: 380,
    soldCount: 1450,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hl-10',
    name: 'Chanderi Sheer Cotton Silk Saree',
    handloomType: 'Chanderi',
    state: 'Madhya Pradesh',
    weaverName: 'Chanderi Fabric Collective',
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    availability: 'In Stock',
    estimatedDelivery: '6–8 Days',
    rating: 4.8,
    reviewsCount: 410,
    soldCount: 1620,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80'
  }
];

const featuredSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Andhra Cotton Mills',
    location: 'Guntur, Andhra Pradesh',
    products: ['Premium Cotton Yarn', 'Organic Cotton', 'Cotton Thread', 'Handloom Accessories'],
    experience: '22 Years',
    rating: 4.9,
    ordersDelivered: '12,500+',
    verified: true,
    logo: '🧵'
  },
  {
    id: 'sup-2',
    name: 'Golden Silk Traders',
    location: 'Kanchipuram, Tamil Nadu',
    products: ['Silk Yarn', 'Mulberry Silk', 'Premium Zari', 'Natural Dye Packs'],
    experience: '18 Years',
    rating: 4.8,
    ordersDelivered: '8,200+',
    verified: true,
    logo: '✨'
  },
  {
    id: 'sup-3',
    name: 'Eco Threads India',
    location: 'Hyderabad, Telangana',
    products: ['Natural Dyes', 'Organic Fibres', 'Linen Yarn', 'Sustainable Cotton'],
    experience: '15 Years',
    rating: 4.7,
    ordersDelivered: '6,500+',
    verified: true,
    logo: '🌿'
  }
];

const featuredSupplierProducts: SupplierProduct[] = [
  {
    id: 'sp-1',
    name: 'Premium Cotton Yarn',
    supplier: 'Andhra Cotton Mills',
    price: '₹450 / kg',
    rating: 4.9,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sp-2',
    name: 'Mulberry Silk Yarn',
    supplier: 'Golden Silk Traders',
    price: '₹3,200 / kg',
    rating: 4.8,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sp-3',
    name: 'Natural Dye Packs',
    supplier: 'Eco Threads India',
    price: '₹850 / set',
    rating: 4.7,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sp-4',
    name: 'Golden Zari Thread',
    supplier: 'Golden Silk Traders',
    price: '₹1,400 / spool',
    rating: 4.9,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sp-5',
    name: 'Linen Rolls',
    supplier: 'Eco Threads India',
    price: '₹650 / meter',
    rating: 4.8,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sp-6',
    name: 'Cotton Cones',
    supplier: 'Andhra Cotton Mills',
    price: '₹320 / cone',
    rating: 4.9,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sp-7',
    name: 'Handloom Needles',
    supplier: 'Andhra Cotton Mills',
    price: '₹150 / set',
    rating: 4.7,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sp-8',
    name: 'Weaving Shuttle',
    supplier: 'Golden Silk Traders',
    price: '₹890 / piece',
    rating: 4.8,
    availability: 'In Stock',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
  }
];

export const LandingPage: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedSupplierDetail, setSelectedSupplierDetail] = useState<Supplier | null>(null);

  const { setTheme } = useTheme();
  const { user, token } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();

  // Social states for logged-in view
  const [posts, setPosts] = useState<PostType[]>([]);
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeStoryGroup, setActiveStoryGroup] = useState<StoryGroup | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyIntervalRef = useRef<any>(null);
  const isHoldingRef = useRef(false);

  // Comments state
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

  const fetchSocialFeed = async () => {
    setLoadingPosts(true);
    try {
      const postsRes = await fetch(`${API_URL}/posts`);
      if (postsRes.ok) {
        const data = await postsRes.json();
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

      const storiesRes = await fetch(`${API_URL}/stories`);
      if (storiesRes.ok) {
        setStories(await storiesRes.json());
      }

      const suggestionsRes = await fetch(`${API_URL}/suggested-users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (suggestionsRes.ok) {
        setSuggestedUsers(await suggestionsRes.json());
      }
    } catch (err) {
      setPosts([
        {
          _id: 'p1',
          user: { _id: 'u-1', name: 'Master Pochampally Looms', role: 'weaver' },
          images: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
          ],
          caption: 'Handweaving pure Pochampally double-ikat silk saree for traditional wedding wear. 🧵✨ #pochampally #ikat #handloom #artisan',
          hashtags: ['pochampally', 'ikat', 'handloom', 'artisan'],
          location: 'Pochampally, Telangana',
          taggedProducts: ['Pochampally Silk Saree', 'Ikat Dupatta'],
          likesCount: 340,
          viewsCount: 1820,
          sharesCount: 52,
          createdAt: new Date().toISOString(),
          liked: false,
          saved: false
        },
        {
          _id: 'p2',
          user: { _id: 'u-2', name: 'Varanasi Silk Weavers', role: 'weaver' },
          images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'],
          caption: 'Pure gold zari Banarasi brocade sarees hot off the traditional pit loom. 👑 #banarasi #silk #heritage',
          hashtags: ['banarasi', 'silk', 'heritage'],
          location: 'Varanasi, UP',
          taggedProducts: ['Banarasi Silk Brocade'],
          likesCount: 295,
          viewsCount: 1400,
          sharesCount: 31,
          createdAt: new Date().toISOString(),
          liked: false,
          saved: false
        }
      ]);

      setStories([
        {
          user: { _id: 'u-1', name: 'Pochampally Looms', role: 'weaver' },
          stories: [
            { _id: 's1', mediaUrl: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80', mediaType: 'image', createdAt: new Date().toISOString() }
          ]
        },
        {
          user: { _id: 'u-2', name: 'Kanchi Looms', role: 'weaver' },
          stories: [
            { _id: 's2', mediaUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80', mediaType: 'image', createdAt: new Date().toISOString() }
          ]
        }
      ]);

      setSuggestedUsers([
        { _id: 'u-3', name: 'Andhra Cotton Mills', role: 'supplier', email: 'guntur@cottonmills.in' },
        { _id: 'u-4', name: 'Golden Silk Traders', role: 'supplier', email: 'kanchi@goldensilk.in' },
        { _id: 'u-5', name: 'Eco Threads India', role: 'supplier', email: 'hyd@ecothreads.in' }
      ]);
    } finally {
      setLoadingPosts(false);
    }
  };

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

  const handleAddToCart = (productName: string) => {
    showToast(`Added "${productName}" to Cart!`, "success");
  };

  const handleBuyNow = (productName: string) => {
    if (!user) {
      setShowGate(true);
    } else {
      showToast(`Proceeding to checkout for "${productName}"...`, "info");
      navigate('/customer');
    }
  };

  const handleContactSupplier = (supplierName: string) => {
    if (!user) {
      setShowGate(true);
    } else {
      showToast(`Initiating B2B inquiry with ${supplierName}...`, "info");
    }
  };

  // 1. Logged in Social Feed View
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
          .feed-main-col { flex: 1; max-width: 630px; display: flex; flex-direction: column; gap: 24px; }
          .feed-sidebar-col { width: 320px; display: flex; flex-direction: column; gap: 24px; }
          .stories-carousel-card {
            background-color: var(--bg-secondary); border: 1px solid var(--border-color);
            border-radius: 12px; padding: 16px; display: flex; gap: 16px; overflow-x: auto; scrollbar-width: none;
          }
          .story-bubble { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; min-width: 74px; }
          .story-ring { width: 64px; height: 64px; border-radius: 50%; padding: 3px; background: linear-gradient(45deg, var(--accent-gold), #b38627); display: flex; justify-content: center; align-items: center; }
          .story-avatar { width: 100%; height: 100%; border-radius: 50%; border: 2px solid var(--bg-secondary); object-fit: cover; }
          .feed-post-card { background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-sm); }
          .post-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; }
          .post-avatar-placeholder { width: 38px; height: 38px; border-radius: 50%; background-color: var(--accent-gold); color: black; font-weight: 700; display: flex; align-items: center; justify-content: center; }
          .post-image-carousel { position: relative; width: 100%; aspect-ratio: 1; background-color: #000; display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
          .post-carousel-slide { flex: 0 0 100%; width: 100%; scroll-snap-align: start; object-fit: cover; }
          .post-actions-bar { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; font-size: 24px; }
          .post-actions-left { display: flex; gap: 16px; }
          .post-action-btn { background: transparent; border: none; cursor: pointer; padding: 0; font-size: 24px; }
          .post-meta-details { padding: 0 16px 16px; font-size: 14px; line-height: 1.5; }
          .sidebar-widget { background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; }
          .widget-title { font-size: 15px; font-weight: 700; margin-bottom: 16px; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
          @media (max-width: 900px) { .feed-sidebar-col { display: none; } .social-home-feed-container { justify-content: center; } }
        `}</style>

        <div className="feed-main-col">
          <div className="stories-carousel-card">
            {stories.map(group => (
              <div key={group.user._id} className="story-bubble" onClick={() => setActiveStoryGroup(group)}>
                <div className="story-ring">
                  <img className="story-avatar" src={group.stories[0].mediaUrl} alt={group.user.name} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{group.user.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {loadingPosts ? (
            <div style={{ textAlign: 'center', padding: '50px' }}><div className="spinner"></div></div>
          ) : (
            posts.map((post, idx) => (
              <div key={post._id} className="feed-post-card fade-in">
                <div className="post-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="post-avatar-placeholder">{post.user.name[0].toUpperCase()}</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>{post.user.name}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>📍 {post.location || 'India'}</span>
                    </div>
                  </div>
                  <span className="badge badge-gold">Verified Weaver</span>
                </div>

                <div className="post-image-carousel">
                  {post.images.map((img, i) => (
                    <img key={i} className="post-carousel-slide" src={img} alt="handloom post" />
                  ))}
                </div>

                <div className="post-actions-bar">
                  <div className="post-actions-left">
                    <button className="post-action-btn" onClick={() => handleLikePost(post._id, idx)}>{post.liked ? '❤️' : '🖤'}</button>
                    <button className="post-action-btn" onClick={() => showToast("Opening comments...", "info")}>💬</button>
                    <button className="post-action-btn" onClick={() => { navigator.clipboard.writeText(window.location.origin); showToast("Link copied!", "info"); }}>↗</button>
                  </div>
                  <button className="post-action-btn" onClick={() => showToast("Saved to collection!", "success")}>📁</button>
                </div>

                <div className="post-meta-details">
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>{post.likesCount || 0} likes • {post.viewsCount || 0} views</div>
                  <div><strong>{post.user.name} </strong>{post.caption}</div>
                  {post.taggedProducts && post.taggedProducts.length > 0 && (
                    <div style={{ fontSize: '12px', color: 'var(--accent-gold)', marginTop: '6px' }}>
                      🧶 Authentic Products: <strong>{post.taggedProducts.join(', ')}</strong>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="feed-sidebar-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 0' }}>
            <div className="post-avatar-placeholder" style={{ width: '50px', height: '50px', fontSize: '18px' }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{user.name}</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.role.toUpperCase()}</span>
            </div>
          </div>

          <div className="sidebar-widget">
            <h4 className="widget-title">Featured Raw Material Suppliers</h4>
            {featuredSuppliers.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{s.logo}</span>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{s.name}</h5>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{s.location}</span>
                  </div>
                </div>
                <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => handleContactSupplier(s.name)}>Contact</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Default Handloom Landing View
  return (
    <div className="handloom-landing-container fade-in">
      <style>{`
        .handloom-landing-container {
          width: 100%;
          margin: 0 auto;
          padding-bottom: 60px;
        }

        /* Splash Screen */
        .splash-screen {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: linear-gradient(135deg, #0A0A0B, #19191E);
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          z-index: 9999; color: #FFFFFF; transition: opacity 0.5s ease;
        }
        .splash-logo {
          font-family: var(--font-heading); font-size: 44px; font-weight: 700; letter-spacing: 2px; margin-bottom: 20px;
        }

        /* Hero Banner */
        .handloom-hero {
          width: 100%;
          min-height: 520px;
          border-radius: var(--border-radius-lg);
          background: linear-gradient(135deg, rgba(15, 20, 35, 0.75) 0%, rgba(10, 10, 15, 0.85) 100%), 
                      url('https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 60px 48px;
          color: #FFFFFF;
          margin-bottom: 50px;
          box-shadow: var(--shadow-lg);
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(197, 160, 89, 0.2);
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .hero-title {
          font-family: var(--font-heading);
          font-size: 52px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 20px;
          max-width: 720px;
          color: #FFFFFF;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
        }

        .hero-subtitle {
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 36px;
          max-width: 620px;
          color: rgba(255, 255, 255, 0.9);
        }

        .hero-cta-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 700;
          border-radius: 30px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #000;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(197, 160, 89, 0.4);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(197, 160, 89, 0.6);
        }

        .hero-btn-secondary {
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(6px);
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #FFFFFF;
          transform: translateY(-2px);
        }

        /* Section Header */
        .section-header-block {
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .section-title-main {
          font-family: var(--font-heading);
          font-size: 30px;
          font-weight: 800;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title-main::before {
          content: '';
          display: inline-block;
          width: 5px;
          height: 28px;
          background: var(--accent-gold);
          border-radius: 4px;
        }

        .section-subtitle-main {
          font-size: 14px;
          color: var(--text-secondary);
          margin-left: 17px;
        }

        /* Categories Grid */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 18px;
          margin-bottom: 60px;
        }

        .category-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 22px 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          box-shadow: var(--shadow-sm);
        }

        .category-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: var(--shadow-md);
          background: var(--bg-tertiary);
        }

        .category-icon {
          font-size: 36px;
        }

        .category-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Handlooms Grid */
        .handloom-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 65px;
        }

        /* Product Card (PART 2 Specification) */
        .product-card-enhanced {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .product-card-enhanced:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: var(--accent-gold);
        }

        .product-img-box {
          position: relative;
          width: 100%;
          height: 260px;
          overflow: hidden;
          background-color: #1a1a1a;
        }

        .product-img-main {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card-enhanced:hover .product-img-main {
          transform: scale(1.05);
        }

        .state-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(10, 15, 30, 0.85);
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          backdrop-filter: blur(4px);
        }

        .discount-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #e63946;
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(230, 57, 70, 0.4);
        }

        .product-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-handloom-type {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .product-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .weaver-info {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .product-metrics-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px dashed var(--border-color);
        }

        .rating-stars {
          color: #ffb703;
          font-weight: 700;
        }

        .sold-count {
          color: var(--text-muted);
          font-weight: 500;
        }

        .price-delivery-block {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 16px;
        }

        .price-group {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .current-price {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .original-price {
          font-size: 14px;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .delivery-time {
          font-size: 11px;
          font-weight: 600;
          color: #2a9d8f;
          background: rgba(42, 157, 143, 0.1);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .product-card-btns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: auto;
        }

        .btn-add-cart {
          padding: 10px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 8px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-add-cart:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-buy-now {
          padding: 10px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          border: none;
          color: #000000;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-buy-now:hover {
          opacity: 0.95;
        }

        /* Raw Material Suppliers Section (PART 4) */
        .suppliers-section-box {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 36px 28px;
          margin-bottom: 60px;
        }

        .supplier-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .supplier-card-enhanced {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: var(--shadow-sm);
          position: relative;
        }

        .supplier-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .supplier-logo-box {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 2px solid var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .supplier-title-box {
          flex: 1;
        }

        .supplier-name {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(42, 157, 143, 0.15);
          color: #2a9d8f;
          border: 1px solid #2a9d8f;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
        }

        .supplier-location {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .supplier-details-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          background: var(--bg-secondary);
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
        }

        .supplier-detail-item strong {
          display: block;
          color: var(--text-primary);
          font-weight: 700;
        }

        .supplier-products-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .product-tag {
          font-size: 11px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 4px 10px;
          border-radius: 12px;
          color: var(--text-secondary);
        }

        /* Supplier Benefits */
        .benefits-banner {
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.08) 0%, rgba(30, 40, 60, 0.15) 100%);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 28px;
          margin-top: 20px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-primary);
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          font-size: 13px;
          font-weight: 600;
        }

        /* Supplier Products Grid */
        .supplier-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .supplier-prod-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .supplier-prod-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .supplier-prod-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .handloom-hero { padding: 36px 24px; min-height: 420px; }
          .hero-title { font-size: 34px; }
          .hero-subtitle { font-size: 15px; }
          .product-card-btns { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Splash Screen */}
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-logo">AURA<span style={{ color: '#C5A059' }}>STITCH</span> AI</div>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', fontSize: '13px', letterSpacing: '3px', color: 'var(--text-muted)' }}>
            CONNECTING WEAVERS & SUPPLIERS...
          </p>
        </div>
      )}

      {/* Hero Banner */}
      <div className="handloom-hero">
        <div className="hero-badge-pill">
          ✦ Direct Weaver Marketplace
        </div>
        <h1 className="hero-title">
          Discover India's Finest Handloom Collections
        </h1>
        <p className="hero-subtitle">
          Support local artisans by purchasing authentic handloom products directly from verified weavers across India.
        </p>
        <div className="hero-cta-group">
          <a href="#featured-collections" className="hero-btn-primary">
            Explore Collection 🛍️
          </a>
          <a href="#raw-material-suppliers" className="hero-btn-secondary">
            Browse Weavers & Suppliers 🧵
          </a>
        </div>
      </div>

      {/* Shop By Category */}
      <div id="shop-by-category" style={{ marginBottom: '50px' }}>
        <div className="section-header-block">
          <h2 className="section-title-main">Shop By Category</h2>
          <span className="section-subtitle-main">Browse authentic handloom weaves categorized by traditional craftsmanship</span>
        </div>

        <div className="category-grid">
          {[
            { name: 'Sarees', icon: '🥻' },
            { name: 'Dress Materials', icon: '👗' },
            { name: 'Cotton Fabrics', icon: '🧵' },
            { name: 'Silk Fabrics', icon: '✨' },
            { name: 'Dupattas', icon: '🧣' },
            { name: 'Kurtis', icon: '👚' },
            { name: 'Home Decor', icon: '🏡' },
            { name: 'Wedding Collection', icon: '👑' },
            { name: 'Festive Collection', icon: '🎉' }
          ].map(cat => (
            <div 
              key={cat.name} 
              className="category-card"
              onClick={() => {
                setActiveCategory(cat.name);
                showToast(`Filtered by ${cat.name}`, "info");
              }}
            >
              <div className="category-icon">{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Handlooms */}
      <div id="featured-collections" style={{ marginBottom: '60px' }}>
        <div className="section-header-block">
          <h2 className="section-title-main">Featured Handlooms</h2>
          <span className="section-subtitle-main">Authentic weaves directly from verified artisan looms across Indian states</span>
        </div>

        <div className="handloom-products-grid">
          {featuredHandlooms.map(product => (
            <div key={product.id} className="product-card-enhanced">
              <div className="product-img-box">
                <img src={product.image} alt={product.name} className="product-img-main" />
                <span className="state-badge">📍 {product.state}</span>
                <span className="discount-badge">{product.discount}% OFF</span>
              </div>

              <div className="product-body">
                <div className="product-handloom-type">{product.handloomType}</div>
                <h3 className="product-title">{product.name}</h3>
                <div className="weaver-info">
                  <span>🧑‍🌾 Woven by: <strong>{product.weaverName}</strong></span>
                </div>

                <div className="product-metrics-row">
                  <span className="rating-stars">⭐ {product.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>({product.reviewsCount} Reviews)</span></span>
                  <span className="sold-count">{product.soldCount.toLocaleString()} Sold</span>
                </div>

                <div className="price-delivery-block">
                  <div className="price-group">
                    <span className="current-price">₹{product.price.toLocaleString()}</span>
                    <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                  </div>
                  <span className="delivery-time">🚚 {product.estimatedDelivery}</span>
                </div>

                <div className="product-card-btns">
                  <button className="btn-add-cart" onClick={() => handleAddToCart(product.name)}>
                    Add to Cart
                  </button>
                  <button className="btn-buy-now" onClick={() => handleBuyNow(product.name)}>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Material Suppliers (PART 4) */}
      <div id="raw-material-suppliers" className="suppliers-section-box">
        <div className="section-header-block">
          <h2 className="section-title-main">Trusted Handloom Raw Material Suppliers</h2>
          <span className="section-subtitle-main">Verified suppliers providing premium quality raw materials to India's handloom weavers</span>
        </div>

        {/* 3 Featured Suppliers */}
        <div className="supplier-cards-grid">
          {featuredSuppliers.map(supplier => (
            <div key={supplier.id} className="supplier-card-enhanced">
              <div className="supplier-card-header">
                <div className="supplier-logo-box">{supplier.logo}</div>
                <div className="supplier-title-box">
                  <div className="supplier-name">
                    {supplier.name}
                    {supplier.verified && <span className="verified-badge">✓ Verified</span>}
                  </div>
                  <div className="supplier-location">📍 {supplier.location}</div>
                </div>
              </div>

              <div className="supplier-details-list">
                <div className="supplier-detail-item">
                  <span>Experience</span>
                  <strong>{supplier.experience}</strong>
                </div>
                <div className="supplier-detail-item">
                  <span>Rating</span>
                  <strong>★ {supplier.rating} / 5.0</strong>
                </div>
                <div className="supplier-detail-item" style={{ gridColumn: 'span 2' }}>
                  <span>Orders Delivered</span>
                  <strong>📦 {supplier.ordersDelivered}</strong>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  PRODUCTS SUPPLIED:
                </span>
                <div className="supplier-products-tags">
                  {supplier.products.map(p => (
                    <span key={p} className="product-tag">{p}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 'auto' }}>
                <button className="btn-secondary" style={{ padding: '8px', fontSize: '12px' }} onClick={() => setSelectedSupplierDetail(supplier)}>
                  View Products
                </button>
                <button className="btn-primary" style={{ padding: '8px', fontSize: '12px' }} onClick={() => handleContactSupplier(supplier.name)}>
                  Contact Supplier
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Supplier Benefits */}
        <div className="benefits-banner">
          <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            Why Choose Verified Suppliers?
          </h3>
          <div className="benefits-grid">
            <div className="benefit-item">💎 Premium Raw Materials</div>
            <div className="benefit-item">🏷️ Direct Manufacturer Pricing</div>
            <div className="benefit-item">🌱 Sustainable Sourcing</div>
            <div className="benefit-item">⚡ Fast Delivery</div>
            <div className="benefit-item">🛡️ Quality Certified</div>
          </div>
        </div>

        {/* Featured Supplier Products */}
        <div style={{ marginTop: '45px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '20px', color: 'var(--text-primary)' }}>
            Featured Supplier Raw Materials
          </h3>

          <div className="supplier-products-grid">
            {featuredSupplierProducts.map(sp => (
              <div key={sp.id} className="supplier-prod-card">
                <img src={sp.image} alt={sp.name} className="supplier-prod-img" />
                <div className="supplier-prod-body">
                  <div style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>{sp.supplier}</div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{sp.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{sp.price}</span>
                    <span style={{ color: '#ffb703', fontWeight: 700 }}>⭐ {sp.rating}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
                    <button className="btn-secondary" style={{ flex: 1, padding: '6px', fontSize: '11px' }} onClick={() => showToast("Saved to Wishlist!", "success")}>
                      ♥ Wishlist
                    </button>
                    <button className="btn-primary" style={{ flex: 1, padding: '6px', fontSize: '11px' }} onClick={() => handleContactSupplier(sp.supplier)}>
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier Quick Modal */}
      {selectedSupplierDetail && (
        <div className="modal-backdrop fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '520px', padding: '30px', border: '1px solid var(--accent-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{selectedSupplierDetail.logo}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-heading)' }}>{selectedSupplierDetail.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📍 {selectedSupplierDetail.location}</span>
                </div>
              </div>
              <button onClick={() => setSelectedSupplierDetail(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Verified raw material supplier with <strong>{selectedSupplierDetail.experience}</strong> of industry expertise supplying premium handloom yarn, dyes and thread pan-India.
            </p>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--accent-gold)' }}>Catalog Raw Materials:</strong>
              <ul style={{ margin: '8px 0 0 18px', padding: 0, fontSize: '13px', color: 'var(--text-primary)' }}>
                {selectedSupplierDetail.products.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedSupplierDetail(null)}>Close</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setSelectedSupplierDetail(null); handleContactSupplier(selectedSupplierDetail.name); }}>Contact Supplier Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Login Modal Gate */}
      <div className={`auth-gate-modal ${showGate ? 'active' : ''}`} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: showGate ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
        <div className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '36px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h3 style={{ marginBottom: '10px', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>
            Login or Register Required
          </h3>
          <p style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
            Sign in to your AuraStitch AI account to place handloom orders, request custom weaving, or contact B2B raw material suppliers.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/login" className="btn-primary">Login to Continue</Link>
            <Link to="/register" className="btn-secondary">Register New Account</Link>
          </div>
          <button 
            style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }} 
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
