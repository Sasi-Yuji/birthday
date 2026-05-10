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
    // Determine initial count and size based on screen width
    const isMobile = window.innerWidth < 768;
    const initialCount = isMobile ? 4 : 6;
    const baseScale = isMobile ? 0.4 : 0.6;
    const randomRange = isMobile ? 0.4 : 0.7;

    // Initial burst
    const initialBalloons = Array.from({ length: initialCount }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      colorObj: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      sizeScale: baseScale + Math.random() * randomRange,
      startX: Math.random() * 90 + 5
    }));
    setBalloons(initialBalloons);

    const spawnInterval = setInterval(() => {
      const isMobile = window.innerWidth < 768;
      const baseScale = isMobile ? 0.4 : 0.6;
      const randomRange = isMobile ? 0.4 : 0.7;

      const id = Math.random().toString(36).substr(2, 9);
      const colorObj = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
      const sizeScale = baseScale + Math.random() * randomRange;
      const startX = Math.random() * 90 + 5;

      setBalloons(prev => [...prev, { id, colorObj, sizeScale, startX }]);
    }, 800);

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
    }
  };

  useEffect(() => {
    // Auto-appear button after 3 seconds for consistency
    const timer = setTimeout(() => setShowContinue(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="content-wrapper relative z-20 pointer-events-none flex flex-col items-center overflow-visible w-full px-4">
        <div className="w-full max-w-[100vw] overflow-visible">
          <CurvedLoop marqueeText="HAPPY BIRTHDAY ✦ " speed={1.5} curveAmount={350} />
        </div>

        <AnimatedText
          text="SHATHINI"
          textClassName="text-[48px] sm:text-[80px] md:text-[140px] lg:text-[180px] font-cinzel font-bold text-white tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
          underlineGradient="from-purple-400 via-fuchsia-500 to-pink-500"
          underlineHeight="h-[2px] md:h-[4px]"
          underlineOffset="-bottom-2 md:-bottom-4"
          className="mt-[-30px] sm:mt-[-80px] md:mt-[-100px] mb-6 z-30"
        />

        {/* Birthday Details - Matched Typography */}
        <div className="flex flex-row items-center justify-between w-full px-4 sm:px-16 md:px-32 max-w-[100vw] md:max-w-5xl z-30 drop-shadow-md gap-4">
          {/* Left Side: Date */}
          <div className="flex items-center justify-start text-date-age text-[12px] sm:text-[18px] md:text-[24px]">
            <div className="flex items-center">
              <Counter end={20} duration={2} className="px-0 w-auto" />
              <span className="mx-1 opacity-60">&bull;</span>
              <Counter end={5} duration={2} className="px-0 w-auto" />
              <span className="mx-1 opacity-60">&bull;</span>
              <Counter end={2005} duration={2} className="px-0 w-auto" />
            </div>
            <span className="text-pink-400 ml-2 hidden sm:block">✦</span>
          </div>

          {/* Right Side: Age - Matched Size */}
          <div className="flex items-center justify-end text-date-age text-[12px] sm:text-[18px] md:text-[24px]">
            <LightningText
              text="21 YEARS"
              size={window.innerWidth < 480 ? 12 : window.innerWidth < 768 ? 18 : 24}
              className="w-[90px] h-[20px] sm:w-[150px] sm:h-[40px] md:w-[200px] md:h-[50px]"
            />
          </div>
        </div>

        <div className="mt-4 sm:mt-52 md:mt-64 transform translate-y-[10px] sm:translate-y-[60px] md:translate-y-[80px]">
          <Lanyard />
        </div>
        <p className="subtitle-elegant mt-2 md:mt-0 text-[10px] sm:text-xs md:text-base tracking-[0.15em] md:tracking-[0.2em]">
          Tap the balloons to celebrate.
        </p>
      </div>

      <div className="bottom-button-container">
        {showContinue && (
          <button
            onClick={onComplete}
            className="btn-luxury animate-fade-up"
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
