import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import { VideoContentForm } from "@/features/room/video/components/VideoContentForm";

export default async function UploadContentPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  return (
    <main>
      <VideoContentForm
        roomId={(await params).roomId}
        backText="戻る"
        backUrl={`/${(await params).roomId}/manager`}
        submitText={"アップロード"}
        successMessage={"アップロードしました"}
      />
    </main>
  );
}
