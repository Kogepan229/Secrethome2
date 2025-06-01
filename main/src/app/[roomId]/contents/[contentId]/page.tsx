import { db } from "@/db/db";
import { contentsTable } from "@/db/schema";
import { VideoPlayer } from "@/features/room/video/components/VideoPlayer";
import { and, eq } from "drizzle-orm";
import Linkify from "linkify-react";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ roomId: string; contentId: string }>;
}) {
  const { contentId } = await params;
  const content = (
    await db
      .select()
      .from(contentsTable)
      .where(and(eq(contentsTable.id, contentId), eq(contentsTable.status, "available")))
  ).at(0);

  if (!content) {
    return <div>コンテンツが存在しません</div>;
  }

  return (
    <div className="w-[90%] max-w-220 m-auto">
      <VideoPlayer src={`${process.env.NEXT_PUBLIC_FILES_URL}/video/${contentId}/playlist.m3u8`} />
      <div>
        <div className="mt-1 text-black-primary">
          <span className="text-2xl font-bold">{content.title}</span>
        </div>
        <div className="mt-2 p-2 rounded-md bg-gray-200/60 [&>a]:text-cyan-700">
          <Linkify options={{ nl2br: true, target: "_blank" }}>{content.description}</Linkify>
        </div>
      </div>
    </div>
  );
}
