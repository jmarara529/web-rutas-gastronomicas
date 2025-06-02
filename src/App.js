import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Login from "./pages/login";
import Register from "./pages/register";
import Search from "./pages/Search";
import PlacePage from "./pages/PlacePage";
import PrivateRoute from "./components/PrivateRoute";
import Perfil from "./pages/perfil"; // Asegúrate de que la ruta de importación sea correcta
import MisResenas from "./pages/MisResenas";
import LugaresVisitados from "./pages/LugaresVisitados";
import Favoritos from "./pages/Favoritos";

// Define rutas públicas y privadas
const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/home", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/privacy", element: <Privacy /> },
    { path: "/contact", element: <Contact /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> }
];

const privateRoutes = [
    { path: "/search", element: <Search /> },
    { path: "/sitio/:placeId", element: <PlacePage /> },
    { path: "/perfil", element: <Perfil /> },
    { path: "/mis-reseñas", element: <MisResenas /> },
    { path: "/lugares-visitados", element: <LugaresVisitados /> },
    { path: "/favoritos", element: <Favoritos /> }
];

const App = () => {
    return (
        <Router>
            <Routes>
                {publicRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
                {privateRoutes.map(({ path, element }) => (
                    <Route
                        key={path}
                        path={path}
                        element={<PrivateRoute>{element}</PrivateRoute>}
                    />
                ))}
            </Routes>
        </Router>
    );
};

export default App;