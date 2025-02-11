import { contentsTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const uploadVideoContentSchema = createInsertSchema(contentsTable, {
  title: (schema) => schema.trim().min(1, "1文字以上必要です"),
  description: (schema) => schema.trim().transform((s) => (s === "" ? null : s)),
})
  .pick({
    roomId: true,
    title: true,
    description: true,
  })
  .extend({
    video: z
      .instanceof(File, { message: "ファイルを選択してください" })
      .refine((file) => file.type.startsWith("video/"), { message: "動画ファイルではありません" }),
    thumbnail: z
      .instanceof(File, { message: "ファイルを選択してください" })
      .refine((file) => file.type.startsWith("image/"), { message: "画像ファイルではありません" }),
  });

export type UploadVideoContentSchema = z.infer<typeof uploadVideoContentSchema>;
