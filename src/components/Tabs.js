// Importa React y el hook useState para manejar el estado de la pestaña activa
import React, { useState } from "react";

// Componente Tabs para mostrar contenido en pestañas
// Recibe un array de objetos 'tabs' con las propiedades 'label' y 'content'
const Tabs = ({ tabs }) => {
  // Estado para la pestaña activa (por defecto la primera)
  const [active, setActive] = useState(0);
  return (
    <div className="tabs-container">
      {/* Encabezado de pestañas: botones para cambiar de pestaña */}
      <div className="tabs-header">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={i === active ? "tab-btn active" : "tab-btn"}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Contenido de la pestaña activa */}
      <div className="tabs-content">
        {tabs[active].content}
      </div>
    </div>
  );
};

export default Tabs;
