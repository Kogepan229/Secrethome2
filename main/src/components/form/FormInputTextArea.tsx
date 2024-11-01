"use client";
import type { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import * as css from "./form.css";

type Props = {
  label: string;
} & DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

export function FormInputTextArea(props: Props) {
  return (
    <label className={css.label}>
      {props.label}
      <textarea {...props} spellCheck="false" autoComplete="off" className={css.input_textarea} />
    </label>
  );
}
