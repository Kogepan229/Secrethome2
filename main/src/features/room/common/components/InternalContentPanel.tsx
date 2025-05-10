"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, use } from "react";
import type { ContentSchema, TagSchema } from "../schema";

function Info({
  content,
  tagsWithGroup,
}: {
  content: ContentSchema;
  tagsWithGroup: Promise<{
    [groupId: string]: TagSchema[];
  }>;
}) {
  const tags = Object.entries(use(tagsWithGroup)).map((entry) => {
    const group = entry[0];
    const tags = entry[1];
    const tagElements = tags.map((tag) => {
      return (
        <Link href={""} key={tag.id}>
          <span
            className="h-6 cursor-pointer px-1 pb-0.5 border border-border-gray rounded-md text-sm shadow leading-6 hover:bg-hover-gray"
            onClick={(e) => e.stopPropagation()}
          >
            {tag.name}
          </span>
        </Link>
      );
    });

    return (
      <div className="flex flex-wrap w-full gap-x-1 gap-y-0.5" key={group}>
        {tagElements}
      </div>
    );
  });

  return (
    <div className="grow py-1 px-2">
      <span className="font-bold text-black-primary overflow-hidden wrap-break-word">{content.title}</span>
      <div className="flex flex-col gap-1 mt-1">{tags}</div>
    </div>
  );
}

export function InternalContentPanel({
  content,
  tagsWithGroup,
}: {
  content: ContentSchema;
  tagsWithGroup: Promise<{
    [groupId: string]: TagSchema[];
  }>;
}) {
  const router = useRouter();
  const contentLink = `/${content.roomId}/contents/${content.id}`;
  return (
    <div className="h-90 p-1 cursor-pointer" onClick={() => router.push(contentLink)}>
      <div className="w-full h-full border border-border-gray rounded-sm duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="w-full h-50">
          <Link href={contentLink} className="block relative w-full h-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_FILES_URL}/thumbnail/${content.thumbnailId}.webp`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              alt="thumbnail"
            />
          </Link>
        </div>
        <Suspense>
          <Info content={content} tagsWithGroup={tagsWithGroup} />
        </Suspense>
      </div>
    </div>
  );
}
