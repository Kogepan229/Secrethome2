import { db } from "@/db/db";
import { tagGroupsTable, tagsTable } from "@/db/schema";
import { TagCreateForm } from "@/features/room/tag/components/TagCreateForm";
import { eq } from "drizzle-orm";
import Link from "next/link";
import * as css from "./page.css";

function TagGroupItem({
  roomId,
  id,
  name,
  description,
  selected,
}: { roomId: string; id: string; name: string; description: string | null; selected: boolean }) {
  return (
    <div className={css.tag_group_item_wrapper} data-selected={selected}>
      <Link href={`/${roomId}/manager/tags?id=${id}`}>
        <div className={css.tag_group_item}>
          <span className={css.tag_group_item_name}>{name}</span>
          <span className={css.tag_group_item_desc}>{description}</span>
          {/* <span className={css.tag_group_item_desc}>これは概要</span> */}
        </div>
      </Link>
    </div>
  );
}

function TagItem({ name }: { name: string }) {
  return (
    <div>
      <span>{name}</span>
    </div>
  );
}

async function TagList({ tagGroupId }: { tagGroupId: string | undefined }) {
  if (tagGroupId === undefined) return null;

  const tags = await db.select().from(tagsTable).where(eq(tagsTable.groupId, tagGroupId));
  const tagElements = tags.map((tag) => {
    return <TagItem name={tag.name} key={tag.id} />;
  });

  return <div>{tagElements}</div>;
}

async function TagGroupInfo({ tagGroupId }: { tagGroupId: string | undefined }) {
  if (tagGroupId === undefined) return null;

  const tagGroup = (await db.select().from(tagGroupsTable).where(eq(tagGroupsTable.id, tagGroupId))).at(0);
  if (tagGroup === undefined) return null;

  return (
    <>
      <span className={css.item_header}>タググループ情報</span>
      <span>{tagGroup.name}</span>
      <span>{tagGroup.description}</span>
      <span className={css.item_header}>タグ追加</span>
      <TagCreateForm tagGroupId={tagGroupId} />
      <span className={css.item_header}>タグリスト</span>
      <TagList tagGroupId={tagGroupId} />
    </>
  );
}

export default async function TagsManagerPage({
  params,
  searchParams,
}: { params: Promise<{ roomId: string }>; searchParams: Promise<{ id?: string }> }) {
  const { roomId } = await params;
  const { id } = await searchParams;

  const tagGroups = await db.select().from(tagGroupsTable).where(eq(tagGroupsTable.roomId, roomId));

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
    <main className={css.main}>
      <div className={css.item_container}>
        <div className={css.list_container}>
          <span className={css.item_header}>タググループリスト</span>
          <div className={css.tag_group_container}>{tagGroupElements}</div>
        </div>
        <div className={css.list_container}>
          <TagGroupInfo tagGroupId={selectedId} />
          {/* <span className={css.item_header}>タグリスト</span> */}
          {/* <div className={css.tag_group_container}>{tagGroups}</div> */}
        </div>
      </div>
    </main>
  );
}
