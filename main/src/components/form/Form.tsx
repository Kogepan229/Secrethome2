"use client";
import type { DetailedHTMLProps, FormHTMLAttributes } from "react";
import * as css from "./form.css";

export function Form(props: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) {
  return <form {...props} className={css.form} />;
}
