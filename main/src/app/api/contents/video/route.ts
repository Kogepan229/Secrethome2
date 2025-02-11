import { db } from "@/db/db";
import { contentsTable } from "@/db/schema";
import { saveThumbnail } from "@/features/room/common/utils/file";
import { uploadVideoContentSchema } from "@/features/room/video/schema";
import { parseWithZod } from "@conform-to/zod";
import { createId } from "@paralleldrive/cuid2";
import { after, NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: uploadVideoContentSchema });
  if (submission.status !== "success") {
    return NextResponse.json(submission.reply());
  }

  console.log(submission.value.thumbnail);
  const result = await db
    .insert(contentsTable)
    .values({ roomId: submission.value.roomId, title: submission.value.title, description: submission.value.description })
    .returning({ id: contentsTable.id });
  if (result.length !== 1) {
    return NextResponse.json(submission.reply({ formErrors: ["Failed to insert data to DB."] }));
  }
  const id = result[0].id;

  after(async () => {
    await saveThumbnail(id, submission.value.thumbnail);
  });

  return NextResponse.json(submission.reply());
}
