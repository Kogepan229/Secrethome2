import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export async function convertToWebP(image: File) {
  sharp(await image.arrayBuffer()).webp({ quality: 80 }).toFile;
}

export async function saveThumbnail(id: string, image: File) {
  if (!process.env.DATA_DIR) {
    throw "DATA_DIR env is not set";
  }
  const thumbnailDir = path.join(process.env.DATA_DIR, "contents", "thumbnail");
  mkdir(thumbnailDir, { recursive: true });

  const thumbnailPath = `${path.join(process.env.DATA_DIR, "contents", "thumbnail", id)}.webp`;
  await sharp(await image.arrayBuffer())
    .webp({ quality: 80 })
    .toFile(thumbnailPath);
}

export async function saveVideo() {
  if (!process.env.DATA_DIR) {
    return;
  }
  path.join(process.env.DATA_DIR!, "contents", "video");
}
