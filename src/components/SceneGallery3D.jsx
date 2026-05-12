import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InfiniteGallery from "./ui/3d-gallery-photography";
import FlyingPosters from './ui/FlyingPosters';
import pic1 from '../assets/pic1.jpeg';
import pic2 from '../assets/pic2.jpeg';

const ShinyText = ({ text, disabled = false, speed = 8, className = "" }) => {
  return (
    <div
      className={`text-white/80 bg-clip-text inline-block ${
        disabled ? "" : "animate-shiny-text"
      } ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </div>
  );
};

const FloatingJoyText = ({ text, direction, delay = 0, position }) => {
  const directions = {
    'top-left': { x: -30, y: -30 },
    'top-right': { x: 30, y: -30 },
    'bottom-left': { x: -30, y: 30 },
    'bottom-right': { x: 30, y: 30 },
    'left': { x: -40, y: 0 },
    'right': { x: 40, y: 0 },
  };

  const dir = directions[direction] || { x: 0, y: 0 };

  return (
    <motion.span
      initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 0.9, 0.7, 0],
        x: [0, dir.x],
        y: [0, dir.y],
        scale: [0.8, 1.05, 1.15],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      className="feminine-glow-text absolute text-[10px] sm:text-sm md:text-lg z-10 pointer-events-none"
      style={position}
    >
      <motion.span
        animate={{
          textShadow: [
            "0 0 8px rgba(255, 182, 193, 0.6)",
            "0 0 20px rgba(255, 105, 180, 0.9)",
            "0 0 8px rgba(255, 182, 193, 0.6)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
};

const FloatingStar = ({ style }) => (
  <motion.div
    className="floating-star-glow"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.6, 0],
      scale: [0, 1, 0],
      rotate: [0, 180]
    }}
    transition={{
      duration: 3 + Math.random() * 4,
      repeat: Infinity,
      delay: Math.random() * 10
    }}
    style={{
      width: Math.random() * 3 + 2 + 'px',
      height: Math.random() * 3 + 2 + 'px',
      ...style
    }}
  />
);

const SceneGallery3D = ({ onComplete }) => {
  const images = [
    { src: pic1, alt: "Memory 1" },
    { src: pic2, alt: "Memory 2" },
    { src: pic1, alt: "Memory 3" },
    { src: pic2, alt: "Memory 4" },
    { src: pic1, alt: "Memory 5" },
    { src: pic2, alt: "Memory 6" },
    { src: pic1, alt: "Memory 7" },
    { src: pic2, alt: "Memory 8" },
  ];

  const posterImages = useMemo(() => [pic1, pic2, pic1, pic2, pic1, pic2], []);
  
  const [dims, setDims] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1024,
    h: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = dims.w < 768;

  const floatingTexts = [
    { text: "Happy Birthday ✨", dir: "top-left", pos: { top: '12%', left: '8%' }, d: 0 },
    { text: "Beautiful Soul 💖", dir: "top-right", pos: { top: '15%', right: '10%' }, d: 2 },
    { text: "Princess Energy 👑", dir: "left", pos: { top: '45%', left: '5%' }, d: 4 },
    { text: "Forever Young 🌸", dir: "right", pos: { top: '48%', right: '5%' }, d: 6 },
    { text: "Shine Like a Star ✨", dir: "bottom-left", pos: { bottom: '25%', left: '12%' }, d: 8 },
    { text: "21 Years of Happiness 🎂", dir: "bottom-right", pos: { bottom: '28%', right: '8%' }, d: 1 },
    { text: "Sweet Memories 💫", dir: "top-left", pos: { top: '30%', left: '15%' }, d: 3 },
    { text: "Keep Smiling 😊", dir: "top-right", pos: { top: '35%', right: '15%' }, d: 5 },
    { text: "Born to Sparkle 💎", dir: "bottom-left", pos: { bottom: '15%', left: '8%' }, d: 7 },
    { text: "Queen of the Day 👸", dir: "bottom-right", pos: { bottom: '18%', right: '12%' }, d: 9 },
  ];

  return (
    <div className="scene-gallery-3d-root w-full h-full min-h-0 flex flex-col relative bg-[#050508] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-pink-900/10 blur-[150px] rounded-full" />
        
        {/* Floating Stars */}
        {[...Array(20)].map((_, i) => (
          <FloatingStar key={i} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
        ))}

        <div className="absolute inset-0 opacity-10">
          <FlyingPosters
            items={posterImages}
            planeWidth={isMobile ? 120 : 250}
            planeHeight={isMobile ? 160 : 340}
            distortion={2.5}
            scrollEase={0.015}
          />
        </div>
      </div>

      {/* Floating Birthday Texts */}
      <div className="absolute inset-0 z-[15] pointer-events-none">
        {floatingTexts.map((item, i) => (
          <FloatingJoyText 
            key={i} 
            text={item.text} 
            direction={item.dir} 
            delay={item.d} 
            position={item.pos} 
          />
        ))}
      </div>

      {/* Main Rotating Gallery - Central Visual Focus */}
      <div className="gallery-3d-canvas-host relative z-10 w-full flex-1 min-h-0 flex items-stretch justify-center">
        <InfiniteGallery
          images={images}
          speed={0.5}
          className="h-full w-full"
          fadeSettings={{
            fadeIn: { start: 0.02, end: 0.15 },
            fadeOut: { start: 0.88, end: 0.98 }, // Much longer visibility
          }}
          blurSettings={{
            blurIn: { start: 0.0, end: 0.05 },
            blurOut: { start: 0.9, end: 1.0 },
            maxBlur: 4.0,
          }}
        />
      </div>

      {/* Top Heading Area */}
      <div className="absolute top-10 sm:top-14 left-0 w-full text-center z-30 pointer-events-none px-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h2 className="font-cinzel font-bold text-white tracking-[0.2em] sm:tracking-[0.3em] drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]">
            <ShinyText 
              text="CHRONICLES OF JOY" 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl" 
            />
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="text-[11px] sm:text-sm md:text-base font-montserrat uppercase tracking-[0.4em] sm:tracking-[0.6em] text-white/80 mt-4 md:mt-6 italic font-light"
          >
            Every moment is a beautiful story
          </motion.p>
        </motion.div>
      </div>

      {/* Timeline Hint */}
      <div className="absolute bottom-36 left-0 w-full text-center z-30 pointer-events-none px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="text-white/60 font-mono uppercase text-[9px] md:text-[11px] tracking-[0.4em] drop-shadow-md"
        >
          {isMobile ? "Swipe to explore the timeline" : "Scroll to navigate the memories"}
        </motion.div>
      </div>

      {/* Luxury Celebration Button */}
      <div className="bottom-button-container bottom-button-container--gallery3d z-40 pb-6 sm:pb-10">
        <button
          onClick={onComplete}
          className="btn-luxury group relative overflow-hidden px-8 py-3 sm:px-12 sm:py-4 transition-all duration-500 hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.2em]">Begin The Celebration</span>
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <div className="absolute -inset-px border border-white/30 rounded-full group-hover:border-white/60 transition-colors" />
        </button>
      </div>

      {/* Deep Cinematic Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 pointer-events-none z-20" />
    </div>
  );
};

export default SceneGallery3D;
