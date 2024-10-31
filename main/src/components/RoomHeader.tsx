import Link from "next/link";
import * as css from "./RoomHeader.css";

export const RoomHeader = ({ roomName, link }: { roomName: string; link: string }) => {
  return (
    <header className={css.room_header}>
      <Link href={"/"}>
        <div className={css.logo}>Secret Home</div>
      </Link>
      <Link href={link}>
        <div className={css.room_name}>{roomName}</div>
      </Link>
    </header>
  );
};
