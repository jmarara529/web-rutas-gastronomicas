// Importa React y los estilos específicos para el input de búsqueda de reseñas
import React from "react";
import "../styles/components/searchinputresenas.css";

// Componente de input para buscar reseñas por sitio
// Recibe:
// - value: valor actual del input
// - onChange: función para actualizar el valor del input
const SearchInputResenas = ({ value, onChange }) => (
  <input
    className="searchinput-resenas" // Aplica estilos personalizados
    type="text" // Tipo de input: texto
    placeholder="Buscar por sitio..." // Texto de ayuda
    value={value} // Valor actual del input
    onChange={e => onChange(e.target.value)} // Actualiza el valor al escribir
    autoComplete="off" // Desactiva autocompletado del navegador
  />
);

export default SearchInputResenas;
