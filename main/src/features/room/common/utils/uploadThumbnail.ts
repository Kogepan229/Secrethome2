import { api } from "@/utils/api";

export async function uploadThumbnail(file: File, contentId: string) {
  const formdata = new FormData();
  formdata.append("id", contentId);
  formdata.append("thumbnail", file);

  try {
    const res = await api.post("thumbnail/upload", { body: formdata });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}
