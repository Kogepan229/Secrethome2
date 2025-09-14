"use server";
import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/db/db";
import { roomsTable } from "@/db/schema";

export async function RoomList() {
  await connection();
  const rooms = await db.select().from(roomsTable).orderBy(roomsTable.createdAt);
  const roomList = rooms.map((room) => {
    return (
      <div key={room.id} className="[div+&]:border-t [div+&]:border-border-light-gray">
        <Link href={`/admin/${room.id}/update`}>
          <div className="p-4 hover:bg-hover-gray">
            <span className="font-bold">{room.name}</span>
            <div className="grid gap-x-2 mt-2 grid-cols-1 sm:grid-cols-[auto_1fr]">
              <span className="font-bold">タイプ</span>
              <span>{room.roomType}</span>
              <span className="font-bold">Access Key</span>
              <span>{room.accessKey}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  });

  return <div className="mb-12 border rounded-sm border-border-light-gray">{roomList}</div>;
}
