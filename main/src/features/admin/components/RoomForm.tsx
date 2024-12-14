"use client";
import { createRoomAction } from "../actions";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createRoomSchema } from "../schema";
import { useActionState } from "react";
import { FormInputText } from "@/components/form/FormInputText";
import { FormInputTextArea } from "@/components/form/FormInputTextArea";
import { FormSelect } from "@/components/form/FormSelect";
import { Form } from "@/components/form/Form";
import { FormSubmitCalcel } from "@/components/form/FormSubmitCancel";
import { usePreventResetForm } from "@/hooks/usePreventResetForm";
import { MessageModal } from "@/components/MessageModal";
import { FormCustomDescriptions } from "./FormCustomDescriptions";

export function RoomForm() {
  const [lastResult, action] = useActionState(createRoomAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createRoomSchema });
    },
    defaultValue: undefined,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  usePreventResetForm(form);

  return (
    <>
      <Form {...getFormProps(form)} action={action}>
        <FormInputText label="名前" field={fields.name} />
        <FormInputTextArea label="概要" field={fields.description} />
        <FormSelect
          label="ルームタイプ"
          field={fields.roomType}
          options={[
            { text: "動画", value: "video" },
            { text: "画像", value: "image" },
          ]}
        />
        <FormCustomDescriptions form={form} field={fields.customDescriptionList} />
        <FormInputText label="Access Key" field={fields.accessKey} />
        <FormSubmitCalcel
          cancelText="戻る"
          hrefCancel="/admin"
          submitText="作成"
          dirty={form.dirty}
          disabled={!createRoomSchema.safeParse(form.value).success}
        />
      </Form>
      <MessageModal open={form.status === "success"} message="作成しました" closeText="戻る" onClose="/admin" />
    </>
  );
}
