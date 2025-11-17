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
    // Ensure a default theme is set for consistent styling in tests/runtime
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
