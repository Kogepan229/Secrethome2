import { and, count, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/db";
import { contentsTable, contentTagsTable } from "@/db/schema";
import type { SearchParams } from "@/utils/searchParams";

export const CONTENTS_NUM_PER_PAGE = 20;

export async function getAvailableContentsCount(roomId: string, tagIds: string[] | undefined): Promise<number> {
  if (tagIds) {
    const result = await db
      .select({ count: count() })
      .from(contentTagsTable)
      .innerJoin(contentsTable, eq(contentTagsTable.contentId, contentsTable.id))
      .where(inArray(contentTagsTable.tagId, tagIds))
      .groupBy(contentsTable.id)
      .having(({ count }) => eq(count, tagIds.length));

    return result.length;
  }
  return db.$count(contentsTable, and(eq(contentsTable.roomId, roomId), eq(contentsTable.status, "available")));
}

export const getCurrentPageIndex = (searchParams: SearchParams) => {
  const currentPageIndex = Number(searchParams.page);
  return Number.isNaN(currentPageIndex) || currentPageIndex <= 0 ? 1 : currentPageIndex;
};

const searchParamsSchema = z.optional(
  z.union([z.string(), z.array(z.string())]).transform((value) => (Array.isArray(value) ? value : [value])),
);

export async function getSpecifiedTags(searchParams: SearchParams): Promise<string[] | undefined> {
  searchParams.tags;
  const parsed = await searchParamsSchema.safeParseAsync(searchParams.tags);

  if (!parsed.success) return undefined;
  return parsed.data;
}
