// Importa React y los estilos del mensaje de error
import React from "react";
import "../styles/components/ErrorMessage.css";

// Componente para mostrar mensajes de error
// Recibe el mensaje de error como prop
const ErrorMessage = ({ error }) => {
    // Si no hay error, no renderiza nada
    if (!error) return null;

    // Renderiza el mensaje de error en un párrafo con la clase correspondiente
    return <p className="error-message">{error}</p>;
};

export default ErrorMessage;