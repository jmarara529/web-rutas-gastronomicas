// Importa React y los componentes/estilos necesarios
import React from "react";
import HeaderHome from "../components/HeaderHome";
import "../styles/pages/page-common.css";
import "../styles/pages/contact.css";

// Componente de la página de contacto
const Contact = () => {
    return (
        <div className="page-container">
            {/* Cabecera reutilizable para la navegación principal */}
            <HeaderHome />
            <div className="content">
                {/* Título de la sección */}
                <h1>Contacto</h1>
                {/* Texto de información de contacto */}
                <p>
                    Puedes comunicarte con nosotros a través de nuestro correo:
                </p>
                {/* Enlace mailto para enviar correo directamente */}
                <p>
                    <a href="mailto:jmarara529@g.educaand.es">jmarara529@g.educaand.es</a>
                </p>
            </div>
        </div>
    );
};

export default Contact;