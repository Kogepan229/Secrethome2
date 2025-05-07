import { db } from "@/db/db";
import { contentsTable } from "@/db/schema";
import type { SearchParams } from "@/utils/searchParams";
import { and, eq } from "drizzle-orm";

export const CONTENTS_NUM_PER_PAGE = 20;

export async function getAvailableContentsCount(roomId: string): Promise<number> {
  return await db.$count(contentsTable, and(eq(contentsTable.roomId, roomId), eq(contentsTable.status, "available")));
}

export const getCurrentPageIndex = (searchParams: SearchParams) => {
  const currentPageIndex = Number(searchParams.page);
  return Number.isNaN(currentPageIndex) || currentPageIndex <= 0 ? 1 : currentPageIndex;
};
