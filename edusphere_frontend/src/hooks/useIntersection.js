import { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useIntersection - Observe when an element enters the viewport.
 *
 * @param {Object} options - IntersectionObserver options { root, rootMargin, threshold }
 * @param {boolean} once - if true, unobserve after first intersect
 * @returns {[ref, isIntersecting]} - attach ref to target; isIntersecting signals visibility
 */
export default function useIntersection(options = { threshold: 0.2 }, once = true) {
  const ref = useRef(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback: mark visible immediately
      setIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        if (once) observer.unobserve(entry.target);
      } else if (!once) {
        setIntersecting(false);
      }
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options, once]);

  return [ref, isIntersecting];
}
