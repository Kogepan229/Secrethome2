export function getContentPageUrl(roomId: string, contentId: string) {
  return `/${roomId}/contents/${contentId}`;
}

export function getThumbnailUrl(thumbnailId: string) {
  return `${process.env.NEXT_PUBLIC_FILES_URL}/thumbnail/${thumbnailId}.webp`;
}
