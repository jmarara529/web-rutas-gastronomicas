import React, { useState, useEffect } from "react";
import "../styles/pages/search.css";

// Recibe la prop fechaVisita
const PlaceCard = ({ place, onClick, onAddFavorite, fechaVisita, textoFecha }) => {
  const [imgSrc, setImgSrc] = useState(process.env.PUBLIC_URL + "/images/nophoto.png");
  const [imgLoaded, setImgLoaded] = useState(false);
  const name = place.displayName?.text || place.name || place.nombre_lugar || "Sin nombre";
  const rating = place.rating || place.calificacion || "-";

  // Formatear la fecha si está disponible
  let fechaVisitaStr = "";
  let fechaDebug = fechaVisita;
  if (!fechaVisita && place) {
    fechaDebug = place.fecha_visita || place.fecha_agregado || place.fecha_favorito;
  }
  // Forzar a mostrar la fecha si existe, aunque sea string ISO
  if (fechaDebug && typeof fechaDebug === 'string' && fechaDebug.length > 6) {
    // Mostrar en consola para depuración
    console.log('DEBUG fechaVisita:', fechaDebug, place);
    // Extraer solo la parte de fecha si es formato ISO
    let fechaSolo = fechaDebug.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaSolo)) {
      const [anio, mes, dia] = fechaSolo.split('-');
      fechaVisitaStr = `${textoFecha || 'Fecha de visita'}: ${dia}/${mes}/${anio}`;
    } else {
      // Fallback a Date si no es ISO
      const d = new Date(fechaDebug);
      if (!isNaN(d) && d.getFullYear() > 1970) {
        const dia = d.getDate().toString().padStart(2, '0');
        const mes = (d.getMonth() + 1).toString().padStart(2, '0');
        const anio = d.getFullYear();
        fechaVisitaStr = `${textoFecha || 'Fecha de visita'}: ${dia}/${mes}/${anio}`;
      }
    }
  }
  // DEBUG: Forzar renderizado de la fecha para pruebas
  if (!fechaVisitaStr && fechaDebug) {
    fechaVisitaStr = `${textoFecha || 'Fecha de visita'}: ${fechaDebug}`;
  }

  useEffect(() => {
    let url = null;
    if (place.photos && place.photos.length > 0) {
      if (place.photos[0].name && !place.photos[0].name.startsWith('photo_reference/')) {
        url = `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxWidthPx=120&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
      } else if (place.photos[0].name && place.photos[0].name.startsWith('photo_reference/')) {
        const ref = place.photos[0].name.replace('photo_reference/', '');
        url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=120&photoreference=${ref}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
      }
    } else if (place.fotos && place.fotos.length > 0) {
      url = place.fotos[0];
    }
    if (url) {
      const img = new window.Image();
      img.onload = () => {
        setImgSrc(url);
        setImgLoaded(true);
      };
      img.onerror = () => {
        setImgLoaded(true);
      };
      img.src = url;
    } else {
      setImgLoaded(true);
    }
  }, [place]);

  return (
    <div className="place-card" tabIndex={0} role="button" onClick={onClick}>
      <img
        src={imgSrc}
        alt={name}
        className="place-card-photo"
        style={{ opacity: imgLoaded ? 1 : 0.5, transition: "opacity 0.2s" }}
      />
      <div className="place-card-center">
        <div className="place-card-title">{name}</div>
        {fechaVisitaStr && (
          <div style={{ fontSize: 13, color: '#bbb', margin: '4px 0 0 0' }}>{fechaVisitaStr}</div>
        )}
        <div className="place-card-rating">⭐ {rating}</div>
      </div>
    </div>
  );
};

export default PlaceCard;
