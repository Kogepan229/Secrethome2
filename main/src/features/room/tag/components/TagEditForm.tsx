"use client";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { createId } from "@paralleldrive/cuid2";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { BasicButton } from "@/components/BasicButton";
import { ErrorMessage } from "@/components/form/FormErrorMessage";
import { FormHidden } from "@/components/form/FormHidden";
import { FormInputText } from "@/components/form/FormInputText";
import { editTagAction } from "../actions";
import { type EditTagSchema, editTagSchema } from "../schema";

export function TagEditForm({ initialTag, onClose }: { initialTag: EditTagSchema; onClose: () => void }) {
  const router = useRouter();

  const [formId, setFormId] = useState<string>();
  const [lastResult, action] = useActionState(editTagAction, undefined);
  const [form, fields] = useForm({
    id: formId,
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: editTagSchema });
    },
    onSubmit(e) {
      e.stopPropagation();
    },
    defaultValue: initialTag,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies(initialTag): neccessary
  useEffect(() => {
    setFormId(createId());
  }, [initialTag]);

  useEffect(() => {
    if (lastResult?.status === "success") {
      onClose();
      router.refresh();
    }
  }, [lastResult, router, onClose]);

  return (
    <form {...getFormProps(form)} action={action}>
      <FormHidden field={fields.id} />
      <FormInputText label="タグ名" field={fields.name} />
      <div className="mt-1">
        <ErrorMessage message={form.errors} />
        <div className="flex justify-end gap-2 mt-4">
          <BasicButton type="button" onClick={onClose} className="w-16">
            閉じる
          </BasicButton>
          <BasicButton type="submit" disabled={!editTagSchema.safeParse(form.value).success} className="w-16">
            更新
          </BasicButton>
        </div>
      </div>
    </form>
  );
}
