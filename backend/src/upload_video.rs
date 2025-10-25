use actix_multipart::form::{MultipartForm, tempfile::TempFile, text::Text};
use actix_web::{HttpResponse, Responder, post, web};
use anyhow::{Context, Result, bail};
use cuid2::cuid;
// use ez_ffmpeg::{FfmpegContext, Output};
use log::{error, info};
use serde::Serialize;
use sqlx::{Pool, Postgres};
use std::{collections::HashMap, path::Path, sync::LazyLock};
use tokio::{
    fs::{File, create_dir_all, remove_dir_all, remove_file},
    io::AsyncWriteExt,
    sync::{
        Mutex,
        mpsc::{self, Sender},
    },
};

use crate::{config::CONFIG, error::AppError, filehash::hash_file};

#[derive(Debug, Clone)]
struct UploadInfo {
    content_id: String,
    total_chunk: u16,
    uploaded_chunk: u16,
    hash: String,
}

static MAP: LazyLock<Mutex<HashMap<String, UploadInfo>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

#[derive(Debug, MultipartForm)]
struct UploadStart {
    id: Text<String>,
    total_chunk: Text<u16>,
    hash: Text<String>,
}

#[derive(Serialize)]
struct UploadStartResponse {
    video_id: String,
}

#[post("/file-api/video/upload/start")]
async fn upload_video_start_handler(
    MultipartForm(form): MultipartForm<UploadStart>,
) -> Result<impl Responder, AppError> {
    let video_id = cuid().to_string();

    let mut lock = MAP.lock().await;
    lock.insert(
        video_id.clone(),
        UploadInfo {
            content_id: form.id.to_string(),
            total_chunk: *form.total_chunk,
            uploaded_chunk: 0,
            hash: form.hash.to_string(),
        },
    );

    let res = UploadStartResponse { video_id };

    Ok(web::Json(res))
}

#[derive(Debug, MultipartForm)]
struct UploadChunk {
    id: Text<String>,
    index: Text<u16>,
    chunk: TempFile,
}

#[post("/file-api/video/upload/chunk")]
async fn upload_video_chunk_handler(
    proccess_sender: web::Data<VideoProcessSender>,
    MultipartForm(form): MultipartForm<UploadChunk>,
) -> Result<impl Responder, AppError> {
    {
        let lock = MAP.lock().await;
        if !lock.contains_key(form.id.as_str()) {
            return Ok(HttpResponse::BadRequest().body("Call start api before upload chunk"));
        }
    }

    let chunk_dir_path = Path::new(&CONFIG.data_dir)
        .join("tmp")
        .join("video")
        .join("chunks")
        .join(form.id.as_str());
    let chunk_path = chunk_dir_path.join(form.index.to_string());

    create_dir_all(chunk_dir_path).await?;
    form.chunk.file.persist(chunk_path)?;

    let mut lock = MAP.lock().await;
    let info = lock
        .get_mut(form.id.as_str())
        .context("Could not found Upload Info")?;
    info.uploaded_chunk += 1;

    if info.total_chunk == info.uploaded_chunk {
        proccess_sender.tx.send(form.id.to_string()).await?;
        return Ok(HttpResponse::Created().into());
    }

    Ok(HttpResponse::Ok().into())
}

#[derive(Clone)]
pub struct VideoProcessSender {
    tx: Sender<String>,
}

pub fn start_video_processing_worker(pool: Pool<Postgres>) -> VideoProcessSender {
    let (tx, mut rx) = mpsc::channel::<String>(32);
    tokio::spawn(async move {
        info!("Start video processing worker");
        while let Some(id) = rx.recv().await {
            if let Err(e) = process_video(&id, &pool).await {
                info!("Failed processing video [id: {}] [error: {}]", &id, e);
            } else {
                info!("Finished processing video [id: {}]", &id);
            }

            {
                let mut lock = MAP.lock().await;
                lock.remove(&id);
            }

            {
                let chunks_path = CONFIG
                    .data_dir
                    .join("tmp")
                    .join("video")
                    .join("chunks")
                    .join(&id);
                if chunks_path.exists() {
                    if let Err(e) = remove_dir_all(chunks_path).await {
                        error!("Failed remove chunks dir. [id: {}] {}", &id, e);
                    }
                }
            }
        }
    });

    VideoProcessSender { tx }
}

#[derive(sqlx::Type)]
#[sqlx(type_name = "content_status_type", rename_all = "lowercase")]
enum ContentStatusType {
    Available,
    Error,
}

