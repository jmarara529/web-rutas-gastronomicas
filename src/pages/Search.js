import React, { useState } from "react";
import HeaderUser from "../components/HeaderUser";
import "../styles/pages/page-common.css";

const Search = () => {
    const [query, setQuery] = useState("");
    // Detectar si es admin desde localStorage
    const isAdmin = localStorage.getItem("es_admin") === "true";

    return (
        <div className="page-container">
            <HeaderUser isAdmin={isAdmin} />
            <div className="content">
                <h1>Búsqueda de restaurantes</h1>
                <form style={{ margin: "24px 0" }} onSubmit={e => e.preventDefault()}>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar por nombre, tipo, zona..."
                        style={{
                            width: "100%",
                            maxWidth: 400,
                            padding: 10,
                            borderRadius: 5,
                            border: "1px solid #ccc",
                            fontSize: 16
                        }}
                    />
                </form>
            </div>
        </div>
    );
};

export default Search;
