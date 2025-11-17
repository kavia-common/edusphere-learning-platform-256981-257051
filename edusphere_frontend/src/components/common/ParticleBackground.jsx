import React, { useEffect, useRef } from 'react';

/**
 * Lightweight particle background using canvas.
 * Respects reduced-motion preference and cleans up on unmount.
 *
 * Props:
 * - density: number of particles (default 40)
 * - color: particle color (default rgba(37, 99, 235, 0.5) - Ocean Professional primary with alpha)
 * - className: extra classes for container
 */
const ParticleBackground = ({ density = 40, color = 'rgba(37, 99, 235, 0.5)', className = '' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      // re-seed particle positions on resize for consistency
      seedParticles();
    };
    window.addEventListener('resize', handleResize);

    const seedParticles = () => {
      const count = Math.max(12, Math.floor((width * height) / 25000)); // scale with area
      const target = Math.min(density, count);
      particlesRef.current = new Array(target).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.6,
      }));
    };

    seedParticles();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // gradient overlay for depth
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(59, 130, 246, 0.06)'); // blue-500
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.04)'); // slate-950
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // draw particles
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // connect near particles
        particlesRef.current.forEach(q => {
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0 && dist < 110) {
            ctx.strokeStyle = color.replace('0.5', String(Math.max(0.05, 0.25 - dist / 440)));
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });

        // update
        p.x += p.vx;
        p.y += p.vy;

        // wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      // paint static once for reduced motion users
      draw();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [density, color, prefersReducedMotion]);

  return (
    <div className={`particle-container ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
};

export default ParticleBackground;
