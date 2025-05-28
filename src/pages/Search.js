import React, { useState, useEffect } from "react";
import HeaderUser from "../components/HeaderUser";
import { searchPlacesByText, searchNearbyPlaces } from "../api/plazes/plazes";
import { addPlaceToDB } from "../api/plazes/addPlace";
import { addFavorite } from "../api/plazes/addFavorite";
import "../styles/pages/page-common.css";
import "../styles/pages/search.css";
import SearchInput from "../components/search/SearchInput";
import RadiusSlider from "../components/search/RadiusSlider";
import TypeFilters from "../components/search/TypeFilters";
import SearchResults from "../components/search/SearchResults";
import { useNavigate } from "react-router-dom";

const placeTypes = [
    { value: "restaurant", label: "Restaurante" },
    { value: "bar", label: "Bar" }
];

const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject("Geolocalización no soportada");
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }),
            (err) => reject(err.message)
        );
    });

const fetchPlaces = async ({ query, location, radius, types }) => {
    try {
        if (location) {
            const type = types.length > 0 ? types[0] : undefined;
            const data = await searchNearbyPlaces({ location, radius, type });
            if (data && data.results) return data;
            return { results: [] };
        } else if (query) {
            const data = await searchPlacesByText(query);
            if (data && data.results) return data;
            return { results: [] };
        } else {
            return { results: [] };
        }
    } catch (err) {
        // Devuelve un array vacío si hay error para evitar que desaparezca el loading sin feedback
        return { results: [] };
    }
};

const Search = () => {
    const [query, setQuery] = useState("");
    const [radius, setRadius] = useState(1000); // metros
    const [types, setTypes] = useState(["restaurant"]);
    const [location, setLocation] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    // Detectar si es admin desde localStorage
    const isAdmin = localStorage.getItem("es_admin") === "true";

    useEffect(() => {
        // Al cargar, intentar obtener ubicación actual
        getCurrentLocation()
            .then(setLocation)
            .catch(() => {});
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        try {
            let loc = location;
            let searchQuery = query;
            // Si el campo de búsqueda contiene coordenadas, usar búsqueda por cercanía
            const coordsRegex = /^-?\d{1,3}\.\d{3,},\s*-?\d{1,3}\.\d{3,}$/;
            if (coordsRegex.test(query)) {
                const [lat, lng] = query.split(",").map(v => parseFloat(v));
                loc = { lat, lng };
                searchQuery = "";
            }
            const data = await fetchPlaces({ query: searchQuery, location: loc, radius, types });
            setResults(data.results || []);
        } catch (err) {
            setErrorMsg("Error al buscar lugares: " + err);
        }
        setLoading(false);
    };

    const handleUseLocation = async () => {
        try {
            const loc = await getCurrentLocation();
            setLocation(loc);
            const coordsText = `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
            setQuery(coordsText);
        } catch (err) {
            setErrorMsg("No se pudo obtener la ubicación actual");
        }
    };

    const handlePlaceClick = async (place) => {
        try {
            const token = localStorage.getItem("token");
            await addPlaceToDB(place, token);
            // Navegar a la página de detalle del sitio
            navigate(`/sitio/${place.id || place.place_id}`);
        } catch (err) {
            setErrorMsg("No se pudo registrar el sitio en la base de datos");
        }
    };

    const handleAddFavorite = async (place) => {
        try {
            const token = localStorage.getItem("token");
            await addFavorite(place, token);
            setErrorMsg("Añadido a favoritos");
        } catch (err) {
            setErrorMsg("No se pudo añadir a favoritos");
        }
    };

    return (
        <div className="page-container">
            <HeaderUser isAdmin={isAdmin} />
            <div className="content">
                <h1>Búsqueda de restaurantes y sitios gastronómicos</h1>
                <form className="search-form" onSubmit={handleSearch}>
                    <SearchInput query={query} setQuery={setQuery} onUseLocation={handleUseLocation} />
                    <RadiusSlider radius={radius} setRadius={setRadius} />
                    <TypeFilters placeTypes={placeTypes} types={types} setTypes={setTypes} />
                    <button type="submit" disabled={loading}>Buscar</button>
                </form>
                {errorMsg && <div style={{ color: "#ff9800", margin: "12px 0" }}>{errorMsg}</div>}
                {loading && <div>Buscando...</div>}
                <SearchResults results={results} onPlaceClick={handlePlaceClick} onAddFavorite={handleAddFavorite} />
            </div>
        </div>
    );
};

export default Search;
