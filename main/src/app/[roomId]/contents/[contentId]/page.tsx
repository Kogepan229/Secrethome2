import { and, eq } from "drizzle-orm";
import Linkify from "linkify-react";
import Link from "next/link";
import { BasicButton } from "@/components/BasicButton";
import { db } from "@/db/db";
import { contentsTable } from "@/db/schema";
import { VideoPlayer } from "@/features/room/video/components/VideoPlayer";
import { getVideoId } from "@/features/room/video/utils/videoContent";
import { getVideoUrl } from "@/features/room/video/utils/videoUrl";

export default async function ContentPage({ params }: PageProps<"/[roomId]/contents/[contentId]">) {
  const { roomId, contentId } = await params;
  const content = (
    await db
      .select()
      .from(contentsTable)
      .where(and(eq(contentsTable.id, contentId), eq(contentsTable.status, "available")))
  ).at(0);

  if (!content) {
    return <div>コンテンツが存在しません</div>;
  }

  const videoId = await getVideoId(contentId);

  return (
    <div className="w-[90%] max-w-220 m-auto">
      {videoId ? <VideoPlayer src={getVideoUrl(videoId)} /> : <div>ビデオが存在しません</div>}
      <div>
        <div className="flex mt-1">
          <div className="grow">
            <span className="text-black-primary text-2xl font-bold">{content.title}</span>
          </div>
          <Link href={`/${roomId}/manager/update/${contentId}`}>
            <BasicButton className="min-w-15">更新</BasicButton>
          </Link>
        </div>
        <div className="mt-2 p-2 rounded-md bg-gray-200/60 [&>a]:text-cyan-700">
          <Linkify options={{ nl2br: true, target: "_blank" }}>{content.description}</Linkify>
        </div>
      </div>
    </div>
  );
}
