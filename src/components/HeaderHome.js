import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/components/HeaderHome.css"; 

const HeaderHome = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleToggle = () => setMenuOpen((open) => !open);
    const handleClose = () => setMenuOpen(false);

    return (
        <nav className="header-home-container">
            <h1 className="logo">ComerAquí – Restaurantes y platillos recomendados en tu zona</h1>
            <button
                className="menu-toggle"
                aria-label="Abrir menú"
                onClick={handleToggle}
            >
                <span className="menu-icon">☰</span>
            </button>
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