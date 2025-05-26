import React from "react";
import HeaderHome from "../components/HeaderHome";
import "../styles/pages/page-common.css";
import "../styles/pages/contact.css";

const Contact = () => {
    return (
        <div className="page-container">
            <HeaderHome />
            <div className="content">
                <h1>Contacto</h1>
                <p>
                    Puedes comunicarte con nosotros a través de nuestro correo:
                </p>
                <p>
                    <a href="mailto:jmarara529@g.educaand.es">jmarara529@g.educaand.es</a>
                </p>
            </div>
        </div>
    );
};

export default Contact;