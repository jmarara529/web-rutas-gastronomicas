import React, { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import PerfilBlock from "../components/PerfilBlock";
import "../styles/pages/page-common.css";
import "../styles/pages/search.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DynamicUserForm from "../components/DynamicUserForm";
import ReviewList from "../components/ReviewList";
import PlacesList from "../components/PlacesList";

const Perfil = () => {
  const [user, setUser] = useState({ nombre: "", correo: "" });
  const [editMode, setEditMode] = useState(false);
  const [visitados, setVisitados] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null); // índice del comentario con menú abierto
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewStars, setEditReviewStars] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteForm, setDeleteForm] = useState({ correo: "", password: "" });
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("es_admin") === "true";

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        // Obtener datos usuario
        const userRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/usuarios/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userRes.data;
        setUser(userData || {});
        // Visitados
        const visitadosRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/visitados`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let visitadosData = visitadosRes.data || [];
        // Si hay visitados, obtener detalles de Google para cada uno
        visitadosData = await Promise.all(visitadosData.map(async (v) => {
          let placeId = v.place_id;
          if (!placeId && v.id_lugar) {
            try {
              const lugarRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/lugares/byid/${v.id_lugar}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (lugarRes.data && lugarRes.data.place_id) placeId = lugarRes.data.place_id;
            } catch {}
          }
          if (placeId) {
            try {
              const placeDetail = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/places/detalles`, { params: { place_id: placeId } });
              if (placeDetail.data && placeDetail.data.result) {
                let photos = placeDetail.data.result.photos;
                // Adaptar fotos tanto para API moderna como legacy
                if (photos && photos.length > 0) {
                  photos = photos.map(p => {
                    if (p.photo_reference) {
                      return { name: `photo_reference/${p.photo_reference}` };
                    } else if (p.name) {
                      return { name: p.name };
                    }
                    return null;
                  }).filter(Boolean);
                }
                return {
                  ...v,
                  ...placeDetail.data.result,
                  place_id: placeId,
                  displayName: { text: placeDetail.data.result.name || v.nombre_lugar || v.nombre || "Sin nombre" },
                  name: placeDetail.data.result.name || v.nombre_lugar || v.nombre || "Sin nombre",
                  rating: placeDetail.data.result.rating || v.rating || "-",
                  ...(photos && photos.length > 0 ? { photos } : {})
                };
              }
              return {
                ...v,
                displayName: { text: v.nombre_lugar || v.nombre || "Sin nombre" },
                name: v.nombre_lugar || v.nombre || "Sin nombre",
                rating: v.rating || "-"
              };
            } catch (e) {
              return {
                ...v,
                displayName: { text: v.nombre_lugar || v.nombre || "Sin nombre" },
                name: v.nombre_lugar || v.nombre || "Sin nombre",
                rating: v.rating || "-"
              };
            }
          }
          return {
            ...v,
            displayName: { text: v.nombre_lugar || v.nombre || "Sin nombre" },
            name: v.nombre_lugar || v.nombre || "Sin nombre",
            rating: v.rating || "-"
          };
        }));
        setVisitados(visitadosData);
        // Favoritos
        const favRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/favoritos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let favoritosData = favRes.data || [];
        // Si hay favoritos, obtener detalles de Google para cada uno
        favoritosData = await Promise.all(favoritosData.map(async (fav) => {
          let placeId = fav.place_id;
          if (!placeId && fav.id_lugar) {
            try {
              const lugarRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/lugares/byid/${fav.id_lugar}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (lugarRes.data && lugarRes.data.place_id) placeId = lugarRes.data.place_id;
            } catch {}
          }
          if (placeId) {
            try {
              const placeDetail = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/places/detalles`, { params: { place_id: placeId } });
              if (placeDetail.data && placeDetail.data.result) {
                let photos = placeDetail.data.result.photos;
                // Adaptar fotos tanto para API moderna como legacy
                if (photos && photos.length > 0) {
                  photos = photos.map(p => {
                    if (p.photo_reference) {
                      return { name: `photo_reference/${p.photo_reference}` };
                    } else if (p.name) {
                      return { name: p.name };
                    }
                    return null;
                  }).filter(Boolean);
                }
                return {
                  ...fav,
                  ...placeDetail.data.result,
                  place_id: placeId,
                  displayName: { text: placeDetail.data.result.name || fav.nombre_lugar || fav.nombre || "Sin nombre" },
                  name: placeDetail.data.result.name || fav.nombre_lugar || fav.nombre || "Sin nombre",
                  rating: placeDetail.data.result.rating || fav.rating || "-",
                  ...(photos && photos.length > 0 ? { photos } : {})
                };
              }
              return fav;
            } catch (e) {
              return fav;
            }
          }
          return fav;
        }));
        setFavoritos(favoritosData);
        // Comentarios propios
        const comRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/resenas/usuario`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComentarios(comRes.data || []);
      } catch (err) {
        setError("Error al cargar datos del perfil");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleEdit = () => {
    if (user.id !== 1) setEditMode(true);
  };
  const handleCancel = () => setEditMode(false);

  const handlePlaceClick = place => {
    navigate(`/sitio/${place.place_id || place.id}`);
  };

  // StarRating fuera del callback
  function StarRating({ value, onChange }) {
    const [hover, setHover] = React.useState(null);
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

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError("");
    setDeleteLoading(true);
    try {
      // Verificar credenciales
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        correo: deleteForm.correo,
        contraseña: deleteForm.password
      });
      if (!res.data || !res.data.token) throw new Error("Credenciales incorrectas");
      // Eliminar cuenta
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/usuarios/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.clear();
      window.location.href = "/";
      return; // Evita seguir ejecutando el formulario tras eliminar
    } catch (err) {
      let msg = "Error: credenciales incorrectas o no se pudo eliminar la cuenta";
      if (err.response && err.response.data && (err.response.data.msg || err.response.data.error)) {
        msg = err.response.data.msg || err.response.data.error;
      }
      setDeleteError(msg);
    }
    setDeleteLoading(false);
  };

  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content">
        <h1>Mi Perfil</h1>
        {loading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#ff9800" }}>{error}</div>
        ) : (
          <>
            {/* DATOS USUARIO */}
            <PerfilBlock title="Datos de usuario" action={(!editMode && user.id !== 1) ? <button className="btn" onClick={handleEdit}>Editar</button> : null}>
              {(!editMode || user.id === 1) ? (
                <>
                  <div><b>Nombre:</b> {user.nombre}</div>
                  <div><b>Correo:</b> {user.correo}</div>
                  {user.id !== 1 && (
                    <div style={{ marginTop: 16 }}>
                      {!showDelete ? (
                        <button className="btn" style={{ background: '#e53935', color: '#fff' }} onClick={() => setShowDelete(true)}>
                          Eliminar cuenta
                        </button>
                      ) : (
                        <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                          <div style={{ color: '#e53935', fontWeight: 600 }}>Esta acción es irreversible. Ingresa tus credenciales para confirmar:</div>
                          <input type="email" placeholder="Correo" value={deleteForm.correo} onChange={e => setDeleteForm({ ...deleteForm, correo: e.target.value })} required />
                          <input type="password" placeholder="Contraseña" value={deleteForm.password} onChange={e => setDeleteForm({ ...deleteForm, password: e.target.value })} required />
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn" type="submit" style={{ background: '#e53935', color: '#fff' }} disabled={deleteLoading}>Confirmar eliminación</button>
                            <button className="btn" type="button" onClick={() => setShowDelete(false)} disabled={deleteLoading}>Cancelar</button>
                          </div>
                          {deleteError && <div style={{ color: '#e53935', fontWeight: 500 }}>{deleteError}</div>}
                        </form>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <DynamicUserForm
                  fields={[
                    { name: "nombre", label: "Nombre", type: "text", required: true, autoComplete: "name" },
                    { name: "correo", label: "Correo", type: "email", required: true, autoComplete: "email" },
                    { name: "password", label: "Contraseña", type: "password", required: false, autoComplete: "new-password", placeholder: "Nueva contraseña" }
                  ]}
                  initialValues={user}
                  onSubmit={async (form) => {
                    setError("");
                    setLoading(true);
                    try {
                      const token = localStorage.getItem("token");
                      const userId = user.id;
                      if (form.nombre !== user.nombre) {
                        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/usuarios/nombre/${userId}`, { nombre: form.nombre }, { headers: { Authorization: `Bearer ${token}` } });
                      }
                      if (form.correo !== user.correo) {
                        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/usuarios/correo/${userId}`, { correo: form.correo }, { headers: { Authorization: `Bearer ${token}` } });
                      }
                      if (form.password) {
                        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/usuarios/contrasena/${userId}`, { contraseña: form.password }, { headers: { Authorization: `Bearer ${token}` } });
                      }
                      // Re-login automático
                      const loginRes = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, { correo: form.correo, contraseña: form.password || undefined });
                      localStorage.setItem("token", loginRes.data.token);
                      setEditMode(false);
                      window.location.reload();
                    } catch (err) {
                      setError("Error al guardar cambios");
                    }
                    setLoading(false);
                  }}
                  onCancel={handleCancel}
                  loading={loading}
                  error={error}
                  submitText="Guardar"
                  showCancel={true}
                />
              )}
            </PerfilBlock>
            {/* LUGARES VISITADOS */}
            <PerfilBlock title="Lugares visitados" action={<button className="btn" onClick={() => navigate("/lugares-visitados")}>Ver más</button>}>
              <div className="perfil-places-list">
                <PlacesList 
                  places={visitados.slice(0, 3)}
                  onPlaceClick={handlePlaceClick}
                  fechaKey="fecha_visita"
                  textoFecha="Fecha de visita"
                />
                {visitados.length === 0 && <div style={{ color: "#aaa" }}>No has visitado ningún lugar aún.</div>}
              </div>
            </PerfilBlock>
            {/* FAVORITOS */}
            <PerfilBlock title="Favoritos" action={<button className="btn" onClick={() => navigate("/favoritos")}>Ver más</button>}>
              <div className="perfil-places-list">
                <PlacesList 
                  places={favoritos.slice(0, 3)}
                  onPlaceClick={handlePlaceClick}
                  fechaKey="fecha_visita"
                  textoFecha="Fecha añadido a favoritos"
                />
                {favoritos.length === 0 && <div style={{ color: "#aaa" }}>No tienes favoritos aún.</div>}
              </div>
            </PerfilBlock>
            {/* COMENTARIOS */}
            <PerfilBlock title="Mis comentarios" action={<button className="btn" onClick={() => navigate("/mis-reseñas")}>Administrar</button>}>
              {comentarios.length === 0 ? (
                <div style={{ color: "#aaa" }}>No has escrito comentarios aún.</div>
              ) : (
                <ReviewList
                  reviews={comentarios.slice(0, 3)}
                  userId={user.id}
                  isAdmin={isAdmin}
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  editReviewId={editReviewId}
                  editReviewText={editReviewText}
                  editReviewStars={editReviewStars}
                  setEditReviewId={setEditReviewId}
                  setEditReviewText={setEditReviewText}
                  setEditReviewStars={setEditReviewStars}
                  reviewSubmitting={reviewSubmitting}
                  reviewError={reviewError}
                  onEditClick={(r) => { setEditReviewId(r.id); setEditReviewText(r.comentario); setEditReviewStars(r.calificacion); setMenuOpen(null); }}
                  onEditSave={async () => {
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
                      // Recargar comentarios
                      const comRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/resenas/usuario`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      setComentarios(comRes.data || []);
                      setEditReviewId(null);
                      setEditReviewText("");
                      setEditReviewStars(0);
                    } catch (err) {
                      setReviewError("No se pudo editar la reseña");
                    }
                    setReviewSubmitting(false);
                  }}
                  onEditCancel={() => { setEditReviewId(null); setEditReviewText(""); setEditReviewStars(0); }}
                  onDeleteReview={async (id) => {
                    if (!window.confirm("¿Seguro que quieres eliminar esta reseña?")) return;
                    setReviewSubmitting(true);
                    setReviewError("");
                    try {
                      const token = localStorage.getItem("token");
                      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/resenas/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      // Recargar comentarios
                      const comRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/resenas/usuario`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      setComentarios(comRes.data || []);
                    } catch (err) {
                      setReviewError("No se pudo eliminar la reseña");
                    }
                    setReviewSubmitting(false);
                  }}
                  StarRating={StarRating}
                />
              )}
            </PerfilBlock>
          </>
        )}
      </div>
    </div>
  );
};

export default Perfil;
