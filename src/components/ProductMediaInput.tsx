import React, { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { buildImageSet } from "@/lib/cloudinaryUrl";

interface ProductMediaInputProps {
  value: {
    thumbnailId?: string;
    imageIds?: string[];
  };
  onChange?: (media: { thumbnailId?: string; imageIds?: string[] }) => void;
  folder?: string;
}

export default function ProductMediaInput({
  value,
  onChange,
  folder = "products",
}: ProductMediaInputProps) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const thumbnailId = value?.thumbnailId || "";
  const imageIds = value?.imageIds || [];

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    cb: (id: string) => void
  ) {
    setErr("");
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      const result = await uploadToCloudinary(file, {
        folder,
      });
      cb(result.public_id);
      e.target.value = "";
    } catch (e) {
      setErr(String((e as Error).message || e));
    } finally {
      setBusy(false);
    }
  }

  function setThumbnail(id: string) {
    onChange?.({ thumbnailId: id, imageIds });
  }
  function addImage(id: string) {
    onChange?.({ thumbnailId, imageIds: [...imageIds, id] });
  }
  function removeImage(idx: number) {
    const next = imageIds.slice();
    next.splice(idx, 1);
    onChange?.({ thumbnailId, imageIds: next });
  }

  const thumbPreview = thumbnailId ? buildImageSet(thumbnailId).card : "";

  return (
    <div className="media-field space-y-4">
      <h3 className="text-lg font-semibold">Product Media</h3>

      <div className="media-row flex items-center gap-4">
        <div>
          <label className="block mb-1 font-medium">Thumbnail</label>
          <div className="flex items-center gap-3">
            {thumbPreview ? (
              <img
                src={thumbPreview}
                alt="Thumbnail"
                width={120}
                height={120}
                className="object-cover rounded-lg border"
              />
            ) : (
              <div className="w-30 h-30 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No thumbnail
              </div>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
              onChange={(e) => handleUpload(e, setThumbnail)}
              disabled={busy}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="media-row mt-4">
        <label className="block mb-1 font-medium">Gallery</label>
        <div className="flex flex-wrap gap-3 items-center">
          {imageIds.map((id, i) => {
            const p = buildImageSet(id).thumb;
            return (
              <div key={id} className="relative">
                <img
                  src={p}
                  alt={`Gallery ${i + 1}`}
                  width={96}
                  height={96}
                  className="object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 rounded-full bg-black text-white w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            );
          })}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
            onChange={(e) => handleUpload(e, addImage)}
            disabled={busy}
            className="cursor-pointer"
          />
        </div>
      </div>

      {busy && <p className="text-sm text-gray-500">Uploading…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
    </div>
  );
}