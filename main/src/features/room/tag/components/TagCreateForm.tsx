"use client";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createId } from "@paralleldrive/cuid2";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { ErrorMessage } from "@/components/form/FormErrorMessage";
import { FormHidden } from "@/components/form/FormHidden";
import { usePreventResetForm } from "@/hooks/usePreventResetForm";
import { createTagAction } from "../actions";
import { createTagSchema } from "../schema";
import * as css from "./TagCreateForm.css";

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
  usePreventResetForm(form);
  // console.log(form.value);
  useEffect(() => {
    if (lastResult?.status === "success") {
      setFormId(createId());
      router.refresh();
    }
  }, [lastResult, router]);

  return (
    <form {...getFormProps(form)} action={action} className={css.form}>
      <div className={css.input_wrapper}>
        <label>
          タグ名
          <ErrorMessage message={form.status === "error" ? (fields.name.errors ?? form.errors) : undefined} />
          <input
            {...getInputProps(fields.name, { type: "text" })}
            spellCheck="false"
            autoComplete="off"
            key={fields.name.key}
            className={css.input}
          />
        </label>
      </div>
      <FormHidden field={fields.groupId} />
      <div className={css.button_wrapper}>
        <button type="submit" disabled={!createTagSchema.safeParse(form.value).success} className={css.submit_button}>
          追加
        </button>
      </div>
    </form>
  );
}
