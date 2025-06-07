// FAVORITOS DE UN USUARIO (ADMIN)
// Página para que el administrador vea los favoritos de cualquier usuario.
// Permite buscar, ordenar y navegar a los detalles de cada favorito.

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import PlacesList from "../components/PlacesList";
import { getFavoritos } from "../api/favoritos";
import SearchInputResenas from "../components/SearchInputResenas";
import axios from "axios";
// import '../styles/pages/admin-favoritos.css'; // Archivo no existe, se comenta para evitar error
import "../styles/components/ui-common.css";

// Número de favoritos por página
const FAVORITOS_PER_PAGE = 20;

// Normaliza texto para búsquedas (elimina tildes y pasa a minúsculas)
function normalize(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Ordena la lista de favoritos según el criterio seleccionado
function sortFavoritos(arr, sortType) {
  let sorted = [...arr];
  if (sortType === "reciente") {
    sorted.sort((a, b) => new Date(b.fecha_visita || b.fecha_agregado || b.fecha_favorito) - new Date(a.fecha_visita || a.fecha_agregado || a.fecha_favorito));
  } else if (sortType === "antiguo") {
    sorted.sort((a, b) => new Date(a.fecha_visita || a.fecha_agregado || a.fecha_favorito) - new Date(b.fecha_visita || b.fecha_agregado || b.fecha_favorito));
  } else if (sortType === "sitio-asc") {
    sorted.sort((a, b) => (a.nombre_lugar || a.name || "").localeCompare(b.nombre_lugar || b.name || ""));
  } else if (sortType === "sitio-desc") {
    sorted.sort((a, b) => (b.nombre_lugar || b.name || "").localeCompare(a.nombre_lugar || a.name || ""));
  } else if (sortType === "puntuacion-alta") {
    sorted.sort((a, b) => (b.rating || b.calificacion || 0) - (a.rating || a.calificacion || 0));
  } else if (sortType === "puntuacion-baja") {
    sorted.sort((a, b) => (a.rating || a.calificacion || 0) - (b.rating || b.calificacion || 0));
  }
  return sorted;
}

const AdminFavoritos = () => {
  // Obtiene el userId de la URL
  const { userId } = useParams();
  // Estados para la lista de favoritos, carga, error, búsqueda, orden y paginación
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("es_admin") === "true";
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("reciente");
  const [page, setPage] = useState(1);

  // --- CARGA DE FAVORITOS DEL USUARIO Y ENRIQUECIMIENTO DE DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        let favoritosData = await getFavoritos(token, userId);
        // Para cada favorito, intenta enriquecer con detalles de Google Places
        favoritosData = await Promise.all(favoritosData.map(async (fav, idx) => {
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
                  ...(photos && photos.length > 0 ? { photos } : {}),
                  fecha_visita: fav.fecha_agregado || fav.fecha_visita || fav.fecha_favorito
                };
              }
              // Si no hay detalles, retorna el favorito con datos mínimos
              return {
                ...fav,
                displayName: { text: fav.nombre_lugar || fav.nombre || "Sin nombre" },
                name: fav.nombre_lugar || fav.nombre || "Sin nombre",
                rating: fav.rating || "-",
                fecha_visita: fav.fecha_agregado || fav.fecha_visita || fav.fecha_favorito
              };
            } catch (e) {
              return {
                ...fav,
                displayName: { text: fav.nombre_lugar || fav.nombre || "Sin nombre" },
                name: fav.nombre_lugar || fav.nombre || "Sin nombre",
                rating: fav.rating || "-",
                fecha_visita: fav.fecha_agregado || fav.fecha_visita || fav.fecha_favorito
              };
            }
          }
          // Si no hay placeId, retorna el favorito con datos mínimos
          return {
            ...fav,
            displayName: { text: fav.nombre_lugar || fav.nombre || "Sin nombre" },
            name: fav.nombre_lugar || fav.nombre || "Sin nombre",
            rating: fav.rating || "-",
            fecha_visita: fav.fecha_agregado || fav.fecha_visita || fav.fecha_favorito
          };
        }));
        setFavoritos(favoritosData);
      } catch (err) {
        setError("No se pudo cargar la lista de favoritos");
      }
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  // --- FILTRADO Y ORDENACIÓN DE FAVORITOS ---
  // Navega al detalle del lugar al hacer click en una tarjeta
  const handlePlaceClick = place => {
    navigate(`/sitio/${place.place_id || place.id}`);
  };
  // Filtra favoritos según el texto de búsqueda
  const filtered = React.useMemo(() => {
    if (!search.trim()) return favoritos;
    const normSearch = normalize(search);
    return favoritos.filter(v => normalize(v.nombre_lugar || v.name).includes(normSearch));
  }, [favoritos, search]);
  // Ordena los favoritos filtrados
  const sorted = sortFavoritos(filtered, sort);
  // Calcula la paginación
  const totalPages = Math.ceil(sorted.length / FAVORITOS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * FAVORITOS_PER_PAGE, page * FAVORITOS_PER_PAGE);

  // --- RENDER PRINCIPAL ---
  return (
    <div className="page-container">
      {/* Cabecera de usuario con menú de admin si corresponde */}
      <HeaderUser isAdmin={isAdmin} />
      <div className="content" style={{ color: '#fff' }}>
        <h1>Favoritos</h1>
        {/* Barra de búsqueda y ordenación */}
        <div className="barra-filtros">
          <div className="barra-busqueda">
            <SearchInputResenas
              value={search}
              onChange={val => { setSearch(val); setPage(1); }}
            />
          </div>
          <div className="barra-orden">
            <label className="barra-orden-label">Ordenar por:</label>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} className="barra-orden-select">
              <option value="reciente">Fecha más reciente</option>
              <option value="antiguo">Fecha más antigua</option>
              <option value="sitio-asc">Sitio (A-Z)</option>
              <option value="sitio-desc">Sitio (Z-A)</option>
              <option value="puntuacion-alta">Puntuación más alta</option>
              <option value="puntuacion-baja">Puntuación más baja</option>
            </select>
          </div>
        </div>
        {error && <div className="estado-error">{error}</div>}
        {loading ? (
          <div className="estado-cargando">Cargando...</div>
        ) : (
          paginated.length === 0 ? (
            <div className="estado-vacio">No tiene favoritos aún.</div>
          ) : (
            <PlacesList 
              places={paginated}
              onPlaceClick={handlePlaceClick}
              fechaKey="fecha_agregado"
              textoFecha="Fecha de añadido a favoritos"
            />
          )
        )}
        {totalPages > 1 && (
          <div className="paginacion">
            <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
            <span className="paginacion-info">Página {page} de {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFavoritos;
