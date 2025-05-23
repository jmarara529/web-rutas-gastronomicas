import React from "react";
import "../styles/components/PasswordInput.css";

const PasswordInput = ({
    value,
    onChange,
    showPassword,
    onToggleShowPassword,
    required = true,
}) => (
    <div className="password-input-container">
        <input
            className="password-input"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={value}
            onChange={onChange}
            required={required}
        />
        <label className="show-password-label">
            <input
                type="checkbox"
                checked={showPassword}
                onChange={onToggleShowPassword}
            />
            &nbsp;Mostrar contraseña
        </label>
    </div>
);

export default PasswordInput;