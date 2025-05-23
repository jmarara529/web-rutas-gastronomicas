import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/AuthButtons.css";  // Archivo de estilos

const AuthButtons = () => {
    return (
        <div className="auth-buttons">
            <Link to="/login"><button className="btn login-btn">Iniciar Sesión</button></Link>
            <Link to="/register"><button className="btn register-btn">Registrarse</button></Link>
        </div>
    );
};

export default AuthButtons;