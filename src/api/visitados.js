// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la ruta de lugares visitados
const API_URL = `${API_BASE_URL}/visitados`;

// Función para obtener la lista de lugares visitados
// Recibe el token de autenticación y opcionalmente un adminId
export const getVisitados = async (token, adminId) => {
  // Configura las cabeceras con el token
  const config = { headers: { Authorization: `Bearer ${token}` } };
  // Si se proporciona adminId, lo agrega como parámetro de consulta
  if (adminId) config.params = { id_usuario: adminId };
  // Realiza la petición GET a la API para obtener los lugares visitados
  const res = await axios.get(adminId ? `${API_URL}/admin` : API_URL, config);
  // Retorna la respuesta de la API
  return res.data;
};

// Función para eliminar un lugar de la lista de visitados
// Recibe el id_lugar y el token de autenticación
export const deleteVisitado = async (id_lugar, token) => {
  // Realiza la petición DELETE a la API para eliminar el lugar visitado
  const res = await axios.delete(`${API_URL}/${id_lugar}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Retorna la respuesta de la API
  return res.data;
};
