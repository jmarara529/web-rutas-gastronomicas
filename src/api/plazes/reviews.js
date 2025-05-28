import axios from "axios";

const API_URL = "https://security-killer.ddns.net:3443/api/resenas";

export const addReview = async ({ place_id, calificacion, comentario }, token) => {
  const response = await axios.post(
    API_URL,
    { place_id, calificacion, comentario },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const getReviews = async (place_id, token) => {
  const config = {
    params: { place_id }
  };
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  } else {
    // Si no hay token, intenta obtenerlo de localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      config.headers = { Authorization: `Bearer ${storedToken}` };
    }
  }
  const response = await axios.get(API_URL, config);
  return response.data;
};
