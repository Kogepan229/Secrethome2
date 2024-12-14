"use server";
import { parseWithZod } from "@conform-to/zod";
import { createRoomSchema, updateRoomSchema } from "./schema";
import { roomsTable } from "@/db/schema";
import { db } from "@/db/db";
import { DatabaseError } from "pg";
import { eq } from "drizzle-orm";

export async function createRoomAction(_prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: createRoomSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await db.insert(roomsTable).values(submission.value);
    return submission.reply();
  } catch (e) {
    if (e instanceof DatabaseError) {
      if (e.constraint === "rooms_access_key_unique") {
        return submission.reply({ fieldErrors: { accessKey: ["指定されたキーは既に使用されています"] } });
      }
    }
    console.error(e);
    return submission.reply({ formErrors: ["不明なエラーが発生しました"] });
  }
}

export async function updateRoomAction(_prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: updateRoomSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    console.log(submission.value);
    await db.update(roomsTable).set(submission.value).where(eq(roomsTable.id, submission.value.id!));
    return submission.reply();
  } catch (e) {
    if (e instanceof DatabaseError) {
      if (e.constraint === "rooms_access_key_unique") {
        return submission.reply({ fieldErrors: { accessKey: ["指定されたキーは既に使用されています"] } });
      }
    }
    console.error(e);
    return submission.reply({ formErrors: ["不明なエラーが発生しました"] });
  }
}
