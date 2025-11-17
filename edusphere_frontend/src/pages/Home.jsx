import React, { useEffect, useMemo } from "react";
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
 * - Hero: animated gradient background, particle canvas, typing headline, glow primary CTA, glass secondary CTA.
 * - Features: interactive glass cards with hover lift, gradient border shimmer, icon transitions, and progress demo.
 * - Accessibility: reduced motion support, ARIA landmarks/labels, focus-visible states.
 */
export default function Home() {
  // Observe sections for reveal animations
  const [heroRef, heroInView] = useIntersection({ threshold: 0.15 }, true);
  const [featuresRef, featuresInView] = useIntersection({ threshold: 0.2 }, true);
  const metrics = useLiveMetrics();

  // Typing headline content (progressive enhancement)
  const headline = useMemo(
    () => "Immersive learning, real-time collaboration, and AI-powered insights.",
    []
  );

  useEffect(() => {
    document.title = "EduSphere — Learn without limits";
  }, []);

  return (
    <main id="main-content" aria-labelledby="home-hero-heading">
      {/* HERO */}
      <section
        ref={heroRef}
        className={`relative hero-animated-bg overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 ${heroInView ? "reveal in-view" : "reveal"}`}
        aria-label="Hero"
      >
        <ParticleBackground density={50} />
        {/* Decorative glass nav tint to blend with existing navbar */}
        <div className="absolute inset-x-0 top-0 h-16 glass-nav" aria-hidden="true" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
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
                <div className="text-sm text-slate-600">Courses in progress</div>
                <div className="text-2xl md:text-3xl font-semibold text-slate-900">
                  <Counter end={metrics.coursesInProgress} />
                </div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-slate-600">Completion rate</div>
                <div className="text-2xl md:text-3xl font-semibold text-slate-900">
                  <Counter end={metrics.completionRate} suffix="%" />
                </div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-slate-600">Avg. session</div>
                <div className="text-2xl md:text-3xl font-semibold text-slate-900">
                  <Counter end={metrics.avgSessionMinutes} suffix="m" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={featuresRef}
        className={`relative py-14 md:py-20 bg-white ${featuresInView ? "reveal in-view" : "reveal"}`}
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
