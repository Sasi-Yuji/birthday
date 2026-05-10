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
    AudioSys.playChime(1200);
    onStart();
  };

  return (
    <>
      <div className="content-wrapper glass-panel relative">
        <p className="kicker-text">A Special Surprise Awaits</p>
        <h1 className="title-cinematic font-cinzel">Tonight Is All About You</h1>
        <p className="subtitle-elegant mb-8">An unforgettable cinematic birthday experience.</p>

        {!showButton && (
          <div className="w-full flex flex-col items-center mt-8">
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-600 via-yellow-200 to-yellow-600 transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-button-container">
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
