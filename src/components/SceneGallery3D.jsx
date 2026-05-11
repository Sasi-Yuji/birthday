import React from 'react';
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

  const posterImages = [pic1, pic2, pic1, pic2, pic1, pic2];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="w-full h-screen relative bg-[#050508] overflow-hidden">
      {/* Background Decor - Flying Posters positioned around the gallery */}
      {!isMobile ? (
        <>
          {/* Left Column */}
          <div className="absolute top-0 left-0 w-[25%] h-full z-0 opacity-40 pointer-events-none">
            <FlyingPosters 
              items={posterImages}
              planeWidth={200}
              planeHeight={280}
              distortion={2}
              scrollEase={0.03}
            />
          </div>
          {/* Right Column */}
          <div className="absolute top-0 right-0 w-[25%] h-full z-0 opacity-40 pointer-events-none scale-x-[-1]">
            <FlyingPosters 
              items={posterImages.reverse()}
              planeWidth={200}
              planeHeight={280}
              distortion={2}
              scrollEase={0.03}
            />
          </div>
        </>
      ) : (
        /* Mobile: Single subtle background layer */
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <FlyingPosters 
            items={posterImages}
            planeWidth={120}
            planeHeight={160}
            distortion={3}
            scrollEase={0.03}
          />
        </div>
      )}

      {/* Main 3D Gallery - Centered */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <InfiniteGallery
          images={images}
          speed={0.8}
          className="h-full w-full"
        />
      </div>
      
      {/* Cinematic Header Overlay */}
      <div className="absolute top-8 md:top-12 left-0 w-full text-center z-30 pointer-events-none px-4">
        <h2 className="text-[24px] md:text-[64px] font-cinzel font-bold text-white tracking-[0.2em] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          CHRONICLES OF JOY
        </h2>
        <p className="text-[8px] md:text-sm font-montserrat uppercase tracking-[0.4em] text-white/50 mt-2">
          Every moment is a beautiful story
        </p>
      </div>

      {/* Mobile-optimized Instructions */}
      <div className="absolute bottom-24 md:bottom-32 left-0 right-0 text-center z-30 pointer-events-none px-6">
        <div className="text-white/30 font-mono uppercase text-[7px] md:text-[10px] font-semibold tracking-[0.2em] space-y-1">
          <p>{isMobile ? 'Swipe to explore the timeline' : 'Scroll to navigate the memories'}</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="bottom-button-container z-40 mb-4 md:mb-0">
        <button 
          onClick={onComplete}
          className="btn-luxury px-10 py-3 text-[10px] md:text-xs"
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
