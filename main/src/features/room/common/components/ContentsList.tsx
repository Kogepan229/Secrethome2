import { db } from "@/db/db";
import { contentTagsTable, contentsTable } from "@/db/schema";
import { and, count, eq, getTableColumns, inArray } from "drizzle-orm";
import { CONTENTS_NUM_PER_PAGE } from "../utils/contents";
import { ContentPanel } from "./ContentPanel";

async function getContents(roomId: string, tagIds: string[] | undefined, page: number) {
  if (tagIds) {
    return db
      .select({ ...getTableColumns(contentsTable), count: count() })
      .from(contentTagsTable)
      .innerJoin(contentsTable, eq(contentTagsTable.contentId, contentsTable.id))
      .where(inArray(contentTagsTable.tagId, tagIds))
      .groupBy(contentsTable.id)
      .having(({ count }) => eq(count, tagIds.length))
      .limit(CONTENTS_NUM_PER_PAGE)
      .offset(CONTENTS_NUM_PER_PAGE * (page - 1));
  }
  return db
    .select()
    .from(contentsTable)
    .where(and(eq(contentsTable.roomId, roomId), eq(contentsTable.status, "available")))
    .limit(CONTENTS_NUM_PER_PAGE)
    .offset(CONTENTS_NUM_PER_PAGE * (page - 1));
}

export async function ContentsList({ roomId, tagIds, page }: { roomId: string; tagIds: string[] | undefined; page: number }) {
  const contents = await getContents(roomId, tagIds, page);

  return (
    <div className="grid my-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {contents.map((content) => {
        return <ContentPanel content={content} key={content.id} />;
      })}
    </div>
  );
}
