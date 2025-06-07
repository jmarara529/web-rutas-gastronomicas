// Importa React y los componentes/estilos necesarios
import React from "react";
import HeaderHome from "../components/HeaderHome";
import RegisterForm from "../components/RegisterForm";
import "../styles/pages/page-common.css";
import "../styles/pages/Register.css";

// Componente de la página de registro de usuario
const Register = () => (
    <div className="page-container register-page">
        {/* Cabecera de navegación principal */}
        <HeaderHome />
        <div className="content">
            {/* Formulario de registro */}
            <RegisterForm />
        </div>
    </div>
);

export default Register;