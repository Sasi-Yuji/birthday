import React, { useState } from 'react';
import gsap from 'gsap';
import './SceneGiftRoom.css';

const SceneGiftRoom = ({ onComplete }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleEnter = () => {
    if (isOpened) return;
    setIsOpened(true);
    
    // 1. Door slightly opens more
    gsap.to('.cute-door', {
      rotateY: 100,
      duration: 1.2,
      ease: 'power2.inOut'
    });

    // 2. Screen zooms inward smoothly and blurs
    gsap.to('.gift-room-container', {
      scale: 1.5,
      filter: 'blur(12px)',
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        onComplete();
      }
    });
  };

  return (
    <div className="gift-room-root">
      {/* Background Sparkles */}
      <div className="gift-sparkles-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="gift-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >✨</span>
        ))}
      </div>

      <div className="gift-room-container">
        <h1 className="gift-room-title">The Gift Room</h1>
        
        <div className="cute-door-wrapper">
          {/* Inner Room background */}
          <div className="cute-room-inside">
            {/* Peeking Cats */}
            <div className="peeking-cats">
              <div className="cat white-cat">
                <div className="cat-ear left"></div>
                <div className="cat-ear right"></div>
                <div className="cat-face">
                  <div className="cat-eye left"></div>
                  <div className="cat-eye right"></div>
                  <div className="cat-nose"></div>
                  <div className="cat-blush left"></div>
                  <div className="cat-blush right"></div>
                </div>
              </div>
              <div className="cat orange-cat">
                <div className="cat-ear left"></div>
                <div className="cat-ear right"></div>
                <div className="cat-face">
                  <div className="cat-eye left"></div>
                  <div className="cat-eye right"></div>
                  <div className="cat-nose"></div>
                  <div className="cat-blush left"></div>
                  <div className="cat-blush right"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Actual Door */}
          <div className="cute-door">
            <div className="door-panel top"></div>
            <div className="door-panel bottom"></div>
            <div className="door-knob"></div>
          </div>
        </div>

        <button 
          className="enter-room-btn" 
          onClick={handleEnter}
          disabled={isOpened}
        >
          Enter The Room
        </button>
      </div>
    </div>
  );
};

export default SceneGiftRoom;
