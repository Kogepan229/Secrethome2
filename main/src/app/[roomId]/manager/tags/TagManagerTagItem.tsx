"use client";
import { useCallback, useRef, useState } from "react";
import EditIcon from "@/assets/button/edit.svg";
import TrashIcon from "@/assets/button/trash.svg";
import { BasicButton } from "@/components/BasicButton";
import { Modal } from "@/components/Modal";
import { deleteTag } from "@/features/room/common/actions";
import type { TagWithCountSchema } from "@/features/room/common/schema";
import { TagEditForm } from "@/features/room/tag/components/TagEditForm";

export function TagManagerTagItem({ tag }: { tag: TagWithCountSchema }) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [deleted, setDeleted] = useState(false);

  function openEditModal() {
    if (!modalRef.current) {
      return;
    }
    modalRef.current.showModal();
  }

  const closeEditModal = useCallback(() => {
    if (!modalRef.current) {
      return;
    }
    modalRef.current.close();
  }, []);

  async function handleDelete() {
    setDeleted(true);
    const result = await deleteTag(tag.id);
    setDeleted(result);
  }

  if (deleted) return null;

  const deleteButton =
    tag.count === 0 ? (
      <BasicButton className="hidden w-6 h-6 m-1 rounded-sm p-[3px] border-red-600" onClick={handleDelete}>
        <TrashIcon width={16} height={16} />
      </BasicButton>
    ) : (
      <BasicButton onClick={openEditModal} className="hidden w-6 h-6 m-1 rounded-sm p-[3px]">
        <EditIcon width={16} height={16} />
      </BasicButton>
    );

  return (
    <>
      <div className="flex w-full h-8 hover:bg-hover-gray hover:[&>button]:block">
        <div className="grow ml-2.5 leading-8">{tag.name}</div>
        {deleteButton}
        <div className="w-7.5 m-1.5 border rounded-sm border-border-primary text-primary text-center leading-4 text-sm">{tag.count}</div>
      </div>
      <Modal ref={modalRef}>
        <div className="p-8">
          <h1 className="mb-5 text-2xl font-bold text-black-primary">タグ編集</h1>
          <TagEditForm initialTag={tag} onClose={closeEditModal} />
        </div>
      </Modal>
    </>
  );
}
