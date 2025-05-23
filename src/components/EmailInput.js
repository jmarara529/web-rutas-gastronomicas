import React from "react";
import "../styles/components/EmailInput.css";

const EmailInput = ({ value, onChange, required = true }) => (
    <input
        className="email-input"
        type="email"
        placeholder="Correo electrónico"
        value={value}
        onChange={onChange}
        required={required}
    />
);

export default EmailInput;