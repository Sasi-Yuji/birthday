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
  const [countdownState, setCountdownState] = useState('waiting'); // 'waiting' | 'active' | 'finished'
  const [countdownVal, setCountdownVal] = useState(null);
  const [wishReady, setWishReady] = useState(false);
  const [flamesLit, setFlamesLit] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
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

    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
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
    // Start completely outside the left edge of the screen (ensured for ultra-wide monitors)
    cakeGroup.position.set(-28, 0, 0);
    cakeGroup.scale.set(0.1, 0.1, 0.1);

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

    // Sugar Pearls on Tier edges for cute details
    const pearlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    // Tier 1 upper edge pearls
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const pearlGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const pearl = new THREE.Mesh(pearlGeo, pearlMat);
      pearl.position.set(Math.cos(angle) * 3.3, 2.3, Math.sin(angle) * 3.3);
      cakeGroup.add(pearl);
    }
    // Tier 2 upper edge pearls
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const pearlGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const pearl = new THREE.Mesh(pearlGeo, pearlMat);
      pearl.position.set(Math.cos(angle) * 2.3, 4.1, Math.sin(angle) * 2.3);
      cakeGroup.add(pearl);
    }

    // Cute Strawberry on Top Center
    const strawberryGroup = new THREE.Group();
    strawberryGroup.position.set(0, 4.2, 0);
    const strawGeo = new THREE.ConeGeometry(0.3, 0.55, 16);
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xff3b5c, roughness: 0.2, metalness: 0.1 });
    const strawberry = new THREE.Mesh(strawGeo, strawMat);
    strawberry.rotation.x = Math.PI;
    strawberryGroup.add(strawberry);
    const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.18, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x32cd32, roughness: 0.6 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.32;
    stem.rotation.z = 0.25;
    strawberryGroup.add(stem);
    cakeGroup.add(strawberryGroup);

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
      const targetScale = isMobile ? 0.65 : 0.8;
      if (cakeGroup.scale.x > 0.01) {
        cakeGroup.scale.set(targetScale, targetScale, targetScale);
      }
    };
    scene.add(cakeGroup);

    // Create a glowing canvas texture for soft flame halo
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 225, 130, 1.0)');
      grad.addColorStop(0.2, 'rgba(255, 145, 45, 0.7)');
      grad.addColorStop(0.5, 'rgba(255, 80, 10, 0.25)');
      grad.addColorStop(1, 'rgba(255, 80, 10, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
    };
    const glowTexture = createGlowTexture();
    const glowMatSprite = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffaa44,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Candles initialization
    const flames = [];
    const candles = [];
    const candleOffsets = [[0, 0.5], [-1.2, -0.2], [1.2, -0.2]];

    candleOffsets.forEach((pos, i) => {
      // Candle mesh
      const cGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
      const candle = new THREE.Mesh(cGeo, new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.2
      }));
      // Start high up for drop animation
      candle.position.set(pos[0], 15, pos[1]);
      cakeGroup.add(candle);
      candles.push(candle);

      // Flame mesh (tear-drop shape)
      const fGeo = new THREE.SphereGeometry(0.45, 16, 16);
      // Translate geometry so scaling affects it from the base
      fGeo.translate(0, 0.45, 0);
      const flame = new THREE.Mesh(fGeo, new THREE.MeshBasicMaterial({ color: 0xffcc00 }));
      flame.position.set(0, 0.6, 0); // relative to candle center
      flame.scale.set(0, 0, 0); // start invisible
      flame.userData = { active: false, index: i, originalX: 0 };
      candle.add(flame);
      flames.push(flame);

      // Flame glow sprite
      const glowSprite = new THREE.Sprite(glowMatSprite);
      glowSprite.scale.set(0, 0, 0);
      glowSprite.position.set(0, 1.0, 0); // relative to candle
      glowSprite.visible = false;
      candle.add(glowSprite);
      flame.userData.glow = glowSprite;

      // Point light
      const pLight = new THREE.PointLight(0xffaa00, 0, 8);
      pLight.position.set(0, 1.0, 0); // relative to candle
      candle.add(pLight);
      flame.userData.light = pLight;
    });

    // Sparkle Particle System
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 3.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      particleSpeeds.push({
        y: 0.015 + Math.random() * 0.025,
        angleSpeed: 0.2 + Math.random() * 0.5,
        radius: radius,
        angle: angle,
        sineFreq: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Circular sparkle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    pGrad.addColorStop(0, 'rgba(255, 235, 170, 1.0)');
    pGrad.addColorStop(0.3, 'rgba(255, 200, 100, 0.7)');
    pGrad.addColorStop(1, 'rgba(255, 200, 100, 0.0)');
    pCtx.fillStyle = pGrad;
    pCtx.beginPath();
    pCtx.arc(8, 8, 8, 0, Math.PI * 2);
    pCtx.fill();

    const pTexture = new THREE.CanvasTexture(pCanvas);
    const pMat = new THREE.PointsMaterial({
      size: 0.3,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, pMat);
    scene.add(particles);

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

          // Animate flame scale and light down
          gsap.to(f.scale, { x: 0, y: 0, z: 0, duration: 0.3 });
          gsap.to(f.userData.light, { intensity: 0, duration: 0.5 });
          if (f.userData.glow) {
            gsap.to(f.userData.glow.scale, { x: 0, y: 0, z: 0, duration: 0.3 });
          }

          AudioSys.playBlow();
          if (window.createGlobalExplosion) {
            window.createGlobalExplosion(event.clientX, event.clientY, '#aaaaaa', 10);
          }
          setActiveFlames(prev => {
            const newVal = prev - 1;
            if (newVal === 0) {
              setTimeout(() => {
                AudioSys.playChime(1500);
                setShowBanner(true);
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

    // Flag to control when floating/bouncing should start
    let isFloating = false;

    // Sequence orchestrator
    const startSequence = () => {
      const isMobile = window.innerWidth < 768;
      const targetScale = isMobile ? 0.65 : 0.8;

      // 1. Move to the center and scale up with back bounce ease
      gsap.to(cakeGroup.position, {
        x: 0,
        duration: 3.2,
        ease: "back.out(1.1)"
      });

      gsap.to(cakeGroup.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 3.2,
        ease: "back.out(1.1)",
        onComplete: () => {
          isFloating = true;
          // 2. Drop the candles staggered
          dropCandles();
        }
      });
    };

    const dropCandles = () => {
      const dropDuration = 0.75;
      const staggerDelay = 0.55;

      candles.forEach((candle, idx) => {
        gsap.to(candle.position, {
          y: 4.5,
          duration: dropDuration,
          delay: idx * staggerDelay,
          ease: "bounce.out",
          onComplete: () => {
            // Play pitch adjusted chimes on landing for premium feedback
            const landingNotes = [523.25, 659.25, 783.99]; // C5, E5, G5
            AudioSys.playChime(landingNotes[idx]);

            // Cute squash and stretch bounce
            gsap.timeline()
              .to(candle.scale, { x: 1.25, y: 0.75, z: 1.25, duration: 0.1, ease: "power1.out" })
              .to(candle.scale, { x: 0.9, y: 1.1, z: 0.9, duration: 0.12, ease: "power1.inOut" })
              .to(candle.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.12, ease: "power1.inOut" });

            // Ignite flame instantly
            const flame = flames[idx];
            flame.userData.active = true;
            
            gsap.to(flame.scale, {
              x: 0.6,
              y: 1.2,
              z: 0.6,
              duration: 0.4,
              ease: "back.out(1.8)"
            });

            if (flame.userData.glow) {
              flame.userData.glow.visible = true;
              gsap.to(flame.userData.glow.scale, {
                x: 1.4,
                y: 1.8,
                z: 1.0,
                duration: 0.4,
                ease: "back.out(1.8)"
              });
            }

            gsap.to(flame.userData.light, {
              intensity: 2.2,
              duration: 0.5
            });

            // If last candle, start countdown and show hint
            if (idx === candles.length - 1) {
              setFlamesLit(true);
              setTimeout(() => {
                triggerCountdown();
              }, 600);
            }
          }
        });
      });
    };

    const triggerCountdown = () => {
      setCountdownState('active');
      setCountdownVal(3);
      AudioSys.playPop();

      setTimeout(() => {
        setCountdownVal(null);
        setTimeout(() => {
          setCountdownVal(2);
          AudioSys.playPop();

          setTimeout(() => {
            setCountdownVal(null);
            setTimeout(() => {
              setCountdownVal(1);
              AudioSys.playPop();

              setTimeout(() => {
                setCountdownVal(null);
                setCountdownState('finished');
                setTimeout(() => {
                  setWishReady(true);
                }, 300);
              }, 1000);
            }, 300);
          }, 1000);
        }, 300);
      }, 1000);
    };

    // Kick off sequence
    startSequence();

    let time = 0;
    let animationId;
    const animate = () => {
      time += 0.04;

      // Floating/bouncing effect on cake (only active after settling in center)
      if (isFloating) {
        cakeGroup.position.y = Math.sin(time * 0.45) * 0.15;
      } else {
        cakeGroup.position.y = 0;
      }
      cakeGroup.rotation.y = Math.sin(time * 0.2) * 0.08;

      // Realistic flame flicker
      flames.forEach(f => {
        if (f.userData.active) {
          const baseScaleX = 0.6;
          const baseScaleY = 1.2;
          const baseScaleZ = 0.6;

          const flickerX = baseScaleX * (0.88 + Math.random() * 0.24);
          const flickerY = baseScaleY * (0.82 + Math.random() * 0.36);
          const flickerZ = baseScaleZ * (0.88 + Math.random() * 0.24);

          f.scale.set(flickerX, flickerY, flickerZ);
          f.userData.light.intensity = 1.6 + Math.random() * 0.65;

          // Sway flame gently
          f.position.x = f.userData.originalX + Math.sin(time * 6 + f.userData.index) * 0.04;

          // Flicker glow sprite scale
          if (f.userData.glow) {
            const glowFlicker = 1.4 * (0.85 + Math.random() * 0.3);
            f.userData.glow.scale.set(glowFlicker, glowFlicker * 1.3, 1.0);
          }
        }
      });

      // Float particles
      if (particles) {
        const posArr = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const speed = particleSpeeds[i];
          posArr[i * 3 + 1] += speed.y;
          speed.angle += speed.angleSpeed * 0.01;
          const currentRadius = speed.radius + Math.sin(time * speed.sineFreq + speed.phase) * 0.15;
          posArr[i * 3] = Math.cos(speed.angle) * currentRadius;
          posArr[i * 3 + 2] = Math.sin(speed.angle) * currentRadius;

          if (posArr[i * 3 + 1] > 8) {
            posArr[i * 3 + 1] = -0.5; // Start from plate height local
            speed.angle = Math.random() * Math.PI * 2;
            speed.radius = 1 + Math.random() * 3.5;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

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
      <div className="content-wrapper pointer-events-none relative z-[60] mb-2 sm:mb-6 md:mb-8 flex flex-col items-center justify-end min-h-[100px] sm:min-h-[120px]">
        <AnimatePresence mode="wait">
          {countdownState === 'active' && countdownVal !== null && (
            <motion.div
              key={`countdown-${countdownVal}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: "drop-shadow(0 0 25px rgba(251,191,36,0.9))"
              }}
              exit={{ opacity: 0, filter: "blur(5px)", scale: 1.1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-cinzel text-8xl sm:text-9xl md:text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-500 absolute"
            >
              {countdownVal}
            </motion.div>
          )}

          {wishReady && activeFlames > 0 && (
            <motion.div
              key="wish"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="flex flex-col items-center absolute"
            >
              <h1 className="title-cinematic font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-300 drop-shadow-[0_4px_16px_rgba(251,191,36,0.5)]">
                ✨ Make a Wish ✨
              </h1>
            </motion.div>
          )}

          {activeFlames === 0 && showBanner && (
            <motion.div
              key="hbd"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center absolute"
            >
              <h1 className="title-cinematic font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-500 drop-shadow-[0_4px_20px_rgba(251,191,36,0.8)] text-center text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
                Happy Birthday To You
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex w-full flex-1 min-h-0 max-w-5xl flex-col items-center justify-center px-4 sm:px-6">
        <AnimatePresence>
          {showHint && activeFlames === 3 && flamesLit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="absolute top-[8%] sm:top-[10%] z-40 flex flex-col items-center pointer-events-none"
            >
              {/* Premium Pill Container */}
              <div className="relative group mt-2">
                {/* Animated glow background */}
                <motion.div 
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400/40 via-yellow-200/40 to-amber-400/40 opacity-70 blur-md"
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Glassmorphism Badge */}
                <div className="relative flex items-center justify-center rounded-full border border-amber-300/40 bg-white/10 px-6 py-2.5 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.2)] overflow-hidden">
                  {/* Subtle shine sweep */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-150%" }}
                    animate={{ x: "150%" }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                  />
                  
                  {/* Pulsing Text */}
                  <motion.span 
                    className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-amber-100 sm:text-xs drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Tap the flames
                  </motion.span>
                  
                  {/* Sparkles */}
                  <motion.div className="absolute top-1 left-2 text-amber-300/80 text-[8px]"
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  >✦</motion.div>
                  <motion.div className="absolute bottom-1 right-2 text-amber-300/80 text-[10px]"
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                  >✦</motion.div>
                </div>
              </div>

              {/* Bouncing Arrow */}
              <motion.div
                className="mt-3 text-amber-300 filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2.5} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* (Old elements removed in favor of single top-level container) */}

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
