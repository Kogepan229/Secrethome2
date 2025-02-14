"use client";
import { type FieldMetadata, getSelectProps } from "@conform-to/react";
import { ErrorMessage } from "./FormErrorMessage";
import * as css from "./form.css";

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
    <div className={css.wrapper}>
      <label className={css.label}>
        {props.label}
        <select {...getSelectProps(props.field)} key={props.field.key} className={css.select} disabled={props.disabled}>
          {options}
        </select>
      </label>
      <ErrorMessage message={props.field.errors} />
    </div>
  );
}
