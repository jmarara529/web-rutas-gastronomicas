// Importa React y los estilos del input de texto
import React from "react";
import "../styles/components/textInput.css";

// Componente reutilizable para campos de texto
// Recibe props como type, value, onChange, required, placeholder, name, id, autoComplete, etc.
const TextInput = ({
    type = "text", // Tipo de input (por defecto texto)
    value, // Valor actual del input
    onChange, // Función para manejar cambios
    required = true, // Si el campo es obligatorio
    placeholder = "", // Texto de ayuda
    name, // Nombre del campo
    id, // ID del campo
    autoComplete, // Autocompletado del navegador
    ...props // Otros props adicionales
}) => (
    <input
        className="text-input" // Aplica estilos personalizados
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        name={name}
        id={id}
        autoComplete={autoComplete}
        {...props}
    />
);

export default TextInput;