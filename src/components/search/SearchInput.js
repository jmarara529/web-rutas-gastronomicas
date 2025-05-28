import React from "react";

const SearchInput = ({ query, setQuery, onUseLocation }) => (
  <div className="search-input-group">
    <input
      type="text"
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Buscar por nombre, tipo, zona o calle..."
    />
    <button type="button" onClick={onUseLocation}>
      Usar mi ubicación
    </button>
  </div>
);

export default SearchInput;
