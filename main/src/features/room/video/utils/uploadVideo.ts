import { fileApi } from "@/utils/api";
import { createSHA256 } from "hash-wasm";
import type { ResponsePromise } from "ky";

const CHUNK_SIZE = 1024 * 1024 * 2;
const POOL_SIZE = 5;

async function calcHash(file: File) {
  const hash = await createSHA256();

  await file.stream().pipeTo(
    new WritableStream<Uint8Array<ArrayBufferLike>>({
      write(chunk) {
        return new Promise((resolve) => {
          hash.update(chunk);
          resolve();
        });
      },
    }),
  );
  return hash.digest("hex");
}

export async function uploadVideo(file: File, contentId: string): Promise<boolean> {
  const startData = new FormData();
  startData.append("id", contentId);
  startData.append("total_chunk", String(Math.ceil(file.size / CHUNK_SIZE)));
  startData.append("hash", await calcHash(file));

  const res = await fileApi.post<void>("video/upload/start", { body: startData });
  if (!res.ok) {
    return false;
  }
  const pool: ResponsePromise<void>[] = [];
  let errorOccurred = false;
  let start = 0;
  let chunkIndex = 0;

  while (start < file.size && !errorOccurred) {
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    const chunkData = new FormData();
    chunkData.append("id", contentId);
    chunkData.append("index", String(chunkIndex));
    chunkData.append("chunk", chunk);
    start += CHUNK_SIZE;
    chunkIndex++;

    const task = fileApi.post<void>("video/upload/chunk", { body: chunkData, retry: 2 });

    task
      .then(() => {
        const index = pool.findIndex((t) => t === task);
        pool.splice(index);
      })
      .catch((err) => {
        errorOccurred = true;
        console.error(err);
      });

    pool.push(task);

    if (pool.length === POOL_SIZE) {
      await Promise.race(pool);
    }
  }

  return !errorOccurred;
}
