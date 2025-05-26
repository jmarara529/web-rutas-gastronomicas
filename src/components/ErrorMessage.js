import React from "react";
import "../styles/components/errorMessage.css";

const ErrorMessage = ({ error }) => {
    if (!error) return null;

    return <p className="error-message">{error}</p>;
};

export default ErrorMessage;