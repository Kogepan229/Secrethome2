"use client";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { useActionState } from "react";
import { Form } from "@/components/form/Form";
import { FormBottom } from "@/components/form/FormBottom";
import { FormContainer } from "@/components/form/FormContainer";
import { FormInputText } from "@/components/form/FormInputText";
import { FormInputTextArea } from "@/components/form/FormInputTextArea";
import { FormSelect } from "@/components/form/FormSelect";
import { FormSubmitCalcel } from "@/components/form/FormSubmitCancel";
import { MessageModal } from "@/components/MessageModal";
import { usePreventResetForm } from "@/hooks/usePreventResetForm";
import { createRoomAction, updateRoomAction } from "../actions";
import { createRoomSchema, type UpdateRoomSchema, updateRoomSchema } from "../schema";
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
    <FormContainer>
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
    </FormContainer>
  );
}
