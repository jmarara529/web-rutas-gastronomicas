import React, { useState, useEffect } from "react";
import "../styles/pages/search.css";

// Recibe la prop fechaVisita
const PlaceCard = ({ place, onClick, onAddFavorite, fechaVisita, textoFecha }) => {
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

  // Unifica la lógica de obtención de imagen para evitar inconsistencias y usa siempre el mismo tamaño
  function getImgSrc(place) {
    if (place && place.photos && place.photos.length > 0) {
      // DEBUG: Mostrar cómo viene el campo photos
      console.log('[DEBUG][PlaceCard] photos:', place.photos);
      const p = place.photos[0];
      // Prueba todos los casos posibles
      if (p.name && p.name.startsWith('photo_reference/')) {
        // Legacy: photo_reference en name
        const ref = p.name.replace('photo_reference/', '');
        console.log('[DEBUG][PlaceCard] Usando photo_reference en name:', ref);
        return `${process.env.REACT_APP_API_BASE_URL}/places/photo?photo_reference=${encodeURIComponent(ref)}`;
      } else if (p.photo_reference) {
        // Legacy: photo_reference directo
        console.log('[DEBUG][PlaceCard] Usando photo_reference directo:', p.photo_reference);
        return `${process.env.REACT_APP_API_BASE_URL}/places/photo?photo_reference=${encodeURIComponent(p.photo_reference)}`;
      } else if (p.name) {
        // Nuevo formato Google Places API v1
        console.log('[DEBUG][PlaceCard] Usando name:', p.name);
        return `${process.env.REACT_APP_API_BASE_URL}/places/photo?name=${encodeURIComponent(p.name)}`;
      } else {
        console.warn('[DEBUG][PlaceCard] No se encontró campo válido para imagen en photos[0]', p);
      }
    } else if (place && place.fotos && place.fotos.length > 0) {
      // Imagen local o personalizada
      return place.fotos[0];
    }
    return process.env.PUBLIC_URL + "/images/nophoto.png";
  }

  const imgSrc = getImgSrc(place);

  // Elimina la precarga duplicada y solo marca como cargada cuando la imagen real se carga
  // Limpia logs de depuración

  return (
    <div className="place-card" tabIndex={0} role="button" onClick={onClick}>
      <img
        src={imgSrc}
        alt={name}
        className="place-card-photo"
        style={{ opacity: imgLoaded ? 1 : 0.5, transition: "opacity 0.2s" }}
        onLoad={() => setImgLoaded(true)}
        onError={e => { e.target.onerror = null; e.target.src = process.env.PUBLIC_URL + "/images/nophoto.png"; setImgLoaded(true); }}
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
