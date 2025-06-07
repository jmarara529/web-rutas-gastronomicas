import React, { useEffect, useState, useMemo } from "react";
import HeaderUser from "../components/HeaderUser";
import axios from "axios";

const tipoEntidadMap = {
  usuario: "Usuario",
  resena: "Reseña",
  favorito: "Favorito",
  visitado: "Visitado",
  lugar: "Lugar"
};

const accionesDisponibles = [
  "añadir", "eliminar", "crear", "editar", "actualizar"
];

function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const HistorialEliminaciones = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroPor, setFiltroPor] = useState("");
  const [valorFiltro, setValorFiltro] = useState("");
  const [opcionesUsuario, setOpcionesUsuario] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/historial`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistorial(res.data || []);
        // Opciones únicas de usuario para el filtro
        const usuarios = Array.from(new Set((res.data || []).map(h => h.ejecutado_por).filter(Boolean)));
        setOpcionesUsuario(usuarios);
      } catch (err) {
        setError("No se pudo cargar el historial de acciones");
      }
      setLoading(false);
    };
    fetchHistorial();
  }, []);

  // Opciones únicas para tipo y acción
  const tiposDisponibles = useMemo(() => Array.from(new Set(historial.map(h => h.tipo_entidad))), [historial]);
  const accionesUnicas = useMemo(() => Array.from(new Set(historial.map(h => h.accion))), [historial]);
  const usuariosDisponibles = useMemo(() => Array.from(new Set(historial.map(h => h.ejecutado_por).filter(Boolean))), [historial]);

  // Filtrado
  const historialFiltrado = useMemo(() => {
    if (!filtroPor || !valorFiltro) return historial;
    if (filtroPor === "tipo") {
      return historial.filter(h => h.tipo_entidad === valorFiltro);
    }
    if (filtroPor === "accion") {
      return historial.filter(h => h.accion === valorFiltro);
    }
    if (filtroPor === "usuario") {
      const normFiltro = normalize(valorFiltro);
      return historial.filter(h => normalize(h.ejecutado_por || "").includes(normFiltro));
    }
    return historial;
  }, [historial, filtroPor, valorFiltro]);

  return (
    <div className="page-container">
      <HeaderUser isAdmin={localStorage.getItem("es_admin") === "true"} />
      <div className="content">
        <h1>Historial de Acciones</h1>
        {/* Filtros */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
          <label style={{ color: "#ff9800", fontWeight: 500 }}>Filtrar por:</label>
          <select value={filtroPor} onChange={e => { setFiltroPor(e.target.value); setValorFiltro(""); }} style={{ padding: 4, borderRadius: 4 }}>
            <option value="">---</option>
            <option value="tipo">Tipo</option>
            <option value="accion">Acción</option>
            <option value="usuario">Ejecutado por</option>
          </select>
          {filtroPor === "tipo" && (
            <select value={valorFiltro} onChange={e => setValorFiltro(e.target.value)} style={{ padding: 4, borderRadius: 4 }}>
              <option value="">---</option>
              {tiposDisponibles.map(tipo => (
                <option key={tipo} value={tipo}>{tipoEntidadMap[tipo] || tipo}</option>
              ))}
            </select>
          )}
          {filtroPor === "accion" && (
            <select value={valorFiltro} onChange={e => setValorFiltro(e.target.value)} style={{ padding: 4, borderRadius: 4 }}>
              <option value="">---</option>
              {accionesUnicas.map(accion => (
                <option key={accion} value={accion}>{accion}</option>
              ))}
            </select>
          )}
          {filtroPor === "usuario" && (
            <input
              type="text"
              value={valorFiltro}
              onChange={e => setValorFiltro(e.target.value)}
              placeholder="Buscar usuario..."
              style={{ padding: 4, borderRadius: 4, minWidth: 180 }}
              list="usuarios-list"
            />
          )}
          <datalist id="usuarios-list">
            {usuariosDisponibles.map(u => (
              <option key={u} value={u} />
            ))}
          </datalist>
        </div>
        {/* Tabla */}
        {loading ? (
          <div style={{ color: "#ff9800" }}>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#e53935" }}>{error}</div>
        ) : historialFiltrado.length === 0 ? (
          <div style={{ color: "#aaa" }}>No hay acciones registradas.</div>
        ) : (
          <>
            {/* Vista tabla para pantallas grandes */}
            <table className="historial-table desktop-only" style={{ width: "100%", color: "#fff", background: "rgba(0,0,0,0.4)", borderRadius: 8, borderCollapse: "collapse", marginTop: 24 }}>
              <thead>
                <tr style={{ color: "#ff9800", fontWeight: 600 }}>
                  <th style={{ padding: 8 }}>Fecha</th>
                  <th style={{ padding: 8 }}>Tipo</th>
                  <th style={{ padding: 8 }}>Acción</th>
                  <th style={{ padding: 8 }}>ID Entidad</th>
                  <th style={{ padding: 8 }}>Ejecutado por</th>
                </tr>
              </thead>
              <tbody>
                {historialFiltrado.map((h) => (
                  <tr key={h.id} style={{ borderBottom: "1px solid #333" }}>
                    <td style={{ padding: 8 }}>
                      {h.fecha_accion ? (() => {
                        const d = new Date(h.fecha_accion);
                        if (isNaN(d)) return '-';
                        const dia = String(d.getDate()).padStart(2, '0');
                        const mes = String(d.getMonth() + 1).padStart(2, '0');
                        const anio = d.getFullYear();
                        return `${dia}-${mes}-${anio}`;
                      })() : '-'}
                    </td>
                    <td style={{ padding: 8 }}>{tipoEntidadMap[h.tipo_entidad] || h.tipo_entidad}</td>
                    <td style={{ padding: 8 }}>{h.accion || '-'}</td>
                    <td style={{ padding: 8 }}>{h.id_entidad}</td>
                    <td style={{ padding: 8 }}>{h.ejecutado_por || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Vista lista para móviles */}
            <div className="historial-list mobile-only">
              {historialFiltrado.map((h) => (
                <div key={h.id} className="historial-list-item" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, marginBottom: 16, padding: 12 }}>
                  <div><b>Fecha:</b> {h.fecha_accion ? (() => {
                    const d = new Date(h.fecha_accion);
                    if (isNaN(d)) return '-';
                    const dia = String(d.getDate()).padStart(2, '0');
                    const mes = String(d.getMonth() + 1).padStart(2, '0');
                    const anio = d.getFullYear();
                    return `${dia}-${mes}-${anio}`;
                  })() : '-'}</div>
                  <div><b>Tipo:</b> {tipoEntidadMap[h.tipo_entidad] || h.tipo_entidad}</div>
                  <div><b>Acción:</b> {h.accion || '-'}</div>
                  <div><b>ID Entidad:</b> {h.id_entidad}</div>
                  <div><b>Ejecutado por:</b> {h.ejecutado_por || "-"}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistorialEliminaciones;
