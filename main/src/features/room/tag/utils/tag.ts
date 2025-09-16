import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { tagGroupsTable } from "@/db/schema";

export async function getTagGroupsInRoom(roomId: string) {
  return db.select().from(tagGroupsTable).where(eq(tagGroupsTable.roomId, roomId)).orderBy(tagGroupsTable.order);
}
