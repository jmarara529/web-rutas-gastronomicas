// Componente movido desde search/ para centralización
import React from "react";

const TypeFilters = ({ placeTypes, types, setTypes }) => (
  <div className="search-types">
    <label>Filtrar por tipo: </label>
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
