import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import Link from "next/link";
import * as css from "./page.css";

export default async function ManagerPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const LinkItem = ({ url, text }: { url: string; text: string }) => {
    return (
      <div className={css.link_item_wrapper}>
        <Link href={url}>
          <div className={css.link_item}>{text}</div>
        </Link>
      </div>
    );
  };

  return (
    <main className={css.main}>
      <ContentsGridHeader title={"管理"} />
      <div className={css.link_item_container}>
        <LinkItem url={`/${(await params).roomId}/manager/upload`} text={"コンテンツ追加"} />
      </div>
    </main>
  );
}
