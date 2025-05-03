export function objectToFormData(
  object:
    | {
        [s: string]: string | null;
      }
    | ArrayLike<string | null>,
) {
  const entries = Object.entries<string | null>(object);
  const formData = new FormData();
  // formData.append(e)
  for (const [key, value] of entries) {
    if (value !== null) {
      formData.append(key, value);
    }
  }
  return formData;
}
