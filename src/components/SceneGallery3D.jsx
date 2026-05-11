import React, { useEffect, useMemo, useState } from 'react';
import InfiniteGallery from "./ui/3d-gallery-photography";
import FlyingPosters from './ui/FlyingPosters';
import pic1 from '../assets/pic1.jpeg';
import pic2 from '../assets/pic2.jpeg';

const SceneGallery3D = ({ onComplete }) => {
  const images = [
    { src: pic1, alt: "Memory 1" },
    { src: pic2, alt: "Memory 2" },
    { src: pic1, alt: "Memory 3" },
    { src: pic2, alt: "Memory 4" },
    { src: pic1, alt: "Memory 5" },
    { src: pic2, alt: "Memory 6" },
  ];

  const posterImages = useMemo(
    () => [pic1, pic2, pic1, pic2, pic1, pic2],
    []
  );
  const posterImagesReversed = useMemo(
    () => [...posterImages].reverse(),
    [posterImages]
  );

  const [dims, setDims] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1024,
    h: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    const onResize = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const minDim = Math.min(dims.w, dims.h);
  const isMobile = dims.w < 768;

  const mobileFlying = useMemo(() => {
    if (minDim < 330) return { pw: 64, ph: 88, d: 2.5 };
    if (minDim < 380) return { pw: 72, ph: 98, d: 2.65 };
    if (minDim < 430) return { pw: 80, ph: 108, d: 2.75 };
    if (minDim < 520) return { pw: 88, ph: 120, d: 2.85 };
    return { pw: 100, ph: 136, d: 3 };
  }, [minDim]);

  return (
    <div className="scene-gallery-3d-root w-full h-full min-h-0 flex flex-col relative bg-[#050508] overflow-hidden">
      {/* Background decor — poster planes scale with viewport so they never dominate the frame */}
      {!isMobile ? (
        <>
          <div className="absolute top-0 left-0 w-[25%] h-full z-0 opacity-40 pointer-events-none">
            <FlyingPosters
              items={posterImages}
              planeWidth={200}
              planeHeight={280}
              distortion={2}
              scrollEase={0.03}
            />
          </div>
          <div className="absolute top-0 right-0 w-[25%] h-full z-0 opacity-40 pointer-events-none scale-x-[-1]">
            <FlyingPosters
              items={posterImagesReversed}
              planeWidth={200}
              planeHeight={280}
              distortion={2}
              scrollEase={0.03}
            />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <FlyingPosters
            items={posterImages}
            planeWidth={mobileFlying.pw}
            planeHeight={mobileFlying.ph}
            distortion={mobileFlying.d}
            scrollEase={0.03}
          />
        </div>
      )}

      <div className="gallery-3d-canvas-host relative z-10 w-full flex-1 min-h-0 flex items-stretch justify-center">
        <InfiniteGallery
          images={images}
          speed={0.8}
          className="h-full w-full min-h-[220px] max-h-full"
        />
      </div>

      <div className="absolute top-6 sm:top-8 md:top-12 left-0 w-full text-center z-30 pointer-events-none px-3 sm:px-4 max-w-[100vw]">
        <h2 className="text-[clamp(1.15rem,5.5vw,1.65rem)] sm:text-[clamp(1.5rem,4vw,2.25rem)] md:text-[64px] font-cinzel font-bold text-white tracking-[0.12em] md:tracking-[0.2em] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          CHRONICLES OF JOY
        </h2>
        <p className="text-[clamp(0.5rem,2vw,0.65rem)] sm:text-[9px] md:text-sm font-montserrat uppercase tracking-[0.28em] md:tracking-[0.4em] text-white/50 mt-1.5 md:mt-2 max-w-[min(100%,28rem)] mx-auto">
          Every moment is a beautiful story
        </p>
      </div>

      <div className="gallery-3d-hint absolute left-0 right-0 text-center z-30 pointer-events-none px-4 sm:px-6 max-w-[100vw] mx-auto">
        <div className="text-white/30 font-mono uppercase text-[clamp(0.5rem,1.8vw,0.55rem)] sm:text-[8px] md:text-[10px] font-semibold tracking-[0.2em]">
          <p>{isMobile ? 'Swipe to explore the timeline' : 'Scroll to navigate the memories'}</p>
        </div>
      </div>

      <div className="bottom-button-container bottom-button-container--gallery3d z-40">
        <button
          onClick={onComplete}
          className="btn-luxury animate-fade-up sm:px-10 sm:py-3"
        >
          Begin the Celebration
        </button>
      </div>

      {/* Gradient Vignette for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/95 pointer-events-none z-20" />
    </div>
  );
};

export default SceneGallery3D;
