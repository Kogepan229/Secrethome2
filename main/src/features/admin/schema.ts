import { roomsTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const createRoomSchema = createInsertSchema(roomsTable).pick({
  name: true,
  description: true,
  roomType: true,
  accessKey: true,
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
