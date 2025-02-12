"use client";
import type { ReactNode } from "react";
import { ErrorMessage } from "./FormErrorMessage";
import * as css from "./form.css";

export function FormBottom({ formErrors, children }: { formErrors?: string | string[]; children: ReactNode }) {
  return (
    <div className={css.bottom_container}>
      <ErrorMessage message={formErrors} />
      {children}
    </div>
  );
}
