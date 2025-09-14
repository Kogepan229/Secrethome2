"use client";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useActionState } from "react";
import { BasicButton } from "@/components/BasicButton";
import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import { Form } from "@/components/form/Form";
import { FormInputText } from "@/components/form/FormInputText";
import { accessRoomAction } from "@/features/room/common/actions";
import { accessRoomSchema } from "@/features/room/common/schema";
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
      <header className="flex justify-center w-full h-header bg-primary">
        <Link href={"/"}>
          <div className="font-oswald text-white-primary text-2xl leading-(--h-header) cursor-pointer ">Secret Home</div>
        </Link>
      </header>
      <main className="w-[60%] m-auto mt-12">
        <ContentsGridHeader title="ルームアクセス" />
        <Form {...getFormProps(form)} action={action}>
          <FormInputText field={fields.accessKey} label="key" />
          <BasicButton type="submit" className="mt-8 w-full" disabled={!accessRoomSchema.safeParse(form.value).success}>
            アクセス
          </BasicButton>
        </Form>
      </main>
    </div>
  );
}
