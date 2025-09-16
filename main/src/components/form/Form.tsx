"use client";
import type { DetailedHTMLProps, FormHTMLAttributes } from "react";

export function Form(props: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) {
  return <form {...props} className=" max-w-125 m-auto mb-10" />;
}
