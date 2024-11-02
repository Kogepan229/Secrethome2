"use client";
import * as css from "./form.css";
import { ErrorMessage } from "./FormErrorMessage";
import { getSelectProps, type FieldMetadata } from "@conform-to/react";

type Props = {
  label: string;
  field: FieldMetadata;
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
        <select {...getSelectProps(props.field)} className={css.select}>
          {options}
        </select>
      </label>
      <ErrorMessage message={props.field.errors} />
    </div>
  );
}
