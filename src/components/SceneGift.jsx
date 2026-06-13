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
  const [isCardOpen, setIsCardOpen] = useState(false);
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
            setTimeout(() => setIsCardOpen(true), 800); // Trigger the 3D pop-up open animation
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
    <>
      <style>
        {`
          @keyframes flapLeft {
            0% { transform: rotateY(20deg); }
            100% { transform: rotateY(70deg); }
          }
          @keyframes flapRight {
            0% { transform: rotateY(-20deg); }
            100% { transform: rotateY(-70deg); }
          }
          .transform-style-3d {
            transform-style: preserve-3d;
          }
        `}
      </style>
      <div className="relative flex h-full min-h-0 w-full max-w-[100vw] flex-col items-center justify-between overflow-x-hidden overflow-y-hidden bg-[#050508] py-4 sm:py-6 md:py-8 lg:py-10">
      {/* Cinematic dark theme preserved */}
      <div className="ambient-aurora opacity-40" />
      
      <div className="content-wrapper pointer-events-none relative z-20 pt-2 sm:pt-4 md:pt-8">
        <h1 className="title-cinematic font-cinzel text-white drop-shadow-2xl">
          A Special Gift
        </h1>
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
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-[35%] md:top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto flex justify-center perspective-[1500px]"
            >
              <div 
                className="relative w-[160px] h-[220px] md:w-[220px] md:h-[300px] cursor-pointer" 
                onClick={() => setIsCardOpen(!isCardOpen)}
              >
                <div 
                  className="w-full h-full absolute top-0 left-0 transition-transform duration-[1.5s] ease-in-out transform-style-3d"
                  style={{ 
                    transform: isCardOpen ? 'rotateX(15deg) rotateY(-5deg) translateX(50%)' : 'rotateX(10deg) rotateY(-15deg)'
                  }}
                >
                  {/* Base (Right side / Inside Back) */}
                  <div 
                    className="absolute top-0 right-0 w-full h-full bg-[#fdfaf5] rounded-r-xl shadow-2xl flex flex-col items-center justify-center p-3 sm:p-5 border-l border-gray-200"
                    style={{ transformOrigin: 'left center' }}
                  >
                    <div className="w-full h-full border border-dashed border-[#d4af37] p-2 flex flex-col items-center justify-center text-center relative overflow-hidden">
                       <h2 className="text-sm md:text-xl font-serif text-[#8b0000] mb-2 md:mb-4">You Are Amazing</h2>
                       <p className="text-[10px] md:text-xs text-gray-700 font-serif leading-relaxed">Wishing you a year filled with elegance, joy, and endless success.</p>
                       <p className="text-[10px] md:text-xs text-gray-700 mt-2 font-serif">May all your dreams come true.</p>
                       <div className="absolute -bottom-4 -right-4 w-12 h-12 border-2 border-pink-200 rounded-full opacity-50"></div>
                       <div className="absolute -top-4 -left-4 w-16 h-16 border border-pink-200 rounded-full opacity-50"></div>
                    </div>
                  </div>

                  {/* Cover (Left side / Front) */}
                  <div 
                    className="absolute top-0 right-0 w-full h-full rounded-r-xl shadow-xl transition-transform duration-[1.5s] ease-in-out origin-left transform-style-3d z-10"
                    style={{ transform: isCardOpen ? 'rotateY(-160deg)' : 'rotateY(0deg)' }}
                  >
                    {/* Front Face of the Cover */}
                    <div 
                      className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#8b0000] to-[#4a0000] rounded-r-xl flex items-center justify-center border-l border-[#d4af37]/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="w-[85%] h-[90%] border-[0.5px] border-[#d4af37]/60 rounded-md flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                        <span className="text-[#d4af37] font-serif text-lg md:text-2xl text-center px-2 py-3 leading-relaxed tracking-widest border-y-[0.5px] border-[#d4af37]/50 bg-black/20 backdrop-blur-sm z-10">
                          A Special<br/>Gift
                        </span>
                      </div>
                    </div>
                    
                    {/* Back Face of the Cover (Inside Left) */}
                    <div 
                      className="absolute inset-0 w-full h-full bg-[#fdfaf5] rounded-l-xl flex flex-col items-center justify-center p-3 sm:p-5 border-r border-gray-200"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <div className="w-full h-full border border-dashed border-[#d4af37] p-2 flex flex-col items-center justify-center relative overflow-hidden">
                         <span className="text-xs md:text-base font-serif text-[#8b0000] mb-2 text-center relative z-10">For the best person</span>
                         <span className="text-2xl md:text-4xl text-pink-400 drop-shadow-md relative z-10 mt-1">♥</span>
                         <div className="absolute bottom-2 left-2 text-[10px] text-gray-400 font-serif italic">Always & Forever</div>
                      </div>
                    </div>
                  </div>

                  {/* Pop-up Butterfly (Center Spine) */}
                  <div 
                    className="absolute top-1/2 left-0 w-0 h-0 transition-opacity duration-1000 flex items-center justify-center pointer-events-none"
                    style={{
                       opacity: isCardOpen ? 1 : 0,
                       transformStyle: 'preserve-3d',
                       transform: 'translateZ(10px) translateY(-10px)',
                       transitionDelay: isCardOpen ? '0.5s' : '0s'
                    }}
                  >
                    <div 
                       className="relative flex items-center justify-center origin-bottom transition-transform duration-[1.5s]"
                       style={{ 
                         transform: isCardOpen ? 'scale(1.1) rotateX(-15deg)' : 'scale(0) rotateX(90deg)',
                         transitionDelay: isCardOpen ? '0.5s' : '0s'
                       }}
                    >
                      {/* Butterfly Body */}
                      <div className="w-[2px] md:w-[3px] h-10 md:h-12 bg-[#222] rounded-full absolute top-0 -left-[1px] md:-left-[1.5px] z-10 shadow-lg"></div>
                      
                      {/* Left Wing */}
                      <div 
                        className="absolute right-[1px] top-1 w-12 h-14 md:w-16 md:h-20 origin-right rounded-[60%_40%_40%_60%] bg-gradient-to-br from-[#ff4579] to-[#ff7597] shadow-[0_0_15px_rgba(255,69,121,0.6)] border-[0.5px] border-white/50"
                        style={{ animation: isCardOpen ? 'flapLeft 0.4s ease-in-out infinite alternate' : 'none' }}
                      >
                         <div className="absolute top-2 right-2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/60 blur-[1px]"></div>
                         <div className="absolute bottom-2 right-3 w-2 h-2 md:w-3 md:h-3 rounded-full bg-black/30 blur-[1px]"></div>
                      </div>
                      
                      {/* Right Wing */}
                      <div 
                        className="absolute left-[1px] top-1 w-12 h-14 md:w-16 md:h-20 origin-left rounded-[40%_60%_60%_40%] bg-gradient-to-bl from-[#ff4579] to-[#ff7597] shadow-[0_0_15px_rgba(255,69,121,0.6)] border-[0.5px] border-white/50"
                        style={{ animation: isCardOpen ? 'flapRight 0.4s ease-in-out infinite alternate' : 'none' }}
                      >
                         <div className="absolute top-2 left-2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/60 blur-[1px]"></div>
                         <div className="absolute bottom-2 left-3 w-2 h-2 md:w-3 md:h-3 rounded-full bg-black/30 blur-[1px]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
    </>
  );
};

export default SceneGift;
