import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OutletContextType {
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface ActivityItem {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  time: string;
  icon: string;
}

interface PlatformUpdate {
  id: string;
  tag: string;
  title: string;
  description: string;
  date: string;
  badgeColor: string;
}

interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'feature' | 'system' | 'event';
  icon: string;
}

const mockRecentActivities: ActivityItem[] = [
  {
    id: 'act-1',
    user: 'Sri Lakshmi Weavers',
    role: 'Handloom Weaver',
    action: 'published a new collection',
    target: 'Royal Pochampally Double Ikat Sarees',
    time: '15 mins ago',
    icon: '🌾'
  },
  {
    id: 'act-2',
    user: 'Coimbatore Cotton Mills',
    role: 'Raw Material Supplier',
    action: 'updated raw inventory stock',
    target: '+850 kg Organic Combed Cotton Yarn (80s Count)',
    time: '42 mins ago',
    icon: '🧶'
  },
  {
    id: 'act-3',
    user: 'Master Tailor Priya',
    role: 'Custom Tailor',
    action: 'added new stitching patterns',
    target: '15 Traditional Zardozi Blouse Designs',
    time: '1 hour ago',
    icon: '✂️'
  },
  {
    id: 'act-4',
    user: 'Deccan Organic Dyes',
    role: 'Raw Material Supplier',
    action: 'introduced new eco-friendly dye',
    target: 'Plant-Extracted Natural Indigo Powder',
    time: '2 hours ago',
    icon: '🧪'
  },
  {
    id: 'act-5',
    user: 'Ananya Sharma',
    role: 'Verified Customer',
    action: 'placed a custom handloom order',
    target: 'Kanchipuram Silk Bridal Saree with Zari Border',
    time: '3 hours ago',
    icon: '🛍️'
  }
];

const mockPlatformUpdates: PlatformUpdate[] = [
  {
    id: 'up-1',
    tag: 'NEW COLLECTIONS',
    title: 'New Handloom Collections',
    description: 'Explore the newly added Pochampally Double-Ikat Silk Sarees and Kanchipuram Zari Weaves direct from regional artisan looms.',
    date: '23 Jul 2026',
    badgeColor: 'var(--accent-gold)'
  },
  {
    id: 'up-2',
    tag: 'TEXTILE SCHEMES',
    title: 'Government Textile Schemes',
    description: 'National Handloom Weaver Subsidy 2026 applications now open. Direct 20% yarn purchasing subsidies enabled for registered pit loom artisans.',
    date: '21 Jul 2026',
    badgeColor: '#2a9d8f'
  },
  {
    id: 'up-3',
    tag: 'EXHIBITIONS',
    title: 'Upcoming Handloom Exhibitions',
    description: 'National Craft Mela & Handloom Artisan Expo arriving in Hyderabad and Chennai next week. Free stall registration for weavers.',
    date: '19 Jul 2026',
    badgeColor: '#f4a261'
  },
  {
    id: 'up-4',
    tag: 'ANNOUNCEMENTS',
    title: 'AuraStitch Announcements',
    description: 'AuraStitch AI Design Studio v2.4 released with 3D fabric drape preview and automated jacquard pattern generation.',
    date: '16 Jul 2026',
    badgeColor: '#e76f51'
  }
];

