# 🦀 Backend del Portafolio Interactivo

Este es el servidor backend construido en **Rust** para manejar la lógica de gamificación y estadísticas en tiempo real del portafolio.

## 🛠 Tecnologías

- **Lenguaje**: Rust (Edition 2021)
- **Framework Web**: [Actix-web](https://actix.rs/) (v4) - Escogido por su extrema velocidad y robustez.
- **CORS**: `actix-cors` para permitir peticiones desde el frontend (Astro).
- **Serialización**: `serde` y `serde_json` para manejo de API JSON.
- **Estado**: `std::sync::Mutex` para manejo de estado concurrente en memoria (simulando una DB).

## 📡 API Endpoints

El backend expone una API REST en `http://127.0.0.1:8080`.

### 1. Obtener Estadísticas

Devuelve el estado actual de visitas y monedas recolectadas globalmente.

- **Ruta**: `GET /api/stats`
- **Respuesta**:
  ```json
  {
    "visits": 12,
    "total_coins": 50
  }
  ```

### 2. Registrar Visita

Incrementa el contador de visitas. Se llama automáticamente cuando el frontend carga.

- **Ruta**: `POST /api/visit`
- **Respuesta**:
  ```json
  {
    "status": "visited",
    "count": 13
  }
  ```

### 3. Recolectar Moneda

Acción de gamificación. Incrementa el contador de monedas cuando un usuario hace clic en una moneda en el mapa.

- **Ruta**: `POST /api/collect`
- **Respuesta**:
  ```json
  {
    "status": "collected",
    "total": 60
  }
  ```

## 🚀 Ejecución

Asegúrate de tener [Rust instalado](https://www.rust-lang.org/tools/install).

1.  Navega a la carpeta backend:
    ```bash
    cd backend
    ```
2.  Ejecuta el servidor:
    ```bash
    cargo run
    ```

El servidor iniciará en el puerto **8080**.

## 📝 Notas de Desarrollo

- **Estado Volátil**: Actualmente el estado se guarda en memoria (RAM). Si reinicias el servidor, los contadores vuelven a cero.
- **Seguridad**: CORS está configurado para permitir `Any` origen por facilidad de desarrollo. Para producción, restringir al dominio del frontend.
