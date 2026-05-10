import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import GlobalCanvas from './components/GlobalCanvas';
import SceneIntro from './components/SceneIntro';
import SceneBalloons from './components/SceneBalloons';
import SceneGallery from './components/SceneGallery';
import SceneCake from './components/SceneCake';
import ScenePuzzle from './components/ScenePuzzle';
import SceneGift from './components/SceneGift';
import SceneFinale from './components/SceneFinale';

const SCENES = [
  'intro',
  'balloons',
  'gallery',
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
      
      {SCENES.map((scene, idx) => (
        <section 
          key={scene} 
          className={`scene-container ${currentSceneIdx === idx ? 'active' : ''}`}
        >
          {currentSceneIdx === 0 && idx === 0 && <SceneIntro onStart={() => goToScene(1)} />}
          {currentSceneIdx === 1 && idx === 1 && <SceneBalloons onComplete={() => goToScene(2)} />}
          {currentSceneIdx === 2 && idx === 2 && <SceneGallery onComplete={() => goToScene(3)} />}
          {currentSceneIdx === 3 && idx === 3 && <SceneCake onComplete={() => goToScene(4)} />}
          {currentSceneIdx === 4 && idx === 4 && <ScenePuzzle onComplete={() => goToScene(5)} />}
          {currentSceneIdx === 5 && idx === 5 && <SceneGift onComplete={() => goToScene(6)} />}
          {currentSceneIdx === 6 && idx === 6 && <SceneFinale />}
        </section>
      ))}
    </div>
  );
}

export default App;
