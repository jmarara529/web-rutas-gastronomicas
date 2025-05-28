import React, { useState, useEffect } from "react";
import "../../styles/pages/search.css";

const PlaceCard = ({ place, onClick, onAddFavorite }) => {
  const [imgSrc, setImgSrc] = useState(process.env.PUBLIC_URL + "/images/nophoto.png");
  const [imgLoaded, setImgLoaded] = useState(false);
  const name = place.displayName?.text || place.name || "Sin nombre";
  const rating = place.rating || "-";

  useEffect(() => {
    if (place.photos && place.photos.length > 0) {
      const url = `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxWidthPx=120&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
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
      <div className="place-card-actions">
        <button
          className="fav-btn"
          title="Añadir a favoritos"
          onClick={e => {
            e.stopPropagation();
            onAddFavorite && onAddFavorite(place);
          }}
        >
          ❤️
        </button>
      </div>
    </div>
  );
};

export default PlaceCard;
