"use client";
import type { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import * as css from "./form.css";
import { ErrorMessage } from "./FormErrorMessage";

type Props = {
  label: string;
  error?: string | string[];
  key: string;
} & DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

export function FormInputTextArea(props: Props) {
  return (
    <div className={css.wrapper}>
      <label className={css.label}>
        {props.label}
        <textarea {...props} spellCheck="false" autoComplete="off" className={css.input_textarea} />
      </label>
      <ErrorMessage message={props.error} />
    </div>
  );
}
