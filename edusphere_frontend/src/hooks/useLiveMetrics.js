import { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useLiveMetrics - provides mock live metrics until real backend wiring.
 * Returns { activeLearners, coursesInProgress, completionRate, avgSessionMinutes }
 */
export default function useLiveMetrics() {
  const [metrics, setMetrics] = useState({
    activeLearners: 1284,
    coursesInProgress: 342,
    completionRate: 87,
    avgSessionMinutes: 42,
  });

  useEffect(() => {
    // simulate live updates
    const id = setInterval(() => {
      setMetrics((m) => ({
        activeLearners: m.activeLearners + Math.floor(Math.random() * 5),
        coursesInProgress: m.coursesInProgress + Math.floor(Math.random() * 3),
        completionRate: Math.max(75, Math.min(95, m.completionRate + (Math.random() > 0.5 ? 1 : -1))),
        avgSessionMinutes: Math.max(30, Math.min(60, m.avgSessionMinutes + (Math.random() > 0.5 ? 1 : -1))),
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return metrics;
}
