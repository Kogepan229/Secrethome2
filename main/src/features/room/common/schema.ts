import { contentsTable, roomsTable, tagGroupsTable, tagsTable } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const accessRoomSchema = createSelectSchema(roomsTable).pick({ accessKey: true });

export const contentSchema = createSelectSchema(contentsTable);

export const tagGroupSchema = createSelectSchema(tagGroupsTable);

export const tagSchema = createSelectSchema(tagsTable);

export const uploadTagsSchema = z.object({
  id: z.string(),
  tags: z.array(z.string()),
});

export type ContentSchema = z.infer<typeof contentSchema>;

export type TagGroupSchema = z.infer<typeof tagGroupSchema>;

export type TagSchema = z.infer<typeof tagSchema>;
