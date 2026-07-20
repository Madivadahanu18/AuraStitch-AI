/* AuraStitch AI - Voice & Video Call Overlay custom web component */

class CallOverlay extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  render() {
    this.innerHTML = `
      <style>
        .call-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10, 10, 11, 0.96);
          backdrop-filter: blur(20px);
          z-index: 2000;
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }
        
        .call-wrapper.active {
          display: flex;
        }
        
        .call-avatar {
          width: 120px;
          height: 120px;
          border-radius: var(--border-radius-round);
          object-fit: cover;
          border: 4px solid var(--accent-gold);
          margin-bottom: 20px;
        }
        
        .caller-name {
          font-family: var(--font-heading);
          font-size: 28px;
          margin-bottom: 10px;
        }
        
        .call-status {
          font-size: 16px;
          color: var(--accent-gold);
          margin-bottom: 40px;
          letter-spacing: 1px;
        }
        
        .actions-row {
          display: flex;
          gap: 24px;
        }
        
        .call-action-btn {
          width: 60px;
          height: 60px;
          border-radius: var(--border-radius-round);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          border: none;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }
        
        .call-action-btn:hover {
          transform: scale(1.1);
        }
        
        .btn-mute {
          background-color: rgba(255,255,255,0.15);
          color: #FFFFFF;
        }
        
        .btn-end {
          background-color: var(--accent-copper);
          color: #FFFFFF;
        }
        
        .btn-answer {
          background-color: var(--accent-teal);
          color: #FFFFFF;
        }
        
        .video-full-screen {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
          opacity: 0.6;
          display: none;
        }
      </style>
      
      <div class="call-wrapper" id="call-screen-panel">
        <video class="video-full-screen" id="video-stream-preview" autoplay loop muted src="https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-makeup-posing-41710-large.mp4"></video>
        
        <img class="call-avatar" id="call-screen-avatar" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" alt="Caller">
        <h2 class="caller-name" id="call-screen-username">Priya Sharma</h2>
        <div class="call-status" id="call-screen-status">CONNECTING...</div>
        
        <div class="actions-row">
          <button class="call-action-btn btn-mute" id="call-mute-trigger">🎤</button>
          <button class="call-action-btn btn-end" id="call-hangup-trigger">📞</button>
        </div>
      </div>
    `;
  }

  setupListeners() {
    const screen = this.querySelector('#call-screen-panel');
    const avatar = this.querySelector('#call-screen-avatar');
    const username = this.querySelector('#call-screen-username');
    const status = this.querySelector('#call-screen-status');
    const muteBtn = this.querySelector('#call-mute-trigger');
    const hangupBtn = this.querySelector('#call-hangup-trigger');
    const videoStream = this.querySelector('#video-stream-preview');
    
    let isMuted = false;
    let callTimer = null;
    let seconds = 0;
    
    window.addEventListener('startcall', (e) => {
      const mode = e.detail.mode;
      screen.classList.add('active');
      status.textContent = 'CONNECTING...';
      
      // Video display toggle
      if (mode === 'video') {
        videoStream.style.display = 'block';
        videoStream.play();
      } else {
        videoStream.style.display = 'none';
      }
      
      // Animate simulated connecting
      setTimeout(() => {
        status.textContent = '00:00';
        seconds = 0;
        
        callTimer = setInterval(() => {
          seconds++;
          const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
          const secs = (seconds % 60).toString().padStart(2, '0');
          status.textContent = `${mins}:${secs}`;
        }, 1000);
        
        window.AuraToasts.show("Call Connected", "success");
      }, 2000);
    });
    
    if (hangupBtn) {
      hangupBtn.addEventListener('click', () => {
        clearInterval(callTimer);
        screen.classList.remove('active');
        window.AuraToasts.show("Call Ended", "info");
      });
    }
    
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        muteBtn.textContent = isMuted ? '🔇' : '🎤';
        window.AuraToasts.show(isMuted ? "Microphone Muted" : "Microphone Active", "info");
      });
    }
  }
}

customElements.define('app-call-overlay', CallOverlay);
