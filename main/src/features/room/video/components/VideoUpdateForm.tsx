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
import { getContentPageUrl, getThumbnailUrl } from "@/utils/urls";
import { submitContentTags } from "../../common/actions";
import { FormTag } from "../../common/components/FormTag";
import type { TagGroupSchema, TagSchema } from "../../common/schema";
import { objectToFormData } from "../../common/utils/formdata";
import { uploadThumbnail } from "../../common/utils/uploadThumbnail";
import { submitUpdateVideoInfo } from "../actions";
import { type UpdateVideoContentSchema, updateVideoContentInfoSchema, updateVideoContentSchema } from "../schema";
import { uploadVideo } from "../utils/uploadVideo";
import { getVideoUrl } from "../utils/videoUrl";
import { FormInputVideo } from "./FormInputVideo";

type inititlValue = Omit<UpdateVideoContentSchema, "video" | "thumbnail"> & {
  videoId: string | null;
  thumbnailId: string | null;
};

export type VideoUpdateFormProps = {
  roomId: string;
  initialValue: inititlValue;
  initialTags: TagSchema[];
  tagGroups: Promise<TagGroupSchema[]>;
};

async function updateMediaContents(id: string, thumbnail: File | undefined, video: File | undefined): Promise<boolean> {
  if (thumbnail) {
    const resultThumbnail = await uploadThumbnail(thumbnail, id);
    if (!resultThumbnail) {
      return false;
    }
  }

  if (video) {
    const resultVideo = await uploadVideo(video, id);
    if (!resultVideo) {
      return false;
    }
  }

  return true;
}

export function VideoUpdateForm(props: VideoUpdateFormProps) {
  const { videoId: initialVideoId, thumbnailId: initialThumbnailId, ...inititlValue } = props.initialValue;

  const [isUploading, setIsUploading] = useState(false);
  const [selectedTagList, setSelectedTagList] = useState<TagSchema[]>(props.initialTags);

  const { focusProgressBar, progressBar } = useProgressBar(isUploading);

  const [lastResult, setLastResult] = useState<SubmissionResult<string[]> | null>(null);
  const [form, fields] = useForm<UpdateVideoContentSchema>({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: updateVideoContentSchema });
    },
    defaultValue: inititlValue,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit: async (e) => {
      e.preventDefault();

      const info = await updateVideoContentInfoSchema.safeParseAsync(form.value);
      if (!info.success || !form.value) {
        return;
      }

      setIsUploading(true);
      focusProgressBar();

      const submission = await submitUpdateVideoInfo(objectToFormData(info.data));

      if (submission.status !== "success") {
        setLastResult(submission);
        setIsUploading(false);
        return;
      }

      const resultTags = await submitContentTags({
        id: props.initialValue.id,
        tags: selectedTagList.map((tag) => tag.id),
      });
      if (!resultTags) {
        // TODO: set error
        setIsUploading(false);
        return;
      }

      const success = await updateMediaContents(
        props.initialValue.id,
        form.value.thumbnail as File | undefined,
        form.value.video as File | undefined,
      );
      if (!success) {
        // TODO: set error
        setIsUploading(false);
        return;
      }

      setLastResult(submission);
      setIsUploading(false);
      return;
    },
  });

  return (
    <>
      <Form {...getFormProps(form)}>
        <FormInputText label="タイトル" field={fields.title} />
        <FormInputTextArea label="概要" field={fields.description} />
        <FormTag label={"タグ"} tagGroups={props.tagGroups} selectedTags={selectedTagList} setSelectedTags={setSelectedTagList} />
        <FormInputVideo
          videoField={fields.video}
          thumbnailField={fields.thumbnail}
          initialVideoUrl={initialVideoId ? getVideoUrl(initialVideoId) : undefined}
          initialThumbnailUrl={initialThumbnailId ? getThumbnailUrl(initialThumbnailId) : undefined}
        />
        <FormHidden field={fields.id} />
        <FormBottom formErrors={form.errors}>
          {progressBar}
          <FormSubmitCalcel
            cancelText="戻る"
            hrefCancel={getContentPageUrl(props.roomId, props.initialValue.id)}
            submitText="更新"
            dirty={form.dirty}
            disabled={!updateVideoContentSchema.safeParse(form.value).success || isUploading}
          />
        </FormBottom>
      </Form>
      <MessageModal
        open={form.status === "success"}
        message="更新しました"
        closeText="戻る"
        onClose={getContentPageUrl(props.roomId, props.initialValue.id)}
      />
    </>
  );
}
