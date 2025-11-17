import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";

/**
 * Role-based protected route wrapper for react-router v6.
 */
// PUBLIC_INTERFACE
export function ProtectedRoute({ roles }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (roles && roles.length && role && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
