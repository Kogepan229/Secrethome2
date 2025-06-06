"use server";
import { db } from "@/db/db";
import { contentTagsTable, roomsTable, tagsTable } from "@/db/schema";
import { parseWithZod } from "@conform-to/zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { accessRoomSchema, uploadTagsSchema } from "./schema";

export async function accessRoomAction(_prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: accessRoomSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  let roomId: string;
  try {
    const data = await db.select({ id: roomsTable.id }).from(roomsTable).where(eq(roomsTable.accessKey, submission.value.accessKey));
    if (data.length !== 1) {
      return submission.reply({ fieldErrors: { accessKey: ["キーが間違っています"] } });
    }
    roomId = data[0].id;
  } catch (e) {
    console.error(e);
    return submission.reply({ formErrors: ["不明なエラーが発生しました"] });
  }

  redirect(`/${roomId}`);
}

export async function submitContentTags(data: { id: string; tags: string[] }): Promise<boolean> {
  const result = await uploadTagsSchema.safeParseAsync(data);
  if (!result.success) {
    return false;
  }

  if (result.data.tags.length === 0) {
    return true;
  }

  const tags = result.data.tags.map((tagId, i) => {
    return { contentId: result.data.id, tagId: tagId, order: i + 1 };
  });

  try {
    await db.transaction(async (tx) => {
      await tx.delete(contentTagsTable).where(eq(contentTagsTable.contentId, result.data.id));
      await tx.insert(contentTagsTable).values(tags);
    });
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
}

export async function deleteTag(id: string) {
  console.log("ddd");
  const parsed = await z.string().safeParseAsync(id);
  console.log(parsed);
  if (!parsed.success) return false;

  try {
    await db.delete(tagsTable).where(eq(tagsTable.id, parsed.data));
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
}
