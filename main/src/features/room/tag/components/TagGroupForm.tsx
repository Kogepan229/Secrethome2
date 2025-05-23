"use client";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";

import { FormHeader } from "@/components/FormHeader";
import { MessageModal } from "@/components/MessageModal";
import { Form } from "@/components/form/Form";
import { FormBottom } from "@/components/form/FormBottom";
import { FormHidden } from "@/components/form/FormHidden";
import { FormInputText } from "@/components/form/FormInputText";
import { FormInputTextArea } from "@/components/form/FormInputTextArea";
import { FormSubmitCalcel } from "@/components/form/FormSubmitCancel";
import { usePreventResetForm } from "@/hooks/usePreventResetForm";
import { createTagGroupAction, updateTagGroupAction } from "../actions";
import { type UpdateTagGroupSchema, createTagGroupSchema, updateTagGroupSchema } from "../schema";

export type TagGroupFormProps = {
  initialValue?: UpdateTagGroupSchema;
  roomId?: string;
  backText: string;
  backUrl: string;
  submitText: string;
  successMessage: string;
};

export function TagGroupForm(props: TagGroupFormProps) {
  const isUpdate = props.initialValue !== undefined;
  const [lastResult, action] = useActionState(isUpdate ? updateTagGroupAction : createTagGroupAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: isUpdate ? updateTagGroupSchema : createTagGroupSchema });
    },
    onSubmit(e) {
      e.stopPropagation();
    },
    // defaultValue: isUpdate ? props.initialValue : { roomId: undefined },
    // defaultValue: { roomId: "" },
    // defaultValue: { roomId: props.roomId, ...props.initialValue },
    defaultValue: isUpdate ? { ...props.initialValue } : { roomId: props.roomId },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  usePreventResetForm(form);

  return (
    <>
      <Form {...getFormProps(form)} action={action}>
        <FormHeader title={"タググループ作成"} />
        <FormInputText label="名前" field={fields.name} />
        <FormInputTextArea label="概要" field={fields.description} />
        {isUpdate ? <FormHidden field={fields.id} /> : <FormHidden field={fields.roomId} />}
        <FormBottom formErrors={form.errors}>
          <FormSubmitCalcel
            cancelText={props.backText}
            hrefCancel={props.backUrl}
            submitText={props.submitText}
            dirty={form.dirty}
            disabled={!(isUpdate ? updateTagGroupSchema : createTagGroupSchema).safeParse(form.value).success}
          />
        </FormBottom>
      </Form>
      <MessageModal open={form.status === "success"} message={props.successMessage} closeText={props.backText} onClose={props.backUrl} />
    </>
  );
}
