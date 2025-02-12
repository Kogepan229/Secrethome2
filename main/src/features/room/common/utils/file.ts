import { type ReadStream, createReadStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DATA_DIR = process.env.DATA_DIR!;
if (!DATA_DIR) {
  throw "DATA_DIR env is not set";
}

async function* nodeStreamToIterator(stream: ReadStream) {
  for await (const chunk of stream) {
    yield new Uint8Array(chunk);
  }
}

function iteratorToStream(iterator: AsyncGenerator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export function streamFile(path: string): ReadableStream {
  const nodeStream = createReadStream(path);
  const data: ReadableStream = iteratorToStream(nodeStreamToIterator(nodeStream));
  return data;
}

export async function saveThumbnail(id: string, image: File) {
  const thumbnailDir = path.join(DATA_DIR, "contents", "thumbnail");
  mkdir(thumbnailDir, { recursive: true });

  const thumbnailPath = `${path.join(DATA_DIR, "contents", "thumbnail", id)}.webp`;
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

export async function getThumbnailStat(id: string) {
  try {
    const thumbnailPath = `${path.join(DATA_DIR, "contents", "thumbnail", id)}.webp`;
    return await stat(thumbnailPath);
  } catch (e) {
    return null;
  }
}

export function getThumbnailReadStream(id: string): ReadableStream {
  const thumbnailPath = `${path.join(DATA_DIR, "contents", "thumbnail", id)}.webp`;
  return streamFile(thumbnailPath);
}
