use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use std::sync::Mutex;
use std::collections::{HashSet, HashMap};

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
        users: Mutex::new(HashMap::new()),
    });

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .expect("PORT must be a number");

    println!("Backend running at http://0.0.0.0:{}", port);

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
    .bind(("0.0.0.0", port))?
    .run()
    .await
}