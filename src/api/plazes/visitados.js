import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/visitados`;

export const addVisitado = async (place, token) => {
  const body = {
    place_id: place.id || place.place_id,
    nombre: place.displayName?.text || place.name || "Sin nombre",
    direccion: place.formattedAddress || place.vicinity || "",
    categoria: place.types && place.types.length > 0 ? place.types[0] : "",
    ciudad: ""
  };
  const response = await axios.post(API_URL, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const removeVisitado = async (place_id, token) => {
  const response = await axios.delete(`${API_URL}/${place_id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getVisitados = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
