import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/components/headerHome.css";

const HeaderUser = ({ isAdmin }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleToggle = () => setMenuOpen((open) => !open);
    const handleClose = () => setMenuOpen(false);

    return (
        <nav className="header-home-container">
            <h1 className="logo">ComerAquí</h1>
            <button
                className="menu-toggle"
                aria-label="Abrir menú"
                onClick={handleToggle}
            >
                <span className="menu-icon">☰</span>
            </button>
            <ul className={`nav-links${menuOpen ? " open" : ""}`} onClick={handleClose}>
                <li><Link to="/buscador">Buscador</Link></li>
                <li><Link to="/favoritos">Favoritos</Link></li>
                <li><Link to="/mis-reseñas">Mis Reseñas</Link></li>
                <li><Link to="/lugares-visitados">Lugares Visitados</Link></li>
                <li><Link to="/perfil">Perfil</Link></li>
                {isAdmin && <li><Link to="/historial-eliminaciones">Historial de Eliminaciones</Link></li>}
                {isAdmin && <li><Link to="/administrar-usuarios">administrar usuarios</Link></li>}
                <li><Link to="/logout">Cerrar Sesión</Link></li>
            </ul>
        </nav>
    );
};

export default HeaderUser;