import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (err) {
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    toast.error("Access denied: Admin privileges required ⚠️");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;