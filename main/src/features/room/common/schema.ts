import { contentsTable, roomsTable } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const accessRoomSchema = createSelectSchema(roomsTable).pick({ accessKey: true });

export const contentSchema = createSelectSchema(contentsTable);

export type ContentSchema = z.infer<typeof contentSchema>;
