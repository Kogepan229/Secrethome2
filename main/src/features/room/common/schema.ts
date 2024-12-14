import { roomsTable } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";

export const accessRoomSchema = createSelectSchema(roomsTable).pick({ accessKey: true });
