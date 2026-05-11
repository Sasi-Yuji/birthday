import React, { useEffect, useMemo, useState } from 'react';
import FlyingPosters from './ui/FlyingPosters';

const ScenePosters = ({ onComplete }) => {
  const [vw, setVw] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 800
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const posterItems = useMemo(
    () => [
      'https://picsum.photos/800/1200?random=1',
      'https://picsum.photos/800/1200?random=2',
      'https://picsum.photos/800/1200?random=3',
      'https://picsum.photos/800/1200?random=4',
      'https://picsum.photos/800/1200?random=5',
      'https://picsum.photos/800/1200?random=6',
      'https://picsum.photos/800/1200?random=7',
      'https://picsum.photos/800/1200?random=8',
      'https://picsum.photos/800/1200?random=9',
      'https://picsum.photos/800/1200?random=10',
      'https://picsum.photos/800/1200?random=11',
      'https://picsum.photos/800/1200?random=12',
    ],
    []
  );

  const { planeWidth, planeHeight } = useMemo(() => {
    if (vw < 400) return { planeWidth: 150, planeHeight: 200 };
    if (vw < 480) return { planeWidth: 170, planeHeight: 230 };
    if (vw < 640) return { planeWidth: 200, planeHeight: 270 };
    if (vw < 768) return { planeWidth: 240, planeHeight: 320 };
    if (vw < 1024) return { planeWidth: 280, planeHeight: 380 };
    return { planeWidth: 320, planeHeight: 440 };
  }, [vw]);

  return (
    <div className="flex h-full min-h-0 w-full max-w-[100vw] flex-col items-center overflow-x-hidden py-6 sm:py-10 md:py-12 lg:py-16">
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex w-full justify-center pt-8 text-center sm:pt-10 md:pt-12 lg:pt-14">
        <div className="content-wrapper max-w-full">
          <h2 className="font-cinzel text-2xl font-bold tracking-[0.15em] text-white drop-shadow-2xl sm:text-3xl sm:tracking-[0.18em] md:text-4xl md:tracking-[0.2em] lg:text-5xl xl:text-6xl">
            CHRONICLES OF JOY
          </h2>
          <p className="subtitle-elegant mt-2 text-[0.65rem] tracking-[0.28em] opacity-70 sm:text-xs md:text-sm md:tracking-[0.35em]">
            EVERY MOMENT IS A BEAUTIFUL STORY
          </p>
        </div>
      </div>

      <div className="relative z-20 flex h-[min(76vh,50rem)] min-h-[45vh] w-full flex-1">
        <FlyingPosters
          items={posterItems}
          planeWidth={planeWidth}
          planeHeight={planeHeight}
          distortion={3}
          scrollEase={0.06}
        />
      </div>

      <div className="bottom-button-container z-40 flex flex-col items-center gap-2 sm:gap-4 pb-4">
        <p className="mb-1 max-w-md px-2 text-center text-[0.6rem] uppercase tracking-[0.2em] text-white/50 animate-pulse sm:text-[0.65rem] md:text-xs">
          SWIPE TO EXPLORE THE TIMELINE
        </p>
        <button onClick={onComplete} className="btn-luxury shadow-[0_0_50px_rgba(255,255,255,0.1)]">
          Begin The Celebration
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[min(80vh,42rem)] w-[min(88vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
    </div>
  );
};

export default ScenePosters;
