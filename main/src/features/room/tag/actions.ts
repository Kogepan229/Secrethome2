"use server";
import { db } from "@/db/db";
import { tagGroupsTable } from "@/db/schema";
import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createTagGroupSchema, updateTagGroupSchema } from "./schema";

export async function createTagGroupAction(_prev: unknown, formData: FormData): Promise<SubmissionResult<string[]>> {
  const submission = parseWithZod(formData, { schema: createTagGroupSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await db.insert(tagGroupsTable).values(submission.value);
    return submission.reply();
  } catch (e) {
    console.error(e);
    return submission.reply({ formErrors: ["不明なエラーが発生しました"] });
  }
}

export async function updateTagGroupAction(_prev: unknown, formData: FormData): Promise<SubmissionResult<string[]>> {
  const submission = parseWithZod(formData, { schema: updateTagGroupSchema });
  return submission.reply();
}
