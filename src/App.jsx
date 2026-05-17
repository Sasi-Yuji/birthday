import React, { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import gsap from 'gsap';
import GlobalCanvas from './components/GlobalCanvas';
import SceneIntro from './components/SceneIntro';
import SceneBalloons from './components/SceneBalloons';
import SceneSurprise from './components/SceneSurprise';
import ScenePasscode from './components/ScenePasscode';
import SceneGallery from './components/SceneGallery';
import ScenePosters from './components/ScenePosters';
import SceneGallery3D from './components/SceneGallery3D';
import SceneCake from './components/SceneCake';
import ScenePuzzle from './components/ScenePuzzle';
import SceneGift from './components/SceneGift';
import SceneFinale from './components/SceneFinale';
import DoorTransition from './components/DoorTransition';
import SceneGiftRoom from './components/SceneGiftRoom';

const SCENES = [
  'intro',
  'balloons',
  'giftroom',
  'surprise',
  'passcode',
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
  const [showDoorTransition, setShowDoorTransition] = useState(false);
  const containerRef = useRef(null);

  const goToScene = (index, skipAnimation = false) => {
    if (isTransitioning || index < 0 || index >= SCENES.length) return;
    setIsTransitioning(true);

    // Cinematic Door Transition specifically from intro -> balloons (0 -> 1)
    if (currentSceneIdx === 0 && index === 1) {
      setShowDoorTransition(true);
      return;
    }

    if (skipAnimation) {
      setCurrentSceneIdx(index);
      setIsTransitioning(false);
      // Ensure styles are cleared for the next scene
      gsap.set('.scene-container', { clearProps: 'opacity,scale,filter' });
      if (SCENES[index] === 'finale') setEffectMode('fireworks');
      return;
    }

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

  const handleDoorMiddleRevert = () => {
    setCurrentSceneIdx(1);
    // Initial state for the next scene behind the doors
    gsap.set('.scene-container', { 
      opacity: 0.2, 
      scale: 1.1, 
      filter: 'blur(12px)'
    });
    
    // Smooth cinematic fade + zoom as doors open
    gsap.to('.scene-container', {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 3.5,
      delay: 0.2,
      ease: 'power2.out',
      clearProps: 'all'
    });
  };

  const handleDoorTransitionComplete = () => {
    setShowDoorTransition(false);
    setIsTransitioning(false);
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
      <DoorTransition 
        isActive={showDoorTransition} 
        onMiddleRevert={handleDoorMiddleRevert} 
        onTransitionComplete={handleDoorTransitionComplete} 
      />

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
          {currentSceneIdx === 1 && idx === 1 && <SceneBalloons onComplete={() => goToScene(2)} startTrigger={!showDoorTransition} />}
          {currentSceneIdx === 2 && idx === 2 && <SceneGiftRoom onComplete={() => goToScene(3, true)} />}
          {currentSceneIdx === 3 && idx === 3 && <SceneSurprise onComplete={() => goToScene(4)} />}
          {currentSceneIdx === 4 && idx === 4 && <ScenePasscode onComplete={() => goToScene(5)} />}
          {currentSceneIdx === 5 && idx === 5 && <SceneGallery onComplete={() => goToScene(6)} />}
          {currentSceneIdx === 6 && idx === 6 && <SceneGallery3D onComplete={() => goToScene(7)} />}
          {currentSceneIdx === 7 && idx === 7 && <SceneCake onComplete={() => goToScene(8)} />}
          {currentSceneIdx === 8 && idx === 8 && <ScenePuzzle onComplete={() => goToScene(9)} />}
          {currentSceneIdx === 9 && idx === 9 && <SceneGift onComplete={() => goToScene(10)} />}
          {currentSceneIdx === 10 && idx === 10 && <SceneFinale />}
        </section>
      ))}
    </div>
  );
}

export default App;
