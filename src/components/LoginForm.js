// Importa React, hooks y componentes necesarios
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/RutasGastronomicas/auth";
import ErrorMessage from "./ErrorMessage";
import DynamicUserForm from "./DynamicUserForm";
import "../styles/components/form.css";

// Componente de formulario de inicio de sesión
const LoginForm = () => {
    // Estado para el mensaje de error
    const [error, setError] = useState("");
    // Hook para navegación programática
    const navigate = useNavigate();

    // Maneja el envío del formulario de login
    const handleLogin = async (form) => {
        setError(""); // Limpia errores previos
        const result = await loginUser(form.email, form.password); // Llama a la API de login
        if (result.error) {
            setError(result.error); // Muestra error si ocurre
        } else {
            // Guarda datos relevantes en localStorage
            localStorage.setItem("token", result.token);
            localStorage.setItem("es_admin", result.es_admin);
            localStorage.setItem("user_id", result.id); // Guarda el id del usuario
            navigate("/search"); // Redirige al buscador
        }
    };

    // Renderiza el formulario de login
    return (
        <div className="form-container">
            <h1>Iniciar Sesión</h1>
            <ErrorMessage error={error} />
            <DynamicUserForm
                fields={[
                  { name: "email", label: "Correo electrónico", type: "email", required: true, autoComplete: "email" },
                  { name: "password", label: "Contraseña", type: "password", required: true, autoComplete: "current-password" }
                ]}
                onSubmit={handleLogin}
                loading={false}
                error={error}
                submitText="Entrar"
            />
        </div>
    );
};

export default LoginForm;