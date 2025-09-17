import { eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db/db";
import { contentTagsTable, tagGroupsTable, tagsTable } from "@/db/schema";
import type { TagSchema } from "../../common/schema";

export async function getTagGroupsInRoom(roomId: string) {
  return db.select().from(tagGroupsTable).where(eq(tagGroupsTable.roomId, roomId)).orderBy(tagGroupsTable.order);
}

export async function getContentTags(contentId: string): Promise<TagSchema[]> {
  const tags = await db
    .select(getTableColumns(tagsTable))
    .from(contentTagsTable)
    .innerJoin(tagsTable, eq(contentTagsTable.tagId, tagsTable.id))
    .where(eq(contentTagsTable.contentId, contentId));
  return tags;
}
