import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/RutasGastronomicas/auth";
import ErrorMessage from "./ErrorMessage";
import DynamicUserForm from "./DynamicUserForm";
import "../styles/components/form.css";

const LoginForm = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (form) => {
        setError("");
        const result = await loginUser(form.email, form.password);
        if (result.error) {
            setError(result.error);
        } else {
            localStorage.setItem("token", result.token);
            localStorage.setItem("es_admin", result.es_admin);
            localStorage.setItem("user_id", result.id); // <-- Asegura guardar el id
            navigate("/search");
        }
    };

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