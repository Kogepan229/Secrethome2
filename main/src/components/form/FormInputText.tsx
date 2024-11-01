"use client";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import * as css from "./form.css";

type Props = {
  label: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function FormInputText(props: Props) {
  return (
    <label className={css.label}>
      {props.label}
      <input {...props} spellCheck="false" autoComplete="off" className={css.input_text} />
    </label>
  );
}
