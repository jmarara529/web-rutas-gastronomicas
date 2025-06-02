import React, { useEffect, useState, useMemo } from "react";
import HeaderUser from "../components/HeaderUser";
import SearchInputResenas from "../components/SearchInputResenas";
import PlaceCard from "../components/PlaceCard";
import axios from "axios";
import "../styles/pages/page-common.css";

const FAVORITOS_PER_PAGE = 20;

function normalize(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function sortFavoritos(arr, sortType) {
  let sorted = [...arr];
  if (sortType === "reciente") {
    sorted.sort((a, b) => new Date(b.fecha_favorito) - new Date(a.fecha_favorito));
  } else if (sortType === "antiguo") {
    sorted.sort((a, b) => new Date(a.fecha_favorito) - new Date(b.fecha_favorito));
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

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
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
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/favoritos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let favoritosRaw = res.data || [];
        // Obtener detalles de Google Places para cada favorito
        favoritosRaw = await Promise.all(favoritosRaw.map(async (fav) => {
          let placeId = fav.place_id;
          // Si no hay place_id pero sí id_lugar, intenta obtener el place_id desde la API de lugares
          if (!placeId && fav.id_lugar) {
            try {
              const lugarRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/lugares`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const lugar = (lugarRes.data || []).find(l => l.id === fav.id_lugar);
              if (lugar && lugar.place_id) placeId = lugar.place_id;
            } catch {}
          }
          if (placeId) {
            try {
              const placeDetail = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/places/detalles`, { params: { place_id: placeId } });
              if (placeDetail.data && placeDetail.data.result) {
                let photos = placeDetail.data.result.photos;
                if (photos && photos.length > 0 && photos[0].photo_reference) {
                  photos = photos.map(p => ({ name: `photo_reference/${p.photo_reference}` }));
                }
                return {
                  ...fav,
                  ...placeDetail.data.result,
                  place_id: placeId,
                  displayName: { text: placeDetail.data.result.name || fav.nombre_lugar || fav.nombre || "Sin nombre" },
                  name: placeDetail.data.result.name || fav.nombre_lugar || fav.nombre || "Sin nombre",
                  rating: placeDetail.data.result.rating || fav.rating || "-",
                  photos: photos,
                  fecha_visita: fav.fecha_agregado
                };
              }
              // Si no hay datos de Google, usar los del backend
              return {
                ...fav,
                displayName: { text: fav.nombre_lugar || fav.nombre || "Sin nombre" },
                name: fav.nombre_lugar || fav.nombre || "Sin nombre",
                rating: fav.rating || "-",
                photos: [],
                fecha_visita: fav.fecha_agregado
              };
            } catch (e) {
              // Si falla la consulta a Google, usar los del backend
              return {
                ...fav,
                displayName: { text: fav.nombre_lugar || fav.nombre || "Sin nombre" },
                name: fav.nombre_lugar || fav.nombre || "Sin nombre",
                rating: fav.rating || "-",
                photos: [],
                fecha_visita: fav.fecha_agregado
              };
            }
          }
          // Si no hay place_id, usar los del backend
          return {
            ...fav,
            displayName: { text: fav.nombre_lugar || fav.nombre || "Sin nombre" },
            name: fav.nombre_lugar || fav.nombre || "Sin nombre",
            rating: fav.rating || "-",
            photos: [],
            fecha_visita: fav.fecha_agregado
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

  const filtered = useMemo(() => {
    if (!search.trim()) return favoritos;
    const normSearch = normalize(search);
    return favoritos.filter(v => normalize(v.nombre_lugar || v.name).includes(normSearch));
  }, [favoritos, search]);

  const sorted = sortFavoritos(filtered, sort);
  const totalPages = Math.ceil(sorted.length / FAVORITOS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * FAVORITOS_PER_PAGE, page * FAVORITOS_PER_PAGE);

  const handlePlaceClick = place => {
    window.location.href = `/sitio/${place.place_id || place.id}`;
  };

  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content" style={{ color: '#fff' }}>
        <h1>Favoritos</h1>
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
          <div>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#ff9800" }}>{error}</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {paginated.map(place => (
              <li key={place.id || place.place_id || place._id || Math.random()} style={{ margin: "12px 0" }}>
                <PlaceCard 
                  place={place} 
                  onClick={() => handlePlaceClick(place)} 
                  fechaVisita={place.fecha_visita || place.fecha_agregado || place.fecha_favorito} 
                  textoFecha="Fecha añadido a favoritos" 
                />
              </li>
            ))}
          </ul>
        )}
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
