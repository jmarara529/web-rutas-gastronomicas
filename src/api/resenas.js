// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la ruta de reseñas
const API_URL = `${API_BASE_URL}/resenas`;

// Función para obtener las reseñas de un usuario
// Recibe el token de autenticación y opcionalmente el userId
export const getResenasUsuario = async (token, userId) => {
  // Configura las cabeceras con el token
  const config = { headers: { Authorization: `Bearer ${token}` } };
  // Si se proporciona userId, ajusta la URL para buscar reseñas de ese usuario
  let url = `${API_URL}/usuario`;
  if (userId) url = `${API_URL}/usuario/${userId}`;
  // Realiza la petición GET a la API para obtener las reseñas
  const res = await axios.get(url, config);
  // Retorna la respuesta de la API
  return res.data;
};

// Función para eliminar una reseña
// Recibe el id de la reseña y el token de autenticación
export const deleteResena = async (id, token) => {
  // Realiza la petición DELETE a la API para eliminar la reseña
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Retorna la respuesta de la API
  return res.data;
};
