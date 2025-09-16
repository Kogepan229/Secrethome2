import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import { FormContainer } from "@/components/form/FormContainer";
import { getTagGroupsInRoom } from "@/features/room/tag/utils/tag";
import { VideoUploadForm } from "@/features/room/video/components/VideoUploadForm";

export default async function UploadContentPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const tagGroups = getTagGroupsInRoom(roomId);

  return (
    <main>
      <FormContainer>
        <ContentsGridHeader title="動画アップロード" />
        <VideoUploadForm roomId={(await params).roomId} tagGroups={tagGroups} />
      </FormContainer>
    </main>
  );
}
