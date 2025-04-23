import { ContentsGridHeader } from "@/components/ContentsGridHeader";
import Link from "next/link";

export default async function ManagerPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const LinkItem = ({ url, text }: { url: string; text: string }) => {
    return (
      <div className="[div+&]:border-t [div+&]:border-t-border-gray">
        <Link href={url}>
          <div className="pl-5 leading-12">{text}</div>
        </Link>
      </div>
    );
  };

  const { roomId } = await params;

  return (
    <main className="max-w-125 m-auto my-12 px-5">
      <ContentsGridHeader title={"管理"} />
      <div className="border border-border-gray">
        <LinkItem url={`/${roomId}/manager/upload`} text={"コンテンツ追加"} />
        <LinkItem url={`/${roomId}/manager/tags`} text={"タグ管理"} />
      </div>
    </main>
  );
}
