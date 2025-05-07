import { ContentsList } from "@/features/room/common/components/ContentsList";
import { Suspense } from "react";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const roomId = (await params).roomId;

  return (
    <div className="w-[80%] mx-auto">
      <Suspense>
        <ContentsList roomId={roomId} page={1} />
      </Suspense>
    </div>
  );
}