const mockNotifications: NotificationAlert[] = [
  {
    id: 'notif-1',
    title: 'Scheduled Platform Maintenance',
    message: 'System upgrade scheduled for 25th July from 02:00 AM to 04:00 AM IST. All services will resume immediately after.',
    timestamp: 'Today, 10:30 AM',
    type: 'system',
    icon: '🔔'
  },
  {
    id: 'notif-2',
    title: 'New AI Texture Generator Tool',
    message: 'Weavers can now convert sketch photos directly into loom warp jacquard card patterns in seconds.',
    timestamp: 'Yesterday, 04:15 PM',
    type: 'feature',
    icon: '🚀'
  },
  {
    id: 'notif-3',
    title: 'Artisan Roundtable Webinar',
    message: 'Join the upcoming Handloom Weaver & Designer Collaboration Forum this Friday at 05:00 PM IST.',
    timestamp: '21 Jul 2026',
    type: 'event',
    icon: '📅'
  },
  {
    id: 'notif-4',
    title: 'Express B2B Delivery Active',
    message: 'Raw material shipments from Coimbatore and Salem are now delivering within 48 hours to all South India clusters.',
    timestamp: '20 Jul 2026',
    type: 'info',
    icon: '📦'
  }
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const context = useOutletContext<OutletContextType | null>();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (context?.showToast) context.showToast(msg, type);
    else alert(msg);
  };

  // Search State
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  // Quick Search Tags
  const quickSearchTags = [
    'All', '#PochampallyIkat', '#OrganicCottonYarn', '#KanchipuramSilk', 
    '#NaturalDyes', '#CustomTailoring', '#JacquardCards', '#HandloomCollections'
  ];

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    if (!globalSearch && activeTag === 'All') return mockRecentActivities;

    const term = (globalSearch || activeTag.replace('#', '')).toLowerCase();
    return mockRecentActivities.filter(act => 
      act.user.toLowerCase().includes(term) ||
      act.target.toLowerCase().includes(term) ||
      act.action.toLowerCase().includes(term) ||
      act.role.toLowerCase().includes(term)
    );
  }, [globalSearch, activeTag]);

  // Filtered Updates
  const filteredUpdates = useMemo(() => {
    if (!globalSearch && activeTag === 'All') return mockPlatformUpdates;

    const term = (globalSearch || activeTag.replace('#', '')).toLowerCase();
    return mockPlatformUpdates.filter(up => 
      up.title.toLowerCase().includes(term) ||
      up.description.toLowerCase().includes(term) ||
      up.tag.toLowerCase().includes(term)
    );
  }, [globalSearch, activeTag]);

  // Handle Quick Search Tag Click
  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    if (tag === 'All') {
      setGlobalSearch('');
      showToast('Showing all platform updates and activities', 'info');
    } else {
      showToast(`Filtered by ${tag}`, 'info');
    }
  };

  return (
    <div className="aura-home-container fade-in" style={{ padding: '24px', paddingBottom: '90px', maxWidth: '1240px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <style>{`
        /* Welcome Hero Section */
        .home-welcome-hero {
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.12) 0%, rgba(20, 25, 38, 0.95) 100%);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius-lg);
          padding: 36px 30px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-md);
          position: relative;
          overflow: hidden;
        }

        .welcome-badge-pill {
          display: inline-block;
          background: rgba(197, 160, 89, 0.2);
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 14px;
          letter-spacing: 0.5px;
        }

        .welcome-hero-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 10px;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .welcome-hero-sub {
          font-size: 15px;
          color: var(--text-secondary);
          max-width: 780px;
          margin: 0 0 24px;
          line-height: 1.6;
        }

        /* Search Section */
        .home-search-box {
          position: relative;
          max-width: 720px;
          width: 100%;
        }

        .home-search-input {
          width: 100%;
          padding: 14px 22px;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 15px;
          outline: none;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .home-search-input:focus {
          border-color: var(--accent-gold);
          box-shadow: 0 0 12px rgba(197, 160, 89, 0.25);
        }

        /* Quick Search Tags */
        .quick-search-section {
          margin-top: 18px;
        }

        .quick-search-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 8px;
          display: block;
        }

        .quick-tags-flex {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .quick-tag-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .quick-tag-btn:hover, .quick-tag-btn.active {
          background: rgba(197, 160, 89, 0.2);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        /* Dashboard Main Layout Grid */
        .home-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 28px;
        }

        .section-block-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
        }

        .section-card-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 18px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        /* Recent Activity List */
        .activity-list-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .activity-item-card {
          display: flex;
          gap: 14px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 14px 16px;
          align-items: center;
          transition: border-color 0.2s ease;
        }

        .activity-item-card:hover {
          border-color: var(--accent-gold);
        }

        .activity-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(197, 160, 89, 0.15);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .activity-details {
          flex: 1;
        }

        .activity-user-line {
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: 3px;
        }

        .activity-role-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-gold);
          background: rgba(197, 160, 89, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
          margin-left: 6px;
        }

        .activity-time {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Platform Updates Cards */
        .updates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 16px;
        }

        .update-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .update-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent-gold);
        }

        .update-tag-pill {
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          width: fit-content;
          margin-bottom: 8px;
          color: #000;
        }

        .update-title {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 6px;
          color: var(--text-primary);
        }

        .update-desc {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          line-height: 1.4;
          flex: 1;
        }

        .update-date {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 600;
        }

        /* Notifications Sidebar Panel */
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notif-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 14px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          transition: border-color 0.2s ease;
        }

        .notif-card:hover {
          border-color: var(--accent-gold);
        }

        .notif-icon-box {
          font-size: 18px;
          padding: 6px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          flex-shrink: 0;
        }

        .notif-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px;
        }

        .notif-msg {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .notif-time {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .home-main-grid { grid-template-columns: 1fr; }
          .updates-grid { grid-template-columns: 1fr; }
          .welcome-hero-title { font-size: 24px; }
        }
      `}</style>

      {/* 1. Welcome Section */}
      <div className="home-welcome-hero">
        <span className="welcome-badge-pill">✨ AuraStitch AI Digital Ecosystem</span>
        <h1 className="welcome-hero-title">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="welcome-hero-sub">
          The unified digital platform connecting authentic handloom artisans, raw material suppliers, custom tailors, and fashion enthusiasts across India.
        </p>

        {/* 2. Search Bar */}
        <div className="home-search-box">
          <input 
            type="text" 
            className="home-search-input" 
            placeholder="Search products, raw yarn, weavers, tailors, platform updates, collections..." 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        {/* 3. Quick Search Tags */}
        <div className="quick-search-section">
          <span className="quick-search-title">Quick Search Categories</span>
          <div className="quick-tags-flex">
            {quickSearchTags.map(tag => (
              <button 
                key={tag} 
                className={`quick-tag-btn ${activeTag === tag ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Updates Section (Directly below Welcome section) */}
      <div className="section-block-card" style={{ marginBottom: '32px' }}>
        <h2 className="section-card-title">
          <span>📢 Platform Updates & Information</span>
        </h2>

        {filteredUpdates.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No platform updates matching your search criteria.
          </div>
        ) : (
          <div className="updates-grid">
            {filteredUpdates.map(up => (
              <div key={up.id} className="update-card">
                <span className="update-tag-pill" style={{ background: up.badgeColor }}>
                  {up.tag}
                </span>
                <h3 className="update-title">{up.title}</h3>
                <p className="update-desc">{up.description}</p>
                <span className="update-date">📅 {up.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout Grid */}
      <div className="home-main-grid">
        {/* Left Column: Recent Activity & Platform Updates */}
        <div>
          {/* 4. Recent Activity */}
          <div className="section-block-card">
            <h2 className="section-card-title">
              <span>⚡ Recent Ecosystem Activity</span>
            </h2>

            {filteredActivities.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No recent activity matching your search criteria.
              </div>
            ) : (
              <div className="activity-list-container">
                {filteredActivities.map(act => (
                  <div key={act.id} className="activity-item-card">
                    <div className="activity-icon-box">{act.icon}</div>
                    <div className="activity-details">
                      <div className="activity-user-line">
                        <strong>{act.user}</strong> 
                        <span className="activity-role-tag">{act.role}</span>
                        {' '}{act.action} <strong>{act.target}</strong>
                      </div>
                      <span className="activity-time">🕒 {act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Notifications */}
        <div>
          {/* 6. Notifications */}
          <div className="section-block-card">
            <h2 className="section-card-title">
              <span>🔔 Live Notifications</span>
            </h2>

            <div className="notifications-list">
              {mockNotifications.map(notif => (
                <div key={notif.id} className="notif-card">
                  <div className="notif-icon-box">{notif.icon}</div>
                  <div>
                    <h4 className="notif-title">{notif.title}</h4>
                    <p className="notif-msg">{notif.message}</p>
                    <span className="notif-time">{notif.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
