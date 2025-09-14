"use server";
import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { DatabaseError } from "pg";
import { db } from "@/db/db";
import { tagGroupsTable, tagsTable } from "@/db/schema";
import { createTagGroupSchema, createTagSchema, updateTagGroupSchema } from "./schema";

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

export async function createTagAction(_prev: unknown, formData: FormData): Promise<SubmissionResult<string[]>> {
  const submission = parseWithZod(formData, { schema: createTagSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await db.insert(tagsTable).values(submission.value);
    // return submission.reply({ resetForm: true });
    return submission.reply();
  } catch (e) {
    if (e instanceof DatabaseError) {
      if (e.constraint === "tags_group_id_name_unique") {
        return submission.reply({ fieldErrors: { name: ["指定されたタグ名は既に使用されています"] } });
      }
    }
    console.error(e);
    return submission.reply({ formErrors: ["不明なエラーが発生しました"] });
  }
}
