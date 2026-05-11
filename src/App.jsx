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
    <div
      className="relative mx-auto h-[100dvh] min-h-0 w-full max-w-[100vw] overflow-x-hidden overflow-y-hidden bg-[#050508] text-[#F9F6EE] font-montserrat select-none"
      ref={containerRef}
    >
      <GlobalCanvas effectMode={effectMode} />

      <div className="pointer-events-auto fixed left-2 top-2 z-[9999] flex max-w-[calc(100vw-0.75rem)] flex-wrap items-center justify-end gap-1.5 sm:left-auto sm:right-3 sm:top-3 md:right-4 md:top-4 md:gap-2">
        <button
          onClick={() => goToScene(currentSceneIdx - 1)}
          className="rounded border border-white/20 bg-white/10 px-2 py-1 text-[9px] uppercase tracking-widest transition-all hover:bg-white/20 sm:px-3 sm:text-[10px]"
        >
          Prev
        </button>
        <button
          onClick={() => goToScene(currentSceneIdx + 1)}
          className="rounded border border-white/20 bg-white/10 px-2 py-1 text-[9px] uppercase tracking-widest transition-all hover:bg-white/20 sm:px-3 sm:text-[10px]"
        >
          Next
        </button>
        <div className="flex items-center rounded bg-white/5 px-1.5 py-1 font-mono text-[9px] opacity-50 sm:px-2 sm:text-[10px]">
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
