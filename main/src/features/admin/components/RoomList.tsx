"use server";
import { db } from "@/db/db";
import { roomsTable } from "@/db/schema";
import * as css from "./RoomList.css";
import Link from "next/link";

export async function RoomList() {
  const rooms = await db.select().from(roomsTable).orderBy(roomsTable.createdAt);
  const roomList = rooms.map((room) => {
    return (
      <div className={css.panel_wrapper} key={room.id}>
        <Link href={`/admin/${room.id}/update`}>
          <div className={css.panel}>
            <span className={css.info_name}>{room.name}</span>
            <div className={css.info_grid}>
              <span className={css.info_title}>タイプ</span>
              <span>{room.roomType}</span>
              <span className={css.info_title}>Access Key</span>
              <span>{room.accessKey}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  });

  return <div className={css.container}>{roomList}</div>;
}
