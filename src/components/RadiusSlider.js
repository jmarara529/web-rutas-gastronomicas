// Componente movido desde search/ para centralización
import React from "react";

const RadiusSlider = ({ radius, setRadius }) => (
  <div>
    <label htmlFor="radius-slider">Radio de búsqueda: <b>{radius} m</b></label>
    <input
      id="radius-slider"
      type="range"
      min={100}
      max={5000}
      step={100}
      value={radius}
      onChange={e => setRadius(Number(e.target.value))}
      style={{ width: "100%" }}
    />
  </div>
);

export default RadiusSlider;
