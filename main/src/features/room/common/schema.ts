import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { contentsTable, roomsTable, tagGroupsTable, tagsTable } from "@/db/schema";

export const accessRoomSchema = createSelectSchema(roomsTable).pick({ accessKey: true });

export const contentSchema = createSelectSchema(contentsTable);

export const tagGroupSchema = createSelectSchema(tagGroupsTable);

export const tagSchema = createSelectSchema(tagsTable);

export const tagWithCountSchema = tagSchema.extend({ count: z.number() });

export const uploadTagsSchema = z.object({
  id: z.string(),
  tags: z.array(z.string()),
});

export type ContentSchema = z.infer<typeof contentSchema>;

export type TagGroupSchema = z.infer<typeof tagGroupSchema>;

export type TagSchema = z.infer<typeof tagSchema>;

export type TagWithCountSchema = z.infer<typeof tagWithCountSchema>;
