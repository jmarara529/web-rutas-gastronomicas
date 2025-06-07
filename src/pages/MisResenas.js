// MIS RESEÑAS DEL USUARIO
// Página donde el usuario puede ver, buscar, ordenar, editar y eliminar sus propias reseñas/comentarios.
// Incluye paginación, ordenación y edición en línea.

import React, { useEffect, useState, useMemo } from "react";
import HeaderUser from "../components/HeaderUser";
import ReviewList from "../components/ReviewList";
import axios from "axios";
import "../styles/pages/page-common.css";
import SearchInputResenas from "../components/SearchInputResenas";

const REVIEWS_PER_PAGE = 20;

// Componente de estrellas para calificación
function StarRating({ value, onChange }) {
  const [hover, setHover] = React.useState(null);
  return (
    <span style={{ fontSize: 24, cursor: "pointer", color: "#ff9800" }}>
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseOver={() => setHover(star)}
          onMouseOut={() => setHover(null)}
          style={{ marginRight: 2 }}
        >
          {star <= (hover !== null ? hover : value) ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

const MisResenas = () => {
  // --- ESTADO PRINCIPAL ---
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewStars, setEditReviewStars] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("reciente");
  const [search, setSearch] = useState("");

  const isAdmin = localStorage.getItem("es_admin") === "true";
  const userId = localStorage.getItem("user_id");

  // --- CARGA DE RESEÑAS DEL USUARIO ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const comRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/resenas/usuario`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComentarios(comRes.data || []);
      } catch (err) {
        setError("Error al cargar tus reseñas");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- ORDENACIÓN Y FILTRADO ---
  function sortReviews(reviews, sortType) {
    if (!reviews) return [];
    let sorted = [...reviews];
    if (sortType === "reciente") {
      sorted.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else if (sortType === "antiguo") {
      sorted.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    } else if (sortType === "mejor") {
      sorted.sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0));
    } else if (sortType === "peor") {
      sorted.sort((a, b) => (a.calificacion || 0) - (b.calificacion || 0));
    } else if (sortType === "sitio-asc") {
      sorted.sort((a, b) => (a.nombre_lugar || "").localeCompare(b.nombre_lugar || ""));
    } else if (sortType === "sitio-desc") {
      sorted.sort((a, b) => (b.nombre_lugar || "").localeCompare(a.nombre_lugar || ""));
    }
    return sorted;
  }
  function normalize(str) {
    return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  const filtered = useMemo(() => {
    if (!search.trim()) return comentarios;
    const normSearch = normalize(search);
    return comentarios.filter(r => normalize(r.nombre_lugar).includes(normSearch));
  }, [comentarios, search]);
  const sorted = sortReviews(filtered, sort);
  const totalPages = Math.ceil(sorted.length / REVIEWS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  // --- RENDER PRINCIPAL ---
  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content" style={{ color: '#fff' }}>
        <h1>Mis reseñas</h1>
        {/* Barra de búsqueda y ordenación */}
        <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 0, maxWidth: 340 }}>
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
              <option value="mejor">Mayor calificación</option>
              <option value="peor">Menor calificación</option>
              <option value="sitio-asc">Sitio (A-Z)</option>
              <option value="sitio-desc">Sitio (Z-A)</option>
            </select>
          </div>
        </div>
        {/* Lista de reseñas */}
        {loading ? (
          <div style={{ color: "#ff9800" }}>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#ff9800" }}>{error}</div>
        ) : (
          paginated.length === 0 ? (
            <div style={{ color: "#aaa" }}>No has escrito reseñas aún.</div>
          ) : (
            <ReviewList
              reviews={paginated}
              userId={userId}
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
              // Evita navegación al sitio cuando se está editando
              onReviewClick={r => {
                if (editReviewId !== r.id) {
                  window.location.href = `/sitio/${r.place_id || r.id_lugar}`;
                }
              }}
            />
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

export default MisResenas;
