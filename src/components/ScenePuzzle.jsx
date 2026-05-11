import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import AudioSys from '../utils/AudioSystem';
import PUZZLE_IMG from '../assets/pic1.jpeg';
import TeddyBear from './ui/TeddyBear';

const ScenePuzzle = ({ onComplete }) => {
  const [pieces, setPieces] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    let indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setPieces(indices.map((correctVal, currentPos) => ({ correctVal, currentPos })));
  }, []);

  const handlePieceClick = (index) => {
    if (isWin) return;
    if (selectedIdx === null) {
      setSelectedIdx(index);
      AudioSys.playChime(1500);
    } else {
      if (selectedIdx === index) {
        setSelectedIdx(null);
        return;
      }
      // Swap
      const newPieces = [...pieces];
      const temp = newPieces[selectedIdx].correctVal;
      newPieces[selectedIdx].correctVal = newPieces[index].correctVal;
      newPieces[index].correctVal = temp;
      
      setPieces(newPieces);
      setSelectedIdx(null);
      AudioSys.playPop();
      checkWin(newPieces);
    }
  };

  const checkWin = (currentPieces) => {
    const win = currentPieces.every((p, i) => p.correctVal === i);
    if (win) {
      setIsWin(true);
      AudioSys.playExplosion();
      if (window.createGlobalExplosion) {
        window.createGlobalExplosion(window.innerWidth / 2, window.innerHeight / 2, null, 100, true);
      }
    }
  };

  return (
    <>
      <div className="content-wrapper relative z-20 pointer-events-none">
        <p className="subtitle-elegant">Complete the picture to unlock the surprise.</p>
      </div>
      <div className="puzzle-stage relative flex flex-col items-center">
        <div className={`puzzle-grid transition-all duration-1000 ${isWin ? 'gap-0' : 'gap-[2px]'}`}>
          {pieces.map((p, i) => (
            <div
              key={i}
              className={`puzzle-piece ${selectedIdx === i ? 'selected' : ''} ${isWin ? 'border-transparent cursor-default' : ''}`}
              style={{
                backgroundImage: `url(${PUZZLE_IMG})`,
                backgroundPosition: `${(p.correctVal % 3) * 50}% ${Math.floor(p.correctVal / 3) * 50}%`,
              }}
              onClick={() => handlePieceClick(i)}
            />
          ))}
        </div>
      </div>
      <div className="bottom-button-container">
        {isWin && (
          <button onClick={onComplete} className="btn-luxury animate-fade-up">
            Unlock Surprise
          </button>
        )}
      </div>

      {/* Premium Teddy Bear Friends - Increased top-left significantly as requested */}
      <TeddyBear type="teddy3" delay={1.5} sizeMultiplier={1.6} stackReserve={0.11} />
      <TeddyBear type="teddy4" delay={2.5} sizeMultiplier={1.08} stackReserve={0.14} />
    </>
  );
};

export default ScenePuzzle;
