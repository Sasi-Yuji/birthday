import React, { useEffect, useRef } from 'react';
import AudioSys from '../utils/AudioSystem';

const GlobalCanvas = ({ effectMode }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const fireworks = useRef([]);
  const stars = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars.current = [];
      for (let i = 0; i < 100; i++) {
        stars.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          s: Math.random() * 1.5,
          a: Math.random(),
          speed: Math.random() * 0.1 + 0.05,
        });
      }
    };

    class Particle {
      constructor(x, y, color, isConfetti = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isConfetti = isConfetti;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isConfetti ? 8 : 4) + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + (isConfetti ? 0.005 : 0.015);
        this.gravity = isConfetti ? 0.2 : 0.05;
        this.size = isConfetti ? Math.random() * 6 + 4 : Math.random() * 3 + 1;
        this.angle = Math.random() * 360;
        this.spin = (Math.random() - 0.5) * 10;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= this.decay;
        this.angle += this.spin;
      }
      draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        if (this.isConfetti) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate((this.angle * Math.PI) / 180);
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }
    }

    class Firework {
      constructor(width, height) {
        this.x = Math.random() * width;
        this.y = height;
        this.targetY = Math.random() * (height * 0.4) + height * 0.1;
        this.speed = Math.random() * 4 + 6;
        this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        this.exploded = false;
      }
      update() {
        if (!this.exploded) {
          this.y -= this.speed;
          if (this.y <= this.targetY) {
            this.exploded = true;
            return true;
          }
        }
        return false;
      }
      draw(ctx) {
        if (!this.exploded) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const createExplosion = (x, y, color, count = 50, isConfetti = false) => {
      for (let i = 0; i < count; i++) {
        particles.current.push(
          new Particle(
            x,
            y,
            isConfetti ? `hsl(${Math.random() * 360}, 80%, 60%)` : color,
            isConfetti
          )
        );
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      stars.current.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
        star.a += (Math.random() - 0.5) * 0.05;
        star.a = Math.max(0.1, Math.min(1, star.a));
        ctx.globalAlpha = star.a;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.s, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      for (let i = particles.current.length - 1; i >= 0; i--) {
        particles.current[i].update();
        particles.current[i].draw(ctx);
        if (particles.current[i].life <= 0) particles.current.splice(i, 1);
      }

      if (effectMode === 'fireworks') {
        if (Math.random() < 0.04) {
          fireworks.current.push(new Firework(canvas.width, canvas.height));
        }
        for (let i = fireworks.current.length - 1; i >= 0; i--) {
          const exploded = fireworks.current[i].update();
          fireworks.current[i].draw(ctx);
          if (exploded) {
            createExplosion(
              fireworks.current[i].x,
              fireworks.current[i].y,
              fireworks.current[i].color
            );
            AudioSys.playExplosion();
            fireworks.current.splice(i, 1);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Export a function to create explosions externally
    window.createGlobalExplosion = createExplosion;

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      delete window.createGlobalExplosion;
    };
  }, [effectMode]);

  return (
    <>
      <div className="ambient-aurora"></div>
      <canvas
        ref={canvasRef}
        id="global-canvas"
        className="absolute inset-0 z-0 pointer-events-none"
      />
    </>
  );
};

export default GlobalCanvas;
