import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import PlacesList from "../components/PlacesList";
import { getVisitados } from "../api/visitados";
import SearchInputResenas from "../components/SearchInputResenas";
import axios from "axios";

const VISITADOS_PER_PAGE = 20;

function normalize(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

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

const AdminLugaresVisitados = () => {
  const { userId } = useParams();
  const [visitados, setVisitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("reciente");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("es_admin") === "true";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        let visitadosData = await getVisitados(token, userId);
        // Obtener detalles de Google para cada uno (igual que en LugaresVisitados.js)
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
        setError("No se pudo cargar la lista de lugares visitados");
      }
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const handlePlaceClick = place => {
    navigate(`/sitio/${place.place_id || place.id}`);
  };

  const filtered = React.useMemo(() => {
    if (!search.trim()) return visitados;
    const normSearch = normalize(search);
    return visitados.filter(v => normalize(v.nombre_lugar).includes(normSearch));
  }, [visitados, search]);

  const sorted = sortVisitados(filtered, sort);
  const totalPages = Math.ceil(sorted.length / VISITADOS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * VISITADOS_PER_PAGE, page * VISITADOS_PER_PAGE);

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
              <option value="puntuacion-alta">Puntuación más alta</option>
              <option value="puntuacion-baja">Puntuación más baja</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div style={{ color: "#ff9800" }}>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#ff9800" }}>{error}</div>
        ) : (
          paginated.length === 0 ? (
            <div style={{ color: "#aaa" }}>No ha visitado ningún lugar aún.</div>
          ) : (
            <PlacesList 
              places={paginated}
              onPlaceClick={handlePlaceClick}
              fechaKey="fecha_visita"
              textoFecha="Fecha de visita"
            />
          )
        )}
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

export default AdminLugaresVisitados;
