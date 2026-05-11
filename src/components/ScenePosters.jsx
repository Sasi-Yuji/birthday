import React from 'react';
import FlyingPosters from './ui/FlyingPosters';

const ScenePosters = ({ onComplete }) => {
  const posterItems = [
    'https://picsum.photos/800/1200?random=1',
    'https://picsum.photos/800/1200?random=2',
    'https://picsum.photos/800/1200?random=3',
    'https://picsum.photos/800/1200?random=4',
    'https://picsum.photos/800/1200?random=5',
    'https://picsum.photos/800/1200?random=6',
  ];

  return (
    <div className="content-wrapper flex flex-col items-center justify-center w-full h-screen relative overflow-hidden">
      {/* Header Text */}
      <div className="absolute top-12 left-0 w-full text-center z-30 pointer-events-none">
        <h2 className="text-[32px] md:text-[64px] font-cinzel font-bold text-white tracking-[0.2em] drop-shadow-2xl">
          CHRONICLES OF JOY
        </h2>
        <p className="subtitle-elegant mt-2 text-[10px] md:text-sm tracking-[0.3em] opacity-70">
          SCROLL OR DRAG TO EXPLORE THE MEMORIES
        </p>
      </div>

      {/* Main Flying Posters Container */}
      <div className="w-full h-[70vh] md:h-[80vh] relative z-20">
        <FlyingPosters 
          items={posterItems}
          planeWidth={window.innerWidth < 768 ? 240 : 400}
          planeHeight={window.innerWidth < 768 ? 320 : 550}
          distortion={4}
          scrollEase={0.05}
        />
      </div>

      {/* Footer / Continue Button */}
      <div className="bottom-button-container flex-col gap-4">
        <p className="text-[10px] md:text-xs tracking-[0.2em] text-white/50 animate-pulse mb-2">
          EVERY MOMENT IS A MASTERPIECE
        </p>
        <button 
          onClick={onComplete}
          className="btn-luxury"
        >
          Proceed to the Cake
        </button>
      </div>

      {/* Background Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508] pointer-events-none z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default ScenePosters;
