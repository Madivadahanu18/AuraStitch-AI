import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface NotificationType {
  _id: string;
  sender: {
    name: string;
    role: string;
  };
  type: 'like' | 'comment' | 'follow' | 'order' | 'message' | 'update' | 'announcement';
  text: string;
  isRead: boolean;
  createdAt: string;
}

export const NotificationsPage: React.FC = () => {
  const { showToast } = useOutletContext<OutletContextType>();
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/social';

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn("Using offline mock notifications...");
      setNotifications([
        {
          _id: 'n-1',
          sender: { name: 'Priya Sharma', role: 'tailor' },
          type: 'like',
          text: 'Priya Sharma liked your preset dress customization design.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          _id: 'n-2',
          sender: { name: 'Platform Admin', role: 'admin' },
          type: 'announcement',
          text: 'System Announcement: Handloom Weaver Exhibition begins live in Design Studio this Sunday! 🎨',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
        },
        {
          _id: 'n-3',
          sender: { name: 'Kiran Loom', role: 'weaver' },
          type: 'follow',
          text: 'Kiran Handloom started following your style portfolio.',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        },
        {
          _id: 'n-4',
          sender: { name: 'System Dispatch', role: 'admin' },
          type: 'order',
          text: 'Order status updated: Custom embroidery dress order is dispatched and on route. 📦',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, index: number) => {
    const updated = [...notifications];
    updated[index].isRead = true;
    setNotifications(updated);
    showToast("Notification marked as read.", "success");

    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {}
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'order': return '🛍️';
      case 'message': return '✉️';
      case 'update': return '⚙️';
      case 'announcement': return '📢';
      default: return '🔔';
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  return (
    <div className="notifications-page-container fade-in">
      <style>{`
        .notifications-page-container {
          padding: 24px;
          padding-bottom: 90px;
          max-width: 700px;
          margin: 0 auto;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .notification-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background-color: var(--bg-secondary, #fff);
          border: 1px solid var(--border-color, rgba(0,0,0,0.1));
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
          transition: background-color 0.2s;
          cursor: pointer;
        }

        .notification-item.unread {
          border-left: 4px solid var(--accent-gold, #C5A059);
          background-color: rgba(197, 160, 89, 0.04);
        }

        .notification-type-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--bg-primary, #f5f5f5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-info {
          flex: 1;
        }

        .notification-time {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .mark-read-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-gold, #C5A059);
        }
      `}</style>

      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', borderLeft: '4px solid var(--accent-gold)', paddingLeft: '12px' }}>
        Alert Center
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>Activity updates on your profile and design studio</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner"></div></div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif, index) => (
            <div 
              key={notif._id} 
              className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
              onClick={() => !notif.isRead && markAsRead(notif._id, index)}
            >
              <div className="notification-type-icon">
                {getIcon(notif.type)}
              </div>
              <div className="notification-info">
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{notif.text}</p>
                <div className="notification-time">
                  {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {!notif.isRead && <div className="mark-read-bullet" title="Unread Alert" />}
            </div>
          ))}
        </div>
      )}

      {notifications.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <h3>No activity updates yet</h3>
          <p>Your notifications will display here when you receive design orders, likes, or studio comments.</p>
        </div>
      )}
    </div>
  );
};
export default NotificationsPage;
