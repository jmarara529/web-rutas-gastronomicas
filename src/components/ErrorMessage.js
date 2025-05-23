import React from "react";
import "../styles/components/ErrorMessage.css";

const ErrorMessage = ({ error }) => {
    if (!error) return null;

    return <p className="error-message">{error}</p>;
};

export default ErrorMessage;