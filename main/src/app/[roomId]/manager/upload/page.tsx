import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import { db } from "@/db/db";
import { tagGroupsTable } from "@/db/schema";
import { VideoContentForm } from "@/features/room/video/components/VideoContentForm";
import { eq } from "drizzle-orm";

export default async function UploadContentPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const tagGroups = db.select().from(tagGroupsTable).where(eq(tagGroupsTable.roomId, roomId)).orderBy(tagGroupsTable.order);

  return (
    <main>
      <VideoContentForm
        roomId={(await params).roomId}
        backText="戻る"
        backUrl={`/${roomId}/manager`}
        submitText={"アップロード"}
        successMessage={"アップロードしました"}
        tagGroups={tagGroups}
      />
    </main>
  );
}
