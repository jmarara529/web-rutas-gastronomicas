// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la ruta de lugares
const API_URL = `${API_BASE_URL}/lugares`;

// Función para agregar un lugar a la base de datos
// Recibe un objeto 'place' y un 'token' de autenticación
export const addPlaceToDB = async (place, token) => {
  // Extrae los campos necesarios para la tabla lugares
  const body = {
    place_id: place.id || place.place_id, // Usa el id del lugar
    nombre: place.displayName?.text || place.name || "Sin nombre", // Nombre del lugar
    direccion: place.formattedAddress || place.vicinity || "", // Dirección del lugar
    categoria: place.types && place.types.length > 0 ? place.types[0] : "", // Categoría principal
    ciudad: place.formattedAddress ? (place.formattedAddress.split(",").slice(-2)[0].trim() || "") : "" // Ciudad extraída de la dirección
  };
  try {
    // Realiza la petición POST a la API para agregar el lugar
    const response = await axios.post(API_URL, body, {
      headers: {
        Authorization: `Bearer ${token}` // Agrega el token de autenticación en la cabecera
      }
    });
    // Retorna la respuesta de la API
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // Si ya existe el lugar, actúa como si se hubiera registrado correctamente
      return { msg: "Lugar registrado correctamente" };
    }
    // Lanza el error si es otro tipo de error
    throw error;
  }
};
