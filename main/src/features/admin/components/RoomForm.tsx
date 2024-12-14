"use client";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createRoomSchema, updateRoomSchema, type UpdateRoomSchema } from "../schema";
import { useActionState } from "react";
import { FormInputText } from "@/components/form/FormInputText";
import { FormInputTextArea } from "@/components/form/FormInputTextArea";
import { FormSelect } from "@/components/form/FormSelect";
import { Form } from "@/components/form/Form";
import { FormSubmitCalcel } from "@/components/form/FormSubmitCancel";
import { usePreventResetForm } from "@/hooks/usePreventResetForm";
import { MessageModal } from "@/components/MessageModal";
import { FormCustomDescriptions } from "./FormCustomDescriptions";
import { createRoomAction, updateRoomAction } from "../actions";
import { FormHidden } from "@/components/form/FormHidden";

export type RoomFormProps = {
  inititlValue?: UpdateRoomSchema;
  backText: string;
  backUrl: string;
  submitText: string;
  successMessage: string;
};

export function RoomForm(props: RoomFormProps) {
  const [lastResult, action] = useActionState(props.inititlValue === undefined ? createRoomAction : updateRoomAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: props.inititlValue === undefined ? createRoomSchema : updateRoomSchema });
    },
    defaultValue: props.inititlValue,
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
        {props.inititlValue === undefined ? null : <FormHidden field={fields.id} />}
        <FormSubmitCalcel
          cancelText={props.backText}
          hrefCancel={props.backUrl}
          submitText={props.submitText}
          dirty={form.dirty}
          disabled={!createRoomSchema.safeParse(form.value).success}
        />
      </Form>
      <MessageModal open={form.status === "success"} message={props.successMessage} closeText={props.backText} onClose={props.backUrl} />
    </>
  );
}
