use actix_cors::Cors;
use actix_multipart::form::tempfile::TempFileConfig;
use actix_web::{
    App, HttpResponse, HttpServer, Responder,
    middleware::{Logger, from_fn},
    post, web,
};
use anyhow::Result;
use config::CONFIG;
use error::AppError;
use middleware::log_internal_error;
use tokio::fs::create_dir_all;
use upload_video::{start_video_processing_worker, upload_video_chunk, upload_video_start};

mod config;
mod error;
mod filehash;
mod middleware;
mod upload_thumbnail;
mod upload_video;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let db_pool = sqlx::PgPool::connect(&CONFIG.database_url)
        .await
        .expect("Failed to connect DB");

    if let Some(tmp_dir) = &CONFIG.tmp_dir {
        create_dir_all(tmp_dir).await?;
    }

    let sender = start_video_processing_worker();

    HttpServer::new(move || {
        let mut temp_file_config = TempFileConfig::default();
        if let Some(tmp_dir) = &CONFIG.tmp_dir {
            temp_file_config = temp_file_config.directory(tmp_dir);
        }

        App::new()
            .wrap(Cors::permissive())
            .wrap(Logger::new("[%r] Status: %s"))
            .wrap(from_fn(log_internal_error))
            .app_data(temp_file_config)
            .app_data(web::Data::new(db_pool.clone()))
            .app_data(web::Data::new(sender.clone()))
            .service(upload_video_start)
            .service(upload_video_chunk)
            .service(test)
    })
    .bind(("127.0.0.1", CONFIG.port))?
    .run()
    .await
}

#[post("/test")]
async fn test() -> Result<impl Responder, AppError> {
    try_thing()?;
    Ok(HttpResponse::Ok())
}

fn try_thing() -> Result<(), anyhow::Error> {
    anyhow::bail!("it failed!")
}
