// Importa React y los estilos del input de texto
import React from "react";
import "../styles/components/textInput.css";

// Componente reutilizable para campos de contraseña
// Recibe props como value, onChange, placeholder, name, required y autoComplete
const PasswordInput = ({ value, onChange, placeholder = "", name = "password", required = false, autoComplete = "new-password" }) => (
  <input
    className="text-input" // Aplica estilos personalizados
    type="password" // Tipo de input: contraseña
    value={value} // Valor del campo
    onChange={onChange} // Manejador de cambio
    placeholder={placeholder} // Texto de ayuda
    name={name} // Nombre del campo
    required={required} // Si es obligatorio
    autoComplete={autoComplete} // Autocompletado para navegadores
    style={{ width: "100%", marginTop: 4 }} // Estilos adicionales
  />
);

export default PasswordInput;
