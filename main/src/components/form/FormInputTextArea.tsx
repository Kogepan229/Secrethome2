"use client";
import { type FieldMetadata, getInputProps } from "@conform-to/react";
import { ErrorMessage } from "./FormErrorMessage";
import { formStyles } from "./formStyles";

type Props = {
  label: string;
  field: FieldMetadata;
};

export function FormInputTextArea(props: Props) {
  return (
    <div className={formStyles.wrapper()}>
      <label>
        <span className={formStyles.label()}>{props.label}</span>
        <textarea
          {...getInputProps(props.field, { type: "text" })}
          spellCheck="false"
          autoComplete="off"
          key={props.field.key}
          className="w-full h-16 min-h-16 p-1 outline-none border border-border-dark-gray rounded-sm text-base resize-y focus:border-border-primary focus:shadow-sm"
        />
      </label>
      <ErrorMessage message={props.field.errors} />
    </div>
  );
}
