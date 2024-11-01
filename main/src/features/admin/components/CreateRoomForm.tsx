"use client";
import { createRoomAction } from "../actions";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createRoomSchema } from "../schema";
import { materials } from "@/theme.css";
import { useActionState } from "react";
import { FormInputText } from "@/components/form/FormInputText";
import { FormInputTextArea } from "@/components/form/FormInputTextArea";

export function CreateRoomForm() {
  const [lastResult, action] = useActionState(createRoomAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createRoomSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form {...getFormProps(form)} action={action} className={materials.form}>
      <FormInputText label="名前" {...getInputProps(fields.name, { type: "text" })} error={fields.name.errors} />
      <FormInputTextArea label="概要" {...getInputProps(fields.description, { type: "text" })} />
      <FormInputText label="Access Key" {...getInputProps(fields.accessKey, { type: "text" })} error={fields.accessKey.errors} />
    </form>
  );
}
