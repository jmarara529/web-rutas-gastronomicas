import React, { useState, useEffect } from "react";
import "../styles/pages/search.css";

const PerfilPlaceCard = ({ place, onClick }) => {
  const [imgSrc, setImgSrc] = useState(process.env.PUBLIC_URL + "/images/nophoto.png");
  const [imgLoaded, setImgLoaded] = useState(false);
  const name = place.displayName?.text || place.name || place.nombre_lugar || "Sin nombre";
  const rating = place.rating || place.calificacion || "-";

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
      // Soporte para campo fotos
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
        <div className="place-card-rating">⭐ {rating}</div>
      </div>
    </div>
  );
};

export default PerfilPlaceCard;
