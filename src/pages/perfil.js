// PERFIL DEL USUARIO (Página principal de perfil)
// Muestra los datos del usuario, sus lugares visitados, favoritos y comentarios.
// Permite editar datos, eliminar cuenta y navegar a páginas de gestión.

import React, { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import PerfilBlock from "../components/PerfilBlock";
import "../styles/pages/page-common.css";
import "../styles/pages/search.css";
import "../styles/pages/perfil.css";
import "../styles/components/ui-common.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DynamicUserForm from "../components/DynamicUserForm";
import ReviewList from "../components/ReviewList";
import PlacesList from "../components/PlacesList";
import { deleteUsuario } from "../api/usuarios";
import { getFavoritos } from "../api/favoritos";
import { getVisitados } from "../api/visitados";
import { getResenasUsuario } from "../api/resenas";

const Perfil = () => {
  // --- ESTADO PRINCIPAL ---
  const [user, setUser] = useState({ nombre: "", correo: "" });
  const [editMode, setEditMode] = useState(false);
  const [visitados, setVisitados] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Estado para edición y eliminación de reseñas
  const [menuOpen, setMenuOpen] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewStars, setEditReviewStars] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  // Estado para eliminar cuenta
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteForm, setDeleteForm] = useState({ correo: "", password: "" });
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("es_admin") === "true";

  // --- CARGA DE DATOS DEL USUARIO Y SUS LISTAS ---
  useEffect(() => {
    const fetchData = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        // Obtener SIEMPRE los datos del usuario autenticado
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/usuarios/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data || {});
        // 2. Lugares visitados (enriquecidos con detalles de Google, ordenados por fecha descendente y limitados a 3)
        let visitadosData = await getVisitados(token);
        visitadosData = visitadosData
          .sort((a, b) => new Date(b.fecha_visita) - new Date(a.fecha_visita))
          .slice(0, 3);
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
        // 3. Favoritos (ordenados por fecha de agregado descendente y limitados a 3)
        let favoritosData = await getFavoritos(token);
        favoritosData = favoritosData
          .sort((a, b) => new Date(b.fecha_agregado) - new Date(a.fecha_agregado))
          .slice(0, 3);
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
        // 4. Comentarios propios (ordenados por fecha descendente y limitados a 3)
        const comRes = await getResenasUsuario(token);
        const comentariosRecientes = (comRes || [])
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 3);
        setComentarios(comentariosRecientes);
      } catch (err) {
        setError("Error al cargar datos del perfil");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- RECARGA AUTOMÁTICA EN CASO DE ERROR ---
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  // --- ACCIONES DE EDICIÓN Y NAVEGACIÓN ---
  const handleEdit = () => {
    if (user.id !== 1) setEditMode(true);
  };
  const handleCancel = () => setEditMode(false);
  const handlePlaceClick = place => {
    navigate(`/sitio/${place.place_id || place.id}`);
  };

  // --- COMPONENTE DE ESTRELLAS PARA RESEÑAS ---
  function StarRating({ value, onChange }) {
    const [hover, setHover] = React.useState(null);
    // Renderiza las estrellas con clases CSS en vez de estilos en línea
    return (
      <span className="perfil-star-rating">
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onClick={() => onChange(star)}
            onMouseOver={() => setHover(star)}
            onMouseOut={() => setHover(null)}
            className="perfil-star"
          >
            {star <= (hover !== null ? hover : value) ? '★' : '☆'}
          </span>
        ))}
      </span>
    );
  }

  // --- ELIMINAR USUARIO ---
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setDeleteError("");
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      await deleteUsuario(user.id, token);
      setDeleteLoading(false);
      window.location.href = "/login";
    } catch (err) {
      setDeleteError("No se pudo eliminar la cuenta");
      setDeleteLoading(false);
    }
  };

  // --- RENDER PRINCIPAL ---
  return (
    <div className="page-container">
      {/* Cabecera con menú de usuario */}
      <HeaderUser isAdmin={isAdmin} />
      <div className="content perfil-content">
        <h1>Mi Perfil</h1>
        {loading ? (
          <div className="estado-cargando">Cargando...</div>
        ) : error ? (
          <div className="estado-error">{error}</div>
        ) : (
          <>
            {/* DATOS USUARIO */}
            <PerfilBlock title="Datos de usuario" action={(!editMode && user.id !== 1) ? <button className="btn" onClick={handleEdit}>Editar</button> : null}>
              {/* Muestra datos o formulario de edición */}
              {(!editMode || user.id === 1) ? (
                <>
                  <div><b>Nombre:</b> {user.nombre}</div>
                  <div><b>Correo:</b> {user.correo}</div>
                  {/* Botón para eliminar cuenta */}
                  {user.id !== 1 && (
                    <div className="perfil-eliminar-cuenta">
                      {!showDelete ? (
                        <button className="btn perfil-eliminar-btn" onClick={() => setShowDelete(true)}>
                          Eliminar cuenta
                        </button>
                      ) : (
                        <form onSubmit={handleDeleteUser} className="perfil-eliminar-form">
                          <div className="perfil-eliminar-aviso">Esta acción es irreversible. Ingresa tus credenciales para confirmar:</div>
                          <input type="email" placeholder="Correo" value={deleteForm.correo} onChange={e => setDeleteForm({ ...deleteForm, correo: e.target.value })} required />
                          <input type="password" placeholder="Contraseña" value={deleteForm.password} onChange={e => setDeleteForm({ ...deleteForm, password: e.target.value })} required />
                          <div className="perfil-eliminar-form-botones">
                            <button className="btn perfil-eliminar-btn" type="submit" disabled={deleteLoading}>Confirmar eliminación</button>
                            <button className="btn" type="button" onClick={() => setShowDelete(false)} disabled={deleteLoading}>Cancelar</button>
                          </div>
                          {deleteError && <div className="perfil-eliminar-error">{deleteError}</div>}
                        </form>
                      )}
                    </div>
                  )}
                </>
              ) : (
                // Formulario de edición de usuario
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
                      if (form.password === "") delete form.password;
                      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/usuarios/${userId}`, form, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      setUser({ ...user, ...form });
                      setEditMode(false);
                    } catch (err) {
                      setError("Error al actualizar datos");
                    }
                    setLoading(false);
                  }}
                />
              )}
            </PerfilBlock>
            {/* LUGARES VISITADOS */}
            <PerfilBlock title="Lugares visitados" action={<button className="btn" onClick={() => navigate("/lugares-visitados")}>Ver más</button>}>
              <div className="perfil-places-list">
                <PlacesList 
                  places={visitados}
                  onPlaceClick={handlePlaceClick}
                  fechaKey="fecha_visita"
                  textoFecha="Fecha de visita"
                />
                {visitados.length === 0 && <div className="estado-vacio">No has visitado ningún lugar aún.</div>}
              </div>
            </PerfilBlock>
            {/* FAVORITOS */}
            <PerfilBlock title="Favoritos" action={<button className="btn" onClick={() => navigate("/favoritos")}>Ver más</button>}>
              <div className="perfil-places-list">
                <PlacesList 
                  places={favoritos}
                  onPlaceClick={handlePlaceClick}
                  fechaKey="fecha_agregado"
                  textoFecha="Fecha añadido a favoritos"
                />
                {favoritos.length === 0 && <div className="estado-vacio">No tienes favoritos aún.</div>}
              </div>
            </PerfilBlock>
            {/* COMENTARIOS */}
            <PerfilBlock title="Mis comentarios" action={<button className="btn" onClick={() => navigate("/mis-reseñas")}>Administrar</button>}>
              {comentarios.length === 0 ? (
                <div className="estado-vacio">No has escrito comentarios aún.</div>
              ) : (
                <ReviewList
                  reviews={comentarios}
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
                  onReviewClick={async r => {
                    if (editReviewId !== r.id) {
                      const placeId = r.place_id;
                      if (placeId) {
                        handlePlaceClick({ place_id: placeId });
                      } else if (r.id_lugar) {
                        try {
                          const token = localStorage.getItem("token");
                          const lugarRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/lugares/byid/${r.id_lugar}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          if (lugarRes.data && lugarRes.data.place_id) {
                            handlePlaceClick({ place_id: lugarRes.data.place_id });
                          }
                        } catch {}
                      }
                    }
                  }}
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
