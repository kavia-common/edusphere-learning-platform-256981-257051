import React, { useEffect, useMemo, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * ParticleBackground
 * Lightweight particle field using canvas for the hero background.
 *
 * Props:
 * - density: number (particles per pixel; default 0.00012)
 * - maxRadius: number (max particle radius; default 2.4)
 * - color: string (fill color; default rgba(37, 99, 235, 0.18))
 * - interactive: boolean (mouse repulsion; default true)
 * - speed: number (multiplier for velocity; default 1)
 * - intensity: number (multiplier for count/size; default 1)
 * - reduceMotion: boolean | undefined (force reduce motion; default undefined to defer to media query)
 *
 * Accessibility:
 * - Respects prefers-reduced-motion: reduce by pausing animation or greatly reducing velocities.
 * - Canvas is aria-hidden.
 */
const ParticleBackground = ({
  density = 0.00012,
  maxRadius = 2.4,
  color = "rgba(37, 99, 235, 0.18)",
  interactive = true,
  speed = 1,
  intensity = 1,
  reduceMotion,
  className = ""
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  // Determine reduced motion
  const prefersReduced = useMemo(() => {
    if (typeof reduceMotion === "boolean") return reduceMotion;
    if (typeof window !== "undefined" && "matchMedia" in window) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  }, [reduceMotion]);

  const createParticles = (w, h) => {
    // apply intensity to count and max size
    const baseCount = Math.max(8, Math.floor(w * h * density));
    const count = Math.max(6, Math.floor(baseCount * Math.max(0.4, intensity)));
    const scaledMaxRadius = Math.max(0.8, maxRadius * Math.max(0.5, Math.min(intensity, 1.5)));

    return new Array(count).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * scaledMaxRadius + 0.5,
      vx: (Math.random() - 0.5) * 0.2 * speed * (prefersReduced ? 0.15 : 1),
      vy: (Math.random() - 0.5) * 0.2 * speed * (prefersReduced ? 0.15 : 1),
      alpha: 0.55 + Math.random() * 0.35,
    }));
  };

  const drawFrame = (ctx, particles, w, h) => {
    ctx.clearRect(0, 0, w, h);

    // If reduced motion, draw static particles without continuous updates
    const staticMode = prefersReduced;
    particles.forEach((p) => {
      if (!staticMode) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // light interactivity
        if (interactive && mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 12000) {
            p.vx += dx * -0.00003 * speed;
            p.vy += dy * -0.00003 * speed;
          }
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();

    let particles = createParticles(canvas.width, canvas.height);

    let running = true;
    const loop = () => {
      if (!running) return;
      drawFrame(ctx, particles, canvas.width, canvas.height);
      if (prefersReduced) {
        // Do not loop continuously on reduced motion; draw once and stop
        running = false;
        return;
      }
      animationRef.current = requestAnimationFrame(loop);
    };
    // Initial frame/loop
    animationRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      resize();
      particles = createParticles(canvas.width, canvas.height);
      // on reduced motion, redraw once
      if (prefersReduced) {
        drawFrame(ctx, particles, canvas.width, canvas.height);
      }
    };

    const onMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
      if (prefersReduced) {
        // draw once to reflect interaction without starting a loop
        drawFrame(ctx, particles, canvas.width, canvas.height);
      }
    };
    const onLeave = () => (mouseRef.current.active = false);

    window.addEventListener("resize", onResize);
    if (interactive) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onLeave);
    }

    return () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [density, maxRadius, color, interactive, speed, intensity, prefersReduced]);

  return (
    <div ref={containerRef} className={`particle-container ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
};

export default React.memo(ParticleBackground);
