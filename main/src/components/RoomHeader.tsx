import Link from "next/link";

export const RoomHeader = ({ roomName, link }: { roomName: string; link: string }) => {
  return (
    <header className="flex w-full h-header relative justify-center bg-primary">
      <Link href={"/"}>
        <div className="absolute left-5 text-white-primary leading-(--h-header) text-2xl cursor-pointer font-oswald">Secret Home</div>
      </Link>
      <Link href={link}>
        <div className="text-white-primary leading-(--h-header) text-2xl cursor-pointer font-oswald">{roomName}</div>
      </Link>
    </header>
  );
};
