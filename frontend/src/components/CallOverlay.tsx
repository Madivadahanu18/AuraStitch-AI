import React, { useState, useEffect, useRef } from 'react';

interface CallOverlayProps {
  isOpen: boolean;
  mode: 'voice' | 'video';
  onHangup: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({ isOpen, mode, onHangup, showToast }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState('CONNECTING...');
  const timerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus('CONNECTING...');
      setIsMuted(false);

      if (mode === 'video' && videoRef.current) {
        videoRef.current.play().catch((err) => console.log('Video play error', err));
      }

      // Simulate connection delay
      const connectionTimeout = setTimeout(() => {
        setStatus('00:00');
        showToast("Call Connected", "success");

        let localSecs = 0;
        timerRef.current = setInterval(() => {
          localSecs++;
          const mins = Math.floor(localSecs / 60).toString().padStart(2, '0');
          const secs = (localSecs % 60).toString().padStart(2, '0');
          setStatus(`${mins}:${secs}`);
        }, 1000);
      }, 2000);

      return () => {
        clearTimeout(connectionTimeout);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen, mode]);

  const handleHangup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    showToast("Call Ended", "info");
    onHangup();
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    showToast(isMuted ? "Microphone Active" : "Microphone Muted", "info");
  };

  if (!isOpen) return null;

  return (
    <div className="call-wrapper active" id="call-screen-panel">
      <style>{`
        .call-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10, 10, 11, 0.96);
          backdrop-filter: blur(20px);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
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
        
        .video-full-screen {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
          opacity: 0.6;
        }
      `}</style>

      {mode === 'video' && (
        <video 
          ref={videoRef}
          className="video-full-screen" 
          autoPlay 
          loop 
          muted 
          src="https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-makeup-posing-41710-large.mp4"
        />
      )}
      
      <img className="call-avatar" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" alt="Caller" />
      <h2 className="caller-name">Priya Sharma</h2>
      <div className="call-status">{status}</div>
      
      <div className="actions-row">
        <button className="call-action-btn btn-mute" onClick={handleMuteToggle}>
          {isMuted ? '🔇' : '🎤'}
        </button>
        <button className="call-action-btn btn-end" onClick={handleHangup}>
          📞
        </button>
      </div>
    </div>
  );
};
export default CallOverlay;
