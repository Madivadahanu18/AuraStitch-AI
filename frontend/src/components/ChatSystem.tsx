import React, { useState, useEffect, useRef } from 'react';

interface Message {
  text: string;
  isSent: boolean;
}

interface ChatSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCall: (mode: 'voice' | 'video') => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ isOpen, onClose, onStartCall, showToast }) => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState({ name: '', avatar: '' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load mock messages when active room changes
  useEffect(() => {
    if (activeRoom === 'designer-priya') {
      setMessages([
        { text: 'Hi there! How can I help you design your wedding lehenga?', isSent: false },
        { text: 'I want to customize the sleeve border using traditional Pochampally motifs.', isSent: true },
        { text: "That's a beautiful choice! I have added that design preset to your dashboard.", isSent: false }
      ]);
    } else if (activeRoom === 'weaver-ramu') {
      setMessages([
        { text: 'Hello, the Pure Silk Saree fabric loom progress is updated.', isSent: false },
        { text: 'Can you show me the temple border color swatch?', isSent: true },
        { text: 'Sure! I will upload the photos here shortly.', isSent: false }
      ]);
    }
  }, [activeRoom]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectConversation = (roomId: string, name: string, avatar: string) => {
    setActiveUser({ name, avatar });
    setActiveRoom(roomId);
  };

  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { text, isSent: true }]);
    setInputValue('');

    // Mock response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: `AuraStitch: Thank you for selecting our premium handloom customization!`, isSent: false }
      ]);
      showToast("New message received!", "info");
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-drawer ${isOpen ? 'active' : ''}`} id="chat-drawer-panel">
      <style>{`
        .chat-drawer {
          position: fixed;
          top: var(--navbar-height);
          right: -420px;
          width: 400px;
          height: calc(100vh - var(--navbar-height));
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-left: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          transition: right var(--transition-normal);
          z-index: 1000;
          display: grid;
          grid-template-rows: 60px 1fr;
        }
        
        .chat-drawer.active {
          right: 0;
        }
        
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .chat-body {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }
        
        .conversations-list {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 10px;
        }
        
        .chat-room {
          display: none;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }
        
        .chat-room.active {
          display: flex;
        }
        
        .convo-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        
        .convo-item:hover {
          background-color: var(--bg-tertiary);
        }
        
        .avatar-wrapper {
          position: relative;
        }
        
        .avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--border-radius-round);
          object-fit: cover;
        }
        
        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #386A63;
          border: 2px solid var(--bg-secondary);
        }
        
        .chat-messages {
          flex-grow: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .message-bubble {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: var(--border-radius-md);
          font-size: 14px;
          line-height: 1.4;
          position: relative;
        }
        
        .message-sent {
          align-self: flex-end;
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark));
          color: #FFFFFF;
          border-bottom-right-radius: 2px;
        }
        
        .message-received {
          align-self: flex-start;
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          border-bottom-left-radius: 2px;
        }
        
        .chat-input-area {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
        }
        
        .chat-input {
          flex-grow: 1;
          padding: 10px 14px;
          border-radius: var(--border-radius-lg);
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }
        
        .chat-input:focus {
          border-color: var(--accent-gold);
          background-color: var(--bg-secondary);
        }
        
        .close-chat-btn {
          font-size: 20px;
          cursor: pointer;
        }
        
        .call-action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 6px;
          border-radius: var(--border-radius-round);
          transition: background-color var(--transition-fast);
        }

        .call-action-btn:hover {
          background-color: var(--bg-secondary);
        }
      `}</style>

      <div className="chat-header">
        <h3>{activeRoom ? "Chat Window" : "AuraStitch Messages"}</h3>
        <span className="close-chat-btn" onClick={onClose}>✕</span>
      </div>

      <div className="chat-body">
        {/* Conversation list window */}
        {!activeRoom ? (
          <div className="conversations-list">
            <div className="convo-item" onClick={() => selectConversation('designer-priya', 'Priya Sharma (Designer)', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80')}>
              <div className="avatar-wrapper">
                <img className="avatar" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Priya" />
                <div className="status-dot"></div>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Priya Sharma (Designer)</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sure, I can deliver by Monday!</p>
              </div>
            </div>

            <div className="convo-item" onClick={() => selectConversation('weaver-ramu', 'Ramu K. (Handloom Weaver)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80')}>
              <div className="avatar-wrapper">
                <img className="avatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Ramu" />
                <div className="status-dot" style={{ backgroundColor: 'var(--text-muted)' }}></div>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Ramu K. (Handloom Weaver)</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pure Silk Saree fabric is ready.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Individual chat room */
          <div className="chat-room active">
            <div style={{ padding: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-tertiary)' }}>
              <span style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setActiveRoom(null)}>◀</span>
              <img className="avatar" style={{ width: '32px', height: '32px' }} src={activeUser.avatar} alt={activeUser.name} />
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{activeUser.name}</h4>
              
              {/* Calling actions */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                <button className="call-action-btn" onClick={() => onStartCall('voice')} title="Voice Call">📞</button>
                <button className="call-action-btn" onClick={() => onStartCall('video')} title="Video Call">📹</button>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message-bubble ${msg.isSent ? 'message-sent' : 'message-received'}`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Type a message..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                className="btn-primary" 
                style={{ padding: '10px 16px', borderRadius: 'var(--border-radius-round)' }}
                onClick={handleSendMessage}
              >
                ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatSystem;
