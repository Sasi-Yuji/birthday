import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
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

import Butterfly from './ui/Butterfly';

/** Keep in sync with `index.css` `.balloons-detail-row` --bd-lightning (stroke text reads smaller than filled date) */
function readInitialLightningSize() {
  if (typeof window === 'undefined') return 16;
  const w = window.innerWidth;
  if (w < 360) return 16;
  if (w < 375) return 17;
  if (w < 480) return 18;
  if (w < 640) return 19;
  if (w < 768) return 20;
  if (w < 1024) return 22;
  if (w < 1280) return 24;
  if (w < 1536) return 26;
  return 28;
}

const SceneBalloons = ({ onComplete }) => {
  const [balloons, setBalloons] = useState([]);
  const [hasPopped, setHasPopped] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const containerRef = useRef(null);
  
  const [firstLetterRef, setFirstLetterRef] = useState(null);
  const [lastLetterRef, setLastLetterRef] = useState(null);
  const detailRowRef = useRef(null);
  const [lightningSize, setLightningSize] = useState(readInitialLightningSize);

  useLayoutEffect(() => {
    const row = detailRowRef.current;
    if (!row) return;
    const read = () => {
      const raw = getComputedStyle(row).getPropertyValue('--bd-lightning').trim();
      const n = parseFloat(raw, 10);
      if (!Number.isNaN(n) && n > 0) setLightningSize(n);
    };
    read();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(read) : null;
    ro?.observe(row);
    window.addEventListener('resize', read);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', read);
    };
  }, []);

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
      <div className="content-wrapper scene-balloons-root relative z-20 flex min-h-0 w-full max-w-[100vw] flex-col items-center overflow-x-hidden pointer-events-none">
        <div className="balloons-marquee-wrap w-full max-w-[100vw]">
          <CurvedLoop marqueeText="HAPPY BIRTHDAY ✦ " speed={1.5} curveAmount={350} />
        </div>

        <AnimatedText
          text="SHATHINI"
          textClassName="text-[clamp(1.625rem,10vw,3rem)] sm:text-[clamp(2.75rem,12vw,5rem)] md:text-[clamp(5.5rem,14vw,8.75rem)] lg:text-[clamp(7rem,16vw,11.25rem)] font-cinzel font-bold text-white tracking-[0.12em] sm:tracking-[0.18em] md:tracking-[0.28em] drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
          underlineGradient="from-purple-400 via-fuchsia-500 to-pink-500"
          underlineHeight="h-[2px] md:h-[4px]"
          underlineOffset="-bottom-2 md:-bottom-4"
          className="balloons-name-block mt-[-30px] sm:mt-[-80px] md:mt-[-100px] mb-6 z-30"
          onFirstLetterRef={setFirstLetterRef}
          onLastLetterRef={setLastLetterRef}
        />

        {/* Butterflies */}
        {firstLetterRef && (
          <Butterfly 
            targetRef={firstLetterRef} 
            side="left" 
            delay={0.5} 
            color1="#00f0ff" 
            color2="#7b2cbf" 
          />
        )}
        {lastLetterRef && (
          <Butterfly 
            targetRef={lastLetterRef} 
            side="right" 
            delay={1.2} 
            color1="#ff4579" 
            color2="#ffd700" 
          />
        )}

        {/* Birthday Details — date + age scale together via .balloons-detail-row (index.css) */}
        <div
          ref={detailRowRef}
          className="balloons-detail-row relative z-[35] flex flex-row items-center justify-between gap-2 drop-shadow-md sm:gap-4"
        >
          <div className="balloons-date-col flex min-w-0 flex-1 justify-start text-date-age">
            <div className="balloons-date-text flex items-center">
              <Counter end={20} duration={2} className="px-0 w-auto" />
              <span className="mx-0.5 sm:mx-1 opacity-60 shrink-0">&bull;</span>
              <Counter end={5} duration={2} className="px-0 w-auto" />
              <span className="mx-0.5 sm:mx-1 opacity-60 shrink-0">&bull;</span>
              <Counter end={2005} duration={2} className="px-0 w-auto" />
            </div>
            <span className="text-pink-400 ml-1.5 sm:ml-2 hidden sm:inline shrink-0">✦</span>
          </div>

          <div className="balloons-age-col flex shrink-0 justify-end text-date-age">
            <LightningText text="21 YEARS" size={lightningSize} className="balloons-age-slot" />
          </div>
        </div>

        <div className="balloons-lanyard-block mt-4 sm:mt-52 md:mt-64 transform translate-y-[10px] sm:translate-y-[60px] md:translate-y-[80px]">
          <Lanyard />
        </div>
        <p className="subtitle-elegant mt-2 md:mt-0 max-w-[min(100%,22rem)] px-2 text-[10px] sm:text-xs md:text-base tracking-[0.15em] md:tracking-[0.2em]">
          Tap the balloons to celebrate.
        </p>
      </div>

      <div className="bottom-button-container bottom-button-container--balloons">
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
