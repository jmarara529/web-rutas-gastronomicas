// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la ruta de favoritos
const API_URL = `${API_BASE_URL}/favoritos`;

// Función para obtener la lista de favoritos
// Recibe un token de autenticación y opcionalmente un adminId
export const getFavoritos = async (token, adminId) => {
  // Configura las cabeceras con el token
  const config = { headers: { Authorization: `Bearer ${token}` } };
  // Si se proporciona adminId, lo agrega como parámetro de consulta
  if (adminId) config.params = { admin_id: adminId };
  // Realiza la petición GET a la API para obtener los favoritos
  const res = await axios.get(API_URL, config);
  // Retorna la respuesta de la API
  return res.data;
};

// Función para eliminar un favorito
// Recibe el id_lugar y el token de autenticación
export const deleteFavorito = async (id_lugar, token) => {
  // Realiza la petición DELETE a la API para eliminar el favorito
  const res = await axios.delete(`${API_URL}/${id_lugar}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Retorna la respuesta de la API
  return res.data;
};
