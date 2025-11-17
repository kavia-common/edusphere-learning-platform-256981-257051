import { getSupabase } from "../lib/supabaseClient";

// PUBLIC_INTERFACE
export async function fetchCourses(limit = 20) {
  /** Fetches courses list from Supabase */
  const { data, error } = await getSupabase().from("courses").select("*").limit(limit);
  if (error) throw error;
  return data || [];
}

// PUBLIC_INTERFACE
export async function fetchCourse(id) {
  /** Fetch single course by id */
  const { data, error } = await getSupabase().from("courses").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}
```

Explanation: Update index.js to use App routed shell (no change needed but ensure import order)
````edit file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/index.js"
<<<<<<< SEARCH
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
=======
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
>>>>>>> REPLACE
