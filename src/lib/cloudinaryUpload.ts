export async function uploadToCloudinary(
  file: File,
  {
    cloudName = "dd89enrjz",
    uploadPreset = "blom_unsigned",
    folder = "products",
    tags = ["dyadd"],
  } = {}
): Promise<any> {
  if (!file) throw new Error("No file selected.");

  const maxBytes = 8 * 1024 * 1024; // 8MB
  if (file.size > maxBytes) {
    throw new Error("Please upload an image smaller than 8MB.");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", uploadPreset);
  data.append("folder", folder);
  data.append("tags", tags.join(","));

  const res = await fetch(url, { method: "POST", body: data });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Upload failed");
  }
  return res.json();
}