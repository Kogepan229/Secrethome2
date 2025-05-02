use config::ConfigError;
use once_cell::sync::Lazy;
use serde::Deserialize;
use std::path::PathBuf;

#[derive(Deserialize)]
pub struct Config {
    pub port: u16,
    pub database_url: String,
    pub data_dir: PathBuf,
    pub tmp_dir: Option<PathBuf>,
}

impl Config {
    pub fn from_env() -> Result<Self, ConfigError> {
        let cfg = config::Config::builder()
            .add_source(config::Environment::default())
            .build()
            .expect("Failed load .env as config.");
        cfg.try_deserialize()
    }
}

pub static CONFIG: Lazy<Config> = Lazy::new(|| {
    dotenvy::dotenv().expect("Failed to read .env file");
    Config::from_env().expect("Failed to load config.")
});
