import React, { useEffect } from 'react';
import gsap from 'gsap';
import './DoorTransition.css';

const DoorTransition = ({ isActive, onMiddleRevert, onTransitionComplete }) => {
  if (!isActive) return null;

  useEffect(() => {
    // 1. Initial state: Doors are ALREADY CLOSED, overlay invisible
    gsap.set('.door-transition-overlay', { backgroundColor: 'rgba(5, 5, 8, 1)', opacity: 0 });
    gsap.set('.royal-door.left', { x: '0%' });
    gsap.set('.royal-door.right', { x: '0%' });
    
    const tl = gsap.timeline();

    // 2. Fade in the closed doors over the Intro screen
    tl.to('.door-transition-overlay', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        // Swap scene behind the doors once fully covered
        if (onMiddleRevert) onMiddleRevert();
      }
    });

    // 3. Pulse the glowing center line
    tl.to('.door-border-glow', {
      boxShadow: '0 0 35px #ffd700, 0 0 70px #ffaa00',
      duration: 0.6,
      yoyo: true,
      repeat: 1
    }, "+=0.2");

    // Pause briefly before opening
    tl.to({}, { duration: 0.5 });

    // 4. Reveal/Open doors outward
    tl.to('.royal-door.left', {
      x: '-100%',
      duration: 2.5,
      ease: 'power2.inOut'
    });

    tl.to('.royal-door.right', {
      x: '100%',
      duration: 2.5,
      ease: 'power2.inOut'
    }, "<");

    // 5. Fade out overlay
    tl.to('.door-transition-overlay', {
      opacity: 0,
      duration: 1.0,
      ease: 'power2.inOut',
      onComplete: () => {
        if (onTransitionComplete) onTransitionComplete();
      }
    }, "-=1.0");

  }, [onMiddleRevert, onTransitionComplete]);

  return (
    <div className="door-transition-overlay">
      <div className="door-sparkles">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="door-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 2 + 1.5}s`
            }}
          >✨</span>
        ))}
      </div>
      
      <div className="royal-door left">
        <div className="door-inner-texture"></div>
        <div className="door-border-glow right-edge"></div>
      </div>
      <div className="royal-door right">
        <div className="door-inner-texture"></div>
        <div className="door-border-glow left-edge"></div>
      </div>
    </div>
  );
};

export default DoorTransition;
