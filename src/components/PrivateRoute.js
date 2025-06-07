// Importa React y el componente Navigate de react-router-dom
import React from "react";
import { Navigate } from "react-router-dom";

// Componente para proteger rutas privadas (solo accesibles si hay token de sesión)
const PrivateRoute = ({ children }) => {
    // Obtiene el token de autenticación del localStorage
    const token = localStorage.getItem("token");
    // Si no hay token, redirige al usuario a la página de inicio
    if (!token) {
        return <Navigate to="/home" replace />;
    }
    // Si hay token, renderiza los componentes hijos (la ruta protegida)
    return children;
};

export default PrivateRoute;
