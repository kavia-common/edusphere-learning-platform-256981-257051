import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "../components/common";
import { Sidebar } from "../components/common";
import { ProtectedRoute } from "../components/common/routing/ProtectedRoute";
import { ToastProvider } from "../components/common/overlays/Toast";
import { SkipToContent } from "../components/common/skip/SkipToContent";
import { NotificationBell } from "../components/notifications/NotificationBell";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const CourseCatalog = lazy(() => import("../pages/courses/CourseCatalog"));
const CourseDetail = lazy(() => import("../pages/courses/CourseDetail"));
const LessonPlayer = lazy(() => import("../pages/courses/LessonPlayer"));
const InstructorDashboard = lazy(() => import("../pages/instructor/InstructorDashboard"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AnalyticsDashboard = lazy(() => import("../pages/analytics/AnalyticsDashboard"));
const Pricing = lazy(() => import("../pages/payments/Pricing"));
const Checkout = lazy(() => import("../pages/payments/Checkout"));
const BillingHistory = lazy(() => import("../pages/payments/BillingHistory"));

// PUBLIC_INTERFACE
export function AppRouter() {
  /** Routed application shell: includes Navbar, Sidebar, Skip link, and main Routes */
  return (
    <BrowserRouter>
      <ToastProvider>
        <SkipToContent />
        <div className="app-shell">
          <Navbar rightSlot={<NotificationBell />} />
          <Sidebar />
          <main id="main-content" className="main" role="main" tabIndex={-1}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<CourseCatalog />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/lessons/:id" element={<LessonPlayer />} />
                  <Route path="/billing" element={<BillingHistory />} />
                </Route>

                <Route element={<ProtectedRoute roles={["instructor", "admin"]} />}>
                  <Route path="/instructor" element={<InstructorDashboard />} />
                </Route>

                <Route element={<ProtectedRoute roles={["admin"]} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                </Route>

                <Route path="/pricing" element={<Pricing />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                </Route>

                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/forgot" element={<ForgotPassword />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
