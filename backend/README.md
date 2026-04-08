# Backend del Portafolio Interactivo

Este es el servidor backend construido en **Rust** para manejar la lógica de gamificación, persistencia de usuarios y estadísticas en tiempo real del portafolio.

## Tecnologías

- **Lenguaje**: Rust (Edition 2021)
- **Framework Web**: [Actix-web](https://actix.rs/) (v4) - Escogido por su extrema velocidad y robustez.
- **CORS**: `actix-cors` para comunicación segura con el frontend.
- **Serialización**: `serde` y `serde_json` para manejo de API JSON.
- **Estado**: `std::sync::Mutex` y `HashMap` para manejo de estado concurrente en memoria.

## API Endpoints

El backend expone una API REST en `http://127.0.0.1:8080`. Se utiliza el header `X-User-ID` para identificar sesiones únicas.

### Estadísticas Globales
- `GET /api/stats`: Obtiene visitas totales y monedas recolectadas globalmente.

### Estado del Usuario
- `GET /api/user-state`: Recupera monedas, skins obtenidas y recompensas reclamadas del usuario.
- `POST /api/visit`: Registra una visita y otorga un **Bono de Bienvenida** (cada 12 minutos).

### Gamificación y Recompensas
- `POST /api/collect`: Incrementa monedas del usuario. Soporta `reward_id` para evitar doble reclamo de logros.
- `POST /api/play-game`: Valida si el usuario tiene monedas suficientes para iniciar un minijuego y descuenta el costo.

### Tienda de Skins
- `POST /api/buy-skin`: Compra una nueva skin usando monedas.
- `POST /api/set-skin`: Cambia la skin activa del usuario.

## Ejecución

Asegúrate de tener [Rust instalado](https://www.rust-lang.org/tools/install).

1.  Navega a la carpeta backend:
    ```bash
    cd backend
    ```
2.  Ejecuta el servidor:
    ```bash
    cargo run
    ```

El servidor iniciará en el puerto **8080** (o el definido en la variable de entorno `PORT`).

## Notas de Desarrollo

- **Estado Volátil**: Actualmente el estado se guarda en memoria (RAM). Se planea integrar SQLite para persistencia a largo plazo.
- **Identificación**: El frontend genera un UUID persistente en el `localStorage` y lo envía en cada petición.
- **Seguridad**: CORS configurado para permitir cualquier origen durante el desarrollo.