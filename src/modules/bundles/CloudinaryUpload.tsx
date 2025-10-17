import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CLOUD_NAME = "dd89enrjz";
const UPLOAD_PRESET = "blom_unsigned";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface CloudinaryUploadProps {
  onChange: (urls: string[]) => void;
  value?: string[];
}

export default function CloudinaryUpload({ onChange, value = [] }: CloudinaryUploadProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File): Promise<string> {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error("Unsupported file type");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File exceeds 10MB limit");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "blom/bundles");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || "Upload failed");
    }

    const data = await res.json();
    // Transform URL to use f_auto,q_auto and suggest w=800 for thumbnails
    const url = data.secure_url as string;
    if (url.includes("/upload/")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
    }
    return url;
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        uploadedUrls.push(url);
      }
      onChange([...value, ...uploadedUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      toast.error(error);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(idx: number) {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFiles}
        disabled={busy}
        ref={inputRef}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />
      {busy && <p className="text-sm text-gray-500">Uploading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded overflow-hidden border border-gray-300">
            <img src={url} alt={`Uploaded ${i + 1}`} className="object-cover w-full h-full" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl px-1"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}