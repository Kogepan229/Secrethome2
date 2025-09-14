import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { tagGroupsTable } from "@/db/schema";

export async function GET(_request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;

  const groups = await db.select().from(tagGroupsTable).where(eq(tagGroupsTable.roomId, roomId));

  return NextResponse.json(groups);
}
