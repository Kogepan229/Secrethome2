"use server";
import { db } from "@/db/db";
import { roomsTable } from "@/db/schema";
import { parseWithZod } from "@conform-to/zod";
import { eq } from "drizzle-orm";
import { accessRoomSchema } from "./schema";
import { redirect } from "next/navigation";

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
