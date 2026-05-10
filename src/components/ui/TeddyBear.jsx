import React from 'react';
import { motion } from 'framer-motion';
import teddy1 from '../../assets/teddy1.png';
import teddy2 from '../../assets/teddy2.png';
import teddy3 from '../../assets/teddy3.png';
import teddy4 from '../../assets/teddy4.png';

const images = { teddy1, teddy2, teddy3, teddy4 };

const TeddyBear = ({ type = "teddy3", delay = 0.5 }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth < 480;
  
  // Responsive sizing
  const size = isSmallMobile ? 65 : isMobile ? 85 : 160;

  // Animation config using absolute viewport units (vw/vh) for Top/Left/Right/Bottom
  const animations = {
    teddy3: { // Settles Top-Left, Comes from Bottom-Left Outside
      initial: { left: "-30vw", top: "110vh", opacity: 0, rotate: -20 },
      animate: { 
        left: isMobile ? "2vw" : "4vw", 
        top: isMobile ? "5vh" : "8vh", 
        opacity: 1, 
        rotate: 0 
      }
    },
    teddy4: { // Settles Bottom-Right, Comes from Top-Right Outside
      initial: { left: "110vw", top: "-30vh", opacity: 0, rotate: 20 },
      animate: { 
        left: isMobile ? "75vw" : "82vw", 
        top: isMobile ? "78vh" : "72vh", 
        opacity: 1, 
        rotate: 0 
      }
    }
  };

  const config = animations[type] || animations.teddy3;

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      transition={{ 
        duration: 3.5, 
        delay, 
        ease: [0.34, 1.56, 0.64, 1] 
      }}
      className="fixed pointer-events-none z-[9999]"
      style={{ width: size }}
    >
      <motion.div
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: delay + 3.5 
        }}
        className="w-full h-auto"
      >
        <img 
          src={images[type]} 
          alt={`Teddy ${type}`} 
          className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        />
      </motion.div>
    </motion.div>
  );
};

export default TeddyBear;
