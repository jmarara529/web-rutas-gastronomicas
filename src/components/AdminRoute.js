// Importa React y el componente Navigate de react-router-dom
import React from "react";
import { Navigate } from "react-router-dom";

// Componente para proteger rutas solo para administradores
// Recibe los componentes hijos como children
const AdminRoute = ({ children }) => {
  // Obtiene el token de autenticación del localStorage
  const token = localStorage.getItem("token");
  // Verifica si el usuario es administrador
  const esAdmin = localStorage.getItem("es_admin") === "true";

  // Si no hay token, redirige al usuario a la página de inicio
  if (!token) {
    return <Navigate to="/home" replace />;
  }
  // Si el usuario no es administrador, lo redirige a su perfil
  if (!esAdmin) {
    return <Navigate to="/perfil" replace />;
  }
  // Si pasa las validaciones, renderiza los componentes hijos
  return children;
};

export default AdminRoute;
