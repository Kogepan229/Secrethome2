import { desc, eq, getTableColumns } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db/db";
import { contentTagsTable, tagGroupsTable, tagsTable } from "@/db/schema";
import { TagCreateForm } from "@/features/room/tag/components/TagCreateForm";
import { CreateTagGroupPageButton } from "./CreateTagGroupPageButton";
import { TagManagerTagItem } from "./TagManagerTagItem";

function TagGroupItem({
  roomId,
  id,
  name,
  description,
  selected,
}: {
  roomId: string;
  id: string;
  name: string;
  description: string | null;
  selected: boolean;
}) {
  return (
    <div
      className="hover:bg-hover-gray active:bg-active-gray [div+&]:border-t [div+&]:border-t-border-light-gray data-[selected=true]:bg-active-gray"
      data-selected={selected}
    >
      <Link href={`/${roomId}/manager/tags?id=${id}`}>
        <div className="p-2">
          <span className="block font-bold text-black-primary">{name}</span>
          <span className="block h-4 mt-1 leading-4 text-sm text-disabled-gray">{description}</span>
          {/* <span className={css.tag_group_item_desc}>これは概要</span> */}
        </div>
      </Link>
    </div>
  );
}

async function TagList({ tagGroupId }: { tagGroupId: string }) {
  const countQuery = db.$count(contentTagsTable, eq(contentTagsTable.tagId, tagsTable.id));
  const tags = await db
    .select({
      ...getTableColumns(tagsTable),
      count: countQuery,
    })
    .from(tagsTable)
    .where(eq(tagsTable.groupId, tagGroupId))
    .orderBy(desc(countQuery), tagsTable.name);

  const tagElements = tags.map((tag) => {
    return <TagManagerTagItem tag={tag} key={tag.id} />;
  });

  return <div>{tagElements}</div>;
}

async function TagGroupInfo({ tagGroupId }: { tagGroupId: string | undefined }) {
  if (tagGroupId === undefined) return null;

  const tagGroup = (await db.select().from(tagGroupsTable).where(eq(tagGroupsTable.id, tagGroupId))).at(0);
  if (tagGroup === undefined) return null;

  return (
    <>
      <span className="block my-1 text-primary text-lg font-bold">タググループ情報</span>
      <span>{tagGroup.name}</span>
      <span>{tagGroup.description}</span>
      <span className="block my-1 text-primary text-lg font-bold">タグ追加</span>
      <TagCreateForm tagGroupId={tagGroupId} />
      <span className="block my-1 text-primary text-lg font-bold">タグリスト</span>
      <TagList tagGroupId={tagGroupId} />
    </>
  );
}

export default async function TagsManagerPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { roomId } = await params;
  const { id } = await searchParams;

  const tagGroups = await db.select().from(tagGroupsTable).where(eq(tagGroupsTable.roomId, roomId)).orderBy(tagGroupsTable.order);

  const selectedId = id ?? tagGroups.at(0)?.id;

  const tagGroupElements = tagGroups.map((tagGroup) => (
    <TagGroupItem
      roomId={roomId}
      id={tagGroup.id}
      name={tagGroup.name}
      description={tagGroup.description}
      selected={tagGroup.id === selectedId}
      key={tagGroup.id}
    />
  ));

  return (
    <main className="flex flex-col w-full h-[calc(100vh-var(--h-header))] grow basis-0 px-5 py-12">
      <div className="flex grow basis-0 overflow-y-hidden gap-5">
        <div className="flex flex-col grow basis-0 w-full">
          <span className="block my-1 text-primary text-lg font-bold">タググループリスト</span>
          <CreateTagGroupPageButton roomId={roomId} />
          <div className="w-full border rounded-sm border-border-light-gray overflow-y-auto">{tagGroupElements}</div>
        </div>
        <div className="flex flex-col grow basis-0 w-full">
          <TagGroupInfo tagGroupId={selectedId} />
          {/* <span className={css.item_header}>タグリスト</span> */}
          {/* <div className={css.tag_group_container}>{tagGroups}</div> */}
        </div>
      </div>
    </main>
  );
}
