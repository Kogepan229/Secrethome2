import Link from "next/link";
import { BasicButton } from "@/components/BasicButton";
import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import { RoomList } from "@/features/admin/components/RoomList";

export default function AdminPage() {
  return (
    <main className="w-[60%] m-auto mt-12">
      <ContentsGridHeader title="ルームリスト" />
      <Link href="/admin/create">
        <BasicButton className="w-fit my-2">新規作成</BasicButton>
      </Link>
      <RoomList />
    </main>
  );
}
