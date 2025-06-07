import React, { useEffect, useState, useMemo } from "react";
import HeaderUser from "../components/HeaderUser";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/pages/admin-usuarios.css";

// Número de usuarios por página
const USUARIOS_POR_PAGINA = 20;

const AdministrarUsuarios = () => {
  // Estados para la lista de usuarios, carga, error, página, error de usuario, búsqueda, filtro de admin y sugerencias
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [errorUsuario, setErrorUsuario] = useState("");
  const [search, setSearch] = useState("");
  const [isAdminFilter, setIsAdminFilter] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("es_admin") === "true";

  // Efecto para cargar la lista de usuarios al montar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data || []);
      } catch (err) {
        setError("No se pudo cargar la lista de usuarios");
      }
      setLoading(false);
    };
    fetchUsuarios();
  }, []);

  // Normaliza texto para búsquedas (elimina tildes y pasa a minúsculas)
  function normalize(str) {
    return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Efecto para mostrar sugerencias en tiempo real al buscar
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const normSearch = normalize(search);
    const filtered = usuarios.filter(u =>
      normalize(u.nombre).includes(normSearch) || normalize(u.correo).includes(normSearch)
    );
    setSuggestions(filtered.slice(0, 5));
  }, [search, usuarios]);

  // Filtrado de usuarios por búsqueda y filtro de admin
  const usuariosFiltrados = useMemo(() => {
    let filtrados = usuarios;
    if (search.trim()) {
      const normSearch = normalize(search);
      filtrados = filtrados.filter(u =>
        normalize(u.nombre).includes(normSearch) || normalize(u.correo).includes(normSearch)
      );
    }
    if (isAdminFilter) {
      filtrados = filtrados.filter(u => u.es_admin);
    }
    return filtrados;
  }, [usuarios, search, isAdminFilter]);

  // Cálculo de páginas totales y usuarios paginados
  const totalPages = useMemo(() => Math.ceil(usuariosFiltrados.length / USUARIOS_POR_PAGINA), [usuariosFiltrados]);
  const paginados = useMemo(() => usuariosFiltrados.slice((page - 1) * USUARIOS_POR_PAGINA, page * USUARIOS_POR_PAGINA), [usuariosFiltrados, page]);

  // Render principal de la página de administración de usuarios
  return (
    <div className="page-container">
      {/* Cabecera de usuario con menú de admin si corresponde */}
      <HeaderUser isAdmin={isAdmin} />
      <div className="content">
        <h1>Administrar Usuarios</h1>
        {/* Mensaje de error específico al intentar editar usuario protegido */}
        {errorUsuario && <div style={{ color: "#e53935", margin: '12px 0', fontWeight: 600 }}>{errorUsuario}</div>}
        {/* Mensaje de carga o error general */}
        {loading ? (
          <div style={{ color: "#ff9800" }}>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#e53935" }}>{error}</div>
        ) : (
          <>
            {/* Barra de búsqueda y filtro de admin */}
            <div className="admin-usuarios-barra-filtros">
              <div className="admin-usuarios-barra-busqueda" style={{ position: 'relative' }}>
                <input
                  className="text-input"
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  autoComplete="off"
                  style={{ width: '100%' }}
                />
                {/* Sugerencias en tiempo real */}
                {search && suggestions.length > 0 && (
                  <ul className="admin-usuarios-sugerencias">
                    {suggestions.map(u => (
                      <li key={u.id} className="admin-usuarios-sugerencia-item"
                        onClick={() => { setSearch(u.nombre); setSuggestions([]); }}>
                        {u.nombre} <span className="admin-usuarios-sugerencia-correo">({u.correo})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="admin-usuarios-barra-admin">
                <label htmlFor="admin-filter" className="admin-usuarios-barra-admin-label">Solo admins</label>
                <input
                  id="admin-filter"
                  type="checkbox"
                  checked={isAdminFilter}
                  onChange={e => { setIsAdminFilter(e.target.checked); setPage(1); }}
                  className="admin-usuarios-barra-admin-checkbox"
                />
              </div>
            </div>
            {/* Vista tabla para pantallas grandes */}
            <table className="usuarios-table desktop-only" style={{ width: "100%", color: "#fff", background: "rgba(0,0,0,0.4)", borderRadius: 8, borderCollapse: "collapse", marginTop: 24 }}>
              <thead>
                <tr style={{ color: "#ff9800", fontWeight: 600 }}>
                  <th style={{ padding: 8 }}>ID</th>
                  <th style={{ padding: 8 }}>Nombre</th>
                  <th style={{ padding: 8 }}>Correo</th>
                  <th style={{ padding: 8 }}>Administrador</th>
                  <th style={{ padding: 8 }}>Fecha de creación</th>
                </tr>
              </thead>
              <tbody>
                {/* Fila por cada usuario, permite navegar a la edición salvo el usuario protegido */}
                {paginados.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #333", cursor: "pointer" }}
                    onClick={() => {
                      if (u.id === 1) {
                        setErrorUsuario(`No se puede editar usuario id 1/${u.nombre}`);
                      } else {
                        setErrorUsuario("");
                        navigate(`/admin/usuario/${u.id}`);
                      }
                    }}
                  >
                    <td style={{ padding: 8 }}>{u.id}</td>
                    <td style={{ padding: 8 }}>{u.nombre}</td>
                    <td style={{ padding: 8 }}>{u.correo}</td>
                    <td style={{ padding: 8 }}>{u.es_admin ? "Sí" : "No"}</td>
                    <td style={{ padding: 8 }}>{u.fecha_creacion ? new Date(u.fecha_creacion).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Vista lista para móviles */}
            <div className="usuarios-list mobile-only">
              {paginados.map(u => (
                <div key={u.id} className="usuarios-list-item" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, marginBottom: 16, padding: 12, cursor: 'pointer' }}
                  onClick={() => {
                    if (u.id === 1) {
                      setErrorUsuario(`No se puede editar usuario id 1/${u.nombre}`);
                    } else {
                      setErrorUsuario("");
                      navigate(`/admin/usuario/${u.id}`);
                    }
                  }}
                >
                  <div><b>ID:</b> {u.id}</div>
                  <div><b>Nombre:</b> {u.nombre}</div>
                  <div><b>Correo:</b> {u.correo}</div>
                  <div><b>Administrador:</b> {u.es_admin ? "Sí" : "No"}</div>
                  <div><b>Fecha de creación:</b> {u.fecha_creacion ? new Date(u.fecha_creacion).toLocaleDateString() : "-"}</div>
                </div>
              ))}
            </div>
            {/* Paginación si hay varias páginas */}
            {totalPages > 1 && (
              <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 8, color: '#fff' }}>
                <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
                <span style={{ color: "#ff9800", fontWeight: 500 }}>Página {page} de {totalPages}</span>
                <button className="btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdministrarUsuarios;
