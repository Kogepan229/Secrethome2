"use client";
import { type FieldMetadata, getInputProps } from "@conform-to/react";
import { ErrorMessage } from "./FormErrorMessage";
import * as css from "./form.css";

type Props = {
  label: string;
  field: FieldMetadata;
};

export function FormInputText(props: Props) {
  return (
    <div className={css.wrapper}>
      <label className={css.label}>
        {props.label}
        <input
          {...getInputProps(props.field, { type: "text" })}
          spellCheck="false"
          autoComplete="off"
          key={props.field.key}
          className={css.input_text}
        />
      </label>
      <ErrorMessage message={props.field.errors} />
    </div>
  );
}
