import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/lugares`;

export const addPlaceToDB = async (place, token) => {
  // Extraer los campos necesarios para la tabla lugares
  const body = {
    place_id: place.id || place.place_id,
    nombre: place.displayName?.text || place.name || "Sin nombre",
    direccion: place.formattedAddress || place.vicinity || "",
    categoria: place.types && place.types.length > 0 ? place.types[0] : "",
    ciudad: place.formattedAddress ? (place.formattedAddress.split(",").slice(-2)[0].trim() || "") : ""
  };
  try {
    const response = await axios.post(API_URL, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // Si ya existe, simplemente actúa como si se hubiera registrado correctamente
      return { msg: "Lugar registrado correctamente" };
    }
    throw error;
  }
};
