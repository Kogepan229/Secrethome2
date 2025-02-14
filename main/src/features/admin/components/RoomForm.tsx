"use client";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";

import { MessageModal } from "@/components/MessageModal";
import { Form } from "@/components/form/Form";
import { FormBottom } from "@/components/form/FormBottom";
import { FormInputText } from "@/components/form/FormInputText";
import { FormInputTextArea } from "@/components/form/FormInputTextArea";
import { FormSelect } from "@/components/form/FormSelect";
import { FormSubmitCalcel } from "@/components/form/FormSubmitCancel";
import { usePreventResetForm } from "@/hooks/usePreventResetForm";
import { createRoomAction, updateRoomAction } from "../actions";
import { type UpdateRoomSchema, createRoomSchema, updateRoomSchema } from "../schema";
import { FormCustomDescriptions } from "./FormCustomDescriptions";

export type RoomFormProps = {
  initialValue?: UpdateRoomSchema;
  backText: string;
  backUrl: string;
  submitText: string;
  successMessage: string;
};

export function RoomForm(props: RoomFormProps) {
  const isUpdate = props.initialValue !== undefined;
  const [lastResult, action] = useActionState(isUpdate ? updateRoomAction : createRoomAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: isUpdate ? updateRoomSchema : createRoomSchema });
    },
    onSubmit(e) {
      e.stopPropagation();
    },
    defaultValue: props.initialValue,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  usePreventResetForm(form);

  return (
    <>
      <Form {...getFormProps(form)} action={action}>
        <FormInputText label="ID" field={fields.id} />
        <FormInputText label="名前" field={fields.name} />
        <FormInputTextArea label="概要" field={fields.description} />
        <FormSelect
          label="ルームタイプ"
          field={fields.roomType}
          disabled={isUpdate}
          options={[
            { text: "動画", value: "video" },
            { text: "画像", value: "image" },
          ]}
        />
        <FormCustomDescriptions form={form} field={fields.customDescriptionList} />
        <FormInputText label="Access Key" field={fields.accessKey} />
        <FormBottom formErrors={form.errors}>
          <FormSubmitCalcel
            cancelText={props.backText}
            hrefCancel={props.backUrl}
            submitText={props.submitText}
            dirty={form.dirty}
            disabled={!(isUpdate ? updateRoomSchema : createRoomSchema).safeParse(form.value).success}
          />
        </FormBottom>
      </Form>
      <MessageModal open={form.status === "success"} message={props.successMessage} closeText={props.backText} onClose={props.backUrl} />
    </>
  );
}
