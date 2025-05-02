use anyhow::Result;
use sha2::{Digest, Sha256};
use std::path::PathBuf;

pub async fn hash_file(file_path: PathBuf) -> Result<String> {
    let res: Result<String> = tokio::task::spawn_blocking(move || {
        let mut file = std::fs::File::open(file_path)?;
        let mut hasher = Sha256::new();
        std::io::copy(&mut file, &mut hasher)?;
        Ok(hex::encode(hasher.finalize()))
    })
    .await?;
    res
}
