import React from "react";
import { getSupabase } from "../../lib/supabaseClient";
import { GlassCard, DataTable } from "../../components/common";

// PUBLIC_INTERFACE
export default function BillingHistory() {
  /** Reads payments table and lists history */
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await getSupabase().from("payments").select("*").order("created_at", { ascending: false }).limit(25);
        setRows(data || []);
      } catch {
        setRows([]);
      }
    })();
  }, []);
  const cols = [
    { key: "id", header: "ID" },
    { key: "amount", header: "Amount", render: (v) => `$${(v || 0) / 100}` },
    { key: "status", header: "Status" },
    { key: "created_at", header: "Date" },
  ];
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard><h2>Billing history</h2></GlassCard>
      <DataTable columns={cols} rows={rows} />
    </div>
  );
}
```

Explanation: Routing with lazy routes and shell layout
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/routes/index.jsx"
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar, Sidebar } from "../components/common";
import { ProtectedRoute } from "../components/common";
import { ToastProvider } from "../components/common/overlays/Toast";
import { NotificationBell } from "../components/notifications/NotificationBell";
import { SkipToContent } from "../components/common/skip/SkipToContent";

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
  /** App router with shell layout and route definitions */
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

                <Route element={<ProtectedRoute roles={['instructor', 'admin']} />}>
                  <Route path="/instructor" element={<InstructorDashboard />} />
                </Route>

                <Route element={<ProtectedRoute roles={['admin']} />}>
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
```

Explanation: Convert App.js into routed shell using AppRouter and providers
````edit file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/App.js"
<<<<<<< SEARCH
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
=======
import React from "react";
import "./App.css";
import "./styles/theme.css";
import "./styles/glass.css";
import { AppRouter } from "./routes";
import { AuthProvider } from "./providers/AuthProvider";

// PUBLIC_INTERFACE
function App() {
  /** EduSphere SPA shell with providers and routing */
  React.useEffect(() => {
    // set default theme
    if (!document.documentElement.getAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
>>>>>>> REPLACE
