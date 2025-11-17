import React from "react";
import { getSupabase } from "../../lib/supabaseClient";
import { GlassCard, DataTable } from "../../components/common";

/* PUBLIC_INTERFACE */
const BillingHistory = function BillingHistory() {
  /** Reads payments table and lists history */
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await getSupabase()
          .from("payments")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(25);
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
      <GlassCard>
        <h2>Billing history</h2>
      </GlassCard>
      <DataTable columns={cols} rows={rows} />
    </div>
  );
};
export default BillingHistory;
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
