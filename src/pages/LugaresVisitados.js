import React, { useEffect, useState, useMemo } from "react";
import HeaderUser from "../components/HeaderUser";
import SearchInputResenas from "../components/SearchInputResenas";
import PerfilPlaceCard from "../components/PerfilPlaceCard";
import axios from "axios";
import "../styles/pages/page-common.css";

const VISITADOS_PER_PAGE = 20;

function normalize(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function sortVisitados(arr, sortType) {
  let sorted = [...arr];
  if (sortType === "reciente") {
    sorted.sort((a, b) => new Date(b.fecha_visita) - new Date(a.fecha_visita));
  } else if (sortType === "antiguo") {
    sorted.sort((a, b) => new Date(a.fecha_visita) - new Date(b.fecha_visita));
  } else if (sortType === "sitio-asc") {
    sorted.sort((a, b) => (a.nombre_lugar || "").localeCompare(b.nombre_lugar || ""));
  } else if (sortType === "sitio-desc") {
    sorted.sort((a, b) => (b.nombre_lugar || "").localeCompare(a.nombre_lugar || ""));
  }
  return sorted;
}

const LugaresVisitados = () => {
  const [visitados, setVisitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("reciente");
  const [page, setPage] = useState(1);
  const isAdmin = localStorage.getItem("es_admin") === "true";

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
        // Obtener detalles de Google para cada uno (igual que en perfil)
        visitadosData = await Promise.all(visitadosData.map(async (v) => {
          let placeId = v.place_id;
          if (placeId) {
            try {
              const placeDetail = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/places/detalles`, { params: { place_id: placeId } });
              if (placeDetail.data && placeDetail.data.result) {
                let photos = placeDetail.data.result.photos;
                if (photos && photos.length > 0 && photos[0].photo_reference) {
                  photos = photos.map(p => ({ name: `photo_reference/${p.photo_reference}` }));
                }
                return {
                  ...v,
                  ...placeDetail.data.result,
                  place_id: placeId,
                  displayName: { text: placeDetail.data.result.name || v.nombre_lugar || v.nombre || "Sin nombre" },
                  name: placeDetail.data.result.name || v.nombre_lugar || v.nombre || "Sin nombre",
                  rating: placeDetail.data.result.rating || v.rating || "-",
                  photos: photos
                };
              }
              // Si no hay datos de Google, usar los del backend
              return {
                ...v,
                displayName: { text: v.nombre_lugar || v.nombre || "Sin nombre" },
                name: v.nombre_lugar || v.nombre || "Sin nombre",
                rating: v.rating || "-",
                photos: []
              };
            } catch (e) {
              // Si falla la consulta a Google, usar los del backend
              return {
                ...v,
                displayName: { text: v.nombre_lugar || v.nombre || "Sin nombre" },
                name: v.nombre_lugar || v.nombre || "Sin nombre",
                rating: v.rating || "-",
                photos: []
              };
            }
          }
          // Si no hay place_id, usar los del backend
          return {
            ...v,
            displayName: { text: v.nombre_lugar || v.nombre || "Sin nombre" },
            name: v.nombre_lugar || v.nombre || "Sin nombre",
            rating: v.rating || "-",
            photos: []
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

  // Filtrado y ordenación
  const filtered = useMemo(() => {
    if (!search.trim()) return visitados;
    const normSearch = normalize(search);
    return visitados.filter(v => normalize(v.nombre_lugar).includes(normSearch));
  }, [visitados, search]);

  const sorted = sortVisitados(filtered, sort);
  const totalPages = Math.ceil(sorted.length / VISITADOS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * VISITADOS_PER_PAGE, page * VISITADOS_PER_PAGE);

  // Adaptar datos para PlaceCard igual que en perfil
  const adaptPlace = v => {
    // Si ya tiene displayName y photos, devolver tal cual
    if (v.displayName && v.photos) return v;
    // Buscar rating y photos si existen en el objeto
    let rating = v.rating;
    if (!rating && v.calificacion) rating = v.calificacion;
    // Buscar fotos si existen (por ejemplo, v.fotos, v.photos, v.photo_reference)
    let photos = [];
    if (v.photos && v.photos.length > 0) {
      photos = v.photos;
    } else if (v.fotos && v.fotos.length > 0) {
      photos = v.fotos;
    } else if (v.photo_reference) {
      photos = [{ name: `photo_reference/${v.photo_reference}` }];
    }
    return {
      ...v,
      displayName: { text: v.nombre_lugar || v.nombre || "Sin nombre" },
      name: v.nombre_lugar || v.nombre || "Sin nombre",
      rating: rating || "-",
      photos
    };
  };

  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content" style={{ color: '#fff' }}>
        <h1>Lugares visitados</h1>
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
            </select>
          </div>
        </div>
        {loading ? (
          <div style={{ color: "#ff9800" }}>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#ff9800" }}>{error}</div>
        ) : (
          paginated.length === 0 ? (
            <div style={{ color: "#aaa" }}>No has visitado ningún lugar aún.</div>
          ) : (
            <div className="perfil-places-list">
              {paginated.map((v, i) => (
                <PerfilPlaceCard key={i} place={v} onClick={() => window.location.href = `/sitio/${v.place_id}`} />
              ))}
            </div>
          )
        )}
        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 8, color: '#fff' }}>
            <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
            <span style={{ color: "#ff9800", fontWeight: 500 }}>Página {page} de {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LugaresVisitados;
