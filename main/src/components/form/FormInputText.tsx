"use client";
import { type FieldMetadata, getInputProps } from "@conform-to/react";
import { ErrorMessage } from "./FormErrorMessage";
import { formStyles } from "./formStyles";

type Props = {
  label: string;
  field: FieldMetadata;
};

export function FormInputText(props: Props) {
  return (
    <div className={formStyles.wrapper()}>
      <label>
        <span className={formStyles.label()}>{props.label}</span>
        <input
          {...getInputProps(props.field, { type: "text" })}
          spellCheck="false"
          autoComplete="off"
          key={props.field.key}
          className="w-full h-7 p-1 outline-none border border-border-dark-gray rounded-sm text-base focus:border-border-primary focus:shadow-sm"
        />
      </label>
      <ErrorMessage message={props.field.errors} />
    </div>
  );
}
