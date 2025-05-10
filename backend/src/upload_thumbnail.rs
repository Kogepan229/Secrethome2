use actix_multipart::form::{MultipartForm, tempfile::TempFile, text::Text};
use actix_web::{HttpResponse, Responder, post, web};
use anyhow::Result;
use image::ImageReader;
use sqlx::{Pool, Postgres};
use std::io::BufReader;
use tokio::fs::create_dir_all;

use crate::{config::CONFIG, error::AppError};

#[derive(Debug, MultipartForm)]
struct UploadStart {
    id: Text<String>,
    thumbnail: TempFile,
}

#[post("/file-api/thumbnail/upload")]
async fn upload_thumbnail_handler(
    pool: web::Data<Pool<Postgres>>,
    MultipartForm(form): MultipartForm<UploadStart>,
) -> Result<impl Responder, AppError> {
    {
        let exists = sqlx::query_scalar!(
            "SELECT EXISTS (SELECT 1 FROM contents WHERE id = $1)",
            form.id.as_str()
        )
        .fetch_one(pool.as_ref())
        .await?;

        if !exists.unwrap() {
            return Ok(HttpResponse::BadRequest());
        }
    }

    let thumbnail_dir_path = CONFIG.data_dir.join("contents").join("thumbnail");
    create_dir_all(thumbnail_dir_path.clone()).await?;

    let thumbnail_id = cuid2::create_id();

    let _thumbnail_id = thumbnail_id.clone();
    tokio::task::spawn_blocking::<_, Result<()>>(move || {
        let mut thumbnail_path = thumbnail_dir_path.join(_thumbnail_id);
        thumbnail_path.set_extension("webp");

        ImageReader::new(BufReader::new(form.thumbnail.file.as_file()))
            .with_guessed_format()?
            .decode()?
            .thumbnail(1920, 1080)
            .save(thumbnail_path)?;

        form.thumbnail.file.close()?;

        Ok(())
    })
    .await??;

    sqlx::query!(
        "UPDATE contents SET thumbnail_id = $1 WHERE id = $2",
        thumbnail_id,
        form.id.as_str()
    )
    .execute(pool.as_ref())
    .await?;

    Ok(HttpResponse::Ok())
}
