import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/historial`;

export const getHistorial = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
