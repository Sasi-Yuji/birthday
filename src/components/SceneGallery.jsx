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
    <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden">
      {/* Title */}
      <div className="content-wrapper relative z-30 pointer-events-none mt-10">
        <h1 className="title-cinematic font-cinzel text-4xl md:text-5xl drop-shadow-lg">Beautiful Memories</h1>
        <p className="subtitle-elegant">Spinning through time ✨</p>
      </div>

      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-20 pointer-events-none" />

      {/* 3D Orbit Gallery */}
      <div className="absolute inset-0 z-10 w-full h-full cursor-grab active:cursor-grabbing">
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

      {/* Button */}
      <div className="relative z-40 mt-auto mb-24 flex flex-col items-center gap-4">
        {showContinue && (
          <>
            <button 
              onClick={onComplete}
              className="btn-luxury animate-fade-in pointer-events-auto shadow-2xl"
            >
              Explore More
            </button>
            <div className="text-white/40 text-[10px] uppercase tracking-[0.3em] animate-pulse">
              Drag to rotate the galaxy
            </div>
          </>
        )}
      </div>


    </div>
  );
};

export default SceneGallery;
