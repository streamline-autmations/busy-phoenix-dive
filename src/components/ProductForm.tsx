import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import ProductMediaInput from "./ProductMediaInput";

interface ProductFormValue {
  title?: string;
  slug?: string;
  price?: number;
  currency?: string;
  status?: string;
  thumbnailId?: string;
  imageIds?: string[];
  tags?: string[];
  badges?: string[];
  shortDescription?: string;
  overview?: string;
  features?: string[];
  howToUse?: string[];
  ingredients?: {
    inci?: string[];
    key?: string[];
  };
  details?: {
    size?: string;
    shelfLife?: string;
    claims?: string[];
  };
  category?: string;
  variants?: { name: string; image: string }[];
  rating?: number;
  reviewCount?: number;
}

interface ProductFormProps {
  value: ProductFormValue;
  onChange: (updates: Partial<ProductFormValue>) => void;
  onSave?: () => void;
  onPublish?: () => void;
}

export default function ProductForm({
  value,
  onChange,
  onSave,
  onPublish,
}: ProductFormProps) {
  const [newTag, setNewTag] = useState("");
  const [newBadge, setNewBadge] = useState("");

  function patch(updates: Partial<ProductFormValue>) {
    onChange({ ...value, ...updates });
  }

  function addTag() {
    if (newTag.trim() && !value.tags?.includes(newTag.trim())) {
      patch({ tags: [...(value.tags || []), newTag.trim()] });
      setNewTag("");
    }
  }

  function removeTag(tagToRemove: string) {
    patch({ tags: value.tags?.filter((tag) => tag !== tagToRemove) });
  }

  function addBadge() {
    if (newBadge.trim() && !value.badges?.includes(newBadge.trim())) {
      patch({ badges: [...(value.badges || []), newBadge.trim()] });
      setNewBadge("");
    }
  }

  function removeBadge(badgeToRemove: string) {
    patch({ badges: value.badges?.filter((badge) => badge !== badgeToRemove) });
  }

  return (
    <div className="space-y-4">
      {/* Other form fields for title, price, etc. */}

      <div className="space-y-2">
        <Label>Product Media</Label>
        <ProductMediaInput
          value={{
            thumbnailId: value.thumbnailId,
            imageIds: value.imageIds,
          }}
          onChange={(media) => patch(media)}
          folder="products"
        />
        <div className="text-xs text-muted-foreground">
          First image becomes thumbnail. Supported: JPG, PNG, WebP, GIF (max 8MB each)
        </div>
      </div>

      {/* Tags and badges inputs as before */}

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={onSave} variant="outline" className="flex-1">
          💾 Save Draft
        </Button>
        <Button onClick={onPublish} className="flex-1">
          🚀 Publish
        </Button>
      </div>
    </div>
  );
}