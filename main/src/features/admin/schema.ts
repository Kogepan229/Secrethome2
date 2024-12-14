import { roomsTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const createRoomSchema = createInsertSchema(roomsTable, {
  name: (schema) => schema.trim().min(1, "1文字以上必要です"),
  description: (schema) => schema.trim().transform((s) => (s === "" ? null : s)),
  customDescriptionList: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().trim().min(1),
      }),
    )
    .nullish(),
  accessKey: (schema) => schema.trim().min(1, "1文字以上必要です"),
}).pick({
  name: true,
  description: true,
  customDescriptionList: true,
  roomType: true,
  accessKey: true,
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
