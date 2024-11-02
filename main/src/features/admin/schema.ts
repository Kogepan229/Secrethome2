import { roomsTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const createRoomSchema = createInsertSchema(roomsTable, {
  name: (schema) => schema.name.trim().min(1, "1文字以上必要です"),
  description: (schema) => schema.description.trim().transform((s) => (s === "" ? null : s)),
  accessKey: (schema) => schema.accessKey.trim().min(1, "1文字以上必要です"),
}).pick({
  name: true,
  description: true,
  roomType: true,
  accessKey: true,
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
