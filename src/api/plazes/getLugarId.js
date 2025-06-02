import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Obtiene el id interno (id_lugar) a partir de un place_id de Google
export const getLugarId = async (place_id, token) => {
  const response = await axios.get(`${API_BASE_URL}/lugares/${place_id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.id;
};
