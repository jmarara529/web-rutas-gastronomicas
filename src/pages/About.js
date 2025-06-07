// Importa React y componentes/estilos necesarios
import React from "react";
import HeaderHome from "../components/HeaderHome";
import "../styles/pages/page-common.css";

// Componente de la página "Quiénes Somos"
const About = () => {
    return (
        <div className="page-container">
            {/* Cabecera reutilizable para la navegación principal */}
            <HeaderHome />
            <div className="content">
                {/* Título de la sección */}
                <h1>Quiénes Somos</h1>
                {/* Descripción del proyecto y su propósito */}
                <p>
                    Realmente soy un estudiante del CFGS de desarrollo de aplicaciones multiplataforma realizando un proyecto de fin de curso.  
                    El proyecto consiste en una aplicación web y móvil para recomendar restaurantes y platillos en la zona de los usuarios.  
                    La aplicación debe permitir la búsqueda en un radio de x kilómetros de tu ubicación actual o una ubicación marcada, y mostrar los resultados en un mapa.
                </p>
            </div>
        </div>
    );
};

export default About;