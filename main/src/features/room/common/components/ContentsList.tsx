import { db } from "@/db/db";
import { contentsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ContentPanel } from "./ContentPanel";

const LIMIT = 20;

export async function ContentsList({ roomId, page }: { roomId: string; page: number }) {
  const contents = await db
    .select()
    .from(contentsTable)
    // .where(and(eq(contentsTable.roomId, roomId), eq(contentsTable.status, "available")))
    .where(eq(contentsTable.roomId, roomId))
    .limit(LIMIT)
    .offset(LIMIT * (page - 1));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {contents.map((content) => {
        return <ContentPanel content={content} key={content.id} />;
      })}
    </div>
  );
}
