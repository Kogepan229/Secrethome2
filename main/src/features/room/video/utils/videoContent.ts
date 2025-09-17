import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { contentVideoTable } from "@/db/schema";

export async function getVideoId(contentId: string): Promise<string | null> {
  const result = await db
    .select({ videoId: contentVideoTable.videoId })
    .from(contentVideoTable)
    .where(eq(contentVideoTable.contentId, contentId));
  return result.at(0)?.videoId ?? null;
}
