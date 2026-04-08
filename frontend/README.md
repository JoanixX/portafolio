# Frontend del Portafolio Interactivo (Astro)

Este es el frontend del portafolio, diseñado como una experiencia interactiva tipo videojuego 2D ("Game-like Portfolio"). Utiliza **Astro** para un rendimiento estático superior y **TypeScript/Vanilla CSS** para las animaciones e interactividad profunda.

## Tecnologías

- **Framework**: [Astro](https://astro.build/) (v4)
- **Estilos**: CSS Puro (Vanilla) con un sistema de diseño basado en variables y animaciones nativas.
- **Lógica**: TypeScript para manejar el loop de los juegos y la comunicación con la API.
- **Fuentes**: Google Fonts "Outfit" para una estética premium.
- **Interactividad**: `ViewTransitions` de Astro para navegaciones suaves sin refresco de página.

## Estructura del Proyecto

```text
src/
├── components/
│   ├── StartScreen.astro  # Pantalla de inicio con selector de nombre y carga.
│   ├── Dashboard.astro    # HUD superior. Muestra monedas, visitas y selector de skins.
│   ├── GameMap.astro      # Mapa principal con zonas interactivas y NPCs.
│   └── ZoneModal.astro    # Modales dinámicos para proyectos y minijuegos.
├── game/                  # Lógica de los minijuegos (FSM, Física, Renderizado)
│   ├── fishing.ts         # Minijuego de pesca en la zona Backend.
│   ├── farm.ts            # Minijuego de recolección en Magic Tree.
│   ├── connect4.ts        # Juego de estrategia contra la IA.
│   └── quiz.ts            # Quiz interactivo de conocimientos.
├── layouts/               # Estructura global y estilos base.
└── data/                  # Contenido de proyectos y configuración de niveles.
```

## Experiencia de Usuario

### 1. Sistema de Inicio
Al entrar, el usuario es recibido por una `StartScreen`. Se genera un ID único que permite al backend recordar su progreso (monedas y skins) incluso si cierra la pestaña.

### 2. Zonas y Minijuegos
El mapa se divide en biomas tecnológicos:
- **Backend Zone (Blue)**: Aquí puedes pescar proyectos reales.
- **Magic Tree (Green)**: Una zona para relajarse y jugar el minijuego de la granja.
- **Strategic Zone**: Tablero de Connect 4 y Quizzes.

### 3. Economía y Personalización
- **Monedas**: Se ganan recolectándolas del mapa o ganando en los minijuegos.
- **Skins**: El `Dashboard` incluye un acceso a la tienda donde puedes comprar diferentes aspectos para tu cursor/avatar, los cuales se guardan en el servidor.

## Ejecución

Necesitas tener **Node.js** (v18+) instalado.

1.  Instala dependencias:
    ```bash
    npm install
    ```
2.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

Visita `http://localhost:4321`.

> **IMPORTANTE**: La experiencia completa (monedas, skins, visitas) requiere que el **Backend (Rust)** esté activo en el puerto 8080. El frontend intentará reconectarse automáticamente si el backend se cae.