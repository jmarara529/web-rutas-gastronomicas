import React, { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import PerfilBlock from "../components/PerfilBlock";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DynamicUserForm from "../components/DynamicUserForm";
import ReviewList from "../components/ReviewList";
import PlacesList from "../components/PlacesList";

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
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("es_admin") === "true";

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // Obtener datos usuario
        const userRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/usuarios/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data || {});
        // Favoritos
        const favRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/favoritos?admin_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let favoritosData = favRes.data || [];
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
        // Visitados
        const visRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/visitados/admin?id_usuario=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let visitadosData = visRes.data || [];
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
        // Comentarios
        const comRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/resenas/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComentarios(comRes.data || []);
      } catch (err) {
        setError("Error al cargar datos del usuario");
      }
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleSave = async (form) => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/usuarios/${userId}`, {
        ...form,
        es_admin: form.es_admin || false,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/usuarios/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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

  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content">
        <h1>Perfil de Usuario (Admin)</h1>
        {loading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#ff9800" }}>{error}</div>
        ) : (
          <>
            <PerfilBlock title="Datos de usuario" action={!editMode && user.id !== 1 ? <button className="btn" onClick={handleEdit}>Editar</button> : null}>
              {(!editMode || user.id === 1) ? (
                <>
                  <div><b>Nombre:</b> {user.nombre}</div>
                  <div><b>Correo:</b> {user.correo}</div>
                  <div><b>Administrador:</b> {user.es_admin ? "Sí" : "No"}</div>
                  {user.id !== 1 && (
                    <div style={{ marginTop: 16 }}>
                      {!showDelete ? (
                        <button className="btn" style={{ background: '#e53935', color: '#fff' }} onClick={() => setShowDelete(true)}>
                          Eliminar usuario
                        </button>
                      ) : (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ color: '#e53935', fontWeight: 600 }}>¿Seguro que deseas eliminar este usuario? Esta acción es irreversible.</div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button className="btn" style={{ background: '#e53935', color: '#fff' }} onClick={handleDeleteUser} disabled={deleteLoading}>Aceptar</button>
                            <button className="btn" onClick={() => setShowDelete(false)} disabled={deleteLoading}>Cancelar</button>
                          </div>
                          {deleteError && <div style={{ color: '#e53935', fontWeight: 500 }}>{deleteError}</div>}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <DynamicUserForm
                  fields={[
                    { name: "nombre", label: "Nombre", type: "text", required: true, autoComplete: "name" },
                    { name: "correo", label: "Correo", type: "email", required: true, autoComplete: "email" },
                    { name: "password", label: "Contraseña", type: "password", required: false, autoComplete: "new-password", placeholder: "Nueva contraseña" },
                  ]}
                  initialValues={user}
                  onSubmit={handleSave}
                  onCancel={handleCancel}
                  loading={loading}
                  error={error}
                  submitText="Guardar"
                  showCancel={true}
                  renderExtraFields={(form, handleChange) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <label style={{ fontWeight: 500 }}>
                        Administrador:
                        <input
                          type="checkbox"
                          name="es_admin"
                          checked={!!form.es_admin}
                          onChange={e => handleChange({ target: { name: 'es_admin', value: e.target.checked } })}
                          style={{ marginLeft: 8, marginRight: 4 }}
                        />
                        <span style={{ color: !!form.es_admin ? '#4caf50' : '#e53935', fontWeight: 600 }}>
                          {form.es_admin ? 'Sí' : 'No'}
                        </span>
                      </label>
                    </div>
                  )}
                />
              )}
            </PerfilBlock>
            <PerfilBlock title="Lugares visitados">
              <PlacesList
                places={visitados}
                onPlaceClick={handlePlaceClick}
                fechaKey="fecha_visita"
                textoFecha="Fecha de visita"
              />
              {visitados.length === 0 && <div style={{ color: "#aaa" }}>No ha visitado ningún lugar aún.</div>}
            </PerfilBlock>
            <PerfilBlock title="Favoritos">
              <PlacesList
                places={favoritos}
                onPlaceClick={handlePlaceClick}
                fechaKey="fecha_visita"
                textoFecha="Fecha añadido a favoritos"
              />
              {favoritos.length === 0 && <div style={{ color: "#aaa" }}>No tiene favoritos aún.</div>}
            </PerfilBlock>
            <PerfilBlock title="Comentarios">
              <ReviewList
                reviews={comentarios}
                userId={user.id}
                isAdmin={true}
              />
              {comentarios.length === 0 && <div style={{ color: "#aaa" }}>No ha escrito comentarios aún.</div>}
            </PerfilBlock>
          </>
        )}
      </div>
    </div>
  );
};

export default PerfilAdmin;
