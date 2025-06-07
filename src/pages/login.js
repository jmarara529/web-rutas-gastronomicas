// Importa React y los componentes/estilos necesarios
import React from "react";
import HeaderHome from "../components/HeaderHome";
import LoginForm from "../components/LoginForm";
import "../styles/pages/page-common.css";
import "../styles/pages/login.css";

// Componente de la página de inicio de sesión
const Login = () => {
    return (
        <div className="page-container login-page">
            {/* Cabecera de navegación principal */}
            <HeaderHome />
            <div className="content">
                {/* Formulario de login */}
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;