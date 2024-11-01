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
import { FormSubmitCalcel } from "@/components/form/FormSubmitCancel";

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
      <FormInputText label="名前" {...getInputProps(fields.name, { type: "text" })} key="name" error={fields.name.errors} />
      <FormInputTextArea
        label="概要"
        {...getInputProps(fields.description, { type: "text" })}
        key="description"
        error={fields.description.errors}
      />
      <FormSelect
        label="ルームタイプ"
        {...getSelectProps(fields.roomType)}
        options={[
          { text: "動画", value: "video" },
          { text: "画像", value: "image" },
        ]}
        key="roomType"
        error={fields.roomType.errors}
      />
      <FormInputText
        label="Access Key"
        {...getInputProps(fields.accessKey, { type: "text" })}
        key="accessKey"
        error={fields.accessKey.errors}
      />
      <FormSubmitCalcel
        cancelText="戻る"
        hrefCancel="/admin"
        submitText="作成"
        dirty={form.dirty}
        disabled={!createRoomSchema.safeParse(form.value).success}
      />
    </Form>
  );
}
