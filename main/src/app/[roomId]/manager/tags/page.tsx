import { db } from "@/db/db";
import { tagGroupsTable } from "@/db/schema";
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
    <div className={css.tag_group_item_wrapper}>
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

export default async function TagsManagerPage({
  params,
  searchParams,
}: { params: Promise<{ roomId: string }>; searchParams: Promise<{ id?: string }> }) {
  const { roomId } = await params;
  const { id } = await searchParams;

  const tagGroups = (await db.select().from(tagGroupsTable).where(eq(tagGroupsTable.roomId, roomId))).map((tagGroup) => (
    <>
      <TagGroupItem
        roomId={roomId}
        id={tagGroup.id}
        name={tagGroup.name}
        description={tagGroup.description}
        selected={tagGroup.id === id}
        key={tagGroup.id}
      />
      {/* <TagGroupItem
        roomId={roomId}
        id={tagGroup.id}
        name={tagGroup.name}
        description={tagGroup.description}
        selected={tagGroup.id === id}
        key={`${tagGroup.id}2`}
      />
      <TagGroupItem
        roomId={roomId}
        id={tagGroup.id}
        name={tagGroup.name}
        description={tagGroup.description}
        selected={tagGroup.id === id}
        key={`${tagGroup.id}3`}
      /> */}
    </>
  ));

  return (
    <main className={css.main}>
      <div className={css.item_container}>
        <div className={css.list_container}>
          <span className={css.item_header}>タググループリスト</span>
          <div className={css.tag_group_container}>{tagGroups}</div>
        </div>
        <div className={css.list_container}>
          <span className={css.item_header}>タグリスト</span>
          <div className={css.tag_group_container}>{tagGroups}</div>
        </div>
      </div>
    </main>
  );
}
