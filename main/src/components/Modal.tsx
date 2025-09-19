import type { ComponentPropsWithRef, ReactNode } from "react";

type Props = ComponentPropsWithRef<"dialog"> & {
  children: ReactNode;
};

export function Modal({ ref, children }: Props) {
  return (
    <dialog ref={ref} className="m-auto border-none rounded-lg backdrop:bg-black/60">
      {children}
    </dialog>
  );
}
