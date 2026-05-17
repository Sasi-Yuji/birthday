import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import AudioSys from '../utils/AudioSystem';
import TeddyBear from './ui/TeddyBear';

const SceneCake = ({ onComplete }) => {
  const containerRef = useRef(null);
  const [activeFlames, setActiveFlames] = useState(3);
  const [showContinue, setShowContinue] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const sceneRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    // Adjusted camera lookAt to center the cake better vertically
    camera.position.set(0, 5, 14);
    camera.lookAt(0, 2.2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);
    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const spotLight = new THREE.SpotLight(0xffffff, 3);
    spotLight.position.set(10, 20, 10);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    const cakeGroup = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(4.5, 4.8, 0.2, 64);
    const plateMat = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc, 
      metalness: 0.9, 
      roughness: 0.1 
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.receiveShadow = true;
    cakeGroup.add(plate);

    // Main Cake Tiers
    const cakeColor = 0xff8da1;
    const creamMat = new THREE.MeshStandardMaterial({ 
      color: cakeColor, 
      roughness: 0.3,
      metalness: 0.1,
      emissive: cakeColor,
      emissiveIntensity: 0.1
    });

    const t1Geo = new THREE.CylinderGeometry(3.5, 3.5, 2.2, 64);
    const t1 = new THREE.Mesh(t1Geo, creamMat);
    t1.position.y = 1.2;
    t1.castShadow = true; t1.receiveShadow = true;
    cakeGroup.add(t1);

    const t2Geo = new THREE.CylinderGeometry(2.5, 2.5, 1.8, 64);
    const t2 = new THREE.Mesh(t2Geo, creamMat);
    t2.position.y = 3.2;
    t2.castShadow = true; t2.receiveShadow = true;
    cakeGroup.add(t2);

    // Frosting
    const dripMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const dripGeo = new THREE.CylinderGeometry(2.55, 2.55, 0.4, 64);
    const drip = new THREE.Mesh(dripGeo, dripMat);
    drip.position.y = 4.0;
    cakeGroup.add(drip);

    const goldMat = new THREE.MeshStandardMaterial({ 
      color: 0xD4AF37, 
      metalness: 0.9, 
      roughness: 0.1,
      emissive: 0xD4AF37,
      emissiveIntensity: 0.1
    });
    const ribbonGeo = new THREE.CylinderGeometry(3.55, 3.55, 0.3, 64);
    const ribbon = new THREE.Mesh(ribbonGeo, goldMat);
    ribbon.position.y = 0.5;
    cakeGroup.add(ribbon);

    const ribbon2Geo = new THREE.CylinderGeometry(2.55, 2.55, 0.25, 64);
    const ribbon2 = new THREE.Mesh(ribbon2Geo, goldMat);
    ribbon2.position.y = 2.6;
    cakeGroup.add(ribbon2);
    
    // Scale cake proportionally
    const updateScale = () => {
      const isMobile = window.innerWidth < 768;
      const cakeScale = isMobile ? 0.65 : 0.8;
      cakeGroup.scale.set(cakeScale, cakeScale, cakeScale);
    };
    updateScale();
    scene.add(cakeGroup);

    const flames = [];
    const candleOffsets = [[0, 0.5], [-1.2, -0.2], [1.2, -0.2]];
    candleOffsets.forEach((pos, i) => {
      const cGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
      const candle = new THREE.Mesh(cGeo, new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.2
      }));
      candle.position.set(pos[0], 4.5, pos[1]);
      cakeGroup.add(candle);

      const fGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const flame = new THREE.Mesh(fGeo, new THREE.MeshBasicMaterial({ color: 0xffcc00 }));
      flame.position.set(pos[0], 5.2, pos[1]);
      flame.userData = { active: true, index: i };
      cakeGroup.add(flame);
      flames.push(flame);

      const pLight = new THREE.PointLight(0xffaa00, 2, 8);
      pLight.position.set(pos[0], 5.2, pos[1]);
      cakeGroup.add(pLight);
      flame.userData.light = pLight;
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(flames);

      if (intersects.length > 0) {
        const f = intersects[0].object;
        if (f.userData.active) {
          f.userData.active = false;
          setShowHint(false);
          gsap.to(f.scale, { x: 0, y: 0, z: 0, duration: 0.3 });
          gsap.to(f.userData.light, { intensity: 0, duration: 0.5 });
          AudioSys.playBlow();
          if (window.createGlobalExplosion) {
            window.createGlobalExplosion(event.clientX, event.clientY, '#aaaaaa', 10);
          }
          setActiveFlames(prev => {
            const newVal = prev - 1;
            if (newVal === 0) {
              setTimeout(() => {
                AudioSys.playChime(1500);
                setShowContinue(true);
              }, 1000);
            }
            return newVal;
          });
        }
      }
    };

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateScale();
    };

    container.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    let time = 0;
    let animationId;
    const animate = () => {
      time += 0.05;
      cakeGroup.rotation.y = Math.sin(time * 0.2) * 0.1;
      flames.forEach(f => {
        if (f.userData.active) {
          const s = 1 + Math.random() * 0.2;
          f.scale.set(s, s + Math.random() * 0.4, s);
          f.userData.light.intensity = 1.2 + Math.random() * 0.4;
        }
      });
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="flex w-full h-full flex-col items-center justify-center py-6 sm:py-10 md:py-12">
      <div className="content-wrapper pointer-events-none relative z-20 mb-4 sm:mb-8 md:mb-10">
        <h1 className="title-cinematic font-cinzel">Make A Wish</h1>
        <p className="subtitle-elegant">Tap the flames to blow out the candles.</p>
      </div>

      <div className="relative flex w-full flex-1 min-h-0 max-w-5xl flex-col items-center justify-center px-4 sm:px-6">
        <AnimatePresence>
          {showHint && activeFlames === 3 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-[25px] z-30 flex flex-col items-center pointer-events-none sm:top-[35px]"
            >
              <div className="mb-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-white/90 sm:text-[11px]">
                  Tap the flames
                </span>
              </div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="h-7 w-7 text-pink-400 sm:h-9 sm:w-9" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          id="cake-canvas-container"
          ref={containerRef}
          className="relative z-10 w-full flex-1 min-h-0 max-w-4xl cursor-pointer"
        />
      </div>

      <div className="bottom-button-container h-24 sm:h-32">
        {showContinue && (
          <button onClick={onComplete} className="btn-luxury animate-fade-up">
            Continue The Celebration
          </button>
        )}
      </div>

      <TeddyBear type="teddy3" delay={1.2} sizeMultiplier={1.4} stackReserve={0.12} />
      <TeddyBear type="teddy4" delay={2.2} sizeMultiplier={1.3} stackReserve={0.18} />
    </div>
  );
};

export default SceneCake;
