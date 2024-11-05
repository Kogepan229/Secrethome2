import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import * as css from "./page.css";
import Link from "next/link";
import { RoomList } from "@/features/admin/components/RoomList";

export default function AdminPage() {
  return (
    <main className={css.main}>
      <ContentsGridHeader title="ルームリスト" />
      <Link href="/admin/create">
        <button type="button" className={css.create_button}>
          新規作成
        </button>
      </Link>
      <RoomList />
    </main>
  );
}
