"use client";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { createId } from "@paralleldrive/cuid2";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { BasicButton } from "@/components/BasicButton";
import { ErrorMessage } from "@/components/form/FormErrorMessage";
import { FormHidden } from "@/components/form/FormHidden";
import { createTagAction } from "../actions";
import { createTagSchema } from "../schema";

export function TagCreateForm({ tagGroupId }: { tagGroupId: string }) {
  const router = useRouter();
  const [formId, setFormId] = useState<string>();
  const [lastResult, action] = useActionState(createTagAction, undefined);
  const [form, fields] = useForm({
    id: formId,
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createTagSchema });
    },
    onSubmit(e) {
      e.stopPropagation();
    },
    defaultValue: { groupId: tagGroupId },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    if (lastResult?.status === "success") {
      setFormId(createId());
      router.refresh();
    }
  }, [lastResult, router]);

  return (
    <form {...getFormProps(form)} action={action} className="flex gap-2">
      <div className="grow">
        <label>
          タグ名
          <ErrorMessage message={form.status === "error" ? (fields.name.errors ?? form.errors) : undefined} />
          <input
            {...getInputProps(fields.name, { type: "text" })}
            spellCheck="false"
            autoComplete="off"
            key={fields.name.key}
            className="w-full h-6 p-1 outline-none border border-border-dark-gray rounded-sm text-base focus:border-border-primary focus:shadow-sm"
          />
        </label>
      </div>
      <FormHidden field={fields.groupId} />
      <div className="relative w-14">
        <BasicButton type="submit" disabled={!createTagSchema.safeParse(form.value).success} className="absolute bottom-0 w-full h-8 p-0.5">
          追加
        </BasicButton>
      </div>
    </form>
  );
}
