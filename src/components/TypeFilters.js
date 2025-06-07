// Componente para filtrar lugares por tipo usando radio buttons
import React from "react";

// Recibe:
// - placeTypes: array de tipos de lugares disponibles [{ value, label }]
// - types: array con el tipo seleccionado actualmente
// - setTypes: función para actualizar el tipo seleccionado
const TypeFilters = ({ placeTypes, types, setTypes }) => (
  <div className="search-types">
    {/* Etiqueta principal del filtro */}
    <label>Filtrar por tipo: </label>
    {/* Renderiza un radio button por cada tipo de lugar */}
    {placeTypes.map(pt => (
      <label key={pt.value}>
        <input
          type="radio"
          name="placeType"
          checked={types[0] === pt.value}
          onChange={() => setTypes([pt.value])}
        /> {pt.label}
      </label>
    ))}
  </div>
);

export default TypeFilters;
