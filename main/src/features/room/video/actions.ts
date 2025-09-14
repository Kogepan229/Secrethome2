"use server";
import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { contentsTable } from "@/db/schema";
import { uploadVideoContentInfoSchema } from "./schema";

export async function submitVideoInfo(formData: FormData): Promise<{ submission: SubmissionResult<string[]>; id: string | null }> {
  const submission = parseWithZod(formData, { schema: uploadVideoContentInfoSchema });
  if (submission.status !== "success") {
    return { submission: submission.reply(), id: null };
  }

  try {
    const result = await db.insert(contentsTable).values(submission.value).returning({ id: contentsTable.id });
    return { submission: submission.reply(), id: result[0].id };
  } catch (e) {
    console.error(e);
    return { submission: submission.reply({ formErrors: ["不明なエラーが発生しました"] }), id: null };
  }
}

export async function deleteVideoInfo(id: string) {
  try {
    const result = await db.delete(contentsTable).where(eq(contentsTable.id, id));
    if (result.rowCount !== 1) {
      console.error("Deleted content is not one.");
    }
  } catch (e) {
    console.error(e);
  }
}
