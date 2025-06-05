import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import ReviewList from "../components/ReviewList";
import SearchInputResenas from "../components/SearchInputResenas";
import { getResenasUsuario, deleteResena } from "../api/resenas";
import axios from "axios";

const REVIEWS_PER_PAGE = 20;

function StarRating({ value, onChange }) {
  const [hover, setHover] = React.useState(null);
  return (
    <span style={{ fontSize: 24, cursor: "pointer", color: "#ff9800" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseOver={() => setHover(star)}
          onMouseOut={() => setHover(null)}
          style={{ marginRight: 2 }}
        >
          {star <= (hover !== null ? hover : value) ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

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
    sorted.sort((a, b) =>
      (a.nombre_lugar || "").localeCompare(b.nombre_lugar || "")
    );
  } else if (sortType === "sitio-desc") {
    sorted.sort((a, b) =>
      (b.nombre_lugar || "").localeCompare(a.nombre_lugar || "")
    );
  }
  return sorted;
}

function normalize(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const AdminComentarios = () => {
  const { userId } = useParams();
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [sort, setSort] = useState("reciente");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const isAdmin = localStorage.getItem("es_admin") === "true";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const comRes = await getResenasUsuario(token, userId);
        // Enriquecer comentarios con nombre_lugar si es posible (igual que en MisResenas.js)
        const enriched = await Promise.all((comRes || []).map(async (r) => {
          let nombre_lugar = r.nombre_lugar;
          if (!nombre_lugar && r.id_lugar) {
            try {
              const lugarRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/lugares/byid/${r.id_lugar}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (lugarRes.data && lugarRes.data.nombre) nombre_lugar = lugarRes.data.nombre;
            } catch {}
          }
          return { ...r, nombre_lugar: nombre_lugar || r.nombre_lugar || "Sin nombre" };
        }));
        setComentarios(enriched);
      } catch (err) {
        setError("No se pudo cargar los comentarios");
      }
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const handleDeleteReview = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este comentario?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteResena(id, token);
      const comRes = await getResenasUsuario(token, userId);
      setComentarios(comRes || []);
    } catch (err) {
      alert("No se pudo eliminar el comentario");
    }
  };

  const filtered = React.useMemo(() => {
    if (!search.trim()) return comentarios;
    const normSearch = normalize(search);
    return comentarios.filter((r) =>
      normalize(r.nombre_lugar).includes(normSearch)
    );
  }, [comentarios, search]);

  const sorted = sortReviews(filtered, sort);
  const totalPages = Math.ceil(sorted.length / REVIEWS_PER_PAGE);
  const paginated = sorted.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE
  );

  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content" style={{ color: "#fff" }}>
        <h1>Comentarios</h1>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1, minWidth: 220, maxWidth: 480 }}>
            <SearchInputResenas
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </div>
          <div
            style={{
              minWidth: 180,
              flex: "0 0 220px",
              textAlign: "right",
            }}
          >
            <label
              style={{
                color: "#ff9800",
                fontWeight: 500,
                marginRight: 8,
              }}
            >
              Ordenar por:
            </label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              style={{
                padding: 4,
                borderRadius: 4,
                width: "60%",
              }}
            >
              <option value="reciente">Fecha más reciente</option>
              <option value="antiguo">Fecha más antigua</option>
              <option value="mejor">Mayor calificación</option>
              <option value="peor">Menor calificación</option>
              <option value="sitio-asc">Sitio (A-Z)</option>
              <option value="sitio-desc">Sitio (Z-A)</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div style={{ color: "#ff9800" }}>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#ff9800" }}>{error}</div>
        ) : paginated.length === 0 ? (
          <div style={{ color: "#aaa" }}>No ha escrito comentarios aún.</div>
        ) : (
          <ReviewList
            reviews={paginated}
            userId={userId}
            isAdmin={true}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            allowEdit={false}
            onDeleteReview={handleDeleteReview}
            StarRating={StarRating}
          />
        )}
        {totalPages > 1 && (
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "center",
              gap: 8,
              color: "#fff",
            }}
          >
            <button
              className="btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </button>
            <span
              style={{
                color: "#ff9800",
                fontWeight: 500,
              }}
            >
              Página {page} de {totalPages}
            </span>
            <button
              className="btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComentarios;
