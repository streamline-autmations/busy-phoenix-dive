export function useCloudinaryUpload() {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
  const FOLDER = (import.meta.env.VITE_CLOUDINARY_FOLDER as string) || "blom/products";

  async function uploadOne(file: File): Promise<string> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary environment variables are missing. Please check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET");
    }
    
    if (file.size > 10 * 1024 * 1024) {
      throw new Error(`File "${file.name}" exceeds 10MB limit`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", FOLDER);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        throw new Error(result.error?.message || "Upload failed");
      }
      
      return result.secure_url as string;
    } catch (error) {
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { uploadOne };
}