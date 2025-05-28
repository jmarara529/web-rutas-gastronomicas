import React from "react";
import PlaceCard from "./PlaceCard";

const SearchResults = ({ results, onPlaceClick, onAddFavorite }) => (
  <div style={{ marginTop: 24 }}>
    {results.length > 0 ? (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map(place => (
          <li key={place.id || place.place_id} style={{ margin: "12px 0" }}>
            <PlaceCard place={place} onClick={() => onPlaceClick(place)} onAddFavorite={onAddFavorite} />
          </li>
        ))}
      </ul>
    ) : (
      <div style={{ color: "#ff9800", marginTop: 24 }}>No se encontraron lugares.</div>
    )}
  </div>
);

export default SearchResults;
