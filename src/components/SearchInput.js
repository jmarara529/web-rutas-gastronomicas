// Componente de input de búsqueda centralizado para reutilizar en la app
import React from "react";

// Recibe:
// - query: valor actual del input de búsqueda
// - setQuery: función para actualizar el valor del input
// - onUseLocation: función para usar la ubicación del usuario
const SearchInput = ({ query, setQuery, onUseLocation }) => (
  <div className="search-input-group">
    {/* Input de texto para escribir la búsqueda */}
    <input
      type="text"
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Buscar por nombre, tipo, zona o calle..."
    />
    {/* Botón para activar la búsqueda por ubicación actual */}
    <button type="button" onClick={onUseLocation}>
      Usar mi ubicación
    </button>
  </div>
);

export default SearchInput;
