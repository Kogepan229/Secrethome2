import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";
import { tagGroupsTable, tagsTable } from "@/db/schema";

export const createTagGroupSchema = createInsertSchema(tagGroupsTable).omit({ id: true, createdAt: true, order: true });

export const updateTagGroupSchema = createInsertSchema(tagGroupsTable)
  .omit({ roomId: true, createdAt: true, order: true })
  .required({ id: true });

export const createTagSchema = createInsertSchema(tagsTable, {
  name: (schema) => schema.trim().min(1, "1文字以上必要です"),
}).pick({ groupId: true, name: true });

export const editTagSchema = createInsertSchema(tagsTable).omit({ createdAt: true, groupId: true }).required({ id: true });

export type UpdateTagGroupSchema = z.infer<typeof updateTagGroupSchema>;
export type EditTagSchema = z.infer<typeof editTagSchema>;
