// Importa la librería axios para hacer peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la ruta de favoritos
const API_URL = `${API_BASE_URL}/favoritos`;

// Función para agregar un lugar a favoritos
// Recibe un objeto 'place' y un 'token' de autenticación
export const addFavorite = async (place, token) => {
  // Construye el cuerpo de la petición con los datos del lugar
  const body = {
    place_id: place.id || place.place_id, // Usa el id del lugar
    nombre: place.displayName?.text || place.name || "Sin nombre", // Nombre del lugar
    direccion: place.formattedAddress || place.vicinity || "", // Dirección del lugar
    categoria: place.types && place.types.length > 0 ? place.types[0] : "", // Categoría principal
    ciudad: "" // Ciudad (vacío por defecto)
  };
  // Realiza la petición POST a la API para agregar el favorito
  const response = await axios.post(API_URL, body, {
    headers: {
      Authorization: `Bearer ${token}` // Agrega el token de autenticación en la cabecera
    }
  });
  // Retorna la respuesta de la API
  return response.data;
};
