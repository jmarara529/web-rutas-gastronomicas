import React, { useEffect, useState, useMemo } from "react";
import HeaderUser from "../components/HeaderUser";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const USUARIOS_POR_PAGINA = 20;

const AdministrarUsuarios = () => {
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

  // Normaliza texto para búsquedas (sin tildes, minúsculas)
  function normalize(str) {
    return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Sugerencias en tiempo real
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

  // Filtrado de usuarios
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

  const totalPages = useMemo(() => Math.ceil(usuariosFiltrados.length / USUARIOS_POR_PAGINA), [usuariosFiltrados]);
  const paginados = useMemo(() => usuariosFiltrados.slice((page - 1) * USUARIOS_POR_PAGINA, page * USUARIOS_POR_PAGINA), [usuariosFiltrados, page]);

  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content">
        <h1>Administrar Usuarios</h1>
        {errorUsuario && <div style={{ color: "#e53935", margin: '12px 0', fontWeight: 600 }}>{errorUsuario}</div>}
        {loading ? (
          <div style={{ color: "#ff9800" }}>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#e53935" }}>{error}</div>
        ) : (
          <>
            <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, minWidth: 0, maxWidth: 340, position: 'relative' }}>
                <input
                  className="text-input"
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  autoComplete="off"
                  style={{ width: '100%' }}
                />
                {search && suggestions.length > 0 && (
                  <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#232323',
                    borderRadius: 6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    zIndex: 10,
                    margin: 0,
                    padding: '4px 0',
                    listStyle: 'none',
                    maxHeight: 180,
                    overflowY: 'auto',
                    color: '#fff',
                    fontSize: 15
                  }}>
                    {suggestions.map(u => (
                      <li key={u.id} style={{ padding: '6px 12px', cursor: 'pointer' }}
                        onClick={() => { setSearch(u.nombre); setSuggestions([]); }}>
                        {u.nombre} <span style={{ color: '#aaa', fontSize: 13 }}>({u.correo})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div style={{ minWidth: 120, display: 'flex', alignItems: 'center', gap: 8 }}>
                <label htmlFor="admin-filter" style={{ color: '#ff9800', fontWeight: 500, cursor: 'pointer' }}>Solo admins</label>
                <input
                  id="admin-filter"
                  type="checkbox"
                  checked={isAdminFilter}
                  onChange={e => { setIsAdminFilter(e.target.checked); setPage(1); }}
                  style={{ width: 18, height: 18 }}
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
