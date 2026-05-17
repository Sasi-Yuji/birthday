import { useState, useEffect, useRef } from 'react';
import './ScenePasscode.css';
import AudioSys from '../utils/AudioSystem';

// Local Assets
import pic1 from '../assets/pic1.jpeg';
import pic2 from '../assets/pic2.jpeg';
import teddy1 from '../assets/teddy1.png';

const ScenePasscode = ({ onComplete }) => {
  const [step, setStep] = useState(1); // steps 1 to 5
  
  // PAGE 1: PASSCODE STATE
  const [passcode, setPasscode] = useState('');
  const [keypadStatus, setKeypadStatus] = useState(''); // 'shake', 'success', or ''
  const correctPasscode = '2442';

  // PAGE 5: TYPING STATE
  const [typedMessage, setTypedMessage] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  
  // Camera Interaction States (Page 3)
  const [shutterFlash, setShutterFlash] = useState(false);
  const [filmSliding, setFilmSliding] = useState(false);
  const [filmComplete, setFilmComplete] = useState(false);

  // Background Sparks (Page 2)
  const [sparks, setSparks] = useState([]);

  // Birthday Message Lines
  const messageLines = [
    "Happy Birthday to the most precious person 💖",
    "",
    "You deserve all the happiness in the world. Your kindness, laughter, and presence bring so much joy to my life. I am incredibly grateful and lucky to know you.",
    "",
    "Thank you for being in my life and for being the wonderful, beautiful soul that you are. May all your dreams and wishes shine bright today! ✨",
    "",
    "Happiest Birthday, Shathini! 🎉🌸"
  ];

  // Initialize audio for Page 5
  useEffect(() => {
    AudioSys.init();
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
      audioRef.current.play().catch(err => console.log("Audio play blocked by browser", err));
      setIsMusicPlaying(true);
    }
  };

  // Generate random sparkles for Page 2
  useEffect(() => {
    if (step === 2) {
      const generatedSparks = Array.from({ length: 15 }).map(() => ({
        id: Math.random(),
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 60 + 20}%`,
        size: `${Math.random() * 10 + 6}px`,
        delay: `${Math.random() * 2}s`,
        duration: `${Math.random() * 3 + 2}s`
      }));
      setSparks(generatedSparks);
    }
  }, [step]);

  // Keypad click handler
  const handleKeypadPress = (val) => {
    // Soft click chime effect
    AudioSys.playChime(1100);

    if (passcode.length < 4) {
      const nextCode = passcode + val;
      setPasscode(nextCode);

      if (nextCode.length === 4) {
        if (nextCode === correctPasscode) {
          // Success
          setKeypadStatus('success');
          // Soft success fanfare
          setTimeout(() => {
            AudioSys.playChime(900);
            setTimeout(() => AudioSys.playChime(1400), 120);
          }, 150);

          setTimeout(() => {
            setStep(2);
            setKeypadStatus('');
          }, 800);
        } else {
          // Failure
          setKeypadStatus('shake');
          setTimeout(() => {
            setPasscode('');
            setKeypadStatus('');
          }, 600);
        }
      }
    }
  };

  const handleClear = () => {
    AudioSys.playChime(600);
    setPasscode('');
  };

  const handleDelete = () => {
    AudioSys.playChime(700);
    setPasscode(prev => prev.slice(0, -1));
  };

  // Synthesis of high-fidelity mechanical camera shutter click
  const playCameraClick = () => {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    try {
      const context = new AudioContext();
      const t = context.currentTime;
      
      // Mirror flip click (Highpass noise decay)
      const bufferSize = context.sampleRate * 0.12; 
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = context.createBufferSource();
      noise.buffer = buffer;
      
      const filter = context.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1500, t);
      filter.frequency.exponentialRampToValueAtTime(7000, t + 0.08);
      
      const gain = context.createGain();
      gain.gain.setValueAtTime(1.0, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      noise.start(t);
    } catch (err) {
      console.log("Shutter click synthesis blocked", err);
    }
  };

  // Step 3 shutter click trigger
  const handleShutterTrigger = () => {
    playCameraClick();
    setShutterFlash(true);
    
    // Shutter flash visual blink duration
    setTimeout(() => {
      setShutterFlash(false);
      setFilmSliding(true);
    }, 400);

    // Film sliding duration (4s keyframe output)
    setTimeout(() => {
      setFilmComplete(true);
    }, 4500);
  };

  // Page 5 Message Typing Simulation
  useEffect(() => {
    if (step === 5) {
      let currentLine = 0;
      let currentChar = 0;
      let bufferText = '';
      let timerId;

      // Automatically start background music on page 5
      if (audioRef.current && !isMusicPlaying) {
        audioRef.current.play().catch(() => {});
        setIsMusicPlaying(true);
      }

      const type = () => {
        if (currentLine >= messageLines.length) {
          clearInterval(timerId);
          return;
        }

        const activeLineStr = messageLines[currentLine];
        if (currentChar < activeLineStr.length) {
          bufferText += activeLineStr[currentChar];
          setTypedMessage(bufferText);
          currentChar++;
        } else {
          bufferText += '\n';
          setTypedMessage(bufferText);
          currentLine++;
          currentChar = 0;
        }
      };

      timerId = setInterval(type, 30);
      return () => clearInterval(timerId);
    }
  }, [step]);

  return (
    <div className="passcode-scene-root">
      <div className="passcode-aurora"></div>
      
      {/* FULL SCREEN FLASH OVERLAY FOR PAGE 3 CAMERA CLICK */}
      <div className={`shutter-flash-overlay ${shutterFlash ? 'shutter-flash-active' : ''}`} />

      {/* ----------------- PAGE 1: SECRET PASSWORD SCREEN ----------------- */}
      {step === 1 && (
        <div className={`passcode-container passcode-split-layout ${keypadStatus === 'shake' ? 'shake-error' : ''} ${keypadStatus === 'success' ? 'flash-success' : ''}`}>
          {/* Polaroid on the left */}
          <div className="polaroid-wrapper">
            <div className="polaroid-img-container">
              <img src={pic2} alt="Cute polaroid" className="polaroid-img" />
            </div>
            <p className="polaroid-caption">Secret Key... 🔒</p>
            {/* Teddy bear sticker overlapping frame */}
            <img src={teddy1} alt="Teddy Sticker" className="polaroid-sticker" />
          </div>

          {/* Keypad on the right */}
          <div className="keypad-panel">
            <header className="keypad-header">
              <h2 className="keypad-title">Enter a Secret Passcode 💌</h2>
            </header>

            {/* Password Dots Indicator */}
            <div className="dots-display">
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`dot ${passcode.length > i ? 'active' : ''}`}
                />
              ))}
            </div>

            {/* Keypad Grid */}
            <div className="keypad-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(val => (
                <button 
                  key={val} 
                  className="keypad-btn"
                  onClick={() => handleKeypadPress(val)}
                >
                  {val}
                </button>
              ))}
              <button 
                className="keypad-btn action-btn"
                onClick={handleClear}
              >
                C
              </button>
              <button 
                className="keypad-btn"
                onClick={() => handleKeypadPress('0')}
              >
                0
              </button>
              <button 
                className="keypad-btn action-btn"
                onClick={handleDelete}
              >
                Del
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- PAGE 2: COMPLIMENT SCREEN ----------------- */}
      {step === 2 && (
        <div className="passcode-container camera-box-layout">
          {/* Floating sparks around camera */}
          <div className="passcode-sparkle-layer">
            {sparks.map(spark => (
              <span
                key={spark.id}
                style={{
                  position: 'absolute',
                  left: spark.left,
                  top: spark.top,
                  fontSize: spark.size,
                  animation: `float-up-sparkle ${spark.duration} ease-in-out infinite`,
                  animationDelay: spark.delay,
                  opacity: 0.8
                }}
              >
                ✨
              </span>
            ))}
          </div>

          <div className="compliment-text-wrap animate-fade-down">
            <h2 className="compliment-text">“Wow, that looks so good on you 💖”</h2>
            <p className="compliment-sub">Get ready to take a picture !! 📸</p>
          </div>

          {/* Cute pink Instax Camera bouncing in center */}
          <div className="instax-camera animate-camera-bounce">
            <div className="camera-film-slot"></div>
            <div className="camera-viewfinder"></div>
            <div className="camera-flash"></div>
            <div className="camera-shutter-btn"></div>
            <div className="camera-lens">
              <div className="camera-lens-inner"></div>
            </div>
          </div>

          <button 
            className="btn-luxury border-pink-400/40 hover:border-pink-500 hover:shadow-pink-500/10 mt-2 px-10 py-3"
            onClick={() => setStep(3)}
          >
            Get Ready &rarr;
          </button>
        </div>
      )}

      {/* ----------------- PAGE 3: CAMERA INTERACTION ----------------- */}
      {step === 3 && (
        <div className="passcode-container camera-box-layout">
          <div className="compliment-text-wrap">
            <h2 className="compliment-text">Smile for the camera! 😊</h2>
            <p className="compliment-sub">
              {filmSliding 
                ? (filmComplete ? "Click below to see!" : "Developing chemical layers... 🧪") 
                : "Tap shutter button to snap a Polaroid!"}
            </p>
          </div>

          {/* Large Scale Instax Camera */}
          <div className="instax-camera large-scale animate-camera-bounce" style={{ marginBottom: '1.5rem' }}>
            <div className="camera-film-slot"></div>
            <div className="camera-viewfinder"></div>
            <div className="camera-flash"></div>
            <div className="camera-shutter-btn" onClick={!filmSliding ? handleShutterTrigger : undefined} style={{ cursor: 'pointer' }}></div>
            
            {/* Film slot output when triggered */}
            {filmSliding && (
              <div className="instax-film-out">
                <div className="film-img-placeholder">
                  <img src={pic1} alt="Developing Polaroid" />
                </div>
              </div>
            )}

            <div className="camera-lens" onClick={!filmSliding ? handleShutterTrigger : undefined} style={{ cursor: 'pointer' }}>
              <div className="camera-lens-inner"></div>
            </div>
          </div>

          <div className="mt-8">
            {!filmSliding ? (
              <button 
                className="blow-btn" 
                onClick={handleShutterTrigger}
              >
                See the Picture 📸
              </button>
            ) : (
              <button 
                className={`blow-btn ${filmComplete ? '' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!filmComplete}
                onClick={filmComplete ? () => setStep(4) : undefined}
              >
                {filmComplete ? "Reveal Polaroid ✨" : "Developing..."}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ----------------- PAGE 4: PHOTO REVEAL ----------------- */}
      {step === 4 && (
        <div className="passcode-container reveal-split-layout">
          {/* Polaroid photo fully slides out from camera */}
          <div className="reveal-photo-frame">
            <img src={pic1} alt="Revealed Polaroid" className="film-img-actual" />
            <p className="polaroid-caption">Stunning... ✨</p>
            {/* Float overlapping sparkles */}
            <span style={{ position: 'absolute', top: '-10px', right: '-15px', fontSize: '24px' }}>✨</span>
            <span style={{ position: 'absolute', bottom: '15px', left: '-15px', fontSize: '20px' }}>💖</span>
          </div>

          {/* Cute text and prompt beside photo */}
          <div className="reveal-text-panel animate-fade-up">
            <h2 className="reveal-title">“Who is this beautiful girl? ✨”</h2>
            <p className="reveal-desc">
              A breathtaking smile captured inside the cosmic camera lens. You look absolutely gorgeous, radiating light and endless warmth to everyone around you!
            </p>
            
            <button 
              className="btn-luxury border-pink-400/40 hover:border-pink-500 hover:shadow-pink-500/10 px-10 py-3"
              onClick={() => setStep(5)}
            >
              Read My Note &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ----------------- PAGE 5: BIRTHDAY MESSAGE ----------------- */}
      {step === 5 && (
        <div className="passcode-container message-fullscreen-wrap">
          {/* Ambient Hearts in Background */}
          <div className="surprise-bg-particles">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={`heart-bg-${i}`}
                className="floating-heart"
                style={{
                  left: `${Math.random() * 95}%`,
                  '--size': `${14 + Math.random() * 16}px`,
                  '--duration': `${5 + Math.random() * 6}s`,
                  '--delay': `${Math.random() * 3}s`,
                  '--drift': `${(Math.random() - 0.5) * 60}px`,
                  '--rotate': `${-20 + Math.random() * 40}deg`,
                  '--max-opacity': '0.5'
                }}
              >
                💖
              </span>
            ))}
          </div>

          {/* Music Toggle Control */}
          <button 
            className={`music-toggle-btn ${isMusicPlaying ? 'playing' : ''}`} 
            onClick={toggleMusic}
            title={isMusicPlaying ? "Mute Music" : "Play Music"}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
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

          {/* Letter / Card with typing text */}
          <div className="message-glow-letter">
            <p className="message-typing-text">
              {typedMessage}
            </p>
          </div>

          <button 
            className="btn-luxury animate-fade-up shadow-2xl border-pink-400/40 hover:border-pink-500 hover:shadow-pink-500/10 px-12 py-4 text-base"
            onClick={onComplete}
          >
            Explore Memories &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default ScenePasscode;
