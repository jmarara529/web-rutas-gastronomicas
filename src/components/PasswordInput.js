import React from "react";
import "../styles/components/textInput.css";

const PasswordInput = ({ value, onChange, placeholder = "", name = "password", required = false, autoComplete = "new-password" }) => (
  <input
    className="text-input"
    type="password"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    name={name}
    required={required}
    autoComplete={autoComplete}
    style={{ width: "100%", marginTop: 4 }}
  />
);

export default PasswordInput;
