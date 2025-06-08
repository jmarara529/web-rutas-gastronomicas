# Rutas Gastronómicas - Frontend (web-rutas-gastronomicas)

Este proyecto es el frontend de la aplicación **Rutas Gastronómicas**, desarrollado en React. Permite a los usuarios buscar, reseñar, marcar como visitados y guardar como favoritos restaurantes y otros lugares gastronómicos, así como gestionar su perfil y visualizar estadísticas. Los administradores pueden gestionar usuarios y ver el historial de acciones.

## Tabla de Contenidos
- [Características](#características)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno-necesarias)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts principales](#scripts-principales)
- [Uso](#uso)
- [Despliegue](#despliegue)
- [Créditos](#créditos)

## Características
- **Autenticación y registro de usuarios** (JWT)
- **Búsqueda de lugares** (integración con Google Places API)
- **Gestión de lugares visitados y favoritos**
- **Creación, edición y eliminación de reseñas**
- **Perfil de usuario** con edición de datos y eliminación de cuenta
- **Panel de administración** para gestión de usuarios y visualización de historial
- **Historial de acciones** (auditoría de eliminaciones y cambios)
- **Paginación, ordenación y búsqueda** en todas las listas
- **Interfaz moderna y responsive**

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd web-rutas-gastronomicas
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   REACT_APP_API_BASE_URL=http://localhost:3000/api
   ```
   Ajusta la URL según la ubicación de tu backend.
4. Inicia la aplicación en modo desarrollo:
   ```bash
   npm start
   ```

## Variables de entorno necesarias

- `REACT_APP_API_BASE_URL`: URL base del backend (por defecto: `http://localhost:3000/api`)

## Estructura del Proyecto

```
web-rutas-gastronomicas/
  src/
    pages/         # Páginas principales (perfil, favoritos, admin, etc)
    components/    # Componentes reutilizables
    api/           # Funciones para interactuar con la API
    styles/        # Archivos CSS
  public/          # Archivos estáticos
  package.json
  README.md
```

## Scripts principales

- `npm start`: Inicia la app en modo desarrollo en [http://localhost:3000](http://localhost:3000)
- `npm run build`: Genera la versión optimizada para producción
- `npm run lint`: Ejecuta el linter para revisar el código

## Uso

- Accede a [http://localhost:3000](http://localhost:3000) en tu navegador.
- Regístrate o inicia sesión.
- Explora lugares, añade favoritos, marca visitados y escribe reseñas.
- Si eres administrador, accede al panel de administración para gestionar usuarios y ver el historial de acciones.

## Despliegue

Para desplegar en producción:
1. Ejecuta `npm run build` para generar la carpeta `build/` optimizada.
2. Sube el contenido de `build/` a tu servidor web o plataforma de hosting estático (Netlify, Vercel, etc).

## Créditos

Desarrollado por José Martín Arance. Proyecto académico y de aprendizaje.

---

Para dudas o mejoras, abre un issue o contacta al autor.
