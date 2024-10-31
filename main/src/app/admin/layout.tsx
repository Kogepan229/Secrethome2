import { RoomHeader } from "@/components/RoomHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <RoomHeader roomName={"Admin"} link={"/admin"} />
      {children}
    </>
  );
}
