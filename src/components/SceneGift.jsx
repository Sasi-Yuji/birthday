import React, { useState } from 'react';
import gsap from 'gsap';
import AudioSys from '../utils/AudioSystem';

const SceneGift = ({ onComplete }) => {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    AudioSys.playChime(800);
    setTimeout(() => AudioSys.playChime(1200), 200);

    if (window.createGlobalExplosion) {
      const rect = document.getElementById('gift-box').getBoundingClientRect();
      window.createGlobalExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, '#D4AF37', 50);
    }

    setTimeout(onComplete, 6000);
  };

  return (
    <>
      <div className="content-wrapper pointer-events-none">
        <h1 className="title-cinematic font-cinzel text-4xl md:text-5xl">A Special Gift For You</h1>
        <p className="subtitle-elegant">Because today is your day. Tap to open.</p>
      </div>
      <div className="gift-stage" id="gift-box" onClick={handleOpen}>
        <div className="gift-base">
          <div className="ribbon ribbon-v"></div>
          <div className="ribbon ribbon-h"></div>
        </div>
        <div 
          className="gift-lid" 
          style={{ 
            transform: opened ? 'translateY(-120px) rotateX(45deg) rotateZ(15deg)' : 'none',
            opacity: opened ? 0 : 1
          }}
        >
          <div className="ribbon ribbon-v"></div>
          <div className="ribbon ribbon-h"></div>
        </div>
        <div 
          className={`gift-message transition-all duration-1000 ${opened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="glass-panel p-6 text-center w-64 absolute -top-10">
            <h3 className="font-cinzel text-xl text-gold mb-2">You Are Amazing</h3>
            <p className="text-xs font-light leading-relaxed text-gray-300">
              Wishing you a year filled with elegance, joy, and endless success.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SceneGift;
