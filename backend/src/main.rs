use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use std::sync::Mutex;
use std::collections::HashSet;

mod models;
mod handlers;
mod routes;

use models::AppState;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let mut initial_skins = HashSet::new();
    initial_skins.insert(0);

    let data = web::Data::new(AppState {
        visits: Mutex::new(0),
        total_coins: Mutex::new(0),
        user_coins: Mutex::new(0),
        owned_skins: Mutex::new(initial_skins),
        current_skin: Mutex::new(0),
        claimed_rewards: Mutex::new(HashSet::new()),
    });

    println!("Backend running at http://localhost:8080");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .app_data(data.clone())
            .configure(routes::config)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
