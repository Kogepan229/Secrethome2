export function getVideoUrl(videoId: string) {
  return `${process.env.NEXT_PUBLIC_FILES_URL}/video/${videoId}/playlist.m3u8`;
}
