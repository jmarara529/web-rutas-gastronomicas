import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/RutasGastronomicas/auth";
import ErrorMessage from "./ErrorMessage";
import TextInput from "./TextInput";
import "../styles/components/form.css";

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
        <div className="form-container">
            <h1>Registro de Usuario</h1>
            <ErrorMessage error={error} />
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <TextInput
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    name="nombre"
                    autoComplete="name"
                    required
                />
                <TextInput
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="Correo electrónico"
                    name="correo"
                    autoComplete="email"
                    required
                />
                <TextInput
                    type={showPassword ? "text" : "password"}
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    placeholder="Contraseña"
                    name="contraseña"
                    autoComplete="new-password"
                    required
                />
                <label style={{ display: "flex", alignItems: "center", gap: "8px", margin: "10px 0" }}>
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Mostrar contraseña
                </label>
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default RegisterForm;