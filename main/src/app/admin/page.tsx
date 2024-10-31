import * as css from "./page.css";
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className={css.main}>
      <Link href="/admin/create">
        <button type="button" className={css.create_button}>
          新規作成
        </button>
      </Link>
    </main>
  );
}
