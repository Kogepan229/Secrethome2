import { db } from "@/db/db";
import { contentsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { CONTENTS_NUM_PER_PAGE } from "../utils/contents";
import { ContentPanel } from "./ContentPanel";

export async function ContentsList({ roomId, page }: { roomId: string; page: number }) {
  const contents = await db
    .select()
    .from(contentsTable)
    .where(and(eq(contentsTable.roomId, roomId), eq(contentsTable.status, "available")))
    .limit(CONTENTS_NUM_PER_PAGE)
    .offset(CONTENTS_NUM_PER_PAGE * (page - 1));

  return (
    <div className="grid my-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {contents.map((content) => {
        return <ContentPanel content={content} key={content.id} />;
      })}
    </div>
  );
}
