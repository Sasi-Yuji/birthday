import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import GlobalCanvas from './components/GlobalCanvas';
import SceneIntro from './components/SceneIntro';
import SceneBalloons from './components/SceneBalloons';
import SceneGallery from './components/SceneGallery';
import ScenePosters from './components/ScenePosters';
import SceneGallery3D from './components/SceneGallery3D';
import SceneCake from './components/SceneCake';
import ScenePuzzle from './components/ScenePuzzle';
import SceneGift from './components/SceneGift';
import SceneFinale from './components/SceneFinale';

const SCENES = [
  'intro',
  'balloons',
  'gallery',
  'gallery3d',
  'cake',
  'puzzle',
  'gift',
  'finale'
];

function App() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [effectMode, setEffectMode] = useState('ambient');
  const containerRef = useRef(null);

  const goToScene = (index) => {
    if (isTransitioning || index < 0 || index >= SCENES.length) return;
    setIsTransitioning(true);

    const timeline = gsap.timeline({
      onComplete: () => {
        setCurrentSceneIdx(index);
        setIsTransitioning(false);
        if (SCENES[index] === 'finale') setEffectMode('fireworks');
      }
    });

    timeline.to('.scene-container.active', {
      opacity: 0,
      scale: 1.02,
      filter: 'blur(10px)',
      duration: 1,
      ease: "power2.inOut"
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isTransitioning) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      gsap.to('.scene-container.active .content-wrapper', {
        x: -x,
        y: -y,
        duration: 1,
        ease: "power2.out"
      });
      gsap.to('.ambient-aurora', {
        x: x * 2,
        y: y * 2,
        duration: 2,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTransitioning]);

  return (
    <div className="relative w-full h-screen bg-[#050508] text-[#F9F6EE] font-montserrat overflow-hidden select-none" ref={containerRef}>
      <GlobalCanvas effectMode={effectMode} />

      {/* Dev Navigation Controls */}
      <div className="fixed top-4 right-4 z-[9999] flex gap-2 pointer-events-auto">
        <button 
          onClick={() => goToScene(currentSceneIdx - 1)}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded text-[10px] uppercase tracking-widest transition-all"
        >
          Prev
        </button>
        <button 
          onClick={() => goToScene(currentSceneIdx + 1)}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded text-[10px] uppercase tracking-widest transition-all"
        >
          Next
        </button>
        <div className="bg-white/5 px-2 py-1 rounded text-[10px] font-mono opacity-50 flex items-center">
          {currentSceneIdx + 1} / {SCENES.length}
        </div>
      </div>
      
      {SCENES.map((scene, idx) => (
        <section 
          key={scene} 
          className={`scene-container ${currentSceneIdx === idx ? 'active' : ''}`}
        >
          {currentSceneIdx === 0 && idx === 0 && <SceneIntro onStart={() => goToScene(1)} />}
          {currentSceneIdx === 1 && idx === 1 && <SceneBalloons onComplete={() => goToScene(2)} />}
          {currentSceneIdx === 2 && idx === 2 && <SceneGallery onComplete={() => goToScene(3)} />}
          {currentSceneIdx === 3 && idx === 3 && <SceneGallery3D onComplete={() => goToScene(4)} />}
          {currentSceneIdx === 4 && idx === 4 && <SceneCake onComplete={() => goToScene(5)} />}
          {currentSceneIdx === 5 && idx === 5 && <ScenePuzzle onComplete={() => goToScene(6)} />}
          {currentSceneIdx === 6 && idx === 6 && <SceneGift onComplete={() => goToScene(7)} />}
          {currentSceneIdx === 7 && idx === 7 && <SceneFinale />}
        </section>
      ))}
    </div>
  );
}

export default App;
