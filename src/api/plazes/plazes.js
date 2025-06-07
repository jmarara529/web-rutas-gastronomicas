// src/api/plazes/plazes.js
// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la ruta de lugares
const API_URL = `${API_BASE_URL}/places`;

// Busca lugares por texto (nombre de calle, ciudad, etc.)
// Recibe un string de búsqueda y retorna los resultados
export const searchPlacesByText = async (query) => {
    // Realiza una petición GET a la API con el texto de búsqueda
    const response = await axios.get(`${API_URL}/buscar`, { params: { query } });
    return response.data;
};

// Busca lugares cercanos a unas coordenadas
// Recibe un objeto con ubicación, radio y tipo de lugar
export const searchNearbyPlaces = async ({ location, radius, type }) => {
    const params = {
        lat: location.lat, // Latitud
        lng: location.lng, // Longitud
        radius,           // Radio de búsqueda
        type              // Tipo de lugar
    };
    // Realiza una petición GET a la API con los parámetros de búsqueda
    const response = await axios.get(`${API_URL}/cercanos`, { params });
    return response.data;
};
