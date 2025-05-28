import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceDetail from "../components/search/PlaceDetail";
import HeaderUser from "../components/HeaderUser";
import axios from "axios";

const PlacePage = () => {
  const { placeId } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      setError("");
      try {
        // Llama a tu backend para obtener detalles de Google Places
        const response = await axios.get(
          `https://security-killer.ddns.net:3443/api/places/detalles`,
          { params: { place_id: placeId } }
        );
        if (response.data && response.data.result) {
          setPlace(response.data.result);
        } else {
          setError("No se encontró el sitio");
        }
      } catch (err) {
        setError("Error al cargar el sitio");
      }
      setLoading(false);
    };
    fetchPlace();
  }, [placeId]);

  return (
    <div className="page-container">
      <HeaderUser />
      <div className="content">
        {loading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div style={{ color: "#ff9800" }}>{error}</div>
        ) : (
          <PlaceDetail place={place} />
        )}
      </div>
    </div>
  );
};

export default PlacePage;
