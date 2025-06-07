/* Importa los módulos y componentes necesarios */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceDetail from "../components/PlaceDetail";
import HeaderUser from "../components/HeaderUser";
import axios from "axios";

const PlacePage = () => {
  /* Obtiene el parámetro de la URL (placeId) */
  const { placeId } = useParams();
  /* Estado para los datos del lugar, carga y error */
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Verifica si el usuario es admin */
  const isAdmin = localStorage.getItem("es_admin") === "true";

  /* Efecto para cargar los detalles del lugar al montar el componente o cambiar placeId */
  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      setError("");
      try {
        /* Llama al backend para obtener detalles del lugar desde Google Places */
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/places/detalles`,
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

  /* Render principal de la página */
  return (
    <div className="page-container">
      <HeaderUser isAdmin={isAdmin} />
      <div className="content">
        {loading ? (
          <div className="placepage-cargando">Cargando...</div>
        ) : error ? (
          <div className="placepage-error">{error}</div>
        ) : (
          <PlaceDetail place={place} />
        )}
      </div>
    </div>
  );
};

export default PlacePage;
