import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface MessageType {
  _id: string;
  sender: string;
  recipient: string;
  text: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
}

interface ConversationType {
  partner: {
    _id: string;
    name: string;
    role: string;
  };
  lastMessage: MessageType;
  online?: boolean;
}

export const MessagesPage: React.FC = () => {
  const { showToast } = useOutletContext<OutletContextType>();
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMsgText, setNewMsgText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = 'http://localhost:5000/api/social';

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Add mock online status
        setConversations(data.map((c: any, i: number) => ({ ...c, online: i % 2 === 0 })));
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn("Using offline mock conversations...");
      setConversations([
        {
          partner: { _id: 'u-1', name: 'Priya Sharma (Boutique)', role: 'tailor' },
          lastMessage: { _id: 'm1', sender: 'u-1', recipient: 'me', text: 'Sure, we can start stitching by Monday.', isRead: false, createdAt: new Date().toISOString() },
          online: true
        },
        {
          partner: { _id: 'u-2', name: 'Kiran Handlooms', role: 'weaver' },
          lastMessage: { _id: 'm2', sender: 'me', recipient: 'u-2', text: 'Is the ikat fabric pure silk?', isRead: true, createdAt: new Date().toISOString() },
          online: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      const response = await fetch(`${API_URL}/messages/${partnerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      // Local mock chat log
      if (partnerId === 'u-1') {
        setMessages([
          { _id: '1', sender: 'me', recipient: 'u-1', text: 'Hi Priya, I want to customize a bridal saree blouse.', isRead: true, createdAt: new Date().toISOString() },
          { _id: '2', sender: 'u-1', recipient: 'me', text: 'Hello! Id love to help. Have you configured the neck pattern in the Design Lab?', isRead: true, createdAt: new Date().toISOString() },
          { _id: '3', sender: 'me', recipient: 'u-1', text: 'Yes, saved the design to my presets.', isRead: true, createdAt: new Date().toISOString() },
          { _id: '4', sender: 'u-1', recipient: 'me', text: 'Sure, we can start stitching by Monday.', isRead: false, createdAt: new Date().toISOString() }
        ]);
      } else {
        setMessages([
          { _id: '1', sender: 'u-2', recipient: 'me', text: 'Welcome to Kiran Handlooms! We have organic weaves.', isRead: true, createdAt: new Date().toISOString() },
          { _id: '2', sender: 'me', recipient: 'u-2', text: 'Is the ikat fabric pure silk?', isRead: true, createdAt: new Date().toISOString() }
        ]);
      }
    }

    // Trigger mock typing effect
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1800);
  };

  useEffect(() => {
    if (token) {
      fetchConversations();
    }
  }, [token]);

  useEffect(() => {
    if (activePartnerId) {
      fetchMessages(activePartnerId);
    }
  }, [activePartnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent, shareImageUrl = '') => {
    e.preventDefault();
    if (!newMsgText.trim() && !shareImageUrl && !activePartnerId) return;

    const payload = {
      recipientId: activePartnerId,
      text: newMsgText,
      imageUrl: shareImageUrl
    };

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data]);
        setNewMsgText('');
        fetchConversations(); // refresh sidebar last message
      } else {
        throw new Error();
      }
    } catch (e) {
      // Local append fallback
      const localMsg: MessageType = {
        _id: Math.random().toString(),
        sender: 'me',
        recipient: activePartnerId || '',
        text: newMsgText || 'Shared an image',
        imageUrl: shareImageUrl,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setMessages([...messages, localMsg]);
      setNewMsgText('');
      
      // Simulate reply
      setTimeout(() => {
        setIsTyping(true);
      }, 800);

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          _id: Math.random().toString(),
          sender: activePartnerId || '',
          recipient: 'me',
          text: 'Thanks! Checked your details.',
          isRead: false,
          createdAt: new Date().toISOString()
        }]);
        showToast("New message received!", "success");
      }, 2500);
    }
  };

  const handleShareImage = () => {
    const url = prompt("Enter stock image URL to share:", "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80");
    if (url) {
      handleSendMessage({ preventDefault: () => {} } as any, url);
    }
  };

  return (
    <div className="chat-page-container fade-in">
      <style>{`
        .chat-page-container {
          display: flex;
          height: calc(100vh - 120px);
          max-width: 1100px;
          margin: 16px auto;
          background-color: var(--bg-secondary, #fff);
          border: 1px solid var(--border-color, rgba(0,0,0,0.1));
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .chat-sidebar {
          width: 320px;
          border-right: 1px solid var(--border-color, rgba(0,0,0,0.1));
          display: flex;
          flex-direction: column;
          background-color: var(--bg-tertiary, #fafafa);
        }

        .chat-sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.08));
          font-family: var(--font-heading);
        }

        .conversation-list {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          cursor: pointer;
          transition: background-color 0.2s;
          border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.05));
          position: relative;
        }

        .conversation-card:hover, .conversation-card.active {
          background-color: rgba(197, 160, 89, 0.08);
        }

        .chat-avatar-wrapper {
          position: relative;
        }

        .chat-partner-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--accent-gold, #C5A059);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .online-dot {
          position: absolute;
          bottom: 0;
          right: 2px;
          width: 12px;
          height: 12px;
          background-color: var(--accent-teal, #386A63);
          border: 2px solid var(--bg-secondary);
          border-radius: 50%;
        }

        .conversation-info {
          flex: 1;
          min-width: 0;
        }

        .conversation-name {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-lastmsg {
          font-size: 12px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Chat Window */
        .chat-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-secondary);
        }

        .chat-window-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.1));
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-message-log {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-bubble-container {
          display: flex;
          flex-direction: column;
          max-width: 70%;
        }

        .chat-bubble-container.me {
          align-self: flex-end;
          align-items: flex-end;
        }

        .chat-bubble-container.partner {
          align-self: flex-start;
          align-items: flex-start;
        }

        .chat-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
          box-shadow: var(--shadow-sm);
        }

        .chat-bubble-container.me .chat-bubble {
          background-color: var(--accent-gold, #C5A059);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chat-bubble-container.partner .chat-bubble {
          background-color: var(--bg-primary, #f1f1f1);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
        }

        .chat-bubble-img {
          max-width: 100%;
          border-radius: 8px;
          margin-bottom: 4px;
        }

        .chat-timestamp {
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .chat-receipt {
          font-size: 10px;
          color: var(--accent-gold);
          font-weight: bold;
          margin-top: 2px;
        }

        /* Typing Indicator Bubble */
        .typing-bubble {
          align-self: flex-start;
          background-color: var(--bg-primary);
          padding: 10px 16px;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          font-size: 13px;
          color: var(--text-secondary);
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: #C5A059;
          border-radius: 50%;
          animation: bounceDots 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounceDots {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        .chat-input-bar {
          padding: 16px 24px;
          border-top: 1px solid var(--border-color, rgba(0,0,0,0.1));
          display: flex;
          gap: 12px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .chat-sidebar {
            width: 80px;
          }
          .conversation-info {
            display: none;
          }
        }
      `}</style>

      {/* Conversations Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Messages</h3>
        </div>
        <div className="conversation-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}><div className="spinner"></div></div>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv.partner._id} 
                className={`conversation-card ${activePartnerId === conv.partner._id ? 'active' : ''}`}
                onClick={() => setActivePartnerId(conv.partner._id)}
              >
                <div className="chat-avatar-wrapper">
                  <div className="chat-partner-avatar">
                    {conv.partner.name[0].toUpperCase()}
                  </div>
                  {conv.online && <div className="online-dot" />}
                </div>
                <div className="conversation-info">
                  <div className="conversation-name">{conv.partner.name}</div>
                  <div className="conversation-lastmsg">{conv.lastMessage?.text || 'Sent an image'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Conversation Chat Window */}
      {activePartnerId ? (
        <div className="chat-window">
          <div className="chat-window-header">
            <div className="chat-partner-avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
              {conversations.find(c => c.partner._id === activePartnerId)?.partner.name[0].toUpperCase()}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                {conversations.find(c => c.partner._id === activePartnerId)?.partner.name}
              </h4>
              <span style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>
                {conversations.find(c => c.partner._id === activePartnerId)?.online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="chat-message-log">
            {messages.map((msg) => {
              const isMe = msg.sender === 'me' || msg.sender === user?._id;
              return (
                <div key={msg._id} className={`chat-bubble-container ${isMe ? 'me' : 'partner'}`}>
                  <div className="chat-bubble">
                    {msg.imageUrl && <img className="chat-bubble-img" src={msg.imageUrl} alt="Shared" />}
                    {msg.text && <div>{msg.text}</div>}
                  </div>
                  <div className="chat-timestamp">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {isMe && <div className="chat-receipt">{msg.isRead ? 'Read ✓✓' : 'Sent ✓'}</div>}
                </div>
              );
            })}

            {isTyping && (
              <div className="typing-bubble">
                <span style={{ marginRight: '6px' }}>typing</span>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-bar">
            <button type="button" className="btn-secondary" style={{ padding: '10px 14px', borderRadius: '50%' }} onClick={handleShareImage}>
              🖼️
            </button>
            <input 
              type="text" 
              className="discover-search-input" 
              style={{ flex: 1, padding: '10px 18px', fontSize: '14px' }}
              placeholder="Type message here..."
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '30px' }}>
              Send
            </button>
          </form>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '48px', marginBottom: '14px' }}>💬</span>
          <h4>Select a conversation to start chatting</h4>
          <p>You can message tailors, weavers, and suppliers directly.</p>
        </div>
      )}
    </div>
  );
};
export default MessagesPage;
