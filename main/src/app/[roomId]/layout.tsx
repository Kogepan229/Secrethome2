import { eq } from "drizzle-orm";
import { RoomHeader } from "@/components/RoomHeader";
import { db } from "@/db/db";
import { roomsTable } from "@/db/schema";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ roomId: string }>;
}>) {
  const result = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.id, (await params).roomId));
  const room = result.at(0);

  if (!room) {
    return <div>ルームが見つかりません</div>;
  }
  return (
    <>
      <RoomHeader roomName={room.name} link={`/${room.id}/contents`} />
      {children}
    </>
  );
}
