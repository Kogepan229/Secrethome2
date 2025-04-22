import { tagGroupsTable, tagsTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const createTagGroupSchema = createInsertSchema(tagGroupsTable).omit({ id: true, createdAt: true, order: true });

export const updateTagGroupSchema = createInsertSchema(tagGroupsTable)
  .omit({ roomId: true, createdAt: true, order: true })
  .required({ id: true });

export const createTagSchema = createInsertSchema(tagsTable, {
  name: (schema) => schema.trim().min(1, "1文字以上必要です"),
}).pick({ groupId: true, name: true });

export type UpdateTagGroupSchema = z.infer<typeof updateTagGroupSchema>;
