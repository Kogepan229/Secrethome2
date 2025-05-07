import { BasicButton } from "@/components/BasicButton";
import { ContentsList } from "@/features/room/common/components/ContentsList";
import { PageSelector } from "@/features/room/common/components/PageSelector";
import { getCurrentPageIndex } from "@/features/room/common/utils/contents";
import type { SearchParams } from "@/utils/searchParams";
import Link from "next/link";
import { Suspense } from "react";

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const roomId = (await params).roomId;
  const currentPage = getCurrentPageIndex(await searchParams);

  return (
    <div className="">
      <div className="flex w-full h-15 items-center">
        <div className="w-50">
          <Link href={`/${roomId}/manager`} className="block w-fit mx-auto">
            <BasicButton color="primary" className="w-45 rounded-sm">
              管理
            </BasicButton>
          </Link>
        </div>
      </div>
      <div className="flex">
        <div className="w-50">
          <div className="w-50 h-10 bg-primary text-white-primary text-center leading-10">タグ一覧</div>
        </div>
        <div className="grow basis-0">
          <div className="mx-[5%] mb-10">
            <Suspense>
              <PageSelector roomId={roomId} baseURL={`/${roomId}/contents`} currentPageIndex={currentPage} />
            </Suspense>
            <Suspense>
              <ContentsList roomId={roomId} page={currentPage} />
            </Suspense>
            <Suspense>
              <PageSelector roomId={roomId} baseURL={`/${roomId}/contents`} currentPageIndex={currentPage} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
