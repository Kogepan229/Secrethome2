"use client";
import { createRoomAction } from "../actions";
import { getFormProps, getInputProps, getSelectProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createRoomSchema } from "../schema";
import { useActionState } from "react";
import { FormInputText } from "@/components/form/FormInputText";
import { FormInputTextArea } from "@/components/form/FormInputTextArea";
import { FormSelect } from "@/components/form/FormSelect";
import { Form } from "@/components/form/Form";

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
    <Form {...getFormProps(form)} action={action}>
      <FormInputText label="名前" {...getInputProps(fields.name, { type: "text" })} error={fields.name.errors} />
      <FormInputTextArea label="概要" {...getInputProps(fields.description, { type: "text" })} error={fields.description.errors} />
      <FormSelect
        label="ルームタイプ"
        {...getSelectProps(fields.roomType)}
        options={[
          { text: "動画", value: "video" },
          { text: "画像", value: "image" },
        ]}
        error={fields.roomType.errors}
      />
      <FormInputText label="Access Key" {...getInputProps(fields.accessKey, { type: "text" })} error={fields.accessKey.errors} />
    </Form>
  );
}
