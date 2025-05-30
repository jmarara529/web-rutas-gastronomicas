import React from "react";
import HeaderHome from "../components/HeaderHome";
import RegisterForm from "../components/RegisterForm";
import "../styles/pages/page-common.css";
import "../styles/pages/Register.css";

const Register = () => (
    <div className="page-container register-page">
        <HeaderHome />
        <div className="content">
            <RegisterForm />
        </div>
    </div>
);

export default Register;