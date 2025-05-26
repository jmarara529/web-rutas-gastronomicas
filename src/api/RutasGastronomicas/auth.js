import axios from "axios";

const API_URL = "https://security-killer.ddns.net:3443/api"; 

//función para logear usuario
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            correo: email,
            contraseña: password,
        });
        return response.data;
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        return { error: error.response?.data?.msg || "Error desconocido" };
    }
};

//función para registrar usuario
export const registerUser = async (nombre, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            nombre,
            correo: email,
            contraseña: password,
        });
        return response.data;
    } catch (error) {
        console.error("Error en el registro:", error);
        // Devuelve primero el campo 'error', luego 'msg', luego un mensaje genérico
        return { error: error.response?.data?.error || error.response?.data?.msg || "Error desconocido" };
    }
};
