import React, { useState, useEffect } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ParticleSphere } from "./OrbitGallery";
import pic1 from '../assets/pic1.jpeg';
import pic2 from '../assets/pic2.jpeg';

const galleryImages = Array.from({ length: 20 }).map((_, i) => i % 2 === 0 ? pic1 : pic2);

const SceneGallery = ({ onComplete }) => {
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContinue(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex h-full min-h-0 w-full max-w-[100vw] flex-col items-center overflow-x-hidden overflow-y-hidden">
      <div className="pointer-events-none fixed left-0 top-0 z-[100] flex w-full flex-col items-center pt-[clamp(4.5rem,14vh,7.5rem)] sm:pt-[clamp(5.5rem,16vh,8.5rem)]">
        <div className="content-wrapper flex max-w-full flex-col items-center text-center">
          <h1 className="title-cinematic font-cinzel mb-2 text-2xl leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Beautiful Memories
          </h1>
          <p className="subtitle-elegant text-[9px] sm:text-xs md:text-sm tracking-[0.4em] sm:tracking-[0.6em] opacity-90 mb-2">
            Spinning through time ✨
          </p>
          {showContinue && (
            <div className="text-white/40 text-[7px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.4em] animate-pulse">
              Drag to rotate the galaxy
            </div>
          )}
        </div>
      </div>

      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-20 pointer-events-none" />

      {/* 3D Orbit Gallery - Independent container moved to its highest position */}
      <div className="absolute inset-0 z-10 w-full h-full cursor-grab active:cursor-grabbing transform translate-y-0">
        <Canvas camera={{ position: [-15, 2, 15], fov: 40 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <ParticleSphere images={galleryImages} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      <div className="bottom-button-container">
        {showContinue && (
          <button
            onClick={onComplete}
            className="btn-luxury animate-fade-up shadow-2xl"
          >
            Explore More
          </button>
        )}
      </div>


    </div>
  );
};

export default SceneGallery;
