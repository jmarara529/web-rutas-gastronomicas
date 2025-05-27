import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/RutasGastronomicas/auth";
import ErrorMessage from "./ErrorMessage";
import TextInput from "./TextInput";
import "../styles/components/form.css";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const result = await loginUser(email, password);
        if (result.error) {
            setError(result.error);
        } else {
            localStorage.setItem("token", result.token);
            localStorage.setItem("es_admin", result.es_admin); // Guarda si es admin
            navigate("/search");
        }
    };

    return (
        <div className="form-container">
            <h1>Iniciar Sesión</h1>
            <ErrorMessage error={error} />
            <form onSubmit={handleLogin}>
                <TextInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    name="email"
                    autoComplete="email"
                    required
                />
                <TextInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    name="password"
                    autoComplete="current-password"
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
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default LoginForm;