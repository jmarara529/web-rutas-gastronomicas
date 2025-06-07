// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Obtiene el id interno (id_lugar) a partir de un place_id de Google
// Recibe el place_id y el token de autenticación
export const getLugarId = async (place_id, token) => {
  // Realiza una petición GET a la API para obtener el id interno del lugar
  const response = await axios.get(`${API_BASE_URL}/lugares/${place_id}`, {
    headers: { Authorization: `Bearer ${token}` } // Agrega el token en la cabecera
  });
  // Retorna el id interno del lugar
  return response.data.id;
};
