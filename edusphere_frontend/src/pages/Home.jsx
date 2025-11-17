import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/theme.css";
import "../styles/glass.css";
import ParticleBackground from "../components/common/ParticleBackground";
import Counter from "../components/common/Counter";
import useIntersection from "../hooks/useIntersection";
import useLiveMetrics from "../hooks/useLiveMetrics";

/**
 * PUBLIC_INTERFACE
 * Home - EduSphere landing page with immersive hero, interactive features, and live metrics.
 * Adds runtime animation profile toggle and reduced-motion safeguards.
 */
export default function Home() {
  // Reduced motion detection
  const prefersReduced = useMemo(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  }, []);

  // Runtime animation profile (calm | default | lively)
  const [animProfile, setAnimProfile] = useState("default");
  useEffect(() => {
    document.documentElement.setAttribute("data-anim", animProfile);
  }, [animProfile]);

  // Intersection hooks with delay/threshold and respect reduced motion
  const hero = useIntersection({ once: true, threshold: 0.2, delay: prefersReduced ? 0 : 60, respectReducedMotion: true });
  const features = useIntersection({ rootMargin: "0px 0px -10% 0px", threshold: 0.15, delay: prefersReduced ? 0 : 100, respectReducedMotion: true });
  const { metrics } = useLiveMetrics({
    pollingIntervalMs: 60000, // 60s in home to reduce noise
  });

  // Typing headline content (progressive enhancement)
  const headline = useMemo(
    () => "Immersive learning, real-time collaboration, and AI-powered insights.",
    []
  );

  // Particle tuning per profile
  const particleTuning = useMemo(() => {
    if (prefersReduced) {
      return { speed: 0.4, intensity: 0.5, reduceMotion: true };
    }
    switch (animProfile) {
      case "calm":
        return { speed: 0.75, intensity: 0.75, reduceMotion: false };
      case "lively":
        return { speed: 1.25, intensity: 1.2, reduceMotion: false };
      case "default":
      default:
        return { speed: 1, intensity: 1, reduceMotion: false };
    }
  }, [animProfile, prefersReduced]);

  useEffect(() => {
    document.title = "EduSphere — Learn without limits";
  }, []);

  return (
    <main id="main-content" aria-labelledby="home-hero-heading">
      {/* HERO */}
      <section
        ref={hero.ref}
        className={`relative hero-animated-bg overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 ${hero.visible ? "reveal in-view" : "reveal"}`}
        aria-label="Hero"
      >
        <ParticleBackground
          speed={particleTuning.speed}
          intensity={particleTuning.intensity}
          reduceMotion={particleTuning.reduceMotion}
        />
        {/* Decorative glass nav tint to blend with existing navbar */}
        <div className="absolute inset-x-0 top-0 h-16 glass-nav" aria-hidden="true" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
              <label htmlFor="anim-profile" style={{ fontSize: 12, opacity: 0.8 }}>
                Animation
              </label>
              <select
                id="anim-profile"
                value={animProfile}
                onChange={(e) => setAnimProfile(e.target.value)}
                aria-label="Select animation intensity"
                style={{ fontSize: 12 }}
              >
                <option value="calm">Calm</option>
                <option value="default">Default</option>
                <option value="lively">Lively</option>
              </select>
            </div>

            <h1 id="home-hero-heading" className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: "var(--slate-900)" }}>
              EduSphere
            </h1>
            <p className="mt-4 text-lg md:text-xl" style={{ color: "var(--slate-800)" }}>
              <span className="typing block" aria-live="polite">
                {headline}
              </span>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/courses"
                className="btn-glow inline-flex items-center justify-center rounded-lg px-5 py-3 text-white"
                style={{ background: "linear-gradient(135deg, var(--blue-500), var(--indigo-500))" }}
                aria-label="Browse courses"
              >
                Browse Courses
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-slate-800 glass"
                aria-label="View pricing"
              >
                View Pricing
              </Link>
            </div>

            {/* Floating preview cards placeholder */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" aria-hidden="true">
              <div className="glass gradient-border glass-card-hover p-3 md:p-4">
                <div className="h-16 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-md" />
              </div>
              <div className="glass gradient-border glass-card-hover p-3 md:p-4">
                <div className="h-16 bg-gradient-to-br from-amber-400/10 to-blue-500/10 rounded-md" />
              </div>
              <div className="glass gradient-border glass-card-hover p-3 md:p-4">
                <div className="h-16 bg-gradient-to-br from-teal-400/10 to-indigo-500/10 rounded-md" />
              </div>
              <div className="glass gradient-border glass-card-hover p-3 md:p-4">
                <div className="h-16 bg-gradient-to-br from-blue-500/10 to-amber-400/10 rounded-md" />
              </div>
            </div>

            {/* Live Metrics */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4" role="region" aria-label="Live platform metrics">
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-slate-600">Active learners</div>
                <div className="text-2xl md:text-3xl font-semibold text-slate-900">
                  <Counter end={metrics.activeLearners} suffix="+" />
                </div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-slate-600">Total courses</div>
                <div className="text-2xl md:text-3xl font-semibold text-slate-900">
                  <Counter end={metrics.totalCourses} />
                </div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-slate-600">Completions (24h)</div>
                <div className="text-2xl md:text-3xl font-semibold text-slate-900">
                  <Counter end={metrics.recentCompletions} />
                </div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-slate-600">Avg. session</div>
                <div className="text-2xl md:text-3xl font-semibold text-slate-900">
                  {/* Keep avg session mock or compute elsewhere; safe fallback */}
                  <Counter end={42} suffix="m" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={features.ref}
        className={`relative py-14 md:py-20 bg-white ${features.visible ? "reveal in-view" : "reveal"}`}
        aria-labelledby="features-heading"
      >
        <div className="container mx-auto px-4">
          <h2 id="features-heading" className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Powerful features to elevate learning
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <article className="glass gradient-border glass-card-hover p-6 rounded-xl" tabIndex={0} aria-labelledby="feature-immersive">
              <div className="flex items-start gap-3">
                <div
                  className="icon-transition inline-flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{ background: "linear-gradient(135deg, var(--blue-400), var(--indigo-500))" }}
                  aria-hidden="true"
                >
                  <span role="img" aria-label="sparkles" className="text-white text-lg">✨</span>
                </div>
                <div>
                  <h3 id="feature-immersive" className="font-semibold text-lg text-slate-900">Immersive Learning</h3>
                  <p className="text-slate-600 mt-1">
                    Interactive lessons with video, quizzes, and hands-on projects.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <div className="progress" aria-hidden="true"><div className="bar" /></div>
                <p className="sr-only">Example progress animation</p>
              </div>
            </article>

            {/* Feature 2 */}
            <article className="glass gradient-border glass-card-hover p-6 rounded-xl" tabIndex={0} aria-labelledby="feature-collab">
              <div className="flex items-start gap-3">
                <div
                  className="icon-transition inline-flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{ background: "linear-gradient(135deg, var(--teal-400), var(--blue-400))" }}
                  aria-hidden="true"
                >
                  <span role="img" aria-label="speech balloons" className="text-white text-lg">💬</span>
                </div>
                <div>
                  <h3 id="feature-collab" className="font-semibold text-lg text-slate-900">Real-time Collaboration</h3>
                  <p className="text-slate-600 mt-1">
                    Work with peers and instructors using chat, comments, and live sessions.
                  </p>
                </div>
              </div>
            </article>

            {/* Feature 3 */}
            <article className="glass gradient-border glass-card-hover p-6 rounded-xl" tabIndex={0} aria-labelledby="feature-analytics">
              <div className="flex items-start gap-3">
                <div
                  className="icon-transition inline-flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{ background: "linear-gradient(135deg, var(--amber-400), var(--indigo-500))" }}
                  aria-hidden="true"
                >
                  <span role="img" aria-label="chart increasing" className="text-white text-lg">📈</span>
                </div>
                <div>
                  <h3 id="feature-analytics" className="font-semibold text-lg text-slate-900">Analytics & Insights</h3>
                  <p className="text-slate-600 mt-1">
                    Track progress and performance with detailed analytics dashboards.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Secondary CTA */}
          <div className="mt-10">
            <Link
              to="/signup"
              className="btn-glow inline-flex items-center justify-center rounded-lg px-5 py-3 text-white"
              style={{ background: "linear-gradient(135deg, var(--blue-500), var(--indigo-500))" }}
              aria-label="Get started for free"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
