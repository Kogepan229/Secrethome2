"use client";
import TrashIcon from "@/assets/button/trash.svg";
import { BasicButton } from "@/components/BasicButton";
import { deleteTag } from "@/features/room/common/actions";
import type { TagWithCountSchema } from "@/features/room/common/schema";
import { useState } from "react";

export function TagManagerTagItem({ tag }: { tag: TagWithCountSchema }) {
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  async function handleDelete() {
    setDeleted(true);
    const result = await deleteTag(tag.id);
    setDeleted(result);
  }

  const deleteButton =
    tag.count === 0 ? (
      <BasicButton className="hidden w-6 h-6 m-1 rounded-sm p-[3px] border-red-600" onClick={handleDelete}>
        <TrashIcon width={16} height={16} />
      </BasicButton>
    ) : null;

  return (
    <div className="flex w-full h-8 hover:bg-hover-gray hover:[&>button]:block">
      <div className="grow ml-2.5 leading-8">{tag.name}</div>
      {deleteButton}
      <div className="w-7.5 m-1.5 border rounded-sm border-border-primary text-primary text-center leading-4 text-sm">{tag.count}</div>
    </div>
  );
}
