// Importa React y los componentes/estilos necesarios
import React from "react";
import HeaderHome from "../components/HeaderHome";
import AuthButton from "../components/AuthButtons";
import "../styles/pages/page-common.css";
import "../styles/pages/Home.css";

// Componente principal de la página de inicio
const Home = () => {
    return (
        <div className="page-container">
            {/* Cabecera de navegación principal */}
            <HeaderHome />
            <div className="content">
                {/* Título y subtítulo de la app */}
                <div className="title-container">
                    <h1 className="app-title">COMER AQUI</h1>
                    <h2 className="app-subtitle">Restaurantes y platillos recomendados en tu zona</h2>
                </div>
                {/* Botones de acceso para login y registro */}
                <div className="overlay">
                    <AuthButton to="/login" className="login-btn">Iniciar Sesión</AuthButton>
                    <AuthButton to="/register" className="register-btn">Registrarse</AuthButton>
                </div>
            </div>
        </div>
    );
};

export default Home;