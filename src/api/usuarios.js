import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/usuarios`;

export const getUsuarios = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUsuario = async (userId, data, token) => {
  const res = await axios.put(`${API_URL}/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteUsuario = async (userId, token) => {
  const res = await axios.delete(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
