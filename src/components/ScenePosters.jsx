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
    ],
    []
  );

  const { planeWidth, planeHeight } = useMemo(() => {
    if (vw < 400) return { planeWidth: 180, planeHeight: 240 };
    if (vw < 480) return { planeWidth: 200, planeHeight: 270 };
    if (vw < 640) return { planeWidth: 240, planeHeight: 320 };
    if (vw < 768) return { planeWidth: 280, planeHeight: 380 };
    if (vw < 1024) return { planeWidth: 320, planeHeight: 440 };
    return { planeWidth: 400, planeHeight: 550 };
  }, [vw]);

  return (
    <div className="flex h-full min-h-0 w-full max-w-[100vw] flex-col items-center overflow-x-hidden py-6 sm:py-10 md:py-12 lg:py-16">
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex w-full justify-center pt-8 text-center sm:pt-10 md:pt-12 lg:pt-14">
        <div className="content-wrapper max-w-full">
          <h2 className="font-cinzel text-2xl font-bold tracking-[0.15em] text-white drop-shadow-2xl sm:text-3xl sm:tracking-[0.18em] md:text-4xl md:tracking-[0.2em] lg:text-5xl xl:text-6xl">
            CHRONICLES OF JOY
          </h2>
          <p className="subtitle-elegant mt-2 text-[0.65rem] tracking-[0.28em] opacity-70 sm:text-xs md:text-sm md:tracking-[0.35em]">
            SCROLL OR DRAG TO EXPLORE THE MEMORIES
          </p>
        </div>
      </div>

      <div className="relative z-20 mt-16 flex h-[min(72vh,46rem)] min-h-[42vh] w-full flex-1 sm:mt-20 md:mt-24">
        <FlyingPosters
          items={posterItems}
          planeWidth={planeWidth}
          planeHeight={planeHeight}
          distortion={4}
          scrollEase={0.05}
        />
      </div>

      <div className="bottom-button-container z-40 flex flex-col items-center gap-3 sm:gap-4">
        <p className="mb-1 max-w-md px-2 text-center text-[0.6rem] uppercase tracking-[0.2em] text-white/50 animate-pulse sm:text-[0.65rem] md:text-xs">
          EVERY MOMENT IS A MASTERPIECE
        </p>
        <button onClick={onComplete} className="btn-luxury">
          Proceed to the Cake
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[min(80vh,42rem)] w-[min(88vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
    </div>
  );
};

export default ScenePosters;
