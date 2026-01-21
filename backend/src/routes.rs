use actix_web::web;
use crate::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route("/api/stats", web::get().to(handlers::get_stats))
       .route("/api/user", web::get().to(handlers::get_user_state))
       .route("/api/visit", web::post().to(handlers::register_visit))
       .route("/api/collect", web::post().to(handlers::collect_coin))
       .route("/api/play_game", web::post().to(handlers::play_game))
       .route("/api/buy_skin", web::post().to(handlers::buy_skin))
       .route("/api/set_skin", web::post().to(handlers::set_skin));
}
