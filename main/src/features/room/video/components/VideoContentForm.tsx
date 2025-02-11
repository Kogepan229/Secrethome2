"use client";
import { type SubmissionResult, getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useState } from "react";
import { type UploadVideoContentSchema, uploadVideoContentSchema } from "../schema";
import { FormInputVideo } from "./FormInputVideo";

import { MessageModal } from "@/components/MessageModal";
import { Form } from "@/components/form/Form";
import { ErrorMessage } from "@/components/form/FormErrorMessage";
import { FormHidden } from "@/components/form/FormHidden";
import { FormInputText } from "@/components/form/FormInputText";
import { FormInputTextArea } from "@/components/form/FormInputTextArea";
import { FormSubmitCalcel } from "@/components/form/FormSubmitCancel";
import { usePreventResetForm } from "@/hooks/usePreventResetForm";

export type VideoContentFormProps = {
  roomId: string;
  inititlValue?: UploadVideoContentSchema;
  backText: string;
  backUrl: string;
  submitText: string;
  successMessage: string;
};

export function VideoContentForm(props: VideoContentFormProps) {
  // const [lastResult, action] = useActionState(
  //   props.inititlValue === undefined ? uploadVideoContentAction : uploadVideoContentAction,
  //   undefined,
  // );
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  // const [lastResult, action] = useActionState(undefined as any, undefined);
  const [lastResult, setLastResult] = useState<SubmissionResult<string[]> | null>(null);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: props.inititlValue === undefined ? uploadVideoContentSchema : uploadVideoContentSchema });
    },
    defaultValue: { roomId: props.roomId },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit: async (e, c) => {
      e.preventDefault();

      const response = await fetch("/api/contents/video", {
        method: "POST",
        body: c.formData,
      });

      const responseData = (await response.json()) as SubmissionResult<string[]>;
      setLastResult(responseData);
    },
  });
  usePreventResetForm(form);
  console.debug(uploadVideoContentSchema.safeParse(form.value));

  return (
    <>
      <Form {...getFormProps(form)}>
        <ErrorMessage message={form.errors} />
        <FormInputText label="タイトル" field={fields.title} />
        <FormInputTextArea label="概要" field={fields.description} />
        <FormInputVideo videoField={fields.video} thumbnailField={fields.thumbnail} />
        <FormHidden field={fields.roomId} />
        <FormSubmitCalcel
          cancelText={props.backText}
          hrefCancel={props.backUrl}
          submitText={props.submitText}
          dirty={form.dirty}
          disabled={!uploadVideoContentSchema.safeParse(form.value).success}
        />
      </Form>
      <MessageModal
        open={form.status === "success"}
        message={props.inititlValue ? "更新しました" : "追加しました"}
        closeText={"戻る"}
        onClose={`/${props.roomId}/manager`}
      />
    </>
  );
}
