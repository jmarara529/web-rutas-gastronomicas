// Componente para seleccionar el radio de búsqueda con un slider
import React from "react";

// Recibe el valor actual del radio y la función para actualizarlo
const RadiusSlider = ({ radius, setRadius }) => (
  <div>
    {/* Etiqueta que muestra el valor actual del radio */}
    <label htmlFor="radius-slider">Radio de búsqueda: <b>{radius} m</b></label>
    {/* Slider de rango para seleccionar el radio (en metros) */}
    <input
      id="radius-slider"
      type="range"
      min={100} // Valor mínimo permitido
      max={5000} // Valor máximo permitido
      step={100} // Incremento de cada paso
      value={radius} // Valor actual
      onChange={e => setRadius(Number(e.target.value))} // Actualiza el radio al mover el slider
      style={{ width: "100%" }}
    />
  </div>
);

export default RadiusSlider;
