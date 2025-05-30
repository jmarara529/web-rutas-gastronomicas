import React from "react";
import { Navigate } from "react-router-dom";

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/home" replace />;
    }
    return children;
};

export default PrivateRoute;
