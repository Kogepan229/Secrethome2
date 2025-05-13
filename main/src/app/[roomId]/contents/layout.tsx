import { BasicButton } from "@/components/BasicButton";
import { SideBar } from "@/features/room/common/components/SideBar";
import Link from "next/link";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ roomId: string }>;
}>) {
  const { roomId } = await params;
  return (
    <div className="">
      <div className="flex w-full h-15 items-center">
        <div className="w-50">
          <Link href={`/${roomId}/manager`} className="block w-fit mx-auto">
            <BasicButton color="primary" className="w-45 rounded-sm">
              管理
            </BasicButton>
          </Link>
        </div>
      </div>
      <div className="flex">
        <SideBar roomId={roomId} />
        <div className="grow basis-0">{children}</div>
      </div>
    </div>
  );
}
