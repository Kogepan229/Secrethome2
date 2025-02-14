import { tagGroupsTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const createTagGroupSchema = createInsertSchema(tagGroupsTable).omit({ id: true, createdAt: true, order: true });

export const updateTagGroupSchema = createInsertSchema(tagGroupsTable)
  .omit({ roomId: true, createdAt: true, order: true })
  .required({ id: true });

export type UpdateTagGroupSchema = z.infer<typeof updateTagGroupSchema>;
