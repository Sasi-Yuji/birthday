import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import AudioSys from '../utils/AudioSystem';
import Lanyard from './Lanyard';
import CurvedLoop from './CurvedLoop';
import { AnimatedText } from './AnimatedText';
import { Counter } from './AnimatedCounter';
import LightningText from './ui/LightningText';

const BALLOON_COLORS = [
  { bg: 'radial-gradient(circle at 30% 30%, #ff4579, #b0003a, #4a0018)', base: '#ff4579' },
  { bg: 'radial-gradient(circle at 30% 30%, #00f0ff, #007bb5, #002d4a)', base: '#00f0ff' },
  { bg: 'radial-gradient(circle at 30% 30%, #e0aaff, #7b2cbf, #240046)', base: '#e0aaff' },
  { bg: 'radial-gradient(circle at 30% 30%, #ffd700, #b8860b, #4a3600)', base: '#ffd700' }
];

const SceneBalloons = ({ onComplete }) => {
  const [balloons, setBalloons] = useState([]);
  const [hasPopped, setHasPopped] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Initial burst
    const initialBalloons = Array.from({ length: 6 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      colorObj: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      sizeScale: 0.6 + Math.random() * 0.7,
      startX: Math.random() * 90 + 5
    }));
    setBalloons(initialBalloons);

    const spawnInterval = setInterval(() => {
      const id = Math.random().toString(36).substr(2, 9);
      const colorObj = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
      const sizeScale = 0.6 + Math.random() * 0.7;
      const startX = Math.random() * 90 + 5;
      
      setBalloons(prev => [...prev, { id, colorObj, sizeScale, startX }]);
    }, 600);

    return () => clearInterval(spawnInterval);
  }, []);

  const handlePop = (id, e, color) => {
    AudioSys.playPop();
    if (window.createGlobalExplosion) {
      window.createGlobalExplosion(e.clientX, e.clientY, color, 40, true);
    }
    setBalloons(prev => prev.filter(b => b.id !== id));
    
    if (!hasPopped) {
      setHasPopped(true);
      setTimeout(() => setShowContinue(true), 3000);
    }
  };

  return (
    <>
      <div className="content-wrapper relative z-20 pointer-events-none flex flex-col items-center overflow-visible w-full">
        <CurvedLoop marqueeText="HAPPY BIRTHDAY ✦ " speed={1.5} curveAmount={350} />
        <AnimatedText 
          text="SHATHINI" 
          textClassName="text-[80px] md:text-[180px] font-cinzel font-bold text-white tracking-[0.3em] drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
          underlineGradient="from-purple-400 via-fuchsia-500 to-pink-500"
          underlineHeight="h-[4px]"
          underlineOffset="-bottom-4"
          className="mt-[-100px] mb-6 z-30"
        />

        {/* Birthday Details - Adjusted Layout to clear Lanyard String */}
        <div className="flex items-center justify-center w-full max-w-[90vw] md:max-w-5xl z-30 drop-shadow-md">
          {/* Left Side: Date + Star - Moved further left and resized to match Age */}
          <div className="flex-1 flex justify-end pr-16 md:pr-48 items-center">
            <div className="flex items-center justify-center font-cinzel font-bold text-[#fce4ec] opacity-100 text-[22px]">
              <div className="px-10">
                <Counter end={20} duration={2} className="text-[#fce4ec] px-0 w-auto tracking-normal" />
              </div>
              <span className="text-pink-300 opacity-80 text-[22px] mx-4">&bull;</span>
              <div className="px-10">
                <Counter end={5} duration={2} className="text-[#fce4ec] px-0 w-auto tracking-normal" />
              </div>
              <span className="text-pink-300 opacity-80 text-[22px] mx-4">&bull;</span>
              <div className="px-10">
                <Counter end={2005} duration={2} className="text-[#fce4ec] px-0 w-auto tracking-normal" />
              </div>
            </div>
            {/* Star resized and spaced to match theme */}
            <span className="text-pink-400 text-[26px] shrink-0 ml-8 md:ml-12">✦</span>
          </div>
          
          {/* Right Side: Age - Moved further right for symmetry */}
          <div className="flex-1 flex justify-start pl-16 md:pl-48">
            <LightningText 
              text="21 YEARS" 
              size={22} 
              className="w-[180px] h-[50px] md:w-[240px] md:h-[60px]" 
            />
          </div>
        </div>

        <div className="mt-64 transform translate-y-[80px]">
          <Lanyard />
        </div>
        <p className="subtitle-elegant">Pop the balloons to celebrate.</p>
        {showContinue && (
          <button 
            onClick={onComplete}
            className="btn-luxury mt-8 pointer-events-auto animate-fade-in"
          >
            Continue The Celebration
          </button>
        )}
      </div>
      <div className="balloon-stage" ref={containerRef}>
        {balloons.map(balloon => (
          <Balloon 
            key={balloon.id} 
            {...balloon} 
            onPop={(e) => handlePop(balloon.id, e, balloon.colorObj.base)} 
          />
        ))}
      </div>
    </>
  );
};

const Balloon = ({ colorObj, sizeScale, startX, onPop }) => {
  const ref = useRef(null);

  useEffect(() => {
    const floatDuration = 8 + Math.random() * 7;
    gsap.fromTo(ref.current, 
      { y: 0 },
      {
        y: -window.innerHeight - 800,
        x: (Math.random() - 0.5) * 200,
        rotationZ: (Math.random() - 0.5) * 30,
        duration: floatDuration,
        ease: "none",
        onComplete: () => {
          // Optional: handle removal if needed, though React state handles it in this version
        }
      }
    );

    gsap.to(ref.current, {
      x: `+=${(Math.random() - 0.5) * 80}`,
      rotationZ: (Math.random() - 0.5) * 20,
      duration: Math.random() * 2 + 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div 
      ref={ref}
      className="balloon-wrapper"
      style={{ left: `${startX}%`, bottom: '-250px', transform: `scale(${sizeScale})` }}
      onClick={onPop}
    >
      <div className="balloon-body" style={{ background: colorObj.bg }}>
        <div className="balloon-knot" style={{ borderBottomColor: colorObj.base }}></div>
      </div>
      <div className="balloon-string"></div>
    </div>
  );
};

export default SceneBalloons;
