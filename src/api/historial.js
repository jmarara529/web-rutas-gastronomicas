// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la ruta de historial
const API_URL = `${API_BASE_URL}/historial`;

// Función para obtener el historial de acciones del usuario
// Recibe el token de autenticación
export const getHistorial = async (token) => {
  // Realiza la petición GET a la API para obtener el historial
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }, // Agrega el token en la cabecera
  });
  // Retorna la respuesta de la API
  return res.data;
};
