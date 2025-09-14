import { eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db/db";
import { contentTagsTable, tagsTable } from "@/db/schema";
import type { ContentSchema, TagSchema } from "../schema";
import { InternalContentPanel } from "./InternalContentPanel";

async function getTagsWithGroup(contentId: string) {
  const tags = await db
    .select(getTableColumns(tagsTable))
    .from(contentTagsTable)
    .innerJoin(tagsTable, eq(contentTagsTable.tagId, tagsTable.id))
    .where(eq(contentTagsTable.contentId, contentId));

  const tagsWithGroup: { [groupId: string]: TagSchema[] } = {};

  for (const tag of tags) {
    if (!(tag.groupId in tagsWithGroup)) {
      tagsWithGroup[tag.groupId] = [];
    }

    tagsWithGroup[tag.groupId].push(tag);
  }

  return tagsWithGroup;
}

export async function ContentPanel({ content }: { content: ContentSchema }) {
  return <InternalContentPanel content={content} tagsWithGroup={getTagsWithGroup(content.id)} />;
}
