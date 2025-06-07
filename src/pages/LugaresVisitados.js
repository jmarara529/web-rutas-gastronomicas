// LUGARES VISITADOS DEL USUARIO
// Página que muestra todos los lugares que el usuario ha marcado como visitados.
// Permite buscar, ordenar y navegar a los detalles de cada lugar visitado.

import React, { useEffect, useState, useMemo } from "react";
import HeaderUser from "../components/HeaderUser";
import SearchInputResenas from "../components/SearchInputResenas";
import PlacesList from "../components/PlacesList";
import axios from "axios";
import "../styles/pages/page-common.css";
// import "../styles/pages/lugaresvisitados.css"; // Archivo no existe, se comenta para evitar error
import "../styles/components/ui-common.css";

const VISITADOS_PER_PAGE = 20;

// Normaliza texto para búsquedas (sin tildes, minúsculas)
function normalize(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Ordena la lista de visitados según el criterio seleccionado
function sortVisitados(arr, sortType) {
  let sorted = [...arr];
  if (sortType === "reciente") {
    sorted.sort((a, b) => new Date(b.fecha_visita || b.fecha) - new Date(a.fecha_visita || a.fecha));
  } else if (sortType === "antiguo") {
    sorted.sort((a, b) => new Date(a.fecha_visita || a.fecha) - new Date(b.fecha_visita || b.fecha));
  } else if (sortType === "sitio-asc") {
    sorted.sort((a, b) => (a.nombre_lugar || a.nombre || "").localeCompare(b.nombre_lugar || b.nombre || ""));
  } else if (sortType === "sitio-desc") {
    sorted.sort((a, b) => (b.nombre_lugar || b.nombre || "").localeCompare(a.nombre_lugar || a.nombre || ""));
  } else if (sortType === "puntuacion-alta") {
    sorted.sort((a, b) => (b.rating || b.calificacion || 0) - (a.rating || a.calificacion || 0));
  } else if (sortType === "puntuacion-baja") {
    sorted.sort((a, b) => (a.rating || a.calificacion || 0) - (b.rating || b.calificacion || 0));
  }
  return sorted;
}

const LugaresVisitados = () => {
  // --- ESTADO PRINCIPAL ---
  const [visitados, setVisitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("reciente");
  const [page, setPage] = useState(1);
  const isAdmin = localStorage.getItem("es_admin") === "true";

  // --- CARGA DE VISITADOS Y ENRIQUECIMIENTO DE DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/visitados`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let visitadosData = res.data || [];
        // Enriquecer cada visitado con detalles de Google Places y fotos
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
      } catch (err) {
        setError("Error al cargar los lugares visitados");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- FILTRADO Y ORDENACIÓN DE VISITADOS ---
  const filtered = useMemo(() => {
    if (!search.trim()) return visitados;
    const normSearch = normalize(search);
    return visitados.filter(v => normalize(v.nombre_lugar).includes(normSearch));
  }, [visitados, search]);

  const sorted = sortVisitados(filtered, sort);
  const totalPages = Math.ceil(sorted.length / VISITADOS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * VISITADOS_PER_PAGE, page * VISITADOS_PER_PAGE);

  // --- RENDER PRINCIPAL ---
  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content" style={{ color: '#fff' }}>
        <h1>Lugares visitados</h1>
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
            <div className="estado-vacio">No has visitado ningún lugar aún.</div>
          ) : (
            <PlacesList 
              places={paginated}
              onPlaceClick={place => window.location.href = `/sitio/${place.place_id || place.id}`}
              fechaKey="fecha_visita"
              textoFecha="Fecha de visita"
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

export default LugaresVisitados;
