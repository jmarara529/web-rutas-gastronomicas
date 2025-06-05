import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/favoritos`;

export const getFavoritos = async (token, adminId) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  if (adminId) config.params = { admin_id: adminId };
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const deleteFavorito = async (id_lugar, token) => {
  const res = await axios.delete(`${API_URL}/${id_lugar}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
