export function useCloudinaryUpload() {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
  const FOLDER = (import.meta.env.VITE_CLOUDINARY_FOLDER as string) || "blom/products";

  async function uploadOne(file: File): Promise<string> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error("Cloudinary envs missing");
    if (file.size > 10 * 1024 * 1024) throw new Error(`"${file.name}" exceeds 10MB`);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    fd.append("folder", FOLDER);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: "POST",
      body: fd,
    });
    const j = await res.json();
    if (!res.ok || j.error) throw new Error(j.error?.message || "Upload failed");
    return j.secure_url as string;
  }

  return { uploadOne };
}