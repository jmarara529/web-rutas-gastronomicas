import React, { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import PerfilBlock from "../components/PerfilBlock";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DynamicUserForm from "../components/DynamicUserForm";
import ReviewList from "../components/ReviewList";
import PlacesList from "../components/PlacesList";
import { getUsuarios, updateUsuario, deleteUsuario } from "../api/usuarios";
import { getFavoritos } from "../api/favoritos";
import { getVisitados } from "../api/visitados";
import { getResenasUsuario, deleteResena } from "../api/resenas";
import "../styles/pages/perfiladmin.css";

const PerfilAdmin = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({ nombre: "", correo: "" });
  const [editMode, setEditMode] = useState(false);
  const [visitados, setVisitados] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [formUser, setFormUser] = useState(null);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("es_admin") === "true";

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // Obtener datos usuario
        const userRes = await getUsuarios(token);
        const userData = (userRes || []).find(u => String(u.id) === String(userId)) || {};
        console.log('Datos usuario obtenidos en fetchData:', userData);
        // Normalizar es_admin a booleano para el formulario
        const normalizedUser = {
          ...userData,
          es_admin: userData.es_admin === true || userData.es_admin === 1 || userData.es_admin === "1" || userData.es_admin === "true"
        };
        console.log('Usuario normalizado en fetchData:', normalizedUser);
        setUser(normalizedUser);
        // Favoritos (ordenados por fecha de agregado descendente y limitados a 3)
        let favoritosData = await getFavoritos(token, userId);
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
            } catch (e) {
              return {
                ...fav,
                displayName: { text: fav.nombre_lugar || fav.nombre || "Sin nombre" },
                name: fav.nombre_lugar || fav.nombre || "Sin nombre",
                rating: fav.rating || "-"
              };
            }
          }
          return {
            ...fav,
            displayName: { text: fav.nombre_lugar || fav.nombre || "Sin nombre" },
            name: fav.nombre_lugar || fav.nombre || "Sin nombre",
            rating: fav.rating || "-"
          };
        }));
        setFavoritos(favoritosData);
        // Visitados (ordenados por fecha de visita descendente y limitados a 3)
        let visitadosData = await getVisitados(token, userId);
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
        // Comentarios (ordenados por fecha descendente y limitados a 3)
        const comRes = await getResenasUsuario(token, userId);
        const comentariosRecientes = (comRes || [])
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 3);
        setComentarios(comentariosRecientes);
      } catch (err) {
        setError("Error al cargar datos del usuario");
      }
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const handleEdit = async () => {
    // Al pulsar editar, consulta el valor actualizado de es_admin directamente de la API
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = res.data || {};
      console.log('Datos usuario obtenidos en handleEdit:', userData);
      setFormUser({
        ...userData,
        es_admin: userData.es_admin === true || userData.es_admin === 1 || userData.es_admin === "1" || userData.es_admin === "true"
      });
      setEditMode(true);
    } catch (err) {
      setError("No se pudo obtener el estado de administrador actualizado");
      console.error('Error en handleEdit:', err);
    }
    setLoading(false);
  };
  const handleCancel = () => setEditMode(false);

  const handleSave = async (form) => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await updateUsuario(userId, { ...form, es_admin: form.es_admin || false }, token);
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      setError("Error al guardar cambios");
    }
    setLoading(false);
  };

  const handleDeleteUser = async () => {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      await deleteUsuario(user.id, token);
      setDeleteLoading(false);
      window.location.href = "/administrar-usuarios";
    } catch (err) {
      setDeleteError("No se pudo eliminar el usuario");
      setDeleteLoading(false);
    }
  };

  const handlePlaceClick = place => {
    navigate(`/sitio/${place.place_id || place.id}`);
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este comentario?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteResena(id, token);
      // Recargar comentarios
      const comRes = await getResenasUsuario(token, userId);
      setComentarios(comRes || []);
    } catch (err) {
      alert("No se pudo eliminar el comentario");
    }
  };

  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content">
        <h1>Perfil de Usuario (Admin)</h1>
        {loading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div className="perfiladmin-error">{error}</div>
        ) : (
          <>
            <PerfilBlock title="Datos de usuario" action={!editMode && user.id !== 1 && user.correo ? <button className="btn" onClick={handleEdit}>Editar</button> : null}>
              {/* Muestra datos o formulario de edición */}
              {(!editMode || user.id === 1) ? (
                <>
                  <div><b>Nombre:</b> {user.nombre}</div>
                  <div><b>Correo:</b> {user.correo}</div>
                  <div><b>Administrador:</b> {user.es_admin ? "Sí" : "No"}</div>
                  {/* Botón para eliminar usuario */}
                  {user.id !== 1 && (
                    <div className="perfiladmin-eliminar-cuenta">
                      {!showDelete ? (
                        <button className="btn perfiladmin-eliminar-btn" onClick={() => setShowDelete(true)}>
                          Eliminar usuario
                        </button>
                      ) : (
                        <div className="perfiladmin-eliminar-confirm">
                          <div className="perfiladmin-eliminar-aviso">¿Seguro que deseas eliminar este usuario? Esta acción es irreversible.</div>
                          <div className="perfiladmin-eliminar-botones">
                            <button className="btn perfiladmin-eliminar-btn" onClick={handleDeleteUser} disabled={deleteLoading}>Aceptar</button>
                            <button className="btn" onClick={() => setShowDelete(false)} disabled={deleteLoading}>Cancelar</button>
                          </div>
                          {deleteError && <div className="perfiladmin-eliminar-error">{deleteError}</div>}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                // Formulario de edición de usuario
                formUser && (
                  <DynamicUserForm
                    key={formUser.id || formUser.correo || 'form'}
                    fields={[
                      { name: "nombre", label: "Nombre", type: "text", required: true, autoComplete: "name" },
                      { name: "correo", label: "Correo", type: "email", required: true, autoComplete: "email" },
                      { name: "password", label: "Contraseña", type: "password", required: false, autoComplete: "new-password", placeholder: "Nueva contraseña" },
                      { name: "es_admin", type: "hidden" } // <-- Añadido para que el formulario controle es_admin
                    ]}
                    initialValues={formUser}
                    onSubmit={handleSave}
                    onCancel={() => { setEditMode(false); setFormUser(null); }}
                    loading={loading}
                    error={error}
                    submitText="Guardar"
                    showCancel={true}
                    renderExtraFields={(form, handleChange) => {
                      console.log('Valores del formulario en renderExtraFields:', form);
                      return (
                        <div className="perfiladmin-extra-admin">
                          <label className="perfiladmin-admin-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            Administrador:
                            <span className="switch">
                              <input
                                type="checkbox"
                                name="es_admin"
                                checked={!!form.es_admin}
                                onChange={e => handleChange({ target: { name: 'es_admin', value: e.target.checked } })}
                                className="perfiladmin-admin-checkbox"
                                style={{ display: 'none' }}
                              />
                              <span className={form.es_admin ? "slider slider-on" : "slider"}></span>
                            </span>
                            <span className={form.es_admin ? "perfiladmin-admin-si" : "perfiladmin-admin-no"}>
                              {form.es_admin ? 'Sí' : 'No'}
                            </span>
                          </label>
                        </div>
                      );
                    }}
                  />
                )
              )}
            </PerfilBlock>
            {/* LUGARES VISITADOS */}
            <PerfilBlock title="Lugares visitados" action={
              <button className="btn" onClick={() => navigate(`/admin/usuario/${userId}/lugares-visitados`)}>
                Ver todos
              </button>
            }>
              <PlacesList
                places={visitados}
                onPlaceClick={handlePlaceClick}
                fechaKey="fecha_visita"
                textoFecha="Fecha de visita"
              />
              {visitados.length === 0 && <div className="perfiladmin-vacio">No ha visitado ningún lugar aún.</div>}
            </PerfilBlock>
            {/* FAVORITOS */}
            <PerfilBlock title="Favoritos" action={
              <button className="btn" onClick={() => navigate(`/admin/usuario/${userId}/favoritos`)}>
                Ver todos
              </button>
            }>
              <PlacesList
                places={favoritos}
                onPlaceClick={handlePlaceClick}
                fechaKey="fecha_visita"
                textoFecha="Fecha añadido a favoritos"
              />
              {favoritos.length === 0 && <div className="perfiladmin-vacio">No tiene favoritos aún.</div>}
            </PerfilBlock>
            {/* COMENTARIOS */}
            <PerfilBlock title="Comentarios" action={
              <button className="btn" onClick={() => navigate(`/admin/usuario/${userId}/comentarios`)}>
                Ver todos
              </button>
            }>
              <ReviewList
                reviews={comentarios}
                userId={user.id}
                isAdmin={true}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                allowEdit={false}
                onDeleteReview={handleDeleteReview}
              />
              {comentarios.length === 0 && <div className="perfiladmin-vacio">No ha escrito comentarios aún.</div>}
            </PerfilBlock>
          </>
        )}
      </div>
    </div>
  );
};

export default PerfilAdmin;
