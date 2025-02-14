"use client";

import { type FieldMetadata, getInputProps } from "@conform-to/react";

export function FormHidden({ field }: { field: FieldMetadata }) {
  return <input {...getInputProps(field, { type: "hidden" })} key={field.key} />;
}
