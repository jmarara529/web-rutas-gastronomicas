import React from "react";
import HeaderHome from "../components/HeaderHome";
import LoginForm from "../components/LoginForm";
import "../styles/pages/page-common.css";
import "../styles/pages/login.css";

const Login = () => {
    return (
        <div className="page-container login-page">
            <HeaderHome />
            <div className="content">
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;