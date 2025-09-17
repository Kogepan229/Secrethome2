import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { contentsTable } from "@/db/schema";

function createTitleSchema() {
  return (schema: z.ZodString) => schema.trim().min(1, "1文字以上必要です");
}

function createDescriptionSchema() {
  return (schema: z.ZodString) => schema.trim().transform((s) => (s === "" ? null : s));
}

function createVideoFileSchema() {
  return z
    .file({ error: "ファイルを選択してください" })
    .mime(["video/mp4", "video/webm", "video/ogg", "video/quicktime"], { error: "動画ファイルではありません" });
}

function createImageFileSchema() {
  return z
    .file({ error: "ファイルを選択してください" })
    .mime(["image/png", "image/jpeg", "image/gif", "image/svg+xml", "image/webp"], { error: "画像ファイルではありません" });
}

export const uploadVideoContentInfoSchema = createInsertSchema(contentsTable, {
  title: createTitleSchema(),
  description: createDescriptionSchema(),
}).pick({
  roomId: true,
  title: true,
  description: true,
});

export const uploadVideoContentSchema = uploadVideoContentInfoSchema.extend({
  video: createVideoFileSchema(),
  thumbnail: createImageFileSchema(),
});

export const updateVideoContentInfoSchema = createInsertSchema(contentsTable, {
  id: (schema) => schema.nonoptional(),
  title: createTitleSchema(),
  description: createDescriptionSchema(),
}).pick({
  id: true,
  title: true,
  description: true,
});

export const updateVideoContentSchema = updateVideoContentInfoSchema.extend({
  video: createVideoFileSchema().nullable().optional(),
  thumbnail: createImageFileSchema().nullable().optional(),
});

export type UploadVideoContentInfoSchema = z.infer<typeof uploadVideoContentInfoSchema>;
export type UploadVideoContentSchema = z.infer<typeof uploadVideoContentSchema>;
export type UpdateVideoContentSchema = z.infer<typeof updateVideoContentSchema>;
