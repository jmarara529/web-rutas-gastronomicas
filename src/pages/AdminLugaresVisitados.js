import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import PlacesList from "../components/PlacesList";
import { getVisitados } from "../api/visitados";
import SearchInputResenas from "../components/SearchInputResenas";
import axios from "axios";
// import '../styles/pages/admin-lugares-visitados.css'; // Archivo no existe, se comenta para evitar error
import "../styles/components/ui-common.css";

// Número de lugares visitados por página
const VISITADOS_PER_PAGE = 20;

// Normaliza el texto para la búsqueda (elimina tildes y convierte a minúsculas)
function normalize(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Ordena los lugares visitados según el criterio seleccionado
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
  // Obtiene el userId de los parámetros de la URL
  const { userId } = useParams();
  // Estados para la lista de lugares visitados, carga, error, búsqueda, orden y página actual
  const [visitados, setVisitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("reciente");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("es_admin") === "true";

  // Efecto para cargar los lugares visitados del usuario
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        let visitadosData = await getVisitados(token, userId);
        // Enriquecer datos de lugares visitados con información de Google Places
        visitadosData = await Promise.all(visitadosData.map(async (v) => {
          let placeId = v.place_id;
          // Si no hay placeId, intentar obtenerlo desde la API propia
          if (!placeId && v.id_lugar) {
            try {
              const lugarRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/lugares/byid/${v.id_lugar}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (lugarRes.data && lugarRes.data.place_id) placeId = lugarRes.data.place_id;
            } catch {}
          }
          // Si se tiene un placeId, obtener detalles desde Google Places
          if (placeId) {
            try {
              const placeDetail = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/places/detalles`, { params: { place_id: placeId } });
              if (placeDetail.data && placeDetail.data.result) {
                let photos = placeDetail.data.result.photos;
                // Normalizar fotos para el componente de presentación
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
              // Si no se pueden obtener detalles, retornar información básica del lugar visitado
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
          // Retornar información básica si no hay placeId disponible
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

  // Maneja el clic en un lugar, navegando a la página de detalles
  const handlePlaceClick = place => {
    navigate(`/sitio/${place.place_id || place.id}`);
  };

  // Filtra los lugares visitados según el texto de búsqueda
  const filtered = React.useMemo(() => {
    if (!search.trim()) return visitados;
    const normSearch = normalize(search);
    return visitados.filter(v => normalize(v.nombre_lugar).includes(normSearch));
  }, [visitados, search]);

  // Ordena los lugares visitados filtrados según el criterio seleccionado
  const sorted = sortVisitados(filtered, sort);
  // Calcula el número total de páginas para la paginación
  const totalPages = Math.ceil(sorted.length / VISITADOS_PER_PAGE);
  // Obtiene los lugares visitados para la página actual
  const paginated = sorted.slice((page - 1) * VISITADOS_PER_PAGE, page * VISITADOS_PER_PAGE);

  return (
    <div className="page-container">
      {/* Cabecera con información del usuario y navegación a admin si corresponde */}
      <HeaderUser isAdmin={isAdmin} />
      <div className="content" style={{ color: '#fff' }}>
        <h1>Lugares visitados</h1>
        {/* Filtros y opciones de ordenamiento */}
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
            <div className="estado-vacio">No ha visitado ningún lugar aún.</div>
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

export default AdminLugaresVisitados;
