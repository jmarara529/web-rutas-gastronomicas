import React from "react";
import HeaderHome from "../components/HeaderHome";
import AuthButtons from "../components/AuthButtons";  
import "../styles/pages/Home.css"; // Import the CSS file for styling

const Home = () => {
    return (
        <div className="home-container">
            <HeaderHome />  
            <div className="title-container">  
                <h1 className="app-title">COMER AQUI</h1>
                <h2 className="app-subtitle">Restaurantes y platillos recomendados en tu zona</h2>
            </div>
            <div className="overlay">
                <AuthButtons />  
            </div>
        </div>
    );
};

export default Home;