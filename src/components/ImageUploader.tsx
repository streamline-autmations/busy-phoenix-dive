import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

interface ImageUploaderProps {
  onDone: (urls: string[]) => void;
}

export default function ImageUploader({ onDone }: ImageUploaderProps) {
  const { uploadOne } = useCloudinaryUpload();
  const [busy, setBusy] = useState(false);

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files.length) return;
    
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        const url = await uploadOne(f);
        urls.push(url);
      }
      onDone(urls);
    } catch (error) {
      alert(`Upload failed: ${error}`);
    } finally {
      setBusy(false);
      e.currentTarget.value = ""; // reset
    }
  }

  return (
    <div className="space-y-2">
      <input 
        type="file" 
        multiple 
        accept=".jpg,.jpeg,.png,.webp,.gif" 
        onChange={handle} 
        disabled={busy}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <Button variant="secondary" disabled={busy}>
        {busy ? "Uploading…" : "Upload images"}
      </Button>
    </div>
  );
}