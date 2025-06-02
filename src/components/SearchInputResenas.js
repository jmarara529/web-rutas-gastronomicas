import React from "react";
import "../styles/components/searchinputresenas.css";

const SearchInputResenas = ({ value, onChange }) => (
  <input
    className="searchinput-resenas"
    type="text"
    placeholder="Buscar por sitio..."
    value={value}
    onChange={e => onChange(e.target.value)}
    autoComplete="off"
  />
);

export default SearchInputResenas;
