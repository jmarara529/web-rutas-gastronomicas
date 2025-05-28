import axios from "axios";

const API_URL = "https://security-killer.ddns.net:3443/api/favoritos";

export const addFavorite = async (place, token) => {
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
