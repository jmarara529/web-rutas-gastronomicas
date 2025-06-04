import React from "react";
import PlaceCard from "./PlaceCard";

const PlacesList = ({ places, onPlaceClick, fechaKey = "fecha_visita", textoFecha }) => (
  <ul style={{ listStyle: "none", padding: 0 }}>
    {places.map((place, i) => (
      <li key={place.id || place.place_id || place._id || i} style={{ margin: "12px 0" }}>
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
