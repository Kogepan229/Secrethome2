import { permanentRedirect } from "next/navigation";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  permanentRedirect(`/${(await params).roomId}/contents`);
}
