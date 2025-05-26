import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/button.css"; // Puedes usar el mismo CSS

const AuthButton = ({ to, children, className = "" }) => (
    <Link to={to}>
        <button className={`btn ${className}`}>{children}</button>
    </Link>
);

export default AuthButton;