import React from 'react';
import { motion } from 'framer-motion';
import teddy1 from '../../assets/teddy1.png';
import teddy2 from '../../assets/teddy2.png';
import teddy3 from '../../assets/teddy3.png';
import teddy4 from '../../assets/teddy4.png';

const images = { teddy1, teddy2, teddy3, teddy4 };

const TeddyBear = ({ type = "teddy3", delay = 0.5 }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Define animations based on teddy type
  const animations = {
    teddy3: {
      initial: { x: "-50vw", y: "110vh", opacity: 0, rotate: -15 },
      animate: { 
        x: isMobile ? "2vw" : "8vw", 
        y: isMobile ? "10vh" : "12vh", 
        opacity: 1, 
        rotate: 0 
      },
      position: "top-left"
    },
    teddy4: {
      initial: { x: "110vw", y: "-50vh", opacity: 0, rotate: 15 },
      animate: { 
        x: isMobile ? "68vw" : "80vw", 
        y: isMobile ? "72vh" : "70vh", 
        opacity: 1, 
        rotate: 0 
      },
      position: "bottom-right"
    }
  };

  const config = animations[type] || animations.teddy3;

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      transition={{ 
        duration: 2.5, 
        delay, 
        ease: [0.34, 1.56, 0.64, 1] // Custom soft ease-out-back for premium feel
      }}
      className="fixed pointer-events-none z-50"
      style={{ 
        width: isMobile ? '80px' : '150px',
        height: 'auto'
      }}
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
          delay: delay + 2.5 // Start floating after entry
        }}
        className="relative w-full h-full"
      >
        <img 
          src={images[type]} 
          alt={`Teddy ${type}`} 
          className="w-full h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
        />
      </motion.div>
    </motion.div>
  );
};

export default TeddyBear;