async fn process_video(id: &String, pool: &Pool<Postgres>) -> Result<()> {
    // let (total_chunk, original_hash) = {
    //     let lock = MAP.lock().await;
    //     match lock.get(id) {
    //         Some(info) => (info.total_chunk, info.hash.clone()),
    //         None => {
    //             bail!("Could not found id in map");
    //         }
    //     }
    // };

    let info = {
        let lock = MAP.lock().await;
        match lock.get(id) {
            Some(info) => info.clone(),
            None => {
                bail!("Could not found id in map");
            }
        }
    };

    let tmp_video_dir_path = CONFIG.data_dir.join("tmp").join("video");
    create_dir_all(&tmp_video_dir_path).await?;

    let tmp_video_path = {
        let mut path = tmp_video_dir_path.join(id);
        path.set_extension("mp4");
        path
    };
    {
        let mut video_file = File::options()
            .append(true)
            .create(true)
            .open(&tmp_video_path)
            .await?;

        let chunks_dir_path = tmp_video_dir_path.join("chunks").join(id);
        for index in 0..info.total_chunk {
            let mut chunk_file = File::open(chunks_dir_path.join(index.to_string())).await?;

            tokio::io::copy(&mut chunk_file, &mut video_file).await?;
        }
        video_file.flush().await?;
    }

    let hash = hash_file(tmp_video_path.clone()).await?;
    if info.hash != hash {
        error!("File hash is not match id: {}", id);
        remove_file(&tmp_video_path).await?;
        return Ok(());
    }
    println!("hash {}", hash);

    let video_dir_base_path = CONFIG.data_dir.join("contents").join("video");
    let video_dir_path = video_dir_base_path.join(id);
    let mut video_path = video_dir_path.join("original");
    video_path.set_extension("mp4");

    create_dir_all(&video_dir_path).await?;
    tokio::fs::rename(tmp_video_path, &video_path).await?;

    let mut playlist_path = video_dir_path.join("playlist");
    playlist_path.set_extension("m3u8");

    // FfmpegContext::builder()
    //     .input(video_path)
    //     .output(Output::from(playlist_path).set_format("hls"))
    //     .build()?
    //     .start()?
    //     .await?;

    info!("Start converting video. [id: {}]", id);
    let exit_status = tokio::process::Command::new("ffmpeg")
        .current_dir(&video_dir_path)
        .args(&[
            "-i",
            "original.mp4",
            "-c:v",
            "copy",
            "-c:a",
            "copy",
            "-f",
            "hls",
            "-hls_time",
            "5",
            "-hls_playlist_type",
            "vod",
            "-hls_segment_filename",
            "%4d.ts",
            "playlist.m3u8",
        ])
        .kill_on_drop(true)
        .spawn()?
        .wait()
        .await?;

    if exit_status.success() {
        info!("Finished converting video. [id: {}]", id);
    } else {
        error!(
            "Failed to convert video file. [id: {}] [error_code: {:?}]",
            id,
            exit_status.code()
        )
    }

    let mut tx = pool.begin().await?;

    sqlx::query!(
        "UPDATE contents SET status = $1 WHERE id = $2",
        if exit_status.success() {
            ContentStatusType::Available
        } else {
            ContentStatusType::Error
        } as _,
        info.content_id
    )
    .execute(&mut *tx)
    .await?;

    let existing_video_id_result = sqlx::query_scalar!(
        "SELECT video_id FROM content_video_table WHERE content_id = $1",
        info.content_id
    )
    .fetch_optional(&mut *tx)
    .await?;

    match existing_video_id_result {
        Some(existing_video_id) => {
            sqlx::query!(
                "UPDATE content_video_table SET video_id = $1 WHERE content_id = $2",
                &id,
                &info.content_id
            )
            .execute(&mut *tx)
            .await?;

            // Delete old video
            // Move to deleted_videos dir
            let existing_video_dir_path = video_dir_base_path.join(&existing_video_id);
            let deleted_video_dir_base_path =
                CONFIG.data_dir.join("contents").join("deleted_videos");

            create_dir_all(&deleted_video_dir_base_path).await?;
            tokio::fs::rename(
                existing_video_dir_path,
                deleted_video_dir_base_path.join(&existing_video_id),
            )
            .await?;
        }
        None => {
            sqlx::query!(
                "INSERT INTO content_video_table (content_id, video_id) VALUES ($1, $2)",
                info.content_id,
                &id
            )
            .execute(&mut *tx)
            .await?;
        }
    }

    tx.commit().await?;

    Ok(())
}
