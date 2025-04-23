"use client";
import { type FieldMetadata, getSelectProps } from "@conform-to/react";
import { ErrorMessage } from "./FormErrorMessage";
import { formStyles } from "./formStyles";

type Props = {
  label: string;
  field: FieldMetadata;
  disabled?: boolean;
  options: { text: string; value: string }[];
};

export function FormSelect(props: Props) {
  const options = props.options.map((value) => {
    return (
      <option key={value.value} value={value.value}>
        {value.text}
      </option>
    );
  });

  return (
    <div className={formStyles.wrapper()}>
      <label>
        <span className={formStyles.label()}>{props.label}</span>
        <select
          {...getSelectProps(props.field)}
          key={props.field.key}
          disabled={props.disabled}
          className="w-full outline-none border border-border-dark-gray rounded-sm font-normal focus:border-border-primary focus:shadow-sm"
        >
          {options}
        </select>
      </label>
      <ErrorMessage message={props.field.errors} />
    </div>
  );
}
