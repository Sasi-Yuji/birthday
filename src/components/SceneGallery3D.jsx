import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pic1 from '../assets/pic1.jpeg';
import pic2 from '../assets/pic2.jpeg';

const StaggeredTitle = ({ text }) => {
  const letters = text.toUpperCase().split("");
  return (
    <h1 className="gallery3d-title flex flex-nowrap justify-center font-cinzel font-black">
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
          className="text-white drop-shadow-2xl"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h1>
  );
};

const OrbitingPhoto = ({ src, index, total, radius, speed, size, isMobile }) => {
  const finalSize = isMobile ? 76 : size;
  const finalRadius = isMobile ? 86 : radius;
  const angleStep = (Math.PI * 2) / total;
  const initialAngle = index * angleStep;
  const initialAngleDeg = (initialAngle * 180) / Math.PI;

  return (
    <motion.div
      animate={{ rotate: [initialAngleDeg, initialAngleDeg + 360] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      className="absolute flex items-center justify-center pointer-events-none"
      style={{ width: finalRadius * 2, height: finalRadius * 2 }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          rotate: [-initialAngleDeg, -initialAngleDeg - 360],
        }}
        transition={{
          scale: { delay: index * 0.2 + 1, duration: 1 },
          opacity: { delay: index * 0.2 + 1, duration: 1 },
          rotate: { duration: speed, repeat: Infinity, ease: "linear" },
        }}
        className="absolute glass-card-premium rounded-xl pointer-events-auto shadow-2xl"
        style={{ 
          width: finalSize, 
          height: finalSize * 1.3,
          top: -finalSize / 2, // Center the image on the orbital path
          left: '50%',
          marginLeft: -finalSize / 2
        }}
      >
        <img src={src} className="w-full h-full object-cover rounded-xl" alt="Memory" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-xl" />
      </motion.div>
    </motion.div>
  );
};

const birthdayQuotes = [
  'Happy Birthday ✨',
  'Beautiful Soul 💖',
  'Princess Energy 👑',
  'Forever Young 🌸',
  'Shine Like a Star ✨',
  '21 Years of Happiness 🎂',
  'Sweet Memories 💫',
  'Keep Smiling 😊',
  'Born to Sparkle 💎',
  'Queen of the Day 👸'
];

const BirthdayQuoteCycle = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setQuoteIndex(current => (current + 1) % birthdayQuotes.length);
    }, 2600);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="gallery3d-quote-band">
      <AnimatePresence mode="wait">
        <motion.p
          key={birthdayQuotes[quoteIndex]}
          initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
          transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="gallery3d-floating-quote"
        >
          {birthdayQuotes[quoteIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

const SceneGallery3D = ({ onComplete }) => {
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

  const photos = useMemo(() => [
    { src: pic1 }, { src: pic2 }, { src: pic1 }, { src: pic2 }, { src: pic1 }
  ], []);

  return (
    <div className="scene-gallery-3d-root w-full h-full relative bg-[#010103] overflow-hidden flex flex-col items-center">
      {/* Background VFX */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 via-transparent to-blue-900/20" />
      </div>

      {/* 1. CHRONICLES OF JOY - FIXED TOP */}
      <div className="gallery3d-header absolute top-10 sm:top-16 w-full text-center z-30 px-4">
        <StaggeredTitle text="CHRONICLES OF JOY" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.2 }}
          className="gallery3d-subtitle mt-4 text-[9px] sm:text-xs tracking-[0.4em] text-white/90 font-bold uppercase"
        >
          A Timeless Celebration
        </motion.p>
      </div>

      <BirthdayQuoteCycle />

      {/* 2. ORBITING GALLERY - CENTERED */}
      <div className="gallery3d-orbit-stage absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="gallery3d-orbit-core relative flex items-center justify-center">
          {photos.map((photo, i) => (
            <OrbitingPhoto 
              key={i}
              index={i}
              total={photos.length}
              src={photo.src}
              radius={isMobile ? 86 : 320}
              speed={isMobile ? 25 : 40}
              size={isMobile ? 76 : 200}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>

      {/* 3. DESKTOP QUOTE - BELOW GALLERY */}
      <div className="gallery3d-desktop-quote absolute bottom-32 sm:bottom-40 w-full text-center z-30 px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="text-white font-instrument-serif italic text-base sm:text-2xl md:text-3xl font-bold uppercase tracking-wider drop-shadow-lg"
        >
          "Your light shines brighter than the stars"
        </motion.h2>
      </div>

      {/* 4. BUTTON - BOTTOM */}
      <div className="absolute bottom-10 sm:bottom-16 z-40">
        <motion.button
          onClick={onComplete}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 sm:px-16 sm:py-5 glass-card-premium rounded-full text-white tracking-[0.3em] text-[10px] sm:text-xs font-black uppercase"
        >
          CONTINUE
        </motion.button>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none z-20" />
    </div>
  );
};

export default SceneGallery3D;
