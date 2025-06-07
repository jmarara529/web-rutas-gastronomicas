// Importa React, hooks y componentes necesarios
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/RutasGastronomicas/auth";
import DynamicUserForm from "./DynamicUserForm";
import ErrorMessage from "./ErrorMessage";
import "../styles/components/form.css";

// Componente de formulario de registro de usuario
const RegisterForm = () => {
    // Estado para mensajes de error, éxito y carga
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    // Hook para navegación programática
    const navigate = useNavigate();

    // Maneja el envío del formulario de registro
    const handleSubmit = async (form) => {
        setError(""); // Limpia errores previos
        setSuccess(""); // Limpia mensajes de éxito previos
        setLoading(true); // Activa estado de carga
        // Llama a la API de registro con los datos del formulario
        const result = await registerUser(form.nombre, form.correo, form.password);
        // Si el registro fue exitoso, muestra mensaje y redirige al login
        if (result.success || result.msg === 'Usuario creado') {
            setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
            setTimeout(() => navigate("/login"), 1200);
        } else {
            // Si hay error, muestra el mensaje correspondiente
            setError(result.error || result.msg || "Error desconocido en el registro.");
        }
        setLoading(false); // Desactiva estado de carga
    };

    // Renderiza el formulario de registro
    return (
        <div className="form-container">
            <h1>Registro de Usuario</h1>
            {/* Muestra mensaje de error si existe */}
            <ErrorMessage error={error} />
            {/* Muestra mensaje de éxito si existe */}
            {success && <div className="success-message">{success}</div>}
            {/* Formulario dinámico con los campos requeridos */}
            <DynamicUserForm
                fields={[
                  { name: "nombre", label: "Nombre", type: "text", required: true, autoComplete: "name" },
                  { name: "correo", label: "Correo", type: "email", required: true, autoComplete: "email" },
                  { name: "password", label: "Contraseña", type: "password", required: true, autoComplete: "new-password" }
                ]}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                submitText="Registrarse"
            />
        </div>
    );
};

export default RegisterForm;