import React from "react";
import HeaderHome from "../components/HeaderHome";
import "../styles/pages/page-common.css";

const Contact = () => {
    return (
        <div className="page-container">
            <HeaderHome />  {/* 🔹 Agregamos el panel superior */}
            <div className="content">
                <h1>Contacto</h1>
                <p>
                    Puedes comunicarte con nosotros a través de nuestro correo:{" "}
                    <a href="mailto:jmarara529@g.educaand.es">jmarara529@g.educaand.es</a>.
                </p>
            </div>
        </div>
    );
};

export default Contact;