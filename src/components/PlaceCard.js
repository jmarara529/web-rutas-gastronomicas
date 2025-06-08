// Importa React y hooks necesarios
import React, { useState } from "react";
import "../styles/pages/search.css";
import "../styles/components/placeCard.css";

// Componente para mostrar la información de un lugar en una tarjeta visual
// Recibe props: place (objeto del lugar), onClick (handler al hacer click), onAddFavorite (handler para agregar a favoritos), fechaVisita (fecha opcional), textoFecha (texto personalizado para la fecha)
const PlaceCard = ({ place, onClick, onAddFavorite, fechaVisita, textoFecha }) => {
  // Estado para controlar si la imagen ya se cargó
  const [imgLoaded, setImgLoaded] = useState(false);
  // Obtiene el nombre del lugar de diferentes posibles campos
  const name = place.displayName?.text || place.name || place.nombre_lugar || "Sin nombre";
  // Obtiene la calificación del lugar
  const rating = place.rating || place.calificacion || "-";

  // Formatea la fecha de visita si está disponible
  let fechaVisitaStr = "";
  let fechaDebug = fechaVisita;
  if (!fechaVisita && place) {
    fechaDebug = place.fecha_visita || place.fecha_agregado || place.fecha_favorito;
  }
  // Si hay fecha, la formatea a DD/MM/AAAA o muestra el string original
  if (fechaDebug && typeof fechaDebug === 'string' && fechaDebug.length > 6) {
    // Muestra en consola para depuración
    console.log('DEBUG fechaVisita:', fechaDebug, place);
    // Extrae solo la parte de fecha si es formato ISO
    let fechaSolo = fechaDebug.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaSolo)) {
      const [anio, mes, dia] = fechaSolo.split('-');
      fechaVisitaStr = `${textoFecha || 'Fecha de visita'}: ${dia}/${mes}/${anio}`;
    } else {
      // Si no es ISO, intenta formatear con Date
      const d = new Date(fechaDebug);
      if (!isNaN(d) && d.getFullYear() > 1970) {
        const dia = d.getDate().toString().padStart(2, '0');
        const mes = (d.getMonth() + 1).toString().padStart(2, '0');
        const anio = d.getFullYear();
        fechaVisitaStr = `${textoFecha || 'Fecha de visita'}: ${dia}/${mes}/${anio}`;
      }
    }
  }
  // Si no se pudo formatear, muestra la fecha como string
  if (!fechaVisitaStr && fechaDebug) {
    fechaVisitaStr = `${textoFecha || 'Fecha de visita'}: ${fechaDebug}`;
  }

  // Función para obtener la URL de la imagen del lugar
  function getImgSrc(place) {
    if (place && place.photos && place.photos.length > 0) {
      // Muestra en consola para depuración
      console.log('[DEBUG][PlaceCard] photos:', place.photos);
      const p = place.photos[0];
      // Diferentes formatos posibles para la imagen
      if (p.name && p.name.startsWith('photo_reference/')) {
        // Formato legacy: photo_reference en name
        const ref = p.name.replace('photo_reference/', '');
        console.log('[DEBUG][PlaceCard] Usando photo_reference en name:', ref);
        return `${process.env.REACT_APP_API_BASE_URL}/places/photo?photo_reference=${encodeURIComponent(ref)}`;
      } else if (p.photo_reference) {
        // Formato legacy: photo_reference directo
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
    // Imagen por defecto si no hay ninguna disponible
    return process.env.PUBLIC_URL + "/images/nophoto.png";
  }

  // Obtiene la URL de la imagen a mostrar
  const imgSrc = getImgSrc(place);

  // Renderiza la tarjeta del lugar
  return (
    <div className="place-card" tabIndex={0} role="button" onClick={onClick}>
      <img
        src={imgSrc}
        alt={name}
        className={`place-card-photo${imgLoaded ? '' : ' place-card-photo--loading'}`}
        onLoad={() => setImgLoaded(true)}
        onError={e => { e.target.onerror = null; e.target.src = process.env.PUBLIC_URL + "/images/nophoto.png"; setImgLoaded(true); }}
      />
      <div className="place-card-center">
        <div className="place-card-title">{name}</div>
        {/* Muestra la fecha de visita si está disponible */}
        {fechaVisitaStr && (
          <div className="place-card-fecha">{fechaVisitaStr}</div>
        )}
        <div className="place-card-rating">⭐ {rating}</div>
      </div>
    </div>
  );
};

export default PlaceCard;
