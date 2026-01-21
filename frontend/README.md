# 🚀 Frontend del Portafolio Interactivo (Astro)

Este es el frontend del portafolio, diseñado como una experiencia interactiva tipo videojuego 2D ("Game-like Portfolio"). Usa **Astro** para rendimiento estático y **Vanilla JS/CSS** para las animaciones e interactividad.

## 🛠 Tecnologías

- **Framework**: [Astro](https://astro.build/) (v4)
- **Estilos**: CSS Puro (Vanilla) con variables CSS para temas y animaciones `keyframes`.
- **Lenguaje**: TypeScript para lógica robusta en componentes client-side.
- **Fuentes**: Google Fonts "Outfit" para una estética moderna y limpia.

## 📂 Estructura del Proyecto

```text
src/
├── components/
│   ├── Dashboard.astro    # HUD superior derecho. Muestra stats en tiempo real.
│   ├── GameMap.astro      # El núcleo de la experiencia. Mapa 2D con zonas interactivas.
│   └── ZoneModal.astro    # Ventana modal para mostrar detalles de proyectos.
├── layouts/
│   └── Layout.astro       # Estructura global HTML, Head y estilos base.
└── pages/
    └── index.astro        # Punto de entrada. Compone el Mapa y el Dashboard.
```

## 🎮 Características Interactivas

### 1. Mapa de Zonas ("The Map")

El portafolio se divide en 3 zonas principales orbitando un HUB central:

- **Backend Zone**: Proyectos de Rust, Node.js, APis.
- **Data Science Zone**: Analytics, Dashboards.
- **AI/ML Zone**: Modelos, Inferencia.

Cada zona es interactiva (hover effects) y al hacer clic abre un modal detallado sin recargar la página.

### 2. Sistema de Gamificación

- **Monedas ($)**: Hay monedas flotando en el mapa. Al hacer clic en ellas, desaparecen con una animación y envían una petición al backend.
- **Dashboard en Vivo**: El componente `Dashboard` consulta periódicamente al backend para actualizar el contador de monedas global y visitas.

### 3. Diseño Visual

- **Glassmorphism**: Paneles semitransparentes con `backdrop-filter`.
- **Animaciones**: Rotación 3D simulada en el fondo (grid), flotación de monedas, transiciones suaves (ViewTransitions).

## 🚀 Ejecución

Necesitas tener **Node.js** instalado.

1.  Instala dependencias:
    ```bash
    npm install
    ```
2.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

Visita `http://localhost:4321`.

> **Nota**: Para que la interactividad funcione al 100% (contadores), asegúrate de que el **Backend (Rust)** esté corriendo en el puerto 8080.
