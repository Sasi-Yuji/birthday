import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import AudioSys from '../utils/AudioSystem';

const SceneIntro = ({ onStart }) => {
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const tl = gsap.to({}, {
      duration: 2,
      onUpdate: function() {
        setProgress(this.progress() * 100);
      },
      onComplete: () => {
        setShowButton(true);
      }
    });
    return () => tl.kill();
  }, []);

  const handleStart = () => {
    AudioSys.init();
    AudioSys.playBGM();
    AudioSys.playChime(1200);
    onStart();
  };

  return (
    <>
      <div className="content-wrapper glass-panel relative w-full max-w-lg sm:max-w-xl md:max-w-2xl">
        <p className="kicker-text">A Special Surprise Awaits</p>
        <h1 className="title-cinematic font-cinzel">Tonight Is All About You</h1>
        <p className="subtitle-elegant mb-6 sm:mb-8">An unforgettable cinematic birthday experience.</p>

        {!showButton && (
          <div className="mt-6 flex w-full max-w-[min(20rem,85vw)] flex-col items-center sm:mt-8">
            <div className="h-1 w-full rounded-full bg-gray-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-600 via-yellow-200 to-yellow-600 transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-button-container bottom-button-container--intro">
        {showButton && (
          <button 
            onClick={handleStart}
            className="btn-luxury animate-fade-up"
          >
            Begin Experience
          </button>
        )}
      </div>
    </>
  );
};

export default SceneIntro;
