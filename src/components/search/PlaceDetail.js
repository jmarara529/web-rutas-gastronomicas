import React, { useState, useEffect } from "react";
import "../../styles/pages/search.css";

const PlaceDetail = ({ place }) => {
  const [imgSrc, setImgSrc] = useState(process.env.PUBLIC_URL + "/images/nophoto.png");
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!place) return;
    // Obtener la URL de la foto para legacy y para API New
    let photoUrl = process.env.PUBLIC_URL + "/images/nophoto.png";
    if (place.photos && place.photos.length > 0) {
      // API New
      if (place.photos[0].name) {
        photoUrl = `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxWidthPx=400&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
      }
      // Legacy
      if (place.photos[0].photo_reference) {
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
      }
    }

    const img = new window.Image();
    img.onload = () => {
      setImgSrc(photoUrl);
      setImgLoaded(true);
    };
    img.onerror = () => {
      setImgLoaded(true);
    };
    img.src = photoUrl;
  }, [place]);

  if (!place) return <div>No hay datos del sitio.</div>;
  const name = place.displayName?.text || place.name || "Sin nombre";
  const rating = place.rating || "-";

  return (
    <div className="place-detail">
      <img
        src={imgSrc}
        alt={name}
        style={{ width: 400, borderRadius: 12, marginBottom: 16, opacity: imgLoaded ? 1 : 0.5, transition: "opacity 0.2s" }}
      />
      <h2>{name}</h2>
      <div><b>Dirección:</b> {place.formattedAddress || place.vicinity || "-"}</div>
      <div><b>Calificación:</b> {rating}</div>
      <div><b>Tipos:</b> {place.types && place.types.join(", ")}</div>
      {place.websiteUri && <div><a href={place.websiteUri} target="_blank" rel="noopener noreferrer">Sitio web</a></div>}
      {place.nationalPhoneNumber && <div><b>Teléfono:</b> {place.nationalPhoneNumber}</div>}
    </div>
  );
};

export default PlaceDetail;
