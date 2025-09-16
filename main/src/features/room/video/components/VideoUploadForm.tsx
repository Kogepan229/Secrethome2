"use client";
import { getFormProps, type SubmissionResult, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { useState } from "react";
import { Form } from "@/components/form/Form";
import { FormBottom } from "@/components/form/FormBottom";
import { FormHidden } from "@/components/form/FormHidden";
import { FormInputText } from "@/components/form/FormInputText";
import { FormInputTextArea } from "@/components/form/FormInputTextArea";
import { FormSubmitCalcel } from "@/components/form/FormSubmitCancel";
import { useProgressBar } from "@/components/form/ProgressBar";
import { MessageModal } from "@/components/MessageModal";
import { usePreventResetForm } from "@/hooks/usePreventResetForm";
import { submitContentTags } from "../../common/actions";
import { FormTag } from "../../common/components/FormTag";
import type { TagGroupSchema, TagSchema } from "../../common/schema";
import { objectToFormData } from "../../common/utils/formdata";
import { uploadThumbnail } from "../../common/utils/uploadThumbnail";
import { deleteVideoInfo, submitUploadVideoInfo } from "../actions";
import { uploadVideoContentInfoSchema, uploadVideoContentSchema } from "../schema";
import { uploadVideo } from "../utils/uploadVideo";
import { FormInputVideo } from "./FormInputVideo";

export type VideoUploadFormProps = {
  roomId: string;
  tagGroups: Promise<TagGroupSchema[]>;
};

async function uploadMediaContents(id: string, thumbnail: File, video: File): Promise<boolean> {
  const resultThumbnail = await uploadThumbnail(thumbnail, id);
  if (!resultThumbnail) {
    return false;
  }

  const resultVideo = await uploadVideo(video, id);
  if (!resultVideo) {
    return false;
  }

  return true;
}

export function VideoUploadForm(props: VideoUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTagList, setSelectedTagList] = useState<TagSchema[]>([]);

  const { focusProgressBar, progressBar } = useProgressBar(isUploading);

  const [lastResult, setLastResult] = useState<SubmissionResult<string[]> | null>(null);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: uploadVideoContentSchema });
    },
    defaultValue: { roomId: props.roomId },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit: async (e) => {
      e.preventDefault();

      const info = await uploadVideoContentInfoSchema.safeParseAsync(form.value);
      if (!info.success || !form.value || !form.value.thumbnail || !form.value.video) {
        return;
      }

      setIsUploading(true);
      focusProgressBar();

      const resultInfo = await submitUploadVideoInfo(objectToFormData(info.data));
      if (resultInfo.id === null) {
        setLastResult(resultInfo.submission);
        setIsUploading(false);
        return;
      }

      const resultTags = await submitContentTags({
        id: resultInfo.id,
        tags: selectedTagList.map((tag) => tag.id),
      });
      if (!resultTags) {
        // TODO: set error
        await deleteVideoInfo(resultInfo.id);
        setIsUploading(false);
        return;
      }

      const success = await uploadMediaContents(resultInfo.id, form.value.thumbnail, form.value.video);
      if (!success) {
        // TODO: set error
        await deleteVideoInfo(resultInfo.id);
        setIsUploading(false);
        return;
      }

      setLastResult(resultInfo.submission);
      setIsUploading(false);
      return;
    },
  });
  usePreventResetForm(form);
  console.debug(uploadVideoContentSchema.safeParse(form.value));
  return (
    <>
      <Form {...getFormProps(form)}>
        <FormInputText label="タイトル" field={fields.title} />
        <FormInputTextArea label="概要" field={fields.description} />
        <FormTag label={"タグ"} tagGroups={props.tagGroups} selectedTags={selectedTagList} setSelectedTags={setSelectedTagList} />
        <FormInputVideo videoField={fields.video} thumbnailField={fields.thumbnail} />
        <FormHidden field={fields.roomId} />
        <FormBottom formErrors={form.errors}>
          {progressBar}
          <FormSubmitCalcel
            cancelText="戻る"
            hrefCancel={`/${props.roomId}/manager`}
            submitText="アップロード"
            dirty={form.dirty}
            disabled={!uploadVideoContentSchema.safeParse(form.value).success || isUploading}
          />
        </FormBottom>
      </Form>
      <MessageModal open={form.status === "success"} message="追加しました" closeText="戻る" onClose={`/${props.roomId}/manager`} />
    </>
  );
}
