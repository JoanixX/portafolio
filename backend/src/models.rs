use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use std::collections::{HashMap, HashSet};
use std::time::SystemTime;

pub struct UserRecord {
    pub coins: u64,
    pub owned_skins: HashSet<u32>,
    pub current_skin: u32,
    pub claimed_rewards: HashSet<String>,
    pub last_welcome_bonus: SystemTime,
}

pub struct AppState {
    pub visits: Mutex<u64>,
    pub total_coins: Mutex<u64>,
    pub users: Mutex<HashMap<String, UserRecord>>,
}

#[derive(Serialize)]
pub struct Stats {
    pub visits: u64,
    pub total_coins: u64,
}

#[derive(Serialize)]
pub struct UserState {
    pub coins: u64,
    pub current_skin: u32,
    pub owned_skins: Vec<u32>,
    pub claimed_rewards: Vec<String>,
}

#[derive(Deserialize)]
pub struct BuySkinRequest {
    pub skin_id: u32,
}

#[derive(Deserialize)]
pub struct SetSkinRequest {
    pub skin_id: u32,
}

#[derive(Deserialize)]
pub struct PlayGameRequest {
    pub cost: u64,
}

#[derive(Deserialize)]
pub struct RewardRequest {
    pub amount: u64,
    pub reward_id: Option<String>,
}