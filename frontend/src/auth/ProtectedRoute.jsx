// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  return isAuthenticated ? (
    <Outlet context={{ from: location.state?.from?.pathname || "/" }} />
  ) : (
    <Navigate 
      to="/login" 
      replace 
      state={{ from: location.pathname }}
    />
  );
};

export default ProtectedRoute;
