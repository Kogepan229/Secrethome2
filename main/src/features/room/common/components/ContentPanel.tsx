import Image from "next/image";
import Link from "next/link";
import type { ContentSchema } from "../schema";

export function ContentPanel({ content }: { content: ContentSchema }) {
  return (
    <div className="h-90 p-1">
      <div className="w-full h-full border border-border-gray rounded-sm duration-200 hover:-translate-y-1 hover:shadow-md">
        <Link href={`/${content.roomId}/contents/${content.id}`} className="block w-full h-full">
          <div className="relative w-full h-50">
            <Image
              src={`${process.env.NEXT_PUBLIC_FILES_URL}/thumbnail/${content.thumbnailId}.webp`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              alt="thumbnail"
            />
          </div>
          <div className="py-1 px-2">
            <span className="font-bold text-black-primary overflow-hidden wrap-break-word">{content.title}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
