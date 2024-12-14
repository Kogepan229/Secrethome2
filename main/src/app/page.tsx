"use client";
import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import Link from "next/link";
import * as css from "./page.css";
import { Form } from "@/components/form/Form";
import { FormInputText } from "@/components/form/FormInputText";
import { accessRoomAction } from "@/features/room/common/actions";
import { useActionState } from "react";
import { parseWithZod } from "@conform-to/zod";
import { accessRoomSchema } from "@/features/room/common/schema";
import { getFormProps, useForm } from "@conform-to/react";
import { usePreventResetForm } from "@/hooks/usePreventResetForm";

export default function Home() {
  const [lastResult, action] = useActionState(accessRoomAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: accessRoomSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  usePreventResetForm(form);

  return (
    <div>
      <header className={css.header}>
        <Link href={"/"}>
          <div className={css.header_logo}>Secret Home</div>
        </Link>
      </header>
      <main className={css.main}>
        <ContentsGridHeader title="ルームアクセス" />
        <Form {...getFormProps(form)} action={action}>
          <FormInputText field={fields.accessKey} label="key" />
          <button type="submit" className={css.submit_button} disabled={!accessRoomSchema.safeParse(form.value).success}>
            アクセス
          </button>
        </Form>
      </main>
    </div>
  );
}
