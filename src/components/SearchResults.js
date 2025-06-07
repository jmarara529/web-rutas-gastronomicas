// Importa React y el componente PlaceCard para mostrar cada resultado
import React from "react";
import PlaceCard from "./PlaceCard";

// Componente para mostrar los resultados de búsqueda de lugares
// Recibe:
// - results: array de lugares encontrados
// - onPlaceClick: función que se ejecuta al hacer click en una tarjeta
// - onAddFavorite: función para agregar a favoritos (opcional)
const SearchResults = ({ results, onPlaceClick, onAddFavorite }) => (
  <div style={{ marginTop: 24 }}>
    {/* Si hay resultados, muestra la lista de lugares */}
    {results.length > 0 ? (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map(place => (
          <li key={place.id || place.place_id} style={{ margin: "12px 0" }}>
            {/* Tarjeta visual de cada lugar */}
            <PlaceCard place={place} onClick={() => onPlaceClick(place)} onAddFavorite={onAddFavorite} />
          </li>
        ))}
      </ul>
    ) : (
      // Si no hay resultados, muestra un mensaje informativo
      <div style={{ color: "#ff9800", marginTop: 24 }}>No se encontraron lugares.</div>
    )}
  </div>
);

export default SearchResults;
