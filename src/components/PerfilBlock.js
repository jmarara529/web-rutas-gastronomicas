// Importa React y los estilos del bloque de perfil
import React from "react";
import "../styles/pages/perfilBlock.css";

// Componente reutilizable para mostrar una sección de perfil
// Recibe un título, los hijos (contenido) y una acción opcional (botón, enlace, etc.)
const PerfilBlock = ({ title, children, action }) => (
  <section className="perfil-block">
    <div className="perfil-block-header">
      <h2>{title}</h2>
      {/* Si se pasa una acción, la muestra en la cabecera */}
      {action && <div className="perfil-block-action">{action}</div>}
    </div>
    {/* Contenido principal del bloque */}
    <div className="perfil-block-content">{children}</div>
  </section>
);

export default PerfilBlock;
