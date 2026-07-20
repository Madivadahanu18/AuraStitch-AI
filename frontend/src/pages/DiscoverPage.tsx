import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface PostType {
  _id: string;
  user: {
    _id: string;
    name: string;
    role: string;
  };
  images: string[];
  caption: string;
  location?: string;
  likesCount: number;
}

export const DiscoverPage: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All', 'Traditional', 'Wedding', 'Casual', 'Office', 'Handloom', 
    'Designer', 'Vintage', 'Luxury', 'Ethnic', 'Western', 'AI Generated'
  ];

  const fetchDiscoverPosts = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/social/discover?';
      if (selectedCategory !== 'All') {
        url += `category=${selectedCategory}&`;
      }
      if (searchQuery) {
        url += `search=${searchQuery}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        throw new Error("API error");
      }
    } catch (error) {
      console.warn("Using offline fallback discover items...", error);
      // Mock discover data
      const mockPosts: PostType[] = [
        {
          _id: 'mock-1',
          user: { _id: 'u-1', name: 'Ananya Saree Studio', role: 'weaver' },
          images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=350&q=80'],
          caption: 'Traditional handwoven gold zari borders on linen saree. Designer ethnic look.',
          location: 'Andhra Pradesh',
          likesCount: 124
        },
        {
          _id: 'mock-2',
          user: { _id: 'u-2', name: 'Boutique Royal', role: 'tailor' },
          images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=350&q=80'],
          caption: 'Luxury wedding lehenga with custom zardozi work.',
          location: 'Delhi NCR',
          likesCount: 310
        },
        {
          _id: 'mock-3',
          user: { _id: 'u-3', name: 'Nitya Handloom Co', role: 'weaver' },
          images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=350&q=80'],
          caption: 'Casual block printed cotton fabrics for simple shirts.',
          location: 'Jaipur',
          likesCount: 88
        },
        {
          _id: 'mock-4',
          user: { _id: 'u-4', name: 'EcoWeave', role: 'supplier' },
          images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=350&q=80'],
          caption: 'Vintage indigo hand-dyed fabric collection.',
          location: 'Kolkata',
          likesCount: 45
        }
      ];

      // Filter locally for mock items
      let filtered = mockPosts;
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(p => p.caption.toLowerCase().includes(selectedCategory.toLowerCase()));
      }
      if (searchQuery) {
        filtered = filtered.filter(p => 
          p.caption.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      setPosts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoverPosts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDiscoverPosts();
  };

  return (
    <div className="discover-explore-container fade-in">
      <style>{`
        .discover-explore-container {
          padding: 24px;
          padding-bottom: 90px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-filter-section {
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .discover-search-form {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .discover-search-input {
          flex: 1;
          padding: 14px 20px;
          border-radius: 30px;
          border: 1px solid var(--border-color, rgba(0,0,0,0.1));
          background-color: var(--bg-secondary, #fff);
          color: var(--text-primary);
          font-size: 15px;
          box-shadow: var(--shadow-sm);
        }

        .discover-search-input:focus {
          border-color: var(--accent-gold, #C5A059);
          outline: none;
        }

        .discover-categories-bar {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .discover-category-pill {
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid var(--border-color, rgba(0,0,0,0.1));
          background-color: var(--bg-secondary, #fff);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .discover-category-pill.active, .discover-category-pill:hover {
          background-color: var(--accent-gold, #C5A059);
          color: #fff;
          border-color: var(--accent-gold, #C5A059);
        }

        /* Pinterest Masonry layout */
        .discover-grid-layout {
          columns: 4 250px;
          column-gap: 20px;
        }

        .discover-item-card {
          break-inside: avoid;
          margin-bottom: 20px;
          background-color: var(--bg-secondary, #fff);
          border: 1px solid var(--border-color, rgba(0,0,0,0.1));
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .discover-item-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .discover-card-img {
          width: 100%;
          display: block;
          object-fit: cover;
          max-height: 400px;
          cursor: pointer;
        }

        .discover-card-details {
          padding: 16px;
        }

        .discover-card-creator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .discover-creator-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          color: white;
        }

        .discover-card-likes {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .discover-grid-layout {
            columns: 2 160px;
            column-gap: 12px;
          }
          .discover-item-card {
            margin-bottom: 12px;
          }
        }
      `}</style>

      <div className="search-filter-section">
        <form onSubmit={handleSearchSubmit} className="discover-search-form">
          <input 
            type="text" 
            className="discover-search-input" 
            placeholder="Search tags, styles, tailors, fabrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ borderRadius: '30px', padding: '0 24px' }}>Search</button>
        </form>

        <div className="discover-categories-bar">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`discover-category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><div className="spinner"></div></div>
      ) : (
        <div className="discover-grid-layout">
          {posts.map(post => (
            <div key={post._id} className="discover-item-card fade-in">
              <Link to={`/reels`}>
                <img 
                  className="discover-card-img" 
                  src={post.images && post.images[0] ? post.images[0] : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=350&q=80'} 
                  alt="Explore" 
                />
              </Link>
              <div className="discover-card-details">
                <div className="discover-card-creator">
                  <div className="discover-creator-avatar">
                    {post.user?.name ? post.user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{post.user?.name || 'Partner'}</h5>
                    <span style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>{post.user?.role?.toUpperCase()}</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', margin: '0 0 12px 0', lineHeight: 1.4, color: 'var(--text-primary)' }}>{post.caption}</p>
                <div className="discover-card-likes">
                  <span>📍 {post.location || 'Explore'}</span>
                  <span>❤️ {post.likesCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <h3>No items found matching your filters</h3>
          <p>Try selection of another category or clear search inputs.</p>
        </div>
      )}
    </div>
  );
};
export default DiscoverPage;
