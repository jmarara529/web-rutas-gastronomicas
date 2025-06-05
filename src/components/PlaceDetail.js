// Reemplazar todo el contenido por el PlaceDetail completo y funcional migrado desde search/PlaceDetail.js
import React, { useState, useEffect } from "react";
import Tabs from "./Tabs";
import { addReview, getReviews } from "../api/plazes/reviews";
import axios from "axios";
import { addFavorite } from "../api/plazes/addFavorite";
import { getVisitados, addVisitado } from "../api/plazes/visitados";
import { getLugarId } from "../api/plazes/getLugarId";
import "../styles/pages/search.css";

const PlaceDetail = ({ place }) => {
  // Copio la función getImgSrc de PlaceCard para unificar la lógica de imagen
  function getImgSrc(place) {
    if (place && place.photos && place.photos.length > 0) {
      const p = place.photos[0];
      if (p.name && p.name.startsWith('photo_reference/')) {
        const ref = p.name.replace('photo_reference/', '');
        return `${process.env.REACT_APP_API_BASE_URL}/places/photo?photo_reference=${encodeURIComponent(ref)}`;
      } else if (p.photo_reference) {
        return `${process.env.REACT_APP_API_BASE_URL}/places/photo?photo_reference=${encodeURIComponent(p.photo_reference)}`;
      } else if (p.name) {
        return `${process.env.REACT_APP_API_BASE_URL}/places/photo?name=${encodeURIComponent(p.name)}`;
      }
    } else if (place && place.fotos && place.fotos.length > 0) {
      return place.fotos[0];
    }
    return process.env.PUBLIC_URL + "/images/nophoto.png";
  }

  const [imgSrc, setImgSrc] = useState(getImgSrc(place));
  const [imgLoaded, setImgLoaded] = useState(false);
  const [googleReviews, setGoogleReviews] = useState([]);
  const [appReviews, setAppReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [googleSort, setGoogleSort] = useState("reciente");
  const [appSort, setAppSort] = useState("reciente");
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const isAdmin = localStorage.getItem("es_admin") === "true";
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = String(payload.id);
        localStorage.setItem("user_id", userId);
      }
    } catch {}
  }
  const [menuOpen, setMenuOpen] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewStars, setEditReviewStars] = useState(0);
  const [embedUrl, setEmbedUrl] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isVisitado, setIsVisitado] = useState(false);

  useEffect(() => {
    setImgSrc(getImgSrc(place));
    setImgLoaded(false);
  }, [place]);

  useEffect(() => {
    if (!place) return;
    setReviewsLoading(true);
    let google = [];
    if (place.reviews) google = place.reviews;
    setGoogleReviews(google);
    getReviews(place.id || place.place_id)
      .then(data => setAppReviews(data))
      .catch(() => setAppReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [place]);

  useEffect(() => {
    if (!place) return setEmbedUrl(null);
    let lat = null, lng = null;
    const name = place.displayName?.text || place.name || "Sin nombre";
    if (place.location && place.location.latitude && place.location.longitude) {
      lat = place.location.latitude;
      lng = place.location.longitude;
    } else if (place.geometry && place.geometry.location) {
      lat = place.geometry.location.lat;
      lng = place.geometry.location.lng;
    }
    if (lat && lng) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/maps/embed`, { params: { lat, lng, q: name } })
        .then(res => setEmbedUrl(res.data.url))
        .catch(() => setEmbedUrl(null));
    } else {
      setEmbedUrl(null);
    }
  }, [place]);

  useEffect(() => {
    const fetchStates = async () => {
      const token = localStorage.getItem("token");
      try {
        const favRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/favoritos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentPlaceId = (place.id || place.place_id || "").toString().trim().toLowerCase();
        let isFav = false;
        for (const f of favRes.data) {
          if ((f.place_id || "").toString().trim().toLowerCase() === currentPlaceId) {
            isFav = true;
            break;
          }
          if (f.id && place.id && String(f.id) === String(place.id)) {
            isFav = true;
            break;
          }
        }
        setIsFavorite(isFav);
      } catch {}
      try {
        const visRes = await getVisitados(token);
        setIsVisitado(!!visRes.find(v => v.place_id === (place.id || place.place_id)));
      } catch {}
    };
    if (place && (place.id || place.place_id)) fetchStates();
  }, [place]);

  function sortReviews(reviews, sortType, isGoogle = false) {
    if (!reviews) return [];
    let sorted = [...reviews];
    if (sortType === "reciente") {
      sorted.sort((a, b) => {
        const dateA = new Date(a.fecha || a.time || 0);
        const dateB = new Date(b.fecha || b.time || 0);
        return dateB - dateA;
      });
    } else if (sortType === "antiguo") {
      sorted.sort((a, b) => {
        const dateA = new Date(a.fecha || a.time || 0);
        const dateB = new Date(b.fecha || b.time || 0);
        return dateA - dateB;
      });
    } else if (sortType === "mejor") {
      sorted.sort((a, b) => (b.rating || b.calificacion || 0) - (a.rating || a.calificacion || 0));
    } else if (sortType === "peor") {
      sorted.sort((a, b) => (a.rating || a.calificacion || 0) - (b.rating || b.calificacion || 0));
    }
    return sorted;
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError("");
    try {
      const token = localStorage.getItem("token");
      await addReview({
        place_id: place.id || place.place_id,
        calificacion: reviewStars,
        comentario: reviewText
      }, token);
      setReviewText("");
      setReviewStars(0);
      const data = await getReviews(place.id || place.place_id, token);
      setAppReviews(data);
    } catch (err) {
      setReviewError("No se pudo enviar la reseña");
    }
    setReviewSubmitting(false);
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta reseña?")) return;
    setReviewSubmitting(true);
    setReviewError("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/resenas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await getReviews(place.id || place.place_id, token);
      setAppReviews(data);
    } catch (err) {
      setReviewError("No se pudo eliminar la reseña");
    }
    setReviewSubmitting(false);
  };

  const handleEditClick = (review) => {
    setEditReviewId(review.id);
    setEditReviewText(review.comentario);
    setEditReviewStars(review.calificacion);
    setMenuOpen(null);
  };

  const handleEditSave = async () => {
    setReviewSubmitting(true);
    setReviewError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/resenas/${editReviewId}`, {
        calificacion: editReviewStars,
        comentario: editReviewText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await getReviews(place.id || place.place_id, token);
      setAppReviews(data);
      setEditReviewId(null);
      setEditReviewText("");
      setEditReviewStars(0);
    } catch (err) {
      setReviewError("No se pudo editar la reseña");
    }
    setReviewSubmitting(false);
  };

  const handleEditCancel = () => {
    setEditReviewId(null);
    setEditReviewText("");
    setEditReviewStars(0);
  };

  const handleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!isFavorite) {
      await addFavorite(place, token);
      setIsFavorite(true);
    } else {
      try {
        const id_lugar = await getLugarId(place.id || place.place_id, token);
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/favoritos/${id_lugar}`,
          { headers: { Authorization: `Bearer ${token}` } });
        setIsFavorite(false);
      } catch (err) {
        alert("No se pudo eliminar de favoritos");
      }
    }
  };

  const handleVisitado = async () => {
    const token = localStorage.getItem("token");
    if (!isVisitado) {
      await addVisitado(place, token);
      setIsVisitado(true);
    } else {
      try {
        const id_lugar = await getLugarId(place.id || place.place_id, token);
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/visitados/${id_lugar}`,
          { headers: { Authorization: `Bearer ${token}` } });
        setIsVisitado(false);
      } catch (err) {
        alert("No se pudo eliminar de visitados");
      }
    }
  };

  if (!place) return <div>No hay datos del sitio.</div>;
  const name = place.displayName?.text || place.name || "Sin nombre";
  const rating = place.rating || "-";
  let lat = null, lng = null;
  if (place.location && place.location.latitude && place.location.longitude) {
    lat = place.location.latitude;
    lng = place.location.longitude;
  } else if (place.geometry && place.geometry.location) {
    lat = place.geometry.location.lat;
    lng = place.geometry.location.lng;
  }

  function StarRating({ value, onChange }) {
    const [hover, setHover] = useState(null);
    return (
      <span style={{ fontSize: 24, cursor: "pointer", color: "#ff9800" }}>
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onClick={() => onChange(star)}
            onMouseOver={() => setHover(star)}
            onMouseOut={() => setHover(null)}
            style={{ marginRight: 2 }}
          >
            {star <= (hover !== null ? hover : value) ? '★' : '☆'}
          </span>
        ))}
      </span>
    );
  }

  function renderAppReviews() {
    return (
      <ul className="reviews-list">
        {sortReviews(appReviews, appSort).map((r, i) => {
          const isOwner = userId && (String(r.id_usuario) === String(userId));
          const canEdit = isOwner;
          const canDelete = isOwner || isAdmin;
          const userLabel = r.nombre_usuario || r.usuario || "";
          return (
            <li key={i} className="review-app" style={{ position: 'relative' }}>
              <div style={{ fontWeight: 500 }}>{userLabel}</div>
              <div>⭐ {r.calificacion}</div>
              <div style={{ fontStyle: "italic" }}>{r.comentario}</div>
              <div style={{ fontSize: 12, color: "#aaa" }}>{r.fecha}</div>
              {(canEdit || canDelete) && (
                <div className="review-menu-trigger" style={{ position: 'absolute', top: 8, right: 8 }}>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#ff9800' }}
                    onClick={() => setMenuOpen(menuOpen === i ? null : i)}
                    title="Opciones"
                  >
                    &#8942;
                  </button>
                  {menuOpen === i && (
                    <div className="review-menu" style={{ position: 'absolute', top: 24, right: 0 }}>
                      {canEdit && <div className="edit" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleEditClick(r)}>Editar</div>}
                      {canDelete && <div className="delete" style={{ padding: '8px 16px', cursor: 'pointer', color: '#e53935' }} onClick={() => { handleDeleteReview(r.id); setMenuOpen(null); }}>Eliminar</div>}
                    </div>
                  )}
                </div>
              )}
              {editReviewId === r.id && (
                <div style={{ marginTop: 12, background: '#181818', borderRadius: 6, padding: 12 }}>
                  <textarea
                    value={editReviewText}
                    onChange={e => setEditReviewText(e.target.value)}
                    rows={3}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                  <div style={{ marginBottom: 8 }}>
                    <span>Calificación: </span>
                    <StarRating value={editReviewStars} onChange={setEditReviewStars} />
                  </div>
                  <button onClick={handleEditSave} disabled={reviewSubmitting} style={{ marginRight: 8 }}>Guardar</button>
                  <button onClick={handleEditCancel} disabled={reviewSubmitting}>Cancelar</button>
                  {reviewError && <div style={{ color: '#e53935', marginTop: 8 }}>{reviewError}</div>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="place-detail">
      <img
        src={imgSrc}
        alt={name}
        style={{ width: 400, borderRadius: 12, marginBottom: 16, opacity: imgLoaded ? 1 : 0.5, transition: "opacity 0.2s" }}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(true)}
      />
      <h2>{name}</h2>
      <div><b>Dirección:</b> {place.formattedAddress || place.vicinity || "-"}</div>
      <div><b>Calificación:</b> {rating}</div>
      <div><b>Tipos:</b> {place.types && place.types.join(", ")}</div>
      {place.websiteUri && <div><a href={place.websiteUri} target="_blank" rel="noopener noreferrer">Sitio web</a></div>}
      {place.nationalPhoneNumber && <div><b>Teléfono:</b> {place.nationalPhoneNumber}</div>}
      {lat && lng && (
        <div style={{ position: "relative", margin: "24px 0" }}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: 12 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa"
            />
          ) : (
            <div style={{ background: '#2a2a2a', borderRadius: 12, padding: 16, textAlign: 'center', color: '#ff9800', marginBottom: 8 }}>
              <b>El mapa no se puede mostrar.</b><br />
              Verifica que tu clave de Google Maps Platform tiene permisos para Maps Embed API.
            </div>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <button className="btn" onClick={handleFavorite} style={{ background: isFavorite ? '#e53935' : '#ff9800', color: '#fff' }}>
          {isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
        </button>
        <button className="btn" onClick={handleVisitado} style={{ background: isVisitado ? '#388e3c' : '#ff9800', color: '#fff' }}>
          {isVisitado ? 'Eliminar de visitados' : 'Marcar como visitado'}
        </button>
      </div>
      <Tabs
        tabs={[
          {
            label: `Comentarios de Google (${googleReviews.length})`,
            content: (
              <>
                <div style={{ marginBottom: 8 }}>
                  <label>Ordenar por: </label>
                  <select value={googleSort} onChange={e => setGoogleSort(e.target.value)}>
                    <option value="reciente">Más reciente</option>
                    <option value="antiguo">Más antiguo</option>
                    <option value="mejor">Mejor calificación</option>
                    <option value="peor">Peor calificación</option>
                  </select>
                </div>
                {reviewsLoading ? (
                  <div>Cargando comentarios...</div>
                ) : googleReviews.length === 0 ? (
                  <div>No hay comentarios de Google.</div>
                ) : (
                  <ul className="reviews-list">
                    {sortReviews(googleReviews, googleSort, true).map((r, i) => (
                      <li key={i} className="review-google">
                        <div style={{ fontWeight: 500 }}>{r.author_name || r.author || "Usuario Google"}</div>
                        <div>⭐ {r.rating}</div>
                        <div style={{ fontStyle: "italic" }}>{r.text}</div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{r.relative_time_description || r.time}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )
          },
          {
            label: `Comentarios de la app (${appReviews.length})`,
            content: (
              <>
                <div style={{ marginBottom: 8 }}>
                  <label>Ordenar por: </label>
                  <select value={appSort} onChange={e => setAppSort(e.target.value)}>
                    <option value="reciente">Más reciente</option>
                    <option value="antiguo">Más antiguo</option>
                    <option value="mejor">Mejor calificación</option>
                    <option value="peor">Peor calificación</option>
                  </select>
                </div>
                <form style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }} onSubmit={handleSubmitReview}>
                  <input type="text" placeholder="Tu comentario..." style={{ width: "60%" }} required value={reviewText} onChange={e => setReviewText(e.target.value)} />
                  <StarRating value={reviewStars} onChange={setReviewStars} />
                  <button type="submit" disabled={reviewSubmitting || !reviewStars || !reviewText}>Enviar</button>
                </form>
                {reviewError && <div style={{ color: '#ff9800', marginBottom: 8 }}>{reviewError}</div>}
                {reviewsLoading ? (
                  <div>Cargando comentarios...</div>
                ) : appReviews.length === 0 ? (
                  <div>No hay comentarios en la app.</div>
                ) : (
                  renderAppReviews()
                )}
              </>
            )
          }
        ]}
      />
    </div>
  );
};

export default PlaceDetail;
