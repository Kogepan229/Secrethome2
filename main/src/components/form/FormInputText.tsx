"use client";
import * as css from "./form.css";
import { ErrorMessage } from "./FormErrorMessage";
import { getInputProps, type FieldMetadata } from "@conform-to/react";

type Props = {
  label: string;
  field: FieldMetadata;
};

export function FormInputText(props: Props) {
  return (
    <div className={css.wrapper}>
      <label className={css.label}>
        {props.label}
        <input {...getInputProps(props.field, { type: "text" })} spellCheck="false" autoComplete="off" className={css.input_text} />
      </label>
      <ErrorMessage message={props.field.errors} />
    </div>
  );
}
