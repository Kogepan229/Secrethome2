import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { contentsTable } from "@/db/schema";

export const uploadVideoContentInfoSchema = createInsertSchema(contentsTable, {
  title: (schema) => schema.trim().min(1, "1文字以上必要です"),
  description: (schema) => schema.trim().transform((s) => (s === "" ? null : s)),
}).pick({
  roomId: true,
  title: true,
  description: true,
});

export const uploadVideoContentSchema = uploadVideoContentInfoSchema.extend({
  video: z
    .instanceof(File, {
        error: "ファイルを選択してください"
    })
    .refine((file) => file.type.startsWith("video/"), {
        error: "動画ファイルではありません"
    }),
  thumbnail: z
    .instanceof(File, {
        error: "ファイルを選択してください"
    })
    .refine((file) => file.type.startsWith("image/"), {
        error: "画像ファイルではありません"
    }),
});

export type UploadVideoContentInfoSchema = z.infer<typeof uploadVideoContentInfoSchema>;
export type UploadVideoContentSchema = z.infer<typeof uploadVideoContentSchema>;
