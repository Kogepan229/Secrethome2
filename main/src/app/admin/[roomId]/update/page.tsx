import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { roomsTable } from "@/db/schema";
import { RoomForm } from "@/features/admin/components/RoomForm";

export default async function UpdateRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const roomData = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.id, (await params).roomId));

  if (roomData.length !== 1) {
    return <main>ルームが見つかりません</main>;
  }

  return (
    <main>
      <RoomForm initialValue={roomData[0]} backText="戻る" backUrl="/admin" submitText="更新" successMessage="更新しました" />
    </main>
  );
}
