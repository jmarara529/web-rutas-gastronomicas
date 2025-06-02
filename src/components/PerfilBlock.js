import React from "react";
import "../styles/pages/perfilBlock.css";

const PerfilBlock = ({ title, children, action }) => (
  <section className="perfil-block">
    <div className="perfil-block-header">
      <h2>{title}</h2>
      {action && <div className="perfil-block-action">{action}</div>}
    </div>
    <div className="perfil-block-content">{children}</div>
  </section>
);

export default PerfilBlock;
