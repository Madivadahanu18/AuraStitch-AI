import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

interface OutletContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface Dress {
  id: string;
  name: string;
  category: 'blouse' | 'kurti' | 'lehenga' | 'shirt';
  color: string;
  thumbnail: string;
  tryonOverlay: string;
}

const fallbackDresses: Dress[] = [
  {
    id: 'd1',
    name: 'Royal Banarasi Silk Blouse',
    category: 'blouse',
    color: 'Crimson Red & Gold',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
    tryonOverlay: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd2',
    name: 'Traditional Choli Blouse',
    category: 'blouse',
    color: 'Marigold Yellow',
    thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
    tryonOverlay: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd3',
    name: 'Elegant Anarkali Kurti',
    category: 'kurti',
    color: 'Teal Blue',
    thumbnail: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&w=300&q=80',
    tryonOverlay: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd4',
    name: 'Jaipur Cotton Printed Kurti',
    category: 'kurti',
    color: 'Indigo Blue & White',
    thumbnail: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=300&q=80',
    tryonOverlay: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd5',
    name: 'Luxury Zardozi Wedding Lehenga',
    category: 'lehenga',
    color: 'Ruby Maroon',
    thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80',
    tryonOverlay: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd6',
    name: 'Modern Floral Lehenga',
    category: 'lehenga',
    color: 'Pastel Pink & Olive',
    thumbnail: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=300&q=80',
    tryonOverlay: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd7',
    name: 'Premium Khadi Cotton Shirt',
    category: 'shirt',
    color: 'Off-White Ivory',
    thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80',
    tryonOverlay: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd8',
    name: 'Organic Linen Casual Shirt',
    category: 'shirt',
    color: 'Sage Green',
    thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80',
    tryonOverlay: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80'
  }
];

// Dynamically read the outfits directory using Vite's glob import
const dynamicOutfits = () => {
  const modules = import.meta.glob<{ default: string }>('../../assets/outfits/*.{png,jpg,jpeg,svg,PNG,JPG,JPEG,webp,WEBP}', { eager: true });
  const dynamicList: Dress[] = Object.keys(modules).map((path, index) => {
    const filename = path.split('/').pop() || '';
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const cleanName = nameWithoutExt
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    let category: Dress['category'] = 'kurti';
    const lowerName = cleanName.toLowerCase();
    if (lowerName.includes('blouse')) category = 'blouse';
    else if (lowerName.includes('kurti')) category = 'kurti';
    else if (lowerName.includes('lehenga') || lowerName.includes('choli')) category = 'lehenga';
    else if (lowerName.includes('shirt')) category = 'shirt';

    return {
      id: `dynamic-${index}`,
      name: cleanName,
      category,
      color: cleanName.includes('Pink') ? 'Rose Pink' : cleanName.includes('Blue') ? 'Royal Blue' : 'Custom Tone',
      thumbnail: modules[path].default,
      tryonOverlay: modules[path].default
    };
  });

  // Fallback to curate mock list if no dynamic images exist in folder
  return dynamicList.length > 0 ? dynamicList : fallbackDresses;
};

const mockDresses = dynamicOutfits();

const neckOptions = {
  boat: "M150,130 C150,130 200,180 250,130",
  vneck: "M150,130 L200,210 L250,130",
  sweet: "M150,130 C150,130 180,210 200,200 C220,210 250,130 250,130",
  round: "M150,130 C150,130 200,240 250,130"
};

