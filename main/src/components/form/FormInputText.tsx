"use client";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import * as css from "./form.css";
import { ErrorMessage } from "./FormErrorMessage";

type Props = {
  label: string;
  error?: string | string[];
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function FormInputText(props: Props) {
  return (
    <div className={css.wrapper}>
      <label className={css.label}>
        {props.label}
        <input {...props} spellCheck="false" autoComplete="off" className={css.input_text} />
      </label>
      <ErrorMessage message={props.error} />
    </div>
  );
}
