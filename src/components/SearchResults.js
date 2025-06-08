// Importa React y el componente PlaceCard para mostrar cada resultado
import React from "react";
import PlaceCard from "./PlaceCard";
import "../styles/components/searchResults.css";

// Componente para mostrar los resultados de búsqueda de lugares
// Recibe:
// - results: array de lugares encontrados
// - onPlaceClick: función que se ejecuta al hacer click en una tarjeta
// - onAddFavorite: función para agregar a favoritos (opcional)
const SearchResults = ({ results, onPlaceClick, onAddFavorite }) => (
  <div className="search-results-container">
    {/* Si hay resultados, muestra la lista de lugares */}
    {results.length > 0 ? (
      <ul className="search-results-list">
        {results.map(place => (
          <li key={place.id || place.place_id} className="search-results-item">
            {/* Tarjeta visual de cada lugar */}
            <PlaceCard place={place} onClick={() => onPlaceClick(place)} onAddFavorite={onAddFavorite} />
          </li>
        ))}
      </ul>
    ) : (
      // Si no hay resultados, muestra un mensaje informativo
      <div className="search-results-empty">No se encontraron lugares.</div>
    )}
  </div>
);

export default SearchResults;
