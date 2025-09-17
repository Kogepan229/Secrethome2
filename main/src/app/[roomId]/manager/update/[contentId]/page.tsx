import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import { FormContainer } from "@/components/form/FormContainer";
import { getContent } from "@/features/room/common/utils/contents";
import { getContentTags, getTagGroupsInRoom } from "@/features/room/tag/utils/tag";
import { VideoUpdateForm } from "@/features/room/video/components/VideoUpdateForm";
import { getVideoId } from "@/features/room/video/utils/videoContent";

export default async function UpdatePage({ params }: PageProps<"/[roomId]/manager/update/[contentId]">) {
  const { roomId, contentId } = await params;
  const tagGroups = getTagGroupsInRoom(roomId);
  const content = await getContent(contentId);

  if (!content) {
    return <div>コンテンツが存在しません</div>;
  }

  const videoId = await getVideoId(contentId);
  const tags = await getContentTags(contentId);

  return (
    <main>
      <FormContainer>
        <ContentsGridHeader title="動画 - 編集" />
        <VideoUpdateForm
          roomId={roomId}
          initialValue={{
            id: contentId,
            title: content.title,
            description: content.description,
            videoId,
            thumbnailId: content.thumbnailId,
          }}
          initialTags={tags}
          tagGroups={tagGroups}
        />
      </FormContainer>
    </main>
  );
}
