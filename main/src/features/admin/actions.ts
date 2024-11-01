"use server";
import { parseWithZod } from "@conform-to/zod";
import { createRoomSchema } from "./schema";

export async function createRoomAction(prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: createRoomSchema });

  return submission.reply({ resetForm: false });
}
