import { useEffect, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useIntersection
 * Observe element and toggle visible flag when it's in the viewport.
 * Useful for triggering entrance animations.
 *
 * Options:
 * - root: Element | null
 * - rootMargin: string
 * - threshold: number | number[] (default 0.15)
 * - once: boolean (default true)
 * - delay: number (ms) to delay setting visible after intersection
 * - respectReducedMotion: boolean (default true) - disables intersection-triggered animations when user prefers reduced motion
 */
export default function useIntersection({
  root = null,
  rootMargin = "0px",
  threshold = 0.15,
  once = true,
  delay = 0,
  respectReducedMotion = true,
} = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      respectReducedMotion &&
      typeof window !== "undefined" &&
      "matchMedia" in window &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // If reduced motion: consider content visible with minimal/no animation
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    let didUnobserve = false;
    let timer = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              if (timer) clearTimeout(timer);
              timer = setTimeout(() => {
                setVisible(true);
              }, delay);
            } else {
              setVisible(true);
            }
            if (once && !didUnobserve) {
              observer.unobserve(node);
              didUnobserve = true;
            }
          } else if (!once) {
            if (timer) {
              clearTimeout(timer);
              timer = null;
            }
            setVisible(false);
          }
        });
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, once, delay, respectReducedMotion]);

  return { ref, visible };
}
