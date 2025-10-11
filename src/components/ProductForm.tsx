import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUploader from "./ImageUploader";
import { slugify } from "@/lib/slugify";
import { validateDraft } from "@/lib/validators";
import type { ProductDraft } from "@/types/product";

type Props = {
  value: ProductDraft;
  onChange: (p: ProductDraft) => void;
  onSave: (p: ProductDraft) => Promise<void>;
  onPublish: (slug: string) => Promise<void>;
};

export default function ProductForm({ value, onChange, onSave, onPublish }: Props) {
  const [busy, setBusy] = useState(false);

  function patch<K extends keyof ProductDraft>(k: K, v: ProductDraft[K]) {
    onChange({ ...value, [k]: v });
  }

  async function handleSave() {
    const errs = validateDraft(value);
    if (errs.length) {
      alert("Fix:\n- " + errs.join("\n- "));
      return;
    }
    setBusy(true);
    try {
      await onSave(value);
    } catch (error) {
      alert(`Save failed: ${error}`);
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    const errs = validateDraft(value);
    if (errs.length) {
      alert("Fix:\n- " + errs.join("\n- "));
      return;
    }
    const slug = slugify(value.title);
    setBusy(true);
    try {
      await onPublish(slug);
    } catch (error) {
      alert(`Publish failed: ${error}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Product Title *</Label>
        <Input 
          id="title"
          placeholder="Enter product title" 
          value={value.title} 
          onChange={e => patch("title", e.target.value)} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (ZAR) *</Label>
        <Input 
          id="price"
          type="number" 
          placeholder="0.00" 
          value={value.price || ""} 
          onChange={e => patch("price", Number(e.target.value))} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input 
          id="subtitle"
          placeholder="Product subtitle" 
          value={value.subtitle || ""} 
          onChange={e => patch("subtitle", e.target.value)} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea 
          id="shortDescription"
          placeholder="Brief product description" 
          value={value.shortDescription || ""} 
          onChange={e => patch("shortDescription", e.target.value)} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionHtml">Full Description (HTML allowed)</Label>
        <Textarea 
          id="descriptionHtml"
          placeholder="Detailed product description with HTML formatting" 
          value={value.descriptionHtml || ""} 
          onChange={e => patch("descriptionHtml", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Product Images</Label>
        <ImageUploader onDone={(urls) => patch("images", [...(value.images || []), ...urls])} />
        <div className="text-xs text-muted-foreground">
          First image becomes thumbnail. Supported: JPG, PNG, WebP, GIF (max 10MB each)
        </div>
        {value.images && value.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {value.images.map((url: string, i: number) => (
              <div key={i} className="relative">
                <img src={url} alt={`Product ${i + 1}`} className="w-full h-20 object-cover rounded border" />
                <button
                  onClick={() => patch("images", value.images?.filter((_: string, idx: number) => idx !== i))}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} disabled={busy} variant="outline">
          💾 Save Draft
        </Button>
        <Button onClick={handlePublish} disabled={busy}>
          🚀 Publish
        </Button>
      </div>
    </div>
  );
}