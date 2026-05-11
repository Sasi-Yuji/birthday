import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Hand } from 'lucide-react';
import AudioSys from '../utils/AudioSystem';

const SceneGift = ({ onComplete }) => {
  const containerRef = useRef(null);
  const [showHint, setShowHint] = useState(true);
  const [showCardContent, setShowCardContent] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const openedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, isMobile ? 7 : 6, isMobile ? 15 : 12);
    camera.lookAt(0, 2.5, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambient);
    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 1.0);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const spotLight = new THREE.SpotLight(0xffffff, 5);
    spotLight.position.set(10, 20, 10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Materials - Premium Red & Green Theme
    const boxMat = new THREE.MeshStandardMaterial({ 
      color: 0xee0a24, // Premium Red
      roughness: 0.1, 
      metalness: 0.1,
      emissive: 0x440000,
      emissiveIntensity: 0.1
    });
    const ribbonMat = new THREE.MeshStandardMaterial({ 
      color: 0x004d00, // Premium Green
      roughness: 0.2, 
      metalness: 0.3,
      emissive: 0x002200,
      emissiveIntensity: 0.05
    });
    const cardMat = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.0,
      emissive: 0x444444,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 1
    });

    // Gift Construction
    const giftGroup = new THREE.Group();
    const scale = isMobile ? 0.8 : 1.0;
    giftGroup.scale.set(scale, scale, scale);
    scene.add(giftGroup);

    // Base
    const baseGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(3.6, 3, 3.6);
    const baseMesh = new THREE.Mesh(baseGeo, boxMat);
    baseMesh.position.y = 1.5;
    baseMesh.castShadow = true;
    baseGroup.add(baseMesh);

    // Ribbons
    const ribVGeo = new THREE.BoxGeometry(0.5, 3.02, 3.62);
    const ribVMesh = new THREE.Mesh(ribVGeo, ribbonMat);
    ribVMesh.position.y = 1.5;
    baseGroup.add(ribVMesh);

    const ribHGeo = new THREE.BoxGeometry(3.62, 3.02, 0.5);
    const ribHMesh = new THREE.Mesh(ribHGeo, ribbonMat);
    ribHMesh.position.y = 1.5;
    baseGroup.add(ribHMesh);

    giftGroup.add(baseGroup);

    // Lid
    const lidGroup = new THREE.Group();
    lidGroup.position.y = 3;

    const lidGeo = new THREE.BoxGeometry(3.8, 0.8, 3.8);
    const lidMesh = new THREE.Mesh(lidGeo, boxMat);
    lidMesh.position.y = 0.4;
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    const lidRibVGeo = new THREE.BoxGeometry(0.52, 0.82, 3.82);
    const lidRibVMesh = new THREE.Mesh(lidRibVGeo, ribbonMat);
    lidRibVMesh.position.y = 0.4;
    lidGroup.add(lidRibVMesh);

    const lidRibHGeo = new THREE.BoxGeometry(3.82, 0.82, 0.52);
    const lidRibHMesh = new THREE.Mesh(lidRibHGeo, ribbonMat);
    lidRibHMesh.position.y = 0.4;
    lidGroup.add(lidRibHMesh);

    // Bow
    const bowGroup = new THREE.Group();
    bowGroup.position.y = 0.8;
    const bowGeo = new THREE.TorusGeometry(0.5, 0.12, 16, 32);
    const bow1 = new THREE.Mesh(bowGeo, ribbonMat);
    bow1.rotation.x = Math.PI / 2;
    bow1.rotation.y = Math.PI / 4;
    bow1.position.set(0.3, 0.2, 0.3);
    bowGroup.add(bow1);

    const bow2 = new THREE.Mesh(bowGeo, ribbonMat);
    bow2.rotation.x = Math.PI / 2;
    bow2.rotation.y = -Math.PI / 4;
    bow2.position.set(-0.3, 0.2, -0.3);
    bowGroup.add(bow2);
    
    const bowCenterGeo = new THREE.SphereGeometry(0.25, 32, 32);
    const bowCenter = new THREE.Mesh(bowCenterGeo, ribbonMat);
    bowCenter.position.y = 0.2;
    bowGroup.add(bowCenter);

    lidGroup.add(bowGroup);
    giftGroup.add(lidGroup);

    // 3D Card
    const cardGroup = new THREE.Group();
    cardGroup.position.y = 1.0; // Start lower, inside the box
    cardGroup.scale.set(0, 0, 0);
    
    const cardWidth = isMobile ? 3.4 : 4.2;
    const cardHeight = isMobile ? 5.2 : 7.0;
    const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, 0.04);
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardGroup.add(cardMesh);

    // Removed green rim as per user request

    cardGroup.position.z = 0; // Center it inside the box
    scene.add(cardGroup);

    // Interaction State
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const openGift = (clientX, clientY) => {
      openedRef.current = true;
      setShowHint(false);
      
      AudioSys.playChime(800);
      setTimeout(() => AudioSys.playChime(1200), 200);

      if (window.createGlobalExplosion) {
        window.createGlobalExplosion(clientX, clientY, '#004d00', 80, true);
        setTimeout(() => window.createGlobalExplosion(clientX, clientY, '#ee0a24', 50), 200);
      }
      
      // Animations
      gsap.to(lidGroup.position, {
        y: isMobile ? 8 : 9.5, 
        x: isMobile ? 3.5 : 5, 
        z: 1, 
        duration: 2, 
        ease: "power2.out"
      });
      gsap.to(lidGroup.rotation, {
        x: 0.4, y: -0.4, z: 0.2, duration: 2, ease: "power2.out"
      });

      // Add a subtle floating animation to the lid
      gsap.to(lidGroup.position, {
        y: "+=0.5",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2
      });

      gsap.to(giftGroup.rotation, {
        x: 0, y: 0, z: 0, duration: 1, ease: "power2.out"
      });

      // Card flyout - starts from inside
      gsap.to(cardGroup.scale, {
        x: 1, y: 1, z: 1, duration: 1.5, ease: "power2.out", delay: 0.6
      });
      gsap.to(cardGroup.position, {
        y: isMobile ? 5.2 : 6.2, duration: 1.8, ease: "power2.out", delay: 0.6,
        onStart: () => {
          // Trigger the 2D image appearance slightly before the 3D card reaches the top
          setTimeout(() => {
            setShowCardContent(true);
            gsap.to(cardMat, { opacity: 0, duration: 0.6 });
          }, 600);
        }
      });
      gsap.to(cardGroup.rotation, {
        y: Math.PI * 4, duration: 2.5, ease: "power2.out", delay: 0.6,
        onComplete: () => {
          setTimeout(() => setShowContinue(true), 400);
        }
      });
    };

    const handlePointerDown = (event) => {
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      isDragging = true;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerMove = (event) => {
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;

      if (isDragging && !openedRef.current) {
        const deltaMove = {
          x: clientX - previousMousePosition.x,
          y: clientY - previousMousePosition.y
        };
        targetRotationY += deltaMove.x * 0.01;
        targetRotationX += deltaMove.y * 0.01;
        targetRotationX = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, targetRotationX));
        previousMousePosition = { x: clientX, y: clientY };
      }
    };

    const handlePointerUp = (event) => {
      isDragging = false;
      if (!openedRef.current) {
        const clientX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
        const clientY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
        const rect = container.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(giftGroup, true);
        if (intersects.length > 0) openGift(clientX, clientY);
      }
    };

    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('touchstart', handlePointerDown, { passive: false });
    container.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    let time = 0;
    const animate = () => {
      time += 0.02;
      if (!openedRef.current) {
        giftGroup.position.y = Math.sin(time) * 0.2;
        if (!isDragging) targetRotationY += 0.005;
        giftGroup.rotation.y += (targetRotationY - giftGroup.rotation.y) * 0.1;
        giftGroup.rotation.x += (targetRotationX - giftGroup.rotation.x) * 0.1;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      container.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-h-screen relative overflow-hidden bg-[#050508]">
      {/* Cinematic dark theme preserved */}
      <div className="ambient-aurora opacity-40" />
      
      <div className="content-wrapper relative z-20 pointer-events-none pt-6 md:pt-10">
        <h1 className="title-cinematic font-cinzel text-3xl md:text-5xl lg:text-6xl text-white drop-shadow-2xl">A Special Gift</h1>
        <p className="subtitle-elegant mt-2 text-white/70">Because today is your day.</p>
      </div>

      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-0">
        <AnimatePresence>
          {showHint && !openedRef.current && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/4 md:top-1/3 z-30 flex flex-col items-center pointer-events-none"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-3">
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/90 font-bold flex items-center gap-2">
                  <Hand size={14} className="text-green-500" /> Drag to rotate, tap to open
                </span>
              </div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowDown className="text-green-500" size={28} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          ref={containerRef} 
          className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        />

        <AnimatePresence>
          {showCardContent && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 60 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: [0, -15, 0],
              }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                default: { duration: 0.8, ease: "easeOut" }
              }}
              className="absolute top-[30%] md:top-[32%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-[85%] max-w-[280px] md:max-w-[420px] pointer-events-auto"
            >
              <img 
                src="/luxury_birthday_card.png" 
                alt="Birthday Card" 
                className="w-full h-auto drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] rounded-lg"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bottom-button-container">
        {showContinue && (
          <button 
            onClick={onComplete} 
            className="btn-luxury animate-fade-up shadow-xl"
          >
            Continue To Finale
          </button>
        )}
      </div>
    </div>
  );
};

export default SceneGift;
