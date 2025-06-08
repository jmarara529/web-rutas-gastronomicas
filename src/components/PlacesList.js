// Importa React y el componente PlaceCard para mostrar cada lugar
import React from "react";
import PlaceCard from "./PlaceCard";
import "../styles/components/placesList.css";

// Componente para mostrar una lista de lugares
// Recibe:
// - places: array de lugares a mostrar
// - onPlaceClick: función que se ejecuta al hacer click en una tarjeta
// - fechaKey: clave para extraer la fecha relevante de cada lugar (por defecto 'fecha_visita')
// - textoFecha: texto personalizado para mostrar junto a la fecha
const PlacesList = ({ places, onPlaceClick, fechaKey = "fecha_visita", textoFecha }) => (
  <ul className="places-list">
    {/* Itera sobre cada lugar y renderiza una PlaceCard */}
    {places.map((place, i) => (
      <li key={place.id || place.place_id || place._id || i} className="places-list-item">
        <PlaceCard
          place={place}
          onClick={() => onPlaceClick(place)}
          fechaVisita={place[fechaKey] || place.fecha_agregado || place.fecha_favorito}
          textoFecha={textoFecha}
        />
      </li>
    ))}
  </ul>
);

export default PlacesList;
