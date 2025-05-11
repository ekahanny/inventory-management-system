import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || token === "undefined" || token === "null") {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate, token]);

  return token ? <Outlet /> : null;
};

export default ProtectedRoute;
