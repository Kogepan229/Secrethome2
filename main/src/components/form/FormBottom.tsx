"use client";
import type { ReactNode } from "react";
import { ErrorMessage } from "./FormErrorMessage";

export function FormBottom({ formErrors, children }: { formErrors?: string | string[]; children: ReactNode }) {
  return (
    <div className="border-t border-t-border-dark-gray mt-8 pt-1">
      <ErrorMessage message={formErrors} />
      {children}
    </div>
  );
}