export const DesignLab: React.FC = () => {
  const { showToast } = useOutletContext<OutletContextType>();
  
  // Custom user photo states
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Styled design collection states
  const [selectedDress, setSelectedDress] = useState<Dress>(mockDresses[0]);
  const [isTryOnActive, setIsTryOnActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModalPlaceholder, setShowModalPlaceholder] = useState(false);

  // Filters State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    occasion: true,
    category: true,
    color: false,
    fabric: false,
    neck: false,
    sleeve: false,
    pattern: false,
    embroidery: false,
    budget: false
  });
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    occasion: 'all',
    category: 'all',
    color: 'all',
    fabric: 'all',
    neck: 'boat',
    sleeve: 'short',
    pattern: 'all',
    embroidery: 'all',
    budget: 'all'
  });

  const texture = selectedFilters.fabric?.toLowerCase() === 'cotton' ? 'tex-cotton' : 'tex-silk';

  // AI Chat Panel States
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Hello! Welcome to your Premium AI Fashion Studio. I am your AI Stylist. Ask me about custom fits, color matching, fabric textures, or wedding styling tips!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Sync video ref source when camera stream starts
  useEffect(() => {
    if (showCamera && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCamera, cameraStream]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Scroll chat window to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const selectFilter = (section: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [section]: value }));
    showToast(`Filter selected: ${section} -> ${value}`, "info");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserPhoto(event.target.result as string);
          setIsTryOnActive(false);
          showToast("Full-body portrait uploaded successfully!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 500 } });
      setCameraStream(stream);
      setShowCamera(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      showToast("Could not access camera: " + err.message, "error");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 400;
      canvas.height = videoRef.current.videoHeight || 500;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUserPhoto(dataUrl);
        setIsTryOnActive(false);
        showToast("Photo captured successfully!", "success");
      }
      stopCamera();
    }
  };

  const handleAiTryOnSubmit = () => {
    if (!userPhoto) {
      showToast("Please upload a portrait photo first to run AI Try-On.", "warning");
      return;
    }
    setIsProcessing(true);
    showToast("Composing AI virtual try-on...", "info");
    setTimeout(() => {
      setIsProcessing(false);
      setIsTryOnActive(true);
      setShowModalPlaceholder(true);
    }, 2000);
  };

  const getSleevePath = (side: 'left' | 'right') => {
    const sleeveType = selectedFilters.sleeve;
    if (sleeveType === 'short') {
      return side === 'left' ? "M120,160 C100,160 80,180 80,220" : "M280,160 C300,160 320,180 320,220";
    } else if (sleeveType === 'elbow') {
      return side === 'left' ? "M120,160 C90,160 60,200 60,260" : "M280,160 C310,160 340,200 340,260";
    } else if (sleeveType === 'puff') {
      return side === 'left' ? "M120,160 C70,140 70,220 80,220" : "M280,160 C330,140 330,220 320,220";
    }
    return "";
  };

  const getOfflineStylistResponse = (prompt: string): string => {
    const p = prompt.toLowerCase();
    if (p.includes('color') || p.includes('shade') || p.includes('match')) {
      return "For a sophisticated look, matching Crimson Red & Gold with gold accessories is outstanding. Off-white Ivory paired with Sage Green offers an extremely premium, minimalist aesthetic.";
    }
    if (p.includes('fabric') || p.includes('silk') || p.includes('cotton')) {
      return "Banarasi Silk offers a rich, royal texture ideal for weddings and formal gala events. For lightweight luxury, organza or printed premium cotton is highly recommended.";
    }
    if (p.includes('neck') || p.includes('sleeve') || p.includes('cut')) {
      return "A Boat Neck neckline with elbow sleeves creates a highly traditional silhouette. For modern, contemporary fashion, a sweetheart cut paired with puff sleeves adds structured volume.";
    }
    if (p.includes('wedding') || p.includes('marriage') || p.includes('lehenga')) {
      return "Wedding season demands heavy embellishments. A luxury Zardozi Lehenga in maroon or ruby-red offers timeless bridal elegance. Pair it with heavy gold work.";
    }
    return "Hello! I am your AI Stylist. I can recommend colors, fabrics, sleeve patterns, and styling suggestions for your selected designs. What occasion are you dressing for?";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsgText = chatInput.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: userMsgText, time: timestamp }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/customer/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userMsgText })
      });

      if (!response.ok) {
        throw new Error('Server returned non-ok status');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: data.response || 'I processed your prompt but got empty suggestions.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (err) {
      console.warn("AI chat server connection offline. Running fallback recommendation...", err);
      // Wait 1 second to simulate AI thinking
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: getOfflineStylistResponse(userMsgText),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="designer-lab-page" style={{ height: 'calc(100vh - var(--navbar-height) - 20px)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden', boxSizing: 'border-box' }}>
      
      <style>{`
        .studio-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 20px;
          min-height: 0;
        }

        .studio-top-row {
          display: grid;
          grid-template-columns: 280px 1fr 360px;
          gap: 20px;
          flex: 1;
          min-height: 0;
        }

        .studio-bottom-row {
          flex-shrink: 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 16px 24px;
          box-shadow: var(--shadow-sm);
        }

        .panel-box {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          min-height: 0;
          box-shadow: var(--shadow-sm);
        }

        /* Scrollbars styling */
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--accent-gold);
        }

        /* Collapsible section labels */
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
          transition: color var(--transition-fast);
        }
        .filter-header:hover {
          color: var(--accent-gold);
        }

        .filter-content {
          padding: 10px 0 16px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          animation: slideDown 0.25s ease-out;
        }

        .filter-option {
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          font-size: 12px;
          cursor: pointer;
          transition: all var(--transition-fast);
          background: var(--bg-primary);
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: capitalize;
        }
        .filter-option.active {
          border-color: var(--accent-gold);
          background-color: rgba(197, 160, 89, 0.1);
          color: var(--accent-gold);
        }

        /* Snapchat-inspired Horizontal Outfit Carousel */
        .carousel-track {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 10px 0;
        }

        .carousel-card {
          min-width: 150px;
          width: 150px;
          aspect-ratio: 3/4;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          border: 2px solid transparent;
        }
        .carousel-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: var(--shadow-md);
        }
        .carousel-card.selected {
          border-color: var(--accent-gold);
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.4);
          transform: scale(1.03);
        }

        .carousel-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .carousel-card-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
          padding: 12px;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        /* AI Stylist Chat bubbles */
        .message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: var(--border-radius-md);
          font-size: 13px;
          line-height: 1.45;
          margin-bottom: 12px;
          box-shadow: var(--shadow-sm);
        }
        .message-bubble.user {
          align-self: flex-end;
          background: linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%);
          color: #fff;
          border-bottom-right-radius: 2px;
        }
        .message-bubble.ai {
          align-self: flex-start;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          border-bottom-left-radius: 2px;
        }

        /* Spinner & Loading */
        .spinner {
          border: 3px solid rgba(197, 160, 89, 0.1);
          border-top: 3px solid var(--accent-gold);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="studio-container">
        
        {/* Top Content Row */}
        <div className="studio-top-row">
          
          {/* Left Column: Interactive Collapsible Filters */}
          <div className="panel-box filters-panel">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              ✦ Filters Studio
            </h3>
            
            <div className="custom-scroll" style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
              
              {/* Occasion section */}
              <div>
                <div className="filter-header" onClick={() => toggleSection('occasion')}>
                  <span>🎉 Occasion</span>
                  <span>{openSections.occasion ? '▴' : '▾'}</span>
                </div>
                {openSections.occasion && (
                  <div className="filter-content">
                    {['all', 'wedding', 'casual', 'festive', 'formal'].map(opt => (
                      <button key={opt} className={`filter-option ${selectedFilters.occasion === opt ? 'active' : ''}`} onClick={() => selectFilter('occasion', opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category section */}
              <div>
                <div className="filter-header" onClick={() => toggleSection('category')}>
                  <span>👗 Category</span>
                  <span>{openSections.category ? '▴' : '▾'}</span>
                </div>
                {openSections.category && (
                  <div className="filter-content">
                    {['all', 'blouse', 'kurti', 'lehenga', 'shirt'].map(opt => (
                      <button key={opt} className={`filter-option ${selectedFilters.category === opt ? 'active' : ''}`} onClick={() => selectFilter('category', opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Color section */}
              <div>
                <div className="filter-header" onClick={() => toggleSection('color')}>
                  <span>🎨 Color</span>
                  <span>{openSections.color ? '▴' : '▾'}</span>
                </div>
                {openSections.color && (
                  <div className="filter-content">
                    {['all', 'Red', 'Yellow', 'Blue', 'Maroon', 'Pink', 'White', 'Green'].map(opt => (
                      <button key={opt} className={`filter-option ${selectedFilters.color === opt ? 'active' : ''}`} onClick={() => selectFilter('color', opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fabric section */}
              <div>
                <div className="filter-header" onClick={() => toggleSection('fabric')}>
                  <span>🧵 Fabric</span>
                  <span>{openSections.fabric ? '▴' : '▾'}</span>
                </div>
                {openSections.fabric && (
                  <div className="filter-content">
                    {['all', 'Silk', 'Cotton', 'Linen', 'Zardozi'].map(opt => (
                      <button key={opt} className={`filter-option ${selectedFilters.fabric === opt ? 'active' : ''}`} onClick={() => selectFilter('fabric', opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Neck Design section */}
              <div>
                <div className="filter-header" onClick={() => toggleSection('neck')}>
                  <span>🥻 Neck Cut</span>
                  <span>{openSections.neck ? '▴' : '▾'}</span>
                </div>
                {openSections.neck && (
                  <div className="filter-content">
                    {['boat', 'vneck', 'sweet', 'round'].map(opt => (
                      <button key={opt} className={`filter-option ${selectedFilters.neck === opt ? 'active' : ''}`} onClick={() => selectFilter('neck', opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sleeve Design section */}
              <div>
                <div className="filter-header" onClick={() => toggleSection('sleeve')}>
                  <span>🧥 Sleeve Pattern</span>
                  <span>{openSections.sleeve ? '▴' : '▾'}</span>
                </div>
                {openSections.sleeve && (
                  <div className="filter-content">
                    {['short', 'elbow', 'puff', 'sleeveless'].map(opt => (
                      <button key={opt} className={`filter-option ${selectedFilters.sleeve === opt ? 'active' : ''}`} onClick={() => selectFilter('sleeve', opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pattern section */}
              <div>
                <div className="filter-header" onClick={() => toggleSection('pattern')}>
                  <span>✨ Pattern</span>
                  <span>{openSections.pattern ? '▴' : '▾'}</span>
                </div>
                {openSections.pattern && (
                  <div className="filter-content">
                    {['all', 'floral', 'solid', 'striped', 'embroidered'].map(opt => (
                      <button key={opt} className={`filter-option ${selectedFilters.pattern === opt ? 'active' : ''}`} onClick={() => selectFilter('pattern', opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Embroidery section */}
              <div>
                <div className="filter-header" onClick={() => toggleSection('embroidery')}>
                  <span>🪡 Embroidery</span>
                  <span>{openSections.embroidery ? '▴' : '▾'}</span>
                </div>
                {openSections.embroidery && (
                  <div className="filter-content">
                    {['all', 'none', 'zardozi', 'minimal', 'heavy'].map(opt => (
                      <button key={opt} className={`filter-option ${selectedFilters.embroidery === opt ? 'active' : ''}`} onClick={() => selectFilter('embroidery', opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget section */}
              <div>
                <div className="filter-header" onClick={() => toggleSection('budget')}>
                  <span>💵 Budget</span>
                  <span>{openSections.budget ? '▴' : '▾'}</span>
                </div>
                {openSections.budget && (
                  <div className="filter-content">
                    {['all', 'Under ₹1000', '₹1000 - ₹5000', '₹5000+'].map(opt => (
                      <button key={opt} className={`filter-option ${selectedFilters.budget === opt ? 'active' : ''}`} onClick={() => selectFilter('budget', opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Center Column: Large Preview & Try-On Workspace */}
          <div className="panel-box preview-panel">
            
            {/* Upload Controls above preview */}
            <div className="photo-actions-bar" style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => fileInputRef.current?.click()}>
                📤 {userPhoto ? "Upload New Photo" : "Upload Photo"}
              </button>
              <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={startCamera}>
                📷 Use Camera
              </button>
              {userPhoto && (
                <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px', color: '#ff4d4d', borderColor: '#ff4d4d' }} onClick={() => { setUserPhoto(null); setIsTryOnActive(false); showToast("Switched back to mannequin.", "info"); }}>
                  🗑 Remove Photo
                </button>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handlePhotoUpload} 
              />
            </div>

            {/* Mannequin / Photo Render frame */}
            <div className="mannequin-container" id="mannequin-canvas-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '380px', flexGrow: 1 }}>
              {isProcessing && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 20,
                  borderRadius: 'var(--border-radius-md)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--accent-gold)'
                }}>
                  <div className="spinner" style={{ borderTopColor: 'var(--accent-gold)', width: '48px', height: '48px', borderWidth: '4px' }}></div>
                  <h4 style={{ color: '#fff', marginTop: '20px', fontFamily: 'var(--font-heading)', fontSize: '16px', letterSpacing: '1px' }}>AI STYLIST COMPOSING...</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px' }}>Preparing outfit overlay parameters</p>
                </div>
              )}

              {userPhoto ? (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img 
                    src={userPhoto} 
                    alt="User portrait" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }} 
                  />
                  
                  {isTryOnActive && selectedDress && (
                    <div style={{
                      position: 'absolute',
                      top: '25%',
                      width: '45%',
                      height: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.3s'
                    }}>
                      <img 
                        src={selectedDress.thumbnail} 
                        alt="Try-on overlay" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          mixBlendMode: 'multiply',
                          opacity: 0.9,
                          filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.3))'
                        }} 
                      />
                    </div>
                  )}

                  {isTryOnActive && (
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(26, 35, 60, 0.85)',
                      border: '1px solid var(--accent-gold)',
                      color: 'var(--accent-gold)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      boxShadow: 'var(--shadow-md)',
                      backdropFilter: 'blur(4px)'
                    }}>
                      ✦ AI COMPOSITE COMPLETED
                    </div>
                  )}
                </div>
              ) : (
                <svg className="mannequin-svg" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-color)" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="tex-cotton" width="40" height="40" patternUnits="userSpaceOnUse">
                      <rect width="40" height="40" fill="#FAF9F6"/>
                      <path d="M0,10 L40,10 M0,20 L40,20 M0,30 L40,30 M10,0 L10,40 M20,0 L20,40 M30,0 L30,40" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>
                    </pattern>
                    <pattern id="tex-silk" width="60" height="60" patternUnits="userSpaceOnUse">
                      <rect width="60" height="60" fill="#FFE5D9"/>
                      <path d="M0,60 L60,0 M0,30 L30,0 M30,60 L60,30" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
                  <path d="M120,460 L140,220 C140,220 120,200 120,160 C120,120 150,80 200,80 C250,80 280,120 280,160 C280,200 260,220 260,220 L280,460 Z" fill="#E6E1D6" stroke="#9E9B93" strokeWidth="1"/>
                  <path id="svg-layer-neck" d={neckOptions[selectedFilters.neck as keyof typeof neckOptions] || neckOptions.boat} fill="none" stroke="var(--accent-gold)" strokeWidth="8" strokeLinecap="round"/>
                  {selectedFilters.sleeve !== 'sleeveless' && (
                    <>
                      <path id="svg-layer-sleeves" d={getSleevePath('left')} fill="none" stroke={`url(#${texture})`} strokeWidth="24" strokeLinecap="round"/>
                      <path id="svg-layer-sleeves-right" d={getSleevePath('right')} fill="none" stroke={`url(#${texture})`} strokeWidth="24" strokeLinecap="round"/>
                    </>
                  )}
                  <path id="svg-layer-body" d="M140,220 C140,220 160,180 200,180 C240,180 260,220 260,220 L275,360 L125,360 Z" fill={`url(#${texture})`} stroke="var(--border-color)" strokeWidth="1"/>
                </svg>
              )}
            </div>

            {/* Run AI Try On Submit trigger */}
            <button 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                maxWidth: '280px', 
                padding: '10px 20px', 
                fontSize: '14px', 
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--accent-gold) 0%, #b38627 100%)',
                borderRadius: '30px',
                border: 'none',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '12px'
              }}
              onClick={handleAiTryOnSubmit}
            >
              ✨ Run AI Try-On
            </button>
          </div>

          {/* Right Column: AI Stylist Chat Panel */}
          <div className="panel-box chat-panel">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💬 AI Stylist Assistant
            </h3>

            {/* Conversational message logs */}
            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingRight: '4px', marginBottom: '14px' }}>
              {messages.map((msg, index) => (
                <div key={index} className={`message-bubble ${msg.sender}`}>
                  <div>{msg.text}</div>
                  <div style={{ fontSize: '9px', textAlign: 'right', marginTop: '4px', opacity: 0.6 }}>
                    {msg.time}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message-bubble ai" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assistant is composing advice...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Stylist Prompt Chips */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '10px' }} className="custom-scroll">
              {[
                "Suggest wedding colors",
                "Neck and sleeve matches",
                "Tell me about Banarasi Silk",
                "Best casual options"
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setChatInput(chip);
                    showToast("Prompt copied to chat input!", "info");
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  💡 {chip}
                </button>
              ))}
            </div>

            {/* Message input form */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ask stylist about colors, fits..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                style={{ flex: 1, borderRadius: 'var(--border-radius-md)', height: '36px', fontSize: '13px' }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ height: '36px', padding: '0 16px', fontSize: '13px', borderRadius: 'var(--border-radius-md)' }}
              >
                Send
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Area: Snapchat-inspired Outfit Carousel */}
        <div className="studio-bottom-row">
          <h3 style={{ marginBottom: '12px', fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'left' }}>
            ✦ Choose Outfit Collection ({selectedFilters.category === 'all' ? 'All' : selectedFilters.category.toUpperCase()})
          </h3>

          <div className="carousel-track custom-scroll" style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 0' }}>
            {mockDresses
              .filter(d => selectedFilters.category === 'all' || d.category === selectedFilters.category)
              .map((dress) => (
                <div
                  key={dress.id}
                  onClick={() => {
                    setSelectedDress(dress);
                    showToast(`Selected: ${dress.name}`, "info");
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    minWidth: '100px',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid',
                      borderColor: selectedDress.id === dress.id ? 'var(--accent-gold)' : 'var(--border-color)',
                      boxShadow: selectedDress.id === dress.id ? '0 0 12px rgba(197, 160, 89, 0.6)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                      backgroundColor: '#000',
                      position: 'relative'
                    }}
                  >
                    <img 
                      src={dress.thumbnail} 
                      alt={dress.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                    {selectedDress.id === dress.id && (
                      <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'var(--accent-gold)',
                        color: '#fff',
                        fontSize: '7px',
                        fontWeight: 'bold',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        zIndex: 10
                      }}>
                        ACTIVE
                      </div>
                    )}
                  </div>
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: selectedDress.id === dress.id ? '600' : '400',
                      color: selectedDress.id === dress.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '90px'
                    }}
                  >
                    {dress.name}
                  </span>
                </div>
              ))}
          </div>
        </div>

      </div>

      {/* Camera Capture Modal Overlay */}
      {showCamera && (
        <div className="modal-backdrop fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '440px', padding: '24px', textAlign: 'center', position: 'relative' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '20px', color: 'var(--text-primary)' }}>Capture Portrait</h3>
            
            <div style={{ width: '100%', aspectRatio: '4/5', backgroundColor: '#000', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', marginBottom: '20px', position: 'relative' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={stopCamera}>Cancel</button>
              <button className="btn-primary" onClick={capturePhoto}>Capture</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Try-on Connected later Placeholder modal popup */}
      {showModalPlaceholder && (
        <div className="modal-backdrop fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '440px', padding: '30px', textAlign: 'center', border: '1px solid var(--accent-gold)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
            <h3 style={{ marginBottom: '12px', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>AI Virtual Try-On</h3>
            <p style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
              Your selected outfit <strong>{selectedDress?.name}</strong> and uploaded portrait have been compiled and prepared for virtual try-on models ingestion. 
              <br /><br />
              <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>The actual GPU-accelerated Diffusion API virtual try-on pipeline will be connected in the future updates.</span>
            </p>
            <button className="btn-primary" onClick={() => setShowModalPlaceholder(false)} style={{ padding: '8px 24px' }}>
              Close Studio Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
export default DesignLab;
