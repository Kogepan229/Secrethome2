import { type NextRequest, NextResponse } from "next/server";
import { getThumbnailReadStream, getThumbnailStat } from "@/features/room/common/utils/file";

export async function GET(request: NextRequest, { params }: { params: Promise<{ thumbnail_id: string }> }) {
  try {
    const stat = await getThumbnailStat((await params).thumbnail_id);
    if (!stat) {
      return new NextResponse(null, { status: 404 });
    }

    const stream = getThumbnailReadStream((await params).thumbnail_id);
    const res = new NextResponse(stream);
    res.headers.set("content-type", "image/webp");
    res.headers.set("content-length", String(stat.size));
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json(`Error while serving the file: ${e}`, { status: 500 });
  }
}
