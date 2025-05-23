import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/RutasGastronomicas/auth";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import "../styles/components/RegisterForm.css";

const RegisterForm = () => {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const result = await registerUser(nombre, correo, contraseña);
        if (result.success) {
            setSuccess("Usuario registrado correctamente. Redirigiendo...");
            setTimeout(() => navigate("/login"), 2000);
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="register-form-container">
            <h1>Registro de Usuario</h1>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="nombre-input"
                />
                <EmailInput
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />
                <PasswordInput
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    showPassword={showPassword}
                    onToggleShowPassword={() => setShowPassword(!showPassword)}
                />
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default RegisterForm;