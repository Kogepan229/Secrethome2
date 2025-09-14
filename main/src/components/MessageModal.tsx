"use client";
import Link from "next/link";
import { type MouseEventHandler, useEffect, useRef } from "react";
import { BasicButton } from "./BasicButton";

export function MessageModal({
  open,
  message,
  closeText,
  onClose,
}: {
  open: boolean;
  message: string;
  closeText: string;
  onClose: string | MouseEventHandler<HTMLButtonElement>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  function CloseButton() {
    if (typeof onClose === "string") {
      return (
        <div className="w-fit m-auto">
          <Link href={onClose}>
            <BasicButton className="min-w-16 m-auto">{closeText}</BasicButton>
          </Link>
        </div>
      );
    }
    return (
      <div className="w-fit m-auto">
        <BasicButton onClick={onClose} className="min-w-16 m-auto">
          {closeText}
        </BasicButton>
      </div>
    );
  }

  return (
    <dialog ref={dialogRef} className="w-150 h-75 m-auto border-none rounded-sm backdrop:bg-black/60">
      <div className="flex h-50">
        <p className="m-auto text-2xl font-bold text-black-primary">{message}</p>
      </div>
      <CloseButton />
    </dialog>
  );
}
