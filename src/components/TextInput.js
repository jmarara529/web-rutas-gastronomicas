import React from "react";
import "../styles/components/textInput.css";

const TextInput = ({
    type = "text",
    value,
    onChange,
    required = true,
    placeholder = "",
    name,
    id,
    autoComplete,
    ...props
}) => (
    <input
        className="text-input"
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        name={name}
        id={id}
        autoComplete={autoComplete}
        {...props}
    />
);

export default TextInput;