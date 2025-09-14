import Link from "next/link";
import { BasicButton } from "@/components/BasicButton";

export function CreateTagGroupPageButton({ roomId }: { roomId: string }) {
  return (
    <Link href={`/${roomId}/manager/tags/create`}>
      <BasicButton className="mb-2">タググループ作成</BasicButton>
    </Link>
  );
}
