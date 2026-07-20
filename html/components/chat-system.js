/* AuraStitch AI - Premium Unified Chat Messenger Web Component */

class ChatSystem extends HTMLElement {
  connectedCallback() {
    this.isOpen = false;
    this.render();
    this.setupListeners();
  }

  render() {
    this.innerHTML = `
      <style>
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
      </style>
      
      <div class="chat-drawer" id="chat-drawer-panel">
        <div class="chat-header">
          <h3 id="chat-title-heading">AuraStitch Messages</h3>
          <span class="close-chat-btn" id="close-chat-panel">✕</span>
        </div>
        
        <div class="chat-body" id="chat-main-body">
          <!-- Conversation list window -->
          <div class="conversations-list" id="convo-list-section">
            <div class="convo-item" data-user="designer-priya">
              <div class="avatar-wrapper">
                <img class="avatar" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Priya">
                <div class="status-dot"></div>
              </div>
              <div>
                <h4 style="font-size:14px; font-weight:600;">Priya Sharma (Designer)</h4>
                <p style="font-size:12px; color:var(--text-secondary);">Sure, I can deliver by Monday!</p>
              </div>
            </div>
            
            <div class="convo-item" data-user="weaver-ramu">
              <div class="avatar-wrapper">
                <img class="avatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Ramu">
                <div class="status-dot" style="background-color:var(--text-muted);"></div>
              </div>
              <div>
                <h4 style="font-size:14px; font-weight:600;">Ramu K. (Handloom Weaver)</h4>
                <p style="font-size:12px; color:var(--text-secondary);">Pure Silk Saree fabric is ready.</p>
              </div>
            </div>
          </div>
          
          <!-- Individual chat room -->
          <div class="chat-room" id="chat-room-section">
            <div style="padding:10px; border-bottom:1px solid var(--border-color); display:flex; align-items:center; gap:10px; background-color:var(--bg-tertiary);">
              <span id="back-to-convo-btn" style="cursor:pointer; font-size:18px;">◀</span>
              <img id="active-chat-avatar" class="avatar" style="width:32px; height:32px;" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80">
              <h4 id="active-chat-username" style="font-size:14px; font-weight:600;">Priya Sharma</h4>
              
              <!-- Calling actions -->
              <div style="margin-left:auto; display:flex; gap:10px;">
                <button id="call-voice-btn" style="cursor:pointer;">📞</button>
                <button id="call-video-btn" style="cursor:pointer;">📹</button>
              </div>
            </div>
            
            <div class="chat-messages" id="chat-messages-container">
              <div class="message-bubble message-received">Hi there! How can I help you design your wedding lehenga?</div>
              <div class="message-bubble message-sent">I want to customize the sleeve border using traditional Pochampally motifs.</div>
              <div class="message-bubble message-received">That's a beautiful choice! I have added that design preset to your dashboard.</div>
            </div>
            
            <div class="chat-input-area">
              <input type="text" class="chat-input" placeholder="Type a message..." id="message-send-input">
              <button class="btn-primary" style="padding:10px 16px; border-radius:var(--border-radius-round);" id="msg-submit-btn">➔</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupListeners() {
    const drawer = this.querySelector('#chat-drawer-panel');
    const closeBtn = this.querySelector('#close-chat-panel');
    const convoList = this.querySelector('#convo-list-section');
    const chatRoom = this.querySelector('#chat-room-section');
    const backBtn = this.querySelector('#back-to-convo-btn');
    const input = this.querySelector('#message-send-input');
    const submitBtn = this.querySelector('#msg-submit-btn');
    const msgContainer = this.querySelector('#chat-messages-container');
    const headerTitle = this.querySelector('#chat-title-heading');
    
    // Toggle trigger hook
    window.addEventListener('togglechat', () => {
      this.isOpen = !this.isOpen;
      drawer.classList.toggle('active', this.isOpen);
      
      // Reset back to list on open
      chatRoom.classList.remove('active');
      convoList.style.display = 'flex';
      headerTitle.textContent = "AuraStitch Messages";
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.isOpen = false;
        drawer.classList.remove('active');
      });
    }
    
    // Choose active user to chat
    this.querySelectorAll('.convo-item').forEach(item => {
      item.addEventListener('click', () => {
        convoList.style.display = 'none';
        chatRoom.classList.add('active');
        
        const username = item.querySelector('h4').textContent;
        const avatarSrc = item.querySelector('.avatar').src;
        
        this.querySelector('#active-chat-username').textContent = username;
        this.querySelector('#active-chat-avatar').src = avatarSrc;
        headerTitle.textContent = "Chat Window";
      });
    });
    
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        chatRoom.classList.remove('active');
        convoList.style.display = 'flex';
        headerTitle.textContent = "AuraStitch Messages";
      });
    }
    
    // Send message logic
    const sendMessage = () => {
      const text = input.value.trim();
      if (text === '') return;
      
      const msg = document.createElement('div');
      msg.className = 'message-bubble message-sent';
      msg.textContent = text;
      msgContainer.appendChild(msg);
      input.value = '';
      
      msgContainer.scrollTop = msgContainer.scrollHeight;
      
      // Mock typing response
      setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'message-bubble message-received';
        reply.textContent = `AuraStitch: Thank you for selecting our premium handloom customization!`;
        msgContainer.appendChild(reply);
        msgContainer.scrollTop = msgContainer.scrollHeight;
        window.AuraToasts.show("New message received!", "info");
      }, 1500);
    };
    
    if (submitBtn) submitBtn.addEventListener('click', sendMessage);
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
    }
    
    // Calling overlays link triggers
    const voiceBtn = this.querySelector('#call-voice-btn');
    const videoBtn = this.querySelector('#call-video-btn');
    
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('startcall', { detail: { mode: 'voice' } }));
      });
    }
    if (videoBtn) {
      videoBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('startcall', { detail: { mode: 'video' } }));
      });
    }
  }
}

customElements.define('app-chat-system', ChatSystem);
