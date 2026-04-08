# 🎮 Cosmic Portfolio - Experiencia Interactiva

Bienvenido a mi portafolio interactivo, un proyecto diseñado como una experiencia gamificada tipo videojuego 2D ("Game-like Portfolio"). Los usuarios pueden explorar diferentes zonas tecnológicas, recolectar monedas, jugar minijuegos y personalizar su avatar.

Este repositorio está dividido en dos partes principales: el **Frontend** (Astro) y el **Backend** (Rust).

## 🚀 Estructura del Proyecto

```text
portafolio/
├── frontend/     # Aplicación web construida con Astro, TypeScript y Vanilla CSS.
└── backend/      # Servidor en Rust con Actix-web para manejar el estado y la persistencia en memoria.
```

## 🌌 Características Principales

- **Exploración Espacial**: Un mapa interactivo con zonas dedicadas a Backend, Data Science y AI/ML.
- **Sistema de Gamificación**: Recolecta monedas flotantes para ganar puntos.
- **Minijuegos Integrados**: 
  - **Fishing**: Pesca proyectos en un minijuego de ritmo.
  - **Farm**: Gestiona y recolecta recursos en la zona de "Magic Tree".
  - **Connect 4**: Desafía al sistema en un clásico juego de estrategia.
  - **Quiz**: Pon a prueba tus conocimientos.
- **Personalización**: Tienda de skins para cambiar la apariencia del cursor/avatar usando las monedas recolectadas.
- **Efectos Visuales Premium**: Glassmorphism, animaciones fluidas y un diseño responsivo que se adapta a cualquier dispositivo.

## 🛠 Tecnologías Core

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | Astro, TypeScript, Vanilla CSS, Keyframe Animations |
| **Backend** | Rust, Actix-web, Serde, Actix-Cors |
| **Diseño** | Google Fonts (Outfit), Glassmorphism, Retro Pixel Art |

## 🛠 Cómo empezar

### 1. Clonar el repositorio
```bash
git clone https://github.com/JoanixX/portafolio.git
cd portafolio
```

### 2. Ejecutar el Backend (Rust)
```bash
cd backend
cargo run
```
*El backend iniciará en `http://localhost:8080`.*

### 3. Ejecutar el Frontend (Astro)
```bash
cd frontend
npm install
npm run dev
```
*Visita `http://localhost:4321` en tu navegador.*

---

Desarrollado con ❤️ por [Joaquín](https://github.com/JoanixX)
