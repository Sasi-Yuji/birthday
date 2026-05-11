import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin);
}

const Butterfly = ({ targetRef, delay = 0, color1 = "#ff4579", color2 = "#ff7597", side = "left" }) => {
  const butterflyRef = useRef(null);
  const [hasLanded, setHasLanded] = useState(false);

  useEffect(() => {
    if (!targetRef || !butterflyRef.current) return;

    const butterfly = butterflyRef.current;
    
    // Initial position: Off-screen
    const startX = side === "left" ? -200 : window.innerWidth + 200;
    const startY = Math.random() * (window.innerHeight * 0.5) + (window.innerHeight * 0.2);

    gsap.set(butterfly, {
      x: startX,
      y: startY,
      opacity: 0,
      scale: 0.4,
      rotation: side === "left" ? 45 : -45
    });

    const tl = gsap.timeline({ delay: delay + 1.5 }); // Wait for letters to fully settle

    tl.to(butterfly, {
      opacity: 1,
      duration: 0.5,
    });

    // Custom path to target
    const updateTargetPosition = () => {
      if (!targetRef) return;
      const rect = targetRef.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top - 15; // Slightly above the letter

      // Random control points for a fluttery path
      const midX1 = side === "left" ? startX + 150 : startX - 150;
      const midY1 = startY - 100;
      
      const midX2 = (startX + targetX) / 2 + (side === "left" ? 100 : -100);
      const midY2 = (startY + targetY) / 2 - 200;

      tl.to(butterfly, {
        motionPath: {
          path: [
            { x: startX, y: startY },
            { x: midX1, y: midY1 },
            { x: midX2, y: midY2 },
            { x: targetX, y: targetY }
          ],
          curviness: 1.5,
          autoRotate: true
        },
        duration: 4 + Math.random() * 2,
        ease: "power1.inOut",
        scale: 0.6,
        onComplete: () => {
          setHasLanded(true);
          // Stop flight flapping
          flightFlap.kill();
          // Subtle flapping while sitting
          gsap.to(butterfly.querySelectorAll('.wing'), {
            rotateY: 75,
            duration: 0.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
          // Gentle breathing/swaying
          gsap.to(butterfly, {
            y: "-=3",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
          // Fix rotation for sitting
          gsap.to(butterfly, {
            rotation: 0,
            duration: 0.5
          });
        }
      });
    };

    // Delay slightly to ensure targetRef is positioned correctly after its own animation
    setTimeout(updateTargetPosition, 500);

    // Continuous wing flapping during flight (faster)
    const flightFlap = gsap.to(butterfly.querySelectorAll('.wing'), {
      rotateY: 85,
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    return () => {
      tl.kill();
      flightFlap.kill();
    };
  }, [targetRef, delay, side]);

  return (
    <div 
      ref={butterflyRef} 
      className="fixed pointer-events-none z-[100] w-12 h-12 flex items-center justify-center overflow-visible"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      <div className="relative w-full h-full flex items-center justify-center transform-gpu">
        {/* Body */}
        <div className="absolute w-[3px] h-8 bg-black rounded-full z-10 shadow-lg"></div>
        <div className="absolute w-[6px] h-[6px] bg-black rounded-full -top-1 z-10"></div> {/* Head */}
        
        {/* Wings - Top Layer */}
        <div className="wing left-wing absolute right-1/2 w-9 h-11 rounded-[60%_40%_40%_60%] origin-right" 
          style={{ 
            background: `linear-gradient(135deg, ${color1}, ${color2})`, 
            boxShadow: `0 0 15px ${color1}66`,
            border: '0.5px solid rgba(255,255,255,0.3)'
          }}>
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5)_0%,transparent_70%)]"></div>
          {/* Wing Patterns */}
          <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-white/40 blur-[1px]"></div>
          <div className="absolute bottom-2 right-3 w-3 h-3 rounded-full bg-black/20 blur-[1px]"></div>
        </div>
        
        <div className="wing right-wing absolute left-1/2 w-9 h-11 rounded-[40%_60%_60%_40%] origin-left" 
          style={{ 
            background: `linear-gradient(225deg, ${color1}, ${color2})`, 
            boxShadow: `0 0 15px ${color1}66`,
            border: '0.5px solid rgba(255,255,255,0.3)'
          }}>
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5)_0%,transparent_70%)]"></div>
          {/* Wing Patterns */}
          <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-white/40 blur-[1px]"></div>
          <div className="absolute bottom-2 left-3 w-3 h-3 rounded-full bg-black/20 blur-[1px]"></div>
        </div>

        {/* Lower Wings */}
        <div className="wing left-wing absolute right-1/2 top-4 w-7 h-9 rounded-[60%_40%_60%_40%] origin-right opacity-90" 
          style={{ 
            background: `linear-gradient(135deg, ${color2}, ${color1})`,
            transform: 'rotate(-25deg)',
            boxShadow: `0 0 10px ${color2}44`,
          }}>
          <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-white/30"></div>
        </div>
        <div className="wing right-wing absolute left-1/2 top-4 w-7 h-9 rounded-[40%_60%_60%_40%] origin-left opacity-90" 
          style={{ 
            background: `linear-gradient(225deg, ${color2}, ${color1})`,
            transform: 'rotate(25deg)',
            boxShadow: `0 0 10px ${color2}44`,
          }}>
          <div className="absolute bottom-1 left-2 w-1.5 h-1.5 rounded-full bg-white/30"></div>
        </div>
      </div>
    </div>
  );
};

export default Butterfly;
