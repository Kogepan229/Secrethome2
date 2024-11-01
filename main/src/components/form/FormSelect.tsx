"use client";
import type { DetailedHTMLProps, SelectHTMLAttributes } from "react";
import * as css from "./form.css";
import { ErrorMessage } from "./FormErrorMessage";

type Props = {
  label: string;
  error?: string | string[];
  options: { text: string; value: string }[];
  key: string;
} & DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

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
        <select {...props} className={css.select}>
          {options}
        </select>
      </label>
      <ErrorMessage message={props.error} />
    </div>
  );
}
