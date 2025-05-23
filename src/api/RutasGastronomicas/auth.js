import axios from "axios";

const API_URL = "https://security-killer.ddns.net:3443/api"; 

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
