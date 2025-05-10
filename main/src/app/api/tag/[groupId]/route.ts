import { db } from "@/db/db";
import { tagsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const groups = await db.select().from(tagsTable).where(eq(tagsTable.groupId, groupId));

  return NextResponse.json(groups);
}
