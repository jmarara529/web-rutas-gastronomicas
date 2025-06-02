import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api/RutasGastronomicas/auth";
import DynamicUserForm from "./DynamicUserForm";
import ErrorMessage from "./ErrorMessage";
import "../styles/components/form.css";

const RegisterForm = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (form) => {
        setError("");
        setSuccess("");
        setLoading(true);
        const result = await registerUser(form.nombre, form.correo, form.password);
        if (result.success) {
            // Registro exitoso, iniciar sesión automáticamente
            const loginResult = await loginUser(form.correo, form.password);
            if (loginResult.error) {
                setError("Registro correcto, pero error al iniciar sesión: " + loginResult.error);
            } else {
                localStorage.setItem("token", loginResult.token);
                localStorage.setItem("es_admin", loginResult.es_admin);
                localStorage.setItem("user_id", loginResult.id); // <-- Asegura guardar el id
                navigate("/search");
            }
        } else {
            setError(result.error || result.msg || "Error desconocido en el registro.");
        }
        setLoading(false);
    };

    return (
        <div className="form-container">
            <h1>Registro de Usuario</h1>
            <ErrorMessage error={error} />
            {success && <div className="success-message">{success}</div>}
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