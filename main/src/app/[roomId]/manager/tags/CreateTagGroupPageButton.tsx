import { BasicButton } from "@/components/BasicButton";
import Link from "next/link";

export function CreateTagGroupPageButton({ roomId }: { roomId: string }) {
  return (
    <Link href={`/${roomId}/manager/tags/create`}>
      <BasicButton className="mb-2">タググループ作成</BasicButton>
    </Link>
  );
}
