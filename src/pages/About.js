import React from "react";
import HeaderHome from "../components/HeaderHome";
import "../styles/pages/page-common.css";

const About = () => {
    return (
        <div className="page-container">
            <HeaderHome />
            <div className="content">
                <h1>Quiénes Somos</h1>
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