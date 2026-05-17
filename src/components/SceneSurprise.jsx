import React, { useState, useEffect, useRef } from 'react';
import './SceneSurprise.css';

const SceneSurprise = ({ onComplete }) => {
  const [activeModal, setActiveModal] = useState(null); // 'message', 'flowers', 'cake', or null
  const [openedSurprises, setOpenedSurprises] = useState({ message: false, flowers: false, cake: false });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  // Message Typing State
  const [typedText, setTypedText] = useState('');
  const messageLines = [
    "Dearest Friend, 💖",
    "",
    "Happy Birthday to the most precious person! 🌟",
    "Your smile makes every day better, and I am so incredibly lucky to have you in my life. You bring a warmth and light to everyone around you that is truly rare and beautiful.",
    "",
    "These flowers are a reflection of your beauty, and this cake is for the sweet moments we share. 🎂🌸",
    "",
    "May your day be filled with endless laughter, sweet memories, and all the happiness your heart can hold. You deserve the absolute best today and always.",
    "",
    "Wishing you the happiest birthday ever! ✨"
  ];
  
  // Audio Initialization
  useEffect(() => {
    // A beautiful soft, emotional instrumental acoustic piano track
    audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.log("Audio play blocked by browser. User interaction required."));
      setIsMusicPlaying(true);
    }
  };

  // Open modal handler
  const openModal = (type) => {
    setActiveModal(type);
    setOpenedSurprises(prev => ({ ...prev, [type]: true }));
    
    // Automatically trigger music on first surprise if not already playing
    if (!isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsMusicPlaying(true);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Mouse tilt/glow coordinates for cards
  const handleMouseMove = (e, cardId) => {
    const card = document.getElementById(cardId);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="surprise-scene-root">
      {/* Soft Ambient Background Elements */}
      <div className="surprise-bg-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={`heart-${i}`}
            className="floating-heart"
            style={{
              left: `${Math.random() * 95}%`,
              '--size': `${12 + Math.random() * 12}px`,
              '--duration': `${6 + Math.random() * 8}s`,
              '--delay': `${Math.random() * 5}s`,
              '--drift': `${(Math.random() - 0.5) * 80}px`,
              '--rotate': `${-30 + Math.random() * 60}deg`,
              '--max-opacity': `${0.2 + Math.random() * 0.4}`
            }}
          >
            💖
          </span>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={`sparkle-${i}`}
            className="floating-sparkle"
            style={{
              left: `${Math.random() * 95}%`,
              top: `${Math.random() * 80 + 10}%`,
              '--size': `${8 + Math.random() * 8}px`,
              '--duration': `${4 + Math.random() * 5}s`,
              '--delay': `${Math.random() * 3}s`
            }}
          >
            ✨
          </span>
        ))}
      </div>

      {/* Background Music Button */}
      <button 
        className={`music-toggle-btn ${isMusicPlaying ? 'playing' : ''}`} 
        onClick={toggleMusic}
        title={isMusicPlaying ? "Mute Music" : "Play Music"}
      >
        {isMusicPlaying ? (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2z"/>
          </svg>
        )}
      </button>

      {/* Hero Section */}
      <header className="surprise-header">
        <h1 className="surprise-title">Choose Your Surprise 🎁</h1>
        <p className="surprise-subheading">A little birthday happiness made specially for you 💖</p>
      </header>

      {/* 3 Clickable Cards */}
      <div className="surprise-cards-container">
        {/* MESSAGE CARD */}
        <div 
          id="card-message"
          className="surprise-card"
          style={{ '--delay': '0.1s' }}
          onClick={() => openModal('message')}
          onMouseMove={(e) => handleMouseMove(e, 'card-message')}
        >
          <div className="card-icon-container">✉️</div>
          <h2 className="card-title">Surprise Message</h2>
          <p className="card-desc">A beautiful heartfelt letter waiting to be read just for you.</p>
          {openedSurprises.message && <span className="absolute top-3 right-3 text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">Read</span>}
        </div>

        {/* FLOWERS CARD */}
        <div 
          id="card-flowers"
          className="surprise-card"
          style={{ '--delay': '0.3s' }}
          onClick={() => openModal('flowers')}
          onMouseMove={(e) => handleMouseMove(e, 'card-flowers')}
        >
          <div className="card-icon-container">💐</div>
          <h2 className="card-title">Birthday Flowers</h2>
          <p className="card-desc">A magical bouquet gallery carrying elegant sweet whispers.</p>
          {openedSurprises.flowers && <span className="absolute top-3 right-3 text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">Seen</span>}
        </div>

        {/* CAKE CARD */}
        <div 
          id="card-cake"
          className="surprise-card"
          style={{ '--delay': '0.5s' }}
          onClick={() => openModal('cake')}
          onMouseMove={(e) => handleMouseMove(e, 'card-cake')}
        >
          <div className="card-icon-container">🎂</div>
          <h2 className="card-title">Surprise Cake</h2>
          <p className="card-desc">Make a romantic wish and blow the candle in celebration.</p>
          {openedSurprises.cake && <span className="absolute top-3 right-3 text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">Wish Made</span>}
        </div>
      </div>

      {/* Proceed Button */}
      <div className="bottom-button-container mt-8">
        {(openedSurprises.message || openedSurprises.flowers || openedSurprises.cake) && (
          <button 
            onClick={onComplete}
            className="btn-luxury animate-fade-up shadow-2xl border-pink-400/40 hover:border-pink-500 hover:shadow-pink-500/10"
          >
            Beautiful Memories &rarr;
          </button>
        )}
      </div>

      {/* -------------------- SURPRISE CONTENT MODALS -------------------- */}

      {/* 1️⃣ MESSAGE MODAL */}
      {activeModal === 'message' && (
        <MessageSurpriseModal 
          lines={messageLines} 
          onClose={closeModal} 
        />
      )}

      {/* 2️⃣ FLOWERS MODAL */}
      {activeModal === 'flowers' && (
        <FlowersSurpriseModal 
          onClose={closeModal} 
        />
      )}

      {/* 3️⃣ CAKE MODAL */}
      {activeModal === 'cake' && (
        <CakeSurpriseModal 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

/* ==================== 1️⃣ MESSAGE MODAL COMPONENT ==================== */
const MessageSurpriseModal = ({ lines, onClose }) => {
  const [typedText, setTypedText] = useState('');
  const [hearts, setHearts] = useState([]);
  const textEndRef = useRef(null);

  // Typing effect
  useEffect(() => {
    let currentLineIdx = 0;
    let currentCharIdx = 0;
    let fullText = '';
    let intervalId;

    const typeNextChar = () => {
      if (currentLineIdx >= lines.length) {
        clearInterval(intervalId);
        return;
      }

      const currentLine = lines[currentLineIdx];
      
      if (currentCharIdx < currentLine.length) {
        fullText += currentLine[currentCharIdx];
        setTypedText(fullText);
        currentCharIdx++;
      } else {
        fullText += '\n';
        setTypedText(fullText);
        currentLineIdx++;
        currentCharIdx = 0;
      }

      // Auto scroll
      if (textEndRef.current) {
        textEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    intervalId = setInterval(typeNextChar, 30);

    return () => clearInterval(intervalId);
  }, [lines]);

  // Spawning floating hearts inside letter paper
  useEffect(() => {
    const heartTimer = setInterval(() => {
      setHearts(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          left: 10 + Math.random() * 80,
          emoji: ['💖', '❤️', '💕', '✨', '🌸'][Math.floor(Math.random() * 5)],
          size: 14 + Math.random() * 14,
          duration: 3 + Math.random() * 4,
          drift: -30 + Math.random() * 60
        }
      ].slice(-25)); // Keep max 25 hearts
    }, 400);

    return () => clearInterval(heartTimer);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-container max-w-[34rem]" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="letter-envelope-wrapper">
          <div className="letter-paper">
            {/* Letter Hearts Background */}
            <div className="letter-hearts-container">
              {hearts.map(heart => (
                <span
                  key={heart.id}
                  className="floating-heart"
                  style={{
                    left: `${heart.left}%`,
                    '--size': `${heart.size}px`,
                    '--duration': `${heart.duration}s`,
                    '--drift': `${heart.drift}px`,
                    '--max-opacity': '0.7',
                    bottom: '0'
                  }}
                >
                  {heart.emoji}
                </span>
              ))}
            </div>

            {/* Letter Content */}
            <h3 className="letter-title">Birthday Surprise Letter ✉️</h3>
            
            <div className="letter-text font-serif">
              {/* Highlight specific romantic emotional lines with bold/pink */}
              {typedText.split('\n').map((line, idx) => {
                if (line.includes("most precious person")) {
                  return (
                    <p key={idx} className="mb-2 text-[#d11a68] font-semibold drop-shadow-[0_0_1px_rgba(255,182,193,0.5)]">
                      {line}
                    </p>
                  );
                } else if (line.includes("luck to have you in my life") || line.includes("lucky to have you")) {
                  return (
                    <p key={idx} className="mb-2 text-[#d11a68] font-medium italic">
                      {line}
                    </p>
                  );
                } else if (line.includes("Your smile makes every day better")) {
                  return (
                    <p key={idx} className="mb-2 text-[#c71585] font-semibold">
                      {line}
                    </p>
                  );
                }
                return <p key={idx} className="mb-2">{line}</p>;
              })}
              <div ref={textEndRef} />
            </div>

            <div className="letter-signature">
              With all my love & heart, <br />
              <span className="font-instrument-serif text-2xl font-semibold italic text-[#d11a68]">Your Special Friend ✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== 2️⃣ FLOWERS MODAL COMPONENT ==================== */
const FlowersSurpriseModal = ({ onClose }) => {
  const canvasRef = useRef(null);

  // Bouquet items with Unsplash image URLs
  const bouquets = [
    {
      id: 1,
      title: "Romantic Pink Roses",
      url: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600",
      tag: "Beautiful 🌸"
    },
    {
      id: 2,
      title: "Peonies & Hydrangeas",
      url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600",
      tag: "Elegant 💕"
    },
    {
      id: 3,
      title: "White & Cream Blooms",
      url: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=600",
      tag: "Precious 💖"
    },
    {
      id: 4,
      title: "Sweet Spring Tulips",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600",
      tag: "Magical ✨"
    }
  ];

  // HTML5 Canvas Falling Petals System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Petal Particle class
    class Petal {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height - 20;
        this.size = 6 + Math.random() * 12;
        this.speedY = 1 + Math.random() * 2.2;
        this.speedX = -1 + Math.random() * 2;
        this.angle = Math.random() * 360;
        this.rotationSpeed = -2 + Math.random() * 4;
        this.opacity = 0.6 + Math.random() * 0.4;
        // Soft romantic colors: rose, pink, lavender, deep pink
        this.color = [
          '#ffb6c1', // Light Pink
          '#ffc0cb', // Pink
          '#ffe4e1', // Misty Rose
          '#ff69b4', // Hot Pink
          '#f8c8dc'  // Pastel Pink
        ][Math.floor(Math.random() * 5)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 30) * 0.6; // Gentle sway
        this.angle += this.rotationSpeed;
        
        // Reset petal if off screen
        if (this.y > height) {
          this.y = -20;
          this.x = Math.random() * width;
          this.speedY = 1 + Math.random() * 2.2;
          this.speedX = -1 + Math.random() * 2;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        
        // Draw elegant petal shape (ellipse-like)
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, '#ff69b4');
        ctx.fillStyle = gradient;
        
        // Create curved organic shape
        ctx.ellipse(0, 0, this.size, this.size / 1.7, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create 35 petal instances
    const petals = Array.from({ length: 35 }).map(() => new Petal());

    // Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(petal => {
        petal.update();
        petal.draw();
      });
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-container max-w-[40rem]" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        {/* Canvas overlay for falling petals */}
        <canvas ref={canvasRef} className="falling-petals-canvas" />

        <div className="flowers-content-wrapper z-10 relative">
          <div className="flowers-title-section">
            <h3 className="flowers-heading">Your Bouquet Gallery 💐</h3>
            <p className="flowers-quote">“These flowers are as beautiful as you 🌸”</p>
          </div>

          <div className="flowers-grid">
            {bouquets.map(bouquet => (
              <div key={bouquet.id} className="flower-bouquet-card">
                <img 
                  src={bouquet.url} 
                  alt={bouquet.title} 
                  className="flower-bouquet-img"
                  loading="lazy"
                />
                <span className="flower-card-tag">{bouquet.tag}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-3 text-xs text-white/50 italic font-instrument-serif tracking-wider">
            Petals of love falling softly just for you... 🌹
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== 3️⃣ CAKE MODAL COMPONENT ==================== */
const CakeSurpriseModal = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [candles, setCandles] = useState([
    { id: 1, active: true, x: '40%' },
    { id: 2, active: true, x: '50%' },
    { id: 3, active: true, x: '60%' }
  ]);
  const [isWishBlown, setIsWishBlown] = useState(false);
  const [smokes, setSmokes] = useState([]);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // Confetti Particle System using Canvas
  useEffect(() => {
    if (!isConfettiActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    // Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    class ConfettiPiece {
      constructor() {
        this.x = width / 2;
        this.y = height * 0.6; // Start from the cake candles position
        this.size = 4 + Math.random() * 8;
        this.color = [
          '#ff69b4', '#ffb6c1', '#d4af37', '#00e5ff', '#b388ff', '#a7ffeb', '#ffff8d'
        ][Math.floor(Math.random() * 7)];
        
        // Velocity (Burst out in all directions)
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 2; // Upwards bias
        
        this.gravity = 0.12;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = -4 + Math.random() * 8;
        this.opacity = 1;
        this.fadeSpeed = 0.005 + Math.random() * 0.01;
      }

      update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.opacity -= this.fadeSpeed;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        // Draw confetti rectangular shape
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
        ctx.restore();
      }
    }

    // Spawn 120 confetti pieces
    const confettiList = Array.from({ length: 120 }).map(() => new ConfettiPiece());

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      let activePieces = 0;

      confettiList.forEach(c => {
        if (c.opacity > 0) {
          c.update();
          c.draw();
          activePieces++;
        }
      });

      if (activePieces > 0) {
        animationId = requestAnimationFrame(render);
      } else {
        setIsConfettiActive(false);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isConfettiActive]);

  // Blow out specific candle
  const extinguishCandle = (id, e) => {
    // Prevent double clicking active candles
    const targetCandle = candles.find(c => c.id === id);
    if (!targetCandle || !targetCandle.active) return;

    // Capture position to spawn smoke
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
    const relativeX = rect.left - parentRect.left + rect.width / 2;
    const relativeY = rect.top - parentRect.top;

    // Spawn 3 smoke particles
    const newSmokes = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      x: relativeX,
      y: relativeY - 10,
      driftX: -20 + Math.random() * 40,
      size: 6 + Math.random() * 8
    }));
    
    setSmokes(prev => [...prev, ...newSmokes]);

    // Extinguish candle
    setCandles(prev => prev.map(c => c.id === id ? { ...c, active: false } : c));

    // Spark confetti
    setIsConfettiActive(true);
  };

  // Check if all candles are blown
  useEffect(() => {
    const allBlown = candles.every(c => !c.active);
    if (allBlown && candles.length > 0) {
      setIsWishBlown(true);
    }
  }, [candles]);

  // Blow out all remaining candles at once
  const blowAllCandles = () => {
    const parent = document.querySelector('.cake-display-container');
    if (parent) {
      const activeCandles = candles.filter(c => c.active);
      const newSmokes = [];

      activeCandles.forEach(candle => {
        // Approximate coordinates relative to center
        newSmokes.push(...Array.from({ length: 3 }).map((_, i) => ({
          id: Date.now() + Math.random() + i,
          x: 120, // center
          y: 60,  // top tier area
          driftX: -25 + Math.random() * 50,
          size: 7 + Math.random() * 9
        })));
      });

      setSmokes(prev => [...prev, ...newSmokes]);
    }

    setCandles(prev => prev.map(c => ({ ...c, active: false })));
    setIsConfettiActive(true);
    setIsWishBlown(true);
  };

  // Reset/Relight
  const relightCandles = () => {
    setCandles(prev => prev.map(c => ({ ...c, active: true })));
    setIsWishBlown(false);
    setSmokes([]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-container max-w-[36rem]" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        {/* Confetti canvas overlay */}
        {isConfettiActive && <canvas ref={canvasRef} className="falling-petals-canvas" />}

        <div className="cake-section-wrapper z-10 relative">
          <div className="cake-instructions">
            <h3 className="cake-text-title">Happy Birthday Cake 🎂✨</h3>
            <p className="cake-text-subtitle">
              {isWishBlown 
                ? "Your wish has been carried to the stars! ✨💖" 
                : "Make a quiet wish and blow out the candles 💖"}
            </p>
          </div>

          {/* Interactive Cake Graphic */}
          <div className="cake-display-container">
            {/* Render Candle Smoke */}
            {smokes.map(s => (
              <span 
                key={s.id} 
                className="smoke-particle" 
                style={{ 
                  left: `${s.x}px`, 
                  top: `${s.y}px`,
                  '--drift-x': `${s.driftX}px`
                }} 
              />
            ))}

            {/* Stand */}
            <div className="cake-stand"></div>
            <div className="cake-stand-base"></div>

            {/* Tier 1 (Bottom Tier) */}
            <div className="cake-tier-bottom">
              <div className="cream-frosting"></div>
              <div className="drip-container">
                <div className="drip" style={{ '--drip-h': '16px' }}></div>
                <div className="drip" style={{ '--drip-h': '24px' }}></div>
                <div className="drip" style={{ '--drip-h': '14px' }}></div>
                <div className="drip" style={{ '--drip-h': '28px' }}></div>
                <div className="drip" style={{ '--drip-h': '18px' }}></div>
                <div className="drip" style={{ '--drip-h': '22px' }}></div>
              </div>
            </div>

            {/* Tier 2 (Top Tier) */}
            <div className="cake-tier-top">
              <div className="cream-frosting"></div>
              <div className="drip-container">
                <div className="drip" style={{ '--drip-h': '12px' }}></div>
                <div className="drip" style={{ '--drip-h': '18px' }}></div>
                <div className="drip" style={{ '--drip-h': '14px' }}></div>
                <div className="drip" style={{ '--drip-h': '20px' }}></div>
                <div className="drip" style={{ '--drip-h': '11px' }}></div>
              </div>

              {/* Strawberries topping top tier */}
              <div className="toppings-container">
                <span className="strawberry" style={{ '--rot': '-10deg' }}></span>
                <span className="strawberry" style={{ '--rot': '5deg' }}></span>
                <span className="strawberry" style={{ '--rot': '-5deg' }}></span>
                <span className="strawberry" style={{ '--rot': '10deg' }}></span>
              </div>
            </div>

            {/* 3 Candles */}
            {candles.map(candle => (
              <div 
                key={candle.id}
                className="candle-wrapper"
                style={{ '--candle-x': candle.x }}
                onClick={(e) => extinguishCandle(candle.id, e)}
              >
                {candle.active ? (
                  <div className="candle-flame"></div>
                ) : (
                  <div className="candle-extinguished"></div>
                )}
                <div className="candle-wick"></div>
                <div className="candle-body"></div>
              </div>
            ))}
          </div>

          {/* Blow action buttons */}
          <div className="mt-8 flex gap-4">
            {!isWishBlown ? (
              <button className="blow-btn" onClick={blowAllCandles}>
                Blow Candles 🌬️
              </button>
            ) : (
              <button 
                className="blow-btn bg-gradient-to-r from-pink-500/30 to-rose-500/30 border border-pink-400/50 hover:from-pink-500/50" 
                onClick={relightCandles}
              >
                Relight Candles 🕯️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneSurprise;
