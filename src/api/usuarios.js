// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la ruta de usuarios
const API_URL = `${API_BASE_URL}/usuarios`;

// Función para obtener la lista de usuarios
// Recibe el token de autenticación
export const getUsuarios = async (token) => {
  // Realiza la petición GET a la API para obtener los usuarios
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }, // Agrega el token en la cabecera
  });
  // Retorna la respuesta de la API
  return res.data;
};

// Función para actualizar los datos de un usuario
// Recibe el userId, los nuevos datos y el token de autenticación
export const updateUsuario = async (userId, data, token) => {
  // Realiza la petición PUT a la API para actualizar el usuario
  const res = await axios.put(`${API_URL}/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` }, // Agrega el token en la cabecera
  });
  // Retorna la respuesta de la API
  return res.data;
};

// Función para eliminar un usuario
// Recibe el userId y el token de autenticación
export const deleteUsuario = async (userId, token) => {
  // Realiza la petición DELETE a la API para eliminar el usuario
  const res = await axios.delete(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }, // Agrega el token en la cabecera
  });
  // Retorna la respuesta de la API
  return res.data;
};
