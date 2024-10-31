"use client";
import * as css from "./form.css";

export function FormTextArea({ title, name }: { title: string; name: string }) {
  return (
    <label className={css.label}>
      {title}
      <textarea spellCheck="false" autoComplete="off" name={name} className={css.input_textarea} />
    </label>
  );
}
