import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
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
  const [newTag, setNewTag] = useState("");
  const [newBadge, setNewBadge] = useState("");

  function patch<K extends keyof ProductDraft>(k: K, v: ProductDraft[K]) {
    onChange({ ...value, [k]: v });
  }

  function addTag() {
    if (newTag.trim() && !value.tags?.includes(newTag.trim())) {
      patch("tags", [...(value.tags || []), newTag.trim()]);
      setNewTag("");
    }
  }

  function removeTag(tagToRemove: string) {
    patch("tags", value.tags?.filter(tag => tag !== tagToRemove));
  }

  function addBadge() {
    if (newBadge.trim() && !value.badges?.includes(newBadge.trim())) {
      patch("badges", [...(value.badges || []), newBadge.trim()]);
      setNewBadge("");
    }
  }

  function removeBadge(badgeToRemove: string) {
    patch("badges", value.badges?.filter(badge => badge !== badgeToRemove));
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
        {value.title && (
          <div className="text-xs text-muted-foreground">
            Slug: <code>{slugify(value.title)}</code>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (ZAR) *</Label>
          <Input 
            id="price"
            type="number" 
            step="0.01"
            placeholder="0.00" 
            value={value.price || ""} 
            onChange={e => patch("price", Number(e.target.value))} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compareAt">Compare At Price (ZAR)</Label>
          <Input 
            id="compareAt"
            type="number" 
            step="0.01"
            placeholder="0.00" 
            value={value.compareAt || ""} 
            onChange={e => patch("compareAt", Number(e.target.value))} 
          />
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={value.category || ""} onValueChange={v => patch("category", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="beauty">Beauty</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input 
            id="sku"
            placeholder="Product SKU" 
            value={value.sku || ""} 
            onChange={e => patch("sku", e.target.value)} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea 
          id="shortDescription"
          placeholder="Brief product description" 
          value={value.shortDescription || ""} 
          onChange={e => patch("shortDescription", e.target.value)}
          rows={2}
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
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input 
            placeholder="Add tag" 
            value={newTag} 
            onChange={e => setNewTag(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline" size="sm">
            Add
          </Button>
        </div>
        {value.tags && value.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {value.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Badges</Label>
        <div className="flex gap-2">
          <Input 
            placeholder="Add badge (e.g., New, Sale, Featured)" 
            value={newBadge} 
            onChange={e => setNewBadge(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addBadge())}
          />
          <Button type="button" onClick={addBadge} variant="outline" size="sm">
            Add
          </Button>
        </div>
        {value.badges && value.badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {value.badges.map(badge => (
              <Badge key={badge} className="flex items-center gap-1">
                {badge}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeBadge(badge)}
                />
              </Badge>
            ))}
          </div>
        )}
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
              <div key={i} className="relative group">
                <img src={url} alt={`Product ${i + 1}`} className="w-full h-20 object-cover rounded border" />
                <button
                  onClick={() => patch("images", value.images?.filter((_: string, idx: number) => idx !== i))}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                {i === 0 && (
                  <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                    Thumbnail
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleSave} disabled={busy} variant="outline" className="flex-1">
          💾 Save Draft
        </Button>
        <Button onClick={handlePublish} disabled={busy} className="flex-1">
          🚀 Publish
        </Button>
      </div>
    </div>
  );
}