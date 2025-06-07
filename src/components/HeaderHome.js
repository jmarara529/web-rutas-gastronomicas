// Importa React y el componente Link de react-router-dom
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/components/HeaderHome.css"; 

// Componente de cabecera para la página principal
const HeaderHome = () => {
    // Estado para controlar si el menú está abierto o cerrado
    const [menuOpen, setMenuOpen] = useState(false);

    // Alterna el estado del menú (abre/cierra)
    const handleToggle = () => setMenuOpen((open) => !open);
    // Cierra el menú
    const handleClose = () => setMenuOpen(false);

    return (
        <nav className="header-home-container">
            {/* Logo y título de la aplicación */}
            <h1 className="logo">ComerAquí – Restaurantes y platillos recomendados en tu zona</h1>
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
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/about">Quiénes Somos</Link></li>
                <li><Link to="/privacy">Política de Privacidad</Link></li>
                <li><Link to="/contact">Contacto</Link></li>
            </ul>
        </nav>
    );
};

export default HeaderHome;