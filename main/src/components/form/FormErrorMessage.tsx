"use client";
import * as css from "./form.css";

export function ErrorMessage({ message }: { message: string | string[] | undefined }) {
  if (message === undefined) {
    return null;
  }
  if (typeof message === "string") {
    return <p className={css.error_message}>{message}</p>;
  }
  return message.map((msg) => {
    return (
      <p key={msg} className={css.error_message}>
        {msg}
      </p>
    );
  });
}
