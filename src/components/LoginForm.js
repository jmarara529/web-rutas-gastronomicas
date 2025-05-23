import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/RutasGastronomicas/auth";
import ErrorMessage from "./ErrorMessage"; 
import "../styles/components/LoginForm.css";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Nuevo estado
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // 🔹 Limpiar errores previos

        const result = await loginUser(email, password);
        if (result.error) {
            setError(result.error);
        } else {
            localStorage.setItem("token", result.token);  // 🔹 Guardamos el token
            navigate("/dashboard");  // 🔹 Redirigir al usuario tras el login
        }
    };

    return (
        <div className="login-form-container">
            <h1>Iniciar Sesión</h1>
            <ErrorMessage error={error} />  {/* 🔹 Muestra errores si hay problemas */}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div style={{ textAlign: "left", margin: "10px 0" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />{" "}
                        Mostrar contraseña
                    </label>
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default LoginForm;