"use client";
import Link from "next/link";
import type { TagGroupSchema, TagWithCountSchema } from "../schema";

function SideBarTagItem({ roomId, tag }: { roomId: string; tag: TagWithCountSchema }) {
  return (
    <Link className="w-full h-10" href={`/${roomId}/contents?tags=${tag.id}`}>
      <div className="flex w-full h-10 hover:bg-hover-gray">
        <div className="grow ml-2.5 leading-10">{tag.name}</div>
        <div className="w-7.5 m-2.5 border rounded-sm border-border-primary text-primary text-center leading-4.5 text-sm">{tag.count}</div>
      </div>
    </Link>
  );
}

export function SideBarTagList({ roomId, tagGroup, tags }: { roomId: string; tagGroup: TagGroupSchema; tags: TagWithCountSchema[] }) {
  const groupTags = tags
    .filter((tag) => tag.groupId === tagGroup.id)
    .map((tag) => {
      return <SideBarTagItem roomId={roomId} tag={tag} key={tag.id} />;
    });

  if (groupTags.length === 0) return null;

  return (
    <div key={tagGroup.id}>
      <details open={true}>
        <summary className="h-10 px-2.5 border-border-primary leading-10 text-primary font-bold cursor-pointer select-none">
          {tagGroup.name}
        </summary>
        <div>{groupTags}</div>
      </details>
    </div>
  );
}
