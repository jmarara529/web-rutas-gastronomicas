// FAVORITOS DEL USUARIO
// Página que muestra todos los lugares marcados como favoritos por el usuario logueado.
// Permite buscar, ordenar y navegar a los detalles de cada lugar favorito.

import React, { useEffect, useState, useMemo } from "react";
import HeaderUser from "../components/HeaderUser";
import SearchInputResenas from "../components/SearchInputResenas";
import PlacesList from "../components/PlacesList";
import { getFavoritos } from "../api/favoritos";
import axios from "axios";
import "../styles/pages/page-common.css";

const FAVORITOS_PER_PAGE = 20;

// Normaliza texto para búsquedas (sin tildes, minúsculas)
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

const Favoritos = () => {
  // --- ESTADO PRINCIPAL ---
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("reciente");
  const [page, setPage] = useState(1);
  const isAdmin = localStorage.getItem("es_admin") === "true";

  // --- CARGA DE FAVORITOS Y ENRIQUECIMIENTO DE DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        let favoritosRaw = await getFavoritos(token);
        // Enriquecer cada favorito con detalles de Google Places y fotos
        favoritosRaw = await Promise.all(favoritosRaw.map(async (fav, idx) => {
          let placeId = fav.place_id;
          // Si no hay place_id pero sí id_lugar, intenta obtenerlo desde la tabla lugares
          if (!placeId && fav.id_lugar) {
            try {
              const lugarRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/lugares/byid/${fav.id_lugar}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (lugarRes.data && lugarRes.data.place_id) placeId = lugarRes.data.place_id;
            } catch (err) {}
          }
          // Si hay placeId, obtener detalles de Google Places
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
                  ...(photos && photos.length > 0 ? { photos } : {}),
                  fecha_visita: fav.fecha_agregado || fav.fecha_visita || fav.fecha_favorito
                };
              }
              // Si no hay datos de Google, usar los del backend
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
          // Si no hay placeId, solo datos locales
          return {
            ...fav,
            displayName: { text: fav.nombre_lugar || fav.nombre || "Sin nombre" },
            name: fav.nombre_lugar || fav.nombre || "Sin nombre",
            rating: fav.rating || "-",
            fecha_visita: fav.fecha_agregado || fav.fecha_visita || fav.fecha_favorito
          };
        }));
        setFavoritos(favoritosRaw);
      } catch (err) {
        setError("Error al cargar los favoritos");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- FILTRADO Y ORDENACIÓN DE FAVORITOS ---
  const filtered = useMemo(() => {
    if (!search.trim()) return favoritos;
    const normSearch = normalize(search);
    return favoritos.filter(v => normalize(v.nombre_lugar || v.name).includes(normSearch));
  }, [favoritos, search]);

  const sorted = sortFavoritos(filtered, sort);
  const totalPages = Math.ceil(sorted.length / FAVORITOS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * FAVORITOS_PER_PAGE, page * FAVORITOS_PER_PAGE);

  // --- NAVEGACIÓN AL DETALLE DEL LUGAR ---
  const handlePlaceClick = place => {
    window.location.href = `/sitio/${place.place_id || place.id}`;
  };

  // --- RENDER PRINCIPAL ---
  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content" style={{ color: '#fff' }}>
        <h1>Favoritos</h1>
        {/* Barra de búsqueda y ordenación */}
        <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 220, maxWidth: 480 }}>
            <SearchInputResenas
              value={search}
              onChange={val => { setSearch(val); setPage(1); }}
            />
          </div>
          <div style={{ minWidth: 180, flex: '0 0 220px', textAlign: 'right' }}>
            <label style={{ color: '#ff9800', fontWeight: 500, marginRight: 8 }}>Ordenar por:</label>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} style={{ padding: 4, borderRadius: 4, width: '60%' }}>
              <option value="reciente">Fecha más reciente</option>
              <option value="antiguo">Fecha más antigua</option>
              <option value="sitio-asc">Sitio (A-Z)</option>
              <option value="sitio-desc">Sitio (Z-A)</option>
              <option value="puntuacion-alta">Puntuación más alta</option>
              <option value="puntuacion-baja">Puntuación más baja</option>
            </select>
          </div>
        </div>
        {/* Lista de favoritos */}
        {loading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#ff9800" }}>{error}</div>
        ) : (
          <PlacesList 
            places={paginated}
            onPlaceClick={handlePlaceClick}
            fechaKey="fecha_agregado"
            textoFecha="Fecha de añadido a favoritos"
          />
        )}
        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
            <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
            <span style={{ color: "#ff9800", fontWeight: 500 }}>Página {page} de {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favoritos;
