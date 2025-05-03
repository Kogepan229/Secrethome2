import { api } from "@/utils/api";

export async function uploadThumbnail(file: File, contentId: string) {
  const formdata = new FormData();
  formdata.append("id", contentId);
  formdata.append("thumbnail", file);

  const res = await api.post("/thumbnail/upload", { body: formdata });
  return res.ok;
}
