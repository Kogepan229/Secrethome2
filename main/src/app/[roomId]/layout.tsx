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
  const data = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.id, (await params).roomId));
  if (data.length !== 1) {
    return <div>ルームが見つかりません</div>;
  }
  return (
    <>
      <RoomHeader roomName={data[0].name} link={`/${data[0].id}/contents`} />
      {children}
    </>
  );
}
