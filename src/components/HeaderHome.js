import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/headerHome.css"; 

const HeaderHome = () => {
    return (
        <nav className="header-home-container">
            <h1 className="logo">ComerAquí – Restaurantes y platillos recomendados en tu zona</h1>
            <ul className="nav-links">
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/about">Quiénes Somos</Link></li>
                <li><Link to="/privacy">Política de Privacidad</Link></li>
                <li><Link to="/contact">Contacto</Link></li>
            </ul>
        </nav>
    );
};

export default HeaderHome;