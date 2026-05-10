import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import AudioSys from '../utils/AudioSystem';

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
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 14);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
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

    // Main Cake Tiers with color
    const cakeColor = 0xff8da1; // Vibrant Strawberry Pink
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

    // Frosting/Drip Detail
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
      scene.add(candle);

      const fGeo = new THREE.SphereGeometry(0.25, 16, 16); // Increased flame size
      const flame = new THREE.Mesh(fGeo, new THREE.MeshBasicMaterial({ color: 0xffcc00 }));
      flame.position.set(pos[0], 5.2, pos[1]);
      flame.userData = { active: true, index: i };
      scene.add(flame);
      flames.push(flame);

      const pLight = new THREE.PointLight(0xffaa00, 2, 8);
      pLight.position.set(pos[0], 5.2, pos[1]);
      scene.add(pLight);
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
          setShowHint(false); // Hide hint on first interaction
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

    container.addEventListener('click', handleClick);

    let time = 0;
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
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div className="content-wrapper relative z-20 pointer-events-none">
        <h1 className="title-cinematic font-cinzel">Make A Wish</h1>
        <p className="subtitle-elegant">Tap the flames to blow out the candles.</p>
      </div>

      <div className="relative w-full flex flex-col items-center">
        <AnimatePresence>
          {showHint && activeFlames === 3 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-[10%] z-30 flex flex-col items-center pointer-events-none"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-2">
                <span className="text-[10px] uppercase tracking-widest text-white/80 font-bold">Tap the flames</span>
              </div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="text-pink-400" size={32} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div id="cake-canvas-container" ref={containerRef} className="w-full h-[45vh] min-h-[350px] relative mt-4 cursor-pointer z-10" />
      </div>

      <div className="relative z-40 mt-6">
        {showContinue && (
          <button onClick={onComplete} className="btn-luxury animate-fade-in pointer-events-auto">
            Continue The Celebration
          </button>
        )}
      </div>
    </>
  );
};

export default SceneCake;
