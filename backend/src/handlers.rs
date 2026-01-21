use actix_web::{web, HttpResponse, Responder};
use crate::models::{AppState, Stats, UserState, BuySkinRequest, SetSkinRequest, PlayGameRequest, RewardRequest};
use serde_json::json;

pub async fn get_stats(data: web::Data<AppState>) -> impl Responder {
    let visits = *data.visits.lock().unwrap();
    let coins = *data.total_coins.lock().unwrap();
    
    HttpResponse::Ok().json(Stats {
        visits,
        total_coins: coins,
    })
}

pub async fn get_user_state(data: web::Data<AppState>) -> impl Responder {
    let coins = *data.user_coins.lock().unwrap();
    let skin = *data.current_skin.lock().unwrap();
    let owned = data.owned_skins.lock().unwrap().iter().cloned().collect::<Vec<_>>();
    let claimed = data.claimed_rewards.lock().unwrap().iter().cloned().collect::<Vec<_>>();
    
    HttpResponse::Ok().json(UserState {
        coins,
        current_skin: skin,
        owned_skins: owned,
        claimed_rewards: claimed,
    })
}

pub async fn register_visit(data: web::Data<AppState>) -> impl Responder {
    let mut visits = data.visits.lock().unwrap();
    let mut user_coins = data.user_coins.lock().unwrap();
    
    *visits += 1;
    *user_coins += 200; // dar monedas para testear

    HttpResponse::Ok().json(json!({ "status": "visited", "count": *visits, "coins_added": 200 }))
}

pub async fn collect_coin(data: web::Data<AppState>, req: web::Json<RewardRequest>) -> impl Responder {
    let mut global_coins = data.total_coins.lock().unwrap();
    let mut user_coins = data.user_coins.lock().unwrap();
    let mut claimed = data.claimed_rewards.lock().unwrap();
    
    if let Some(id) = &req.reward_id {
        if claimed.contains(id) {
            return HttpResponse::BadRequest().json(json!({"error": "Reward already claimed"}));
        }
        claimed.insert(id.clone());
    }
    
    *global_coins += req.amount; 
    *user_coins += req.amount;
    
    HttpResponse::Ok().json(json!({ "status": "collected", "total": *global_coins, "user": *user_coins }))
}

pub async fn play_game(data: web::Data<AppState>, req: web::Json<PlayGameRequest>) -> impl Responder {
    let mut user_coins = data.user_coins.lock().unwrap();
    
    if *user_coins >= req.cost {
        *user_coins -= req.cost;
        HttpResponse::Ok().json(json!({ "status": "playing", "remaining_coins": *user_coins }))
    } else {
        HttpResponse::BadRequest().json(json!({"error": "Not enough coins"}))
    }
}

pub async fn buy_skin(data: web::Data<AppState>, req: web::Json<BuySkinRequest>) -> impl Responder {
    let mut user_coins = data.user_coins.lock().unwrap();
    let mut owned = data.owned_skins.lock().unwrap();
    
    if owned.contains(&req.skin_id) {
         return HttpResponse::BadRequest().json(json!({"error": "Already owned"}));
    }

    // precios: 50, 100, 150, 200, 250, 300, 350, 400, 450, 500
    let cost = (req.skin_id as u64 + 1) * 50;

    if *user_coins >= cost {
        *user_coins -= cost;
        owned.insert(req.skin_id);
        HttpResponse::Ok().json(json!({ "status": "bought", "remaining_coins": *user_coins }))
    } else {
        HttpResponse::BadRequest().json(json!({"error": "Not enough coins"}))
    }
}

pub async fn set_skin(data: web::Data<AppState>, req: web::Json<SetSkinRequest>) -> impl Responder {
    let owned = data.owned_skins.lock().unwrap();
    if owned.contains(&req.skin_id) {
        let mut skin = data.current_skin.lock().unwrap();
        *skin = req.skin_id;
        HttpResponse::Ok().json(json!({ "status": "updated", "skin": *skin }))
    } else {
        HttpResponse::BadRequest().json(json!({"error": "Skin not owned"}))
    }
}
