// Importa la librería axios para realizar peticiones HTTP
import axios from "axios";

// Obtiene la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Construye la URL específica para la autenticación
const API_URL = `${API_BASE_URL}/auth`;

// Función para logear usuario
// Recibe email y contraseña, retorna los datos del usuario o un error
export const loginUser = async (email, password) => {
    try {
        // Realiza una petición POST a la API para iniciar sesión
        const response = await axios.post(`${API_URL}/login`, {
            correo: email, // Campo de correo electrónico
            contraseña: password, // Campo de contraseña
        });
        // Retorna la respuesta de la API (datos del usuario y token)
        return response.data;
    } catch (error) {
        // Muestra el error en consola y retorna un mensaje de error
        console.error("Error en el inicio de sesión:", error);
        return { error: error.response?.data?.msg || "Error desconocido" };
    }
};

// Función para registrar usuario
// Recibe nombre, email y contraseña, retorna los datos del usuario o un error
export const registerUser = async (nombre, email, password) => {
    try {
        // Realiza una petición POST a la API para registrar el usuario
        const response = await axios.post(`${API_URL}/register`, {
            nombre, // Nombre del usuario
            correo: email, // Correo electrónico
            contraseña: password, // Contraseña
        });
        // Retorna la respuesta de la API (datos del usuario y token)
        return response.data;
    } catch (error) {
        // Muestra el error en consola y retorna un mensaje de error
        console.error("Error en el registro:", error);
        // Devuelve primero el campo 'error', luego 'msg', luego un mensaje genérico
        return { error: error.response?.data?.error || error.response?.data?.msg || "Error desconocido" };
    }
};
