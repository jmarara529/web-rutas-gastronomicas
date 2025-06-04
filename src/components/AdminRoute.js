import React from "react";
import { Navigate } from "react-router-dom";

// Componente para proteger rutas solo para administradores
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const esAdmin = localStorage.getItem("es_admin") === "true";

  if (!token) {
    return <Navigate to="/home" replace />;
  }
  if (!esAdmin) {
    return <Navigate to="/perfil" replace />;
  }
  return children;
};

export default AdminRoute;
