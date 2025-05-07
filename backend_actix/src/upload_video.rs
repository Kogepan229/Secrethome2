use actix_multipart::form::{MultipartForm, tempfile::TempFile, text::Text};
use actix_web::{HttpResponse, Responder, post, web};
use anyhow::{Context, Result, bail};
use log::{error, info};
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

struct UploadInfo {
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

#[post("/api/video/upload/start")]
async fn upload_video_start_handler(
    MultipartForm(form): MultipartForm<UploadStart>,
) -> Result<impl Responder, AppError> {
    let mut lock = MAP.lock().await;
    lock.insert(
        form.id.to_string(),
        UploadInfo {
            total_chunk: *form.total_chunk,
            uploaded_chunk: 0,
            hash: form.hash.to_string(),
        },
    );

    Ok(HttpResponse::Ok())
}

#[derive(Debug, MultipartForm)]
struct UploadChunk {
    id: Text<String>,
    index: Text<u16>,
    chunk: TempFile,
}

#[post("/api/video/upload/chunk")]
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

pub fn start_video_processing_worker() -> VideoProcessSender {
    let (tx, mut rx) = mpsc::channel::<String>(32);
    tokio::spawn(async move {
        info!("Start video processing worker");
        while let Some(id) = rx.recv().await {
            if let Err(e) = process_video(&id).await {
                info!("{}", e);
            } else {
                info!("Successful processing video id: {}", &id);
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

async fn process_video(id: &String) -> Result<()> {
    let (total_chunk, original_hash) = {
        let lock = MAP.lock().await;
        match lock.get(id) {
            Some(info) => (info.total_chunk, info.hash.clone()),
            None => {
                bail!("Could not found id in map");
            }
        }
    };

    let video_dir_path = CONFIG.data_dir.join("tmp").join("video");
    create_dir_all(&video_dir_path).await?;

    let video_path = {
        let mut path = video_dir_path.join(id);
        path.set_extension("mp4");
        path
    };
    {
        let mut video_file = File::options()
            .append(true)
            .create(true)
            .open(&video_path)
            .await?;

        let chunks_dir_path = video_dir_path.join("chunks").join(id);
        for index in 0..total_chunk {
            let mut chunk_file = File::open(chunks_dir_path.join(index.to_string())).await?;

            tokio::io::copy(&mut chunk_file, &mut video_file).await?;
        }
        video_file.flush().await?;
    }

    let hash = hash_file(video_path.clone()).await?;
    if original_hash != hash {
        error!("File hash is not match id: {}", id);
        remove_file(&video_path).await?;
        return Ok(());
    }
    println!("hash {}", hash);

    Ok(())
}
