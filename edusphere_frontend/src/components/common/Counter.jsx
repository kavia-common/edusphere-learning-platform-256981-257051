import React, { useEffect, useRef, useState } from 'react';

/**
 * Counter component to animate numbers counting up.
 *
 * PUBLIC_INTERFACE
 * @param {number} end - Final value
 * @param {number} start - Starting value (default 0)
 * @param {number} duration - Duration in ms (default 1200)
 * @param {string} suffix - Optional suffix (e.g., "+", "%")
 * @param {string} prefix - Optional prefix (e.g., "$")
 * @param {function} formatter - Optional number formatter
 */
const Counter = ({ end, start = 0, duration = 1200, suffix = '', prefix = '', formatter }) => {
  const [value, setValue] = useState(start);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || duration <= 0) {
      setValue(end);
      return;
    }

    const diff = end - start;
    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min(1, (timestamp - startRef.current) / duration);
      const current = start + diff * progress;
      setValue(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [start, end, duration]);

  const display = formatter ? formatter(value) : Math.round(value).toLocaleString();

  return <span aria-live="polite">{`${prefix}${display}${suffix}`}</span>;
};

export default Counter;
