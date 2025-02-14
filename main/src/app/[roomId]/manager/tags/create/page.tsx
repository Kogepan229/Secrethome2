import { TagGroupForm } from "@/features/room/tag/components/TagGroupForm";

export default async function TagsManagerPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;

  return (
    <main>
      <TagGroupForm roomId={roomId} backText="戻る" backUrl={`/${roomId}/manager/tags`} submitText="作成" successMessage="作成しました" />
    </main>
  );
}
