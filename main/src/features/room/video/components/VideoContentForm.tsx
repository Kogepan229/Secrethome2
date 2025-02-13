"use client";
import { type SubmissionResult, getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import axios from "axios";
import { useState } from "react";

import { MessageModal } from "@/components/MessageModal";
import { Form } from "@/components/form/Form";
import { FormBottom } from "@/components/form/FormBottom";
import { FormHidden } from "@/components/form/FormHidden";
import { FormInputText } from "@/components/form/FormInputText";
import { FormInputTextArea } from "@/components/form/FormInputTextArea";
import { FormSubmitCalcel } from "@/components/form/FormSubmitCancel";
import { useProgressBar } from "@/components/form/ProgressBar";
import { usePreventResetForm } from "@/hooks/usePreventResetForm";
import { type UploadVideoContentSchema, uploadVideoContentSchema } from "../schema";
import { FormInputVideo } from "./FormInputVideo";

export type VideoContentFormProps = {
  roomId: string;
  inititlValue?: UploadVideoContentSchema;
  backText: string;
  backUrl: string;
  submitText: string;
  successMessage: string;
};

export function VideoContentForm(props: VideoContentFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { focusProgressBar, progressBar, onProgress } = useProgressBar(isUploading);

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
      setIsUploading(true);
      focusProgressBar();

      axios
        .post<SubmissionResult<string[]>>("/api/contents/video", c.formData, { onUploadProgress: onProgress })
        .then((res) => {
          setLastResult(res.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsUploading(false);
        });
    },
  });
  usePreventResetForm(form);
  console.debug(uploadVideoContentSchema.safeParse(form.value));

  return (
    <>
      <Form {...getFormProps(form)}>
        <FormInputText label="タイトル" field={fields.title} />
        <FormInputTextArea label="概要" field={fields.description} />
        <FormInputVideo videoField={fields.video} thumbnailField={fields.thumbnail} />
        <FormHidden field={fields.roomId} />
        <FormBottom formErrors={form.errors}>
          {progressBar}
          <FormSubmitCalcel
            cancelText={props.backText}
            hrefCancel={props.backUrl}
            submitText={props.submitText}
            dirty={form.dirty}
            disabled={!uploadVideoContentSchema.safeParse(form.value).success || isUploading}
          />
        </FormBottom>
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
