"use client";
import { type MouseEventHandler, useEffect, useRef } from "react";
import * as css from "./MessageModal.css";
import Link from "next/link";

export function MessageModal({
  open,
  message,
  closeText,
  onClose,
}: { open: boolean; message: string; closeText: string; onClose: string | MouseEventHandler<HTMLButtonElement> }) {
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
        <div className={css.button_wrapper}>
          <Link href={onClose}>
            <button type="button" className={css.button}>
              {closeText}
            </button>
          </Link>
        </div>
      );
    }
    return (
      <div className={css.button_wrapper}>
        <button type="button" className={css.button} onClick={onClose}>
          {closeText}
        </button>
      </div>
    );
  }

  return (
    <dialog ref={dialogRef} className={css.dialog}>
      <div className={css.message_container}>
        <p className={css.message}>{message}</p>
      </div>
      <CloseButton />
    </dialog>
  );
}
