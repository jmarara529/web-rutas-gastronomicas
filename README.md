# Rutas Gastronómicas - Frontend (web-rutas-gastronomicas)

Este proyecto es el frontend de la aplicación **Rutas Gastronómicas**, desarrollado en React. Permite a los usuarios buscar, reseñar, marcar como visitados y guardar como favoritos restaurantes y otros lugares gastronómicos, así como gestionar su perfil y visualizar estadísticas. Los administradores pueden gestionar usuarios y ver el historial de acciones.

## Estructura del Proyecto

- **src/pages/**: Páginas principales de la aplicación (perfil, favoritos, lugares visitados, reseñas, administración, etc).
- **src/components/**: Componentes reutilizables (tarjetas de lugares, formularios, cabeceras, filtros, etc).
- **src/api/**: Funciones para interactuar con la API backend (usuarios, favoritos, visitados, reseñas, historial).
- **src/styles/**: Archivos CSS para los estilos globales y de páginas/componentes.
- **public/**: Archivos estáticos y recursos (imágenes, index.html).

## Principales Funcionalidades

- **Autenticación y registro de usuarios**
- **Búsqueda de lugares** (integración con Google Places)
- **Gestión de lugares visitados y favoritos**
- **Creación, edición y eliminación de reseñas**
- **Perfil de usuario** con edición de datos y eliminación de cuenta
- **Panel de administración** para gestión de usuarios y visualización de historial
- **Paginación, ordenación y búsqueda** en todas las listas
- **Interfaz moderna y responsive**

## Scripts principales

- `npm start`: Inicia la app en modo desarrollo en [http://localhost:3000](http://localhost:3000)
- `npm run build`: Genera la versión optimizada para producción

## Variables de entorno necesarias

Crea un archivo `.env` en la raíz del proyecto con al menos:

```
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

Ajusta la URL según la ubicación de tu backend.

## Requisitos

- Node.js 18+
- Tener el backend de la API corriendo

## Estructura recomendada de carpetas

```
web-rutas-gastronomicas/
  src/
    pages/
    components/
    api/
    styles/
  public/
  package.json
  README.md
```

## Créditos

Desarrollado por José Martín Arance. Proyecto académico y de aprendizaje.

---

Para dudas o mejoras, abre un issue o contacta al autor.
