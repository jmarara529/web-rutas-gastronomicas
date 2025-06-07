// Importa React y el componente Link de react-router-dom
import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/button.css"; // Importa los estilos del botón

// Componente reutilizable para crear un botón de autenticación con enlace
// Recibe la ruta 'to', el contenido 'children' y una clase opcional 'className'
const AuthButton = ({ to, children, className = "" }) => (
    <Link to={to}>
        <button className={`btn ${className}`}>{children}</button>
    </Link>
);

export default AuthButton;