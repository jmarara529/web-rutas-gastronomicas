import React from "react";
import HeaderHome from "../components/HeaderHome";
import LoginForm from "../components/LoginForm";
import "../styles/pages/page-common.css";

const Login = () => {
    return (
        <div className="page-container">
            <HeaderHome />  {/* 🔹 Agregamos el panel superior */}
            <div className="content">
                <LoginForm />  {/* 🔹 Agregamos el formulario de login */}
            </div>
        </div>
    );
};

export default Login;