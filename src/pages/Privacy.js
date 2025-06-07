// Importa React y los componentes/estilos necesarios
import React from "react";
import HeaderHome from "../components/HeaderHome";
import "../styles/pages/page-common.css";
import "../styles/pages/privacy.css";

// Componente de la página de política de privacidad
const Privacy = () => {
    return (
        <div className="page-container">
            {/* Cabecera de navegación principal */}
            <HeaderHome />
            <div className="content">
                {/* Título y secciones de la política de privacidad */}
                <h1>Política de Privacidad</h1>
                <p>
                    En <strong>ComerAquí – Restaurantes y platillos recomendados en tu zona</strong>, valoramos y protegemos tu privacidad.  
                    A continuación, te informamos sobre cómo recopilamos, utilizamos y protegemos tus datos personales.
                </p>
                <h2>Recopilación de datos</h2>
                <p>
                    Los datos que nos proporcionas al registrarte, crear una reseña o visitar nuestro sitio se almacenan de forma segura en nuestra base de datos.
                </p>
                <h2>Uso y acceso a la información</h2>
                <p>
                    La información personal que compartes no se comparte con terceros ni con ninguna empresa o entidad externa. Solo tú y nuestros administradores autorizados podrán modificar tus datos y reseñas.
                </p>
                <h2>Contacto</h2>
                <p>Si tienes alguna pregunta o inquietud sobre nuestra política de privacidad, no dudes en contactarnos.</p>
            </div>
        </div>
    );
};

export default Privacy;