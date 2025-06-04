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

  const totalPages = useMemo(() => Math.ceil(usuarios.length / USUARIOS_POR_PAGINA), [usuarios]);
  const paginados = useMemo(() => usuarios.slice((page - 1) * USUARIOS_POR_PAGINA, page * USUARIOS_POR_PAGINA), [usuarios, page]);

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
            <table style={{ width: "100%", color: "#fff", background: "rgba(0,0,0,0.4)", borderRadius: 8, borderCollapse: "collapse", marginTop: 24 }}>
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
