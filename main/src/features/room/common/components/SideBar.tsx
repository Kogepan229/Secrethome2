import { desc, eq, getTableColumns, inArray } from "drizzle-orm";
import { db } from "@/db/db";
import { contentTagsTable, tagGroupsTable, tagsTable } from "@/db/schema";
import { SideBarTagList } from "./SideBarTagList";

export async function SideBar({ roomId }: { roomId: string }) {
  const tagGroups = await db.select().from(tagGroupsTable).where(eq(tagGroupsTable.roomId, roomId));

  const countQuery = db.$count(contentTagsTable, eq(contentTagsTable.tagId, tagsTable.id));
  const tags = await db
    .select({
      ...getTableColumns(tagsTable),
      count: countQuery,
    })
    .from(tagsTable)
    .where(
      inArray(
        tagsTable.groupId,
        tagGroups.map((group) => group.id),
      ),
    )
    .orderBy(desc(countQuery), tagsTable.name);

  const tagList = tagGroups.map((group) => <SideBarTagList roomId={roomId} tagGroup={group} tags={tags} key={group.id} />);

  return (
    <div className="w-50 h-full">
      <div className="w-full h-10 bg-primary text-white-primary text-center leading-10">タグ一覧</div>
      <div className="border-r border-b border-border-gray">{tagList}</div>
    </div>
  );
}
