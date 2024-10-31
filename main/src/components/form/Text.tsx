"use client";
import * as css from "./form.css";

export function FormText({ title, name }: { title: string; name: string }) {
  return (
    <label className={css.label}>
      {title}
      <input spellCheck="false" autoComplete="off" type="text" name={name} className={css.input_text} />
    </label>
  );
}
