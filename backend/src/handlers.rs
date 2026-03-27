use actix_web::{web, HttpResponse, Responder, HttpRequest};
use crate::models::{AppState, Stats, UserState, BuySkinRequest, SetSkinRequest, PlayGameRequest, RewardRequest, UserRecord};
use serde_json::json;
use std::collections::{HashSet, HashMap};
use std::time::{SystemTime, UNIX_EPOCH};

fn get_user_id(req: &HttpRequest) -> String {
    req.headers()
        .get("X-User-ID")
        .and_then(|h| h.to_str().ok())
        .unwrap_or("anonymous")
        .to_string()
}

// obtiene o crea un usuario de forma atómica para el contexto actual
fn with_user<F, R>(data: &web::Data<AppState>, user_id: &str, f: F) -> R 
where F: FnOnce(&mut UserRecord) -> R {
    let mut users = data.users.lock().unwrap();
    let record = users.entry(user_id.to_string()).or_insert_with(|| {
        let mut initial_skins = HashSet::new();
        initial_skins.insert(0); // skin base
        UserRecord {
            coins: 0,
            owned_skins: initial_skins,
            current_skin: 0,
            claimed_rewards: HashSet::new(),
            last_welcome_bonus: UNIX_EPOCH,
        }
    });
    f(record)
}

pub async fn get_stats(data: web::Data<AppState>) -> impl Responder {
    let visits = *data.visits.lock().unwrap();
    let coins = *data.total_coins.lock().unwrap();
    
    HttpResponse::Ok().json(Stats {
        visits,
        total_coins: coins,
    })
}

pub async fn get_user_state(req: HttpRequest, data: web::Data<AppState>) -> impl Responder {
    let user_id = get_user_id(&req);
    with_user(&data, &user_id, |user| {
        HttpResponse::Ok().json(UserState {
            coins: user.coins,
            current_skin: user.current_skin,
            owned_skins: user.owned_skins.iter().cloned().collect(),
            claimed_rewards: user.claimed_rewards.iter().cloned().collect(),
        })
    })
}

pub async fn register_visit(req: HttpRequest, data: web::Data<AppState>) -> impl Responder {
    let user_id = get_user_id(&req);
    let mut visits = data.visits.lock().unwrap();
    *visits += 1;

    with_user(&data, &user_id, |user| {
        let now = SystemTime::now();
        let elapsed = now.duration_since(user.last_welcome_bonus).unwrap_or_default();
        
        if elapsed.as_secs() >= 720 { // 12 minutos = 720 segundos
            user.coins += 200;
            user.last_welcome_bonus = now;
            HttpResponse::Ok().json(json!({ 
                "status": "visited", 
                "count": *visits, 
                "coins_added": 200,
                "message": "¡Bono de bienvenida recibido!"
            }))
        } else {
            let remaining = 720 - elapsed.as_secs();
            HttpResponse::Ok().json(json!({ 
                "status": "visited", 
                "count": *visits, 
                "coins_added": 0,
                "message": format!("Bono disponible en {} segundos", remaining)
            }))
        }
    })
}

pub async fn collect_coin(req: HttpRequest, data: web::Data<AppState>, reward: web::Json<RewardRequest>) -> impl Responder {
    let user_id = get_user_id(&req);
    let mut global_coins = data.total_coins.lock().unwrap();
    *global_coins += reward.amount;

    with_user(&data, &user_id, |user| {
        if let Some(id) = &reward.reward_id {
            if user.claimed_rewards.contains(id) {
                return HttpResponse::BadRequest().json(json!({"error": "Reward already claimed"}));
            }
            user.claimed_rewards.insert(id.clone());
        }
        
        user.coins += reward.amount;
        HttpResponse::Ok().json(json!({ 
            "status": "collected", 
            "total": *global_coins, 
            "user": user.coins 
        }))
    })
}

pub async fn play_game(req: HttpRequest, data: web::Data<AppState>, game: web::Json<PlayGameRequest>) -> impl Responder {
    let user_id = get_user_id(&req);
    with_user(&data, &user_id, |user| {
        if user.coins >= game.cost {
            user.coins -= game.cost;
            HttpResponse::Ok().json(json!({ "status": "playing", "remaining_coins": user.coins }))
        } else {
            HttpResponse::BadRequest().json(json!({"error": "Not enough coins"}))
        }
    })
}

pub async fn buy_skin(req: HttpRequest, data: web::Data<AppState>, skin_req: web::Json<BuySkinRequest>) -> impl Responder {
    let user_id = get_user_id(&req);
    with_user(&data, &user_id, |user| {
        if user.owned_skins.contains(&skin_req.skin_id) {
             return HttpResponse::BadRequest().json(json!({"error": "Already owned"}));
        }

        let cost = (skin_req.skin_id as u64 + 1) * 50;
        if user.coins >= cost {
            user.coins -= cost;
            user.owned_skins.insert(skin_req.skin_id);
            HttpResponse::Ok().json(json!({ "status": "bought", "remaining_coins": user.coins }))
        } else {
            HttpResponse::BadRequest().json(json!({"error": "Not enough coins"}))
        }
    })
}

pub async fn set_skin(req: HttpRequest, data: web::Data<AppState>, skin_req: web::Json<SetSkinRequest>) -> impl Responder {
    let user_id = get_user_id(&req);
    with_user(&data, &user_id, |user| {
        if user.owned_skins.contains(&skin_req.skin_id) {
            user.current_skin = skin_req.skin_id;
            HttpResponse::Ok().json(json!({ "status": "updated", "skin": user.current_skin }))
        } else {
            HttpResponse::BadRequest().json(json!({"error": "Skin not owned"}))
        }
    })
}