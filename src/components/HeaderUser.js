// Importa React, Link y useNavigate de react-router-dom
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/HeaderHome.css";
import "../styles/components/headerUser.css";

// Componente de cabecera para usuarios autenticados
// Recibe la prop isAdmin para mostrar opciones de administrador
const HeaderUser = ({ isAdmin }) => {
    const navigate = useNavigate();
    // Estado para controlar si el menú está abierto o cerrado
    const [menuOpen, setMenuOpen] = useState(false);

    // Alterna el estado del menú (abre/cierra)
    const handleToggle = () => setMenuOpen((open) => !open);
    // Cierra el menú
    const handleClose = () => setMenuOpen(false);
    // Maneja el cierre de sesión: elimina datos del usuario y redirige al inicio
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("es_admin");
        localStorage.removeItem("user_id");
        navigate("/");
    };

    return (
        <nav className="header-home-container">
            {/* Logo de la aplicación */}
            <h1 className="logo">ComerAquí</h1>
            {/* Botón para abrir/cerrar el menú en dispositivos móviles */}
            <button
                className="menu-toggle"
                aria-label="Abrir menú"
                onClick={handleToggle}
            >
                <span className="menu-icon">☰</span>
            </button>
            {/* Lista de enlaces de navegación */}
            <ul className={`nav-links${menuOpen ? " open" : ""}`} onClick={handleClose}>
                <li><Link to="/search">Buscador</Link></li>
                <li><Link to="/favoritos">Favoritos</Link></li>
                <li><Link to="/mis-reseñas">Mis Reseñas</Link></li>
                <li><Link to="/lugares-visitados">Lugares Visitados</Link></li>
                <li><Link to="/perfil">Perfil</Link></li>
                {/* Opciones solo visibles para administradores */}
                {isAdmin && <li><Link to="/historial-eliminaciones">Historial de Acciones</Link></li>}
                {isAdmin && <li><Link to="/administrar-usuarios">administrar usuarios</Link></li>}
                {/* Botón para cerrar sesión */}
                <span className="header-user-link" onClick={handleLogout} tabIndex={0} role="button">
                  Cerrar sesión
                </span>
            </ul>
        </nav>
    );
};

export default HeaderUser;