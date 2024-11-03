"use server";
import { parseWithZod } from "@conform-to/zod";
import { createRoomSchema } from "./schema";
import { roomsTable } from "@/db/schema";
import { db } from "@/db/db";
import { DatabaseError } from "pg";

export async function createRoomAction(_prev: unknown, formData: FormData) {
  // formData.set("custom_description_list", JSON.stringify([]));
  const g = await db.select().from(roomsTable);
  console.log("g", g[0]);

  const submission = parseWithZod(formData, { schema: createRoomSchema });
  console.log(submission.reply());
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
