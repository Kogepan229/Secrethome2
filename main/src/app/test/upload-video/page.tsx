"use client";
import { createId } from "@paralleldrive/cuid2";
import { createSHA256 } from "hash-wasm";
import ky, { type ResponsePromise } from "ky";
import { type MouseEvent, useRef } from "react";

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

export default function TestUploadVideoPage() {
  const inputRef = useRef<null | HTMLInputElement>(null);

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!inputRef.current) return;
    const files = inputRef.current.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const contentID = createId();
    const startData = new FormData();
    startData.append("id", contentID);
    startData.append("total_chunk", String(Math.ceil(file.size / CHUNK_SIZE)));
    startData.append("hash", await calcHash(file));

    const res = await ky.post<void>("http://localhost:20080/api/video/upload/start", { body: startData });
    if (!res.ok) {
      return;
    }
    const pool: ResponsePromise<void>[] = [];
    let errorOccurred = false;
    let start = 0;
    let chunkIndex = 0;

    while (start < file.size && !errorOccurred) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      const chunkData = new FormData();
      chunkData.append("id", contentID);
      chunkData.append("index", String(chunkIndex));
      chunkData.append("chunk", chunk);
      start += CHUNK_SIZE;
      chunkIndex++;

      const task = ky.post<void>("http://localhost:20080/api/video/upload/chunk", { body: chunkData });

      task
        .then((_res) => {
          const index = pool.indexOf(task);
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
  }

  return (
    <form>
      <input type="file" accept="video/mp4" ref={inputRef} />
      <button type="button" onClick={handleSubmit}>
        submit
      </button>
    </form>
  );
}
