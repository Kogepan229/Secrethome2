import { db } from "@/db/db";
import { contentsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ roomId: string; contentId: string }>;
}) {
  const { contentId } = await params;
  const content = (
    await db
      .select()
      .from(contentsTable)
      .where(and(eq(contentsTable.id, contentId), eq(contentsTable.status, "available")))
  ).at(0);
  if (!content) {
    return <div>コンテンツが存在しません</div>;
  }

  return (
    <div>
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video />
      <div>
        <div>
          <span>{content.title}</span>
        </div>
        <span>{content.description}</span>
      </div>
    </div>
  );
}
