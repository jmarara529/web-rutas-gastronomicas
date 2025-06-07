// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la ruta de reseñas
const API_URL = `${API_BASE_URL}/resenas`;

// Función para agregar una reseña a un lugar
// Recibe un objeto con place_id, calificacion y comentario, y un token de autenticación
export const addReview = async ({ place_id, calificacion, comentario }, token) => {
  // Realiza una petición POST a la API para agregar la reseña
  const response = await axios.post(
    API_URL,
    { place_id, calificacion, comentario },
    {
      headers: {
        Authorization: `Bearer ${token}` // Agrega el token de autenticación en la cabecera
      }
    }
  );
  // Retorna la respuesta de la API
  return response.data;
};

// Función para obtener las reseñas de un lugar
// Recibe el place_id y opcionalmente un token de autenticación
export const getReviews = async (place_id, token) => {
  const config = {
    params: { place_id }
  };
  if (token) {
    // Si se proporciona un token, lo agrega a la cabecera
    config.headers = { Authorization: `Bearer ${token}` };
  } else {
    // Si no hay token, intenta obtenerlo de localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      config.headers = { Authorization: `Bearer ${storedToken}` };
    }
  }
  // Realiza una petición GET a la API para obtener las reseñas
  const response = await axios.get(API_URL, config);
  // Retorna la respuesta de la API
  return response.data;
};
