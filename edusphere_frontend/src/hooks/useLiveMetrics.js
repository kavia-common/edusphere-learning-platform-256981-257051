import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchAllMetrics, subscribeToMetrics } from '../services/metrics';

/**
 * PUBLIC_INTERFACE
 * Hook that provides live metrics with:
 * - Initial fetch on mount
 * - Realtime subscriptions for presence/completions
 * - Polling fallback (every 45s by default)
 * - Reduced-motion aware UI updates (throttled/instant updates)
 */
export default function useLiveMetrics(options = {}) {
  const {
    pollingIntervalMs = 45_000,
    animationDurationMs = 500,
  } = options;

  const [metrics, setMetrics] = useState({
    activeLearners: 0,
    totalCourses: 0,
    recentCompletions: 0,
  });

  // Reduced motion preference detection
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(Boolean(mq?.matches));
    update();
    try {
      mq?.addEventListener?.('change', update);
    } catch {
      mq?.addListener?.(update);
    }
    return () => {
      try {
        mq?.removeEventListener?.('change', update);
      } catch {
        mq?.removeListener?.(update);
      }
    };
  }, []);

  // Display values potentially animated
  const targetRef = useRef(metrics);
  const [display, setDisplay] = useState(metrics);

  useEffect(() => {
    targetRef.current = metrics;
  }, [metrics]);

  // Animation effect (throttled/instant if reduced motion)
  useEffect(() => {
    if (reducedMotion) {
      // Update instantly to avoid motion
      setDisplay(targetRef.current);
      return;
    }

    let raf;
    let start;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / Math.max(animationDurationMs, 1), 1);

      const lerp = (a, b, t) => Math.round(a + (b - a) * t);

      setDisplay((prev) => ({
        activeLearners: lerp(prev.activeLearners, targetRef.current.activeLearners, progress),
        totalCourses: lerp(prev.totalCourses, targetRef.current.totalCourses, progress),
        recentCompletions: lerp(prev.recentCompletions, targetRef.current.recentCompletions, progress),
      }));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, reducedMotion, animationDurationMs]);

  // Initial fetch + realtime + polling fallback with cleanup
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const load = async () => {
      try {
        const all = await fetchAllMetrics();
        if (!isMounted) return;
        setMetrics(all);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Initial metrics fetch failed:', e?.message || e);
      }
    };

    load();

    const cleanupRealtime = subscribeToMetrics({
      onChange: (partial) => {
        setMetrics((prev) => ({ ...prev, ...partial }));
      },
      signal: abortController.signal,
    });

    const intervalId = window.setInterval(() => {
      load();
    }, pollingIntervalMs);

    return () => {
      isMounted = false;
      abortController.abort();
      cleanupRealtime && cleanupRealtime();
      window.clearInterval(intervalId);
    };
  }, [pollingIntervalMs]);

  return useMemo(
    () => ({
      metrics: display,
      // Expose a safe setter if needed by UI (rare)
      setMetrics,
    }),
    [display]
  );
}
