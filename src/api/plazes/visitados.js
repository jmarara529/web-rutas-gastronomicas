// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la ruta de lugares visitados
const API_URL = `${API_BASE_URL}/visitados`;

// Función para agregar un lugar a la lista de visitados
// Recibe un objeto 'place' y un 'token' de autenticación
export const addVisitado = async (place, token) => {
  // Construye el cuerpo de la petición con los datos del lugar
  const body = {
    place_id: place.id || place.place_id, // Usa el id del lugar
    nombre: place.displayName?.text || place.name || "Sin nombre", // Nombre del lugar
    direccion: place.formattedAddress || place.vicinity || "", // Dirección del lugar
    categoria: place.types && place.types.length > 0 ? place.types[0] : "", // Categoría principal
    ciudad: "" // Ciudad (vacío por defecto)
  };
  // Realiza la petición POST a la API para agregar el lugar a visitados
  const response = await axios.post(API_URL, body, {
    headers: {
      Authorization: `Bearer ${token}` // Agrega el token de autenticación en la cabecera
    }
  });
  // Retorna la respuesta de la API
  return response.data;
};

// Función para eliminar un lugar de la lista de visitados
// Recibe el place_id y el token de autenticación
export const removeVisitado = async (place_id, token) => {
  // Realiza la petición DELETE a la API para eliminar el lugar de visitados
  const response = await axios.delete(`${API_URL}/${place_id}`, {
    headers: {
      Authorization: `Bearer ${token}` // Agrega el token de autenticación en la cabecera
    }
  });
  // Retorna la respuesta de la API
  return response.data;
};

// Función para obtener la lista de lugares visitados del usuario
// Recibe el token de autenticación
export const getVisitados = async (token) => {
  // Realiza la petición GET a la API para obtener los lugares visitados
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}` // Agrega el token de autenticación en la cabecera
    }
  });
  // Retorna la respuesta de la API
  return response.data;
};
