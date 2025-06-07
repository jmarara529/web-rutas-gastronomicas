// Importa React y hooks necesarios para el estado y efectos
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import ReviewList from "../components/ReviewList";
import SearchInputResenas from "../components/SearchInputResenas";
import { getResenasUsuario, deleteResena } from "../api/resenas";
import axios from "axios";
import "../styles/components/ui-common.css";

// Número de comentarios por página
const REVIEWS_PER_PAGE = 20;

// Componente para mostrar y seleccionar estrellas de calificación
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

// Función para ordenar los comentarios según el criterio seleccionado
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

// Función para normalizar strings (eliminar tildes y pasar a minúsculas)
function normalize(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Componente principal para la administración de comentarios de un usuario
const AdminComentarios = () => {
  // Obtiene el userId de la URL
  const { userId } = useParams();
  // Estados para comentarios, carga, error, menú, orden, búsqueda y paginación
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [sort, setSort] = useState("reciente");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const isAdmin = localStorage.getItem("es_admin") === "true";

  // Efecto para cargar los comentarios del usuario al montar o cambiar userId
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const comRes = await getResenasUsuario(token, userId);
        // Enriquecer comentarios con nombre_lugar si es posible
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

  // Maneja la eliminación de un comentario
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

  // Filtra los comentarios según la búsqueda
  const filtered = React.useMemo(() => {
    if (!search.trim()) return comentarios;
    const normSearch = normalize(search);
    return comentarios.filter((r) =>
      normalize(r.nombre_lugar).includes(normSearch)
    );
  }, [comentarios, search]);

  // Ordena los comentarios filtrados
  const sorted = sortReviews(filtered, sort);
  // Calcula la paginación
  const totalPages = Math.ceil(sorted.length / REVIEWS_PER_PAGE);
  const paginated = sorted.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE
  );

  // Render principal de la página de administración de comentarios
  return (
    <div className="page-container">
      {/* Cabecera de usuario con menú de admin si corresponde */}
      <HeaderUser isAdmin={isAdmin} />
      <div className="content" style={{ color: "#fff" }}>
        <h1>Comentarios</h1>
        {/* Barra de búsqueda y selector de orden */}
        <div className="barra-filtros">
          <div className="barra-busqueda">
            <SearchInputResenas
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </div>
          <div className="barra-orden">
            <label className="barra-orden-label">Ordenar por:</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="barra-orden-select"
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
        {error && <div className="estado-error">{error}</div>}
        {loading ? (
          <div className="estado-cargando">Cargando...</div>
        ) : paginated.length === 0 ? (
          <div className="estado-vacio">No hay comentarios aún.</div>
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
          <div className="paginacion">
            <button
              className="btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </button>
            <span className="paginacion-info">
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
