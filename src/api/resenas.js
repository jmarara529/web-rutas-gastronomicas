import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/resenas`;

export const getResenasUsuario = async (token, userId) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  let url = `${API_URL}/usuario`;
  if (userId) url = `${API_URL}/usuario/${userId}`;
  const res = await axios.get(url, config);
  return res.data;
};

export const deleteResena = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
