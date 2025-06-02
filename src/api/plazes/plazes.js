// src/api/plazes/plazes.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/places`;

// Busca lugares por texto (nombre de calle, ciudad, etc.)
export const searchPlacesByText = async (query) => {
    const response = await axios.get(`${API_URL}/buscar`, { params: { query } });
    return response.data;
};

// Busca lugares cercanos a unas coordenadas
export const searchNearbyPlaces = async ({ location, radius, type }) => {
    const params = {
        lat: location.lat,
        lng: location.lng,
        radius,
        type
    };
    const response = await axios.get(`${API_URL}/cercanos`, { params });
    return response.data;
};
