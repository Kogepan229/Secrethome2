import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import { db } from "@/db/db";
import { tagsTable } from "@/db/schema";
import { ContentsList } from "@/features/room/common/components/ContentsList";
import { PageSelector } from "@/features/room/common/components/PageSelector";
import { getCurrentPageIndex, getSpecifiedTags } from "@/features/room/common/utils/contents";
import type { SearchParams } from "@/utils/searchParams";
import { inArray } from "drizzle-orm";
import { Suspense } from "react";

async function ListHeader({ tagIds }: { tagIds: string[] }) {
  const tagNames = (await db.select({ name: tagsTable.name }).from(tagsTable).where(inArray(tagsTable.id, tagIds))).map((tag) => tag.name);

  return (
    <div className="mb-2">
      <ContentsGridHeader title={tagNames.join(", ")} />
    </div>
  );
}

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const roomId = (await params).roomId;
  const currentPage = getCurrentPageIndex(await searchParams);
  const tagIds = await getSpecifiedTags(await searchParams);

  const listHeader =
    tagIds && tagIds.length > 0 ? (
      <Suspense
        fallback={
          <div className="mb-2">
            <ContentsGridHeader title={""} />
          </div>
        }
      >
        <ListHeader tagIds={tagIds} />
      </Suspense>
    ) : null;

  return (
    <div className="mx-[5%] mb-10">
      {listHeader}
      <Suspense>
        <PageSelector roomId={roomId} tagIds={tagIds} baseURL={`/${roomId}/contents`} currentPageIndex={currentPage} />
      </Suspense>
      <Suspense>
        <ContentsList roomId={roomId} tagIds={tagIds} page={currentPage} />
      </Suspense>
      <Suspense>
        <PageSelector roomId={roomId} tagIds={tagIds} baseURL={`/${roomId}/contents`} currentPageIndex={currentPage} />
      </Suspense>
    </div>
  );
}
