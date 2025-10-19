import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import ProductMediaInput from "./ProductMediaInput";

export interface IngredientGroup {
  inci: string[];
  key: string[];
}

export interface ProductDetails {
  size: string;
  shelfLife: string;
  claims: string[];
}

export interface Variant {
  name: string;
  image: string;
}

export interface ProductFurnitureFormValue {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string;
  inStock: boolean;
  images: string[];
  badges: string[];
  variants: Variant[];
  category: string;
  overview: string;
  features: string[];
  howToUse: string[];
  ingredients: IngredientGroup;
  details: ProductDetails;
  rating: number;
  reviewCount: number;

  // Furniture-specific optional fields
  isFurniture?: boolean;
  originalPrice?: number;
  sku?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight?: number;
  material?: string;
  finish?: string;
  assembly?: 'required' | 'not_required' | 'partial';
  deliveryTime?: string;
  warranty?: string;
  careInstructions?: string;
}

interface ProductFurnitureFormProps {
  value: ProductFurnitureFormValue;
  onChange: (updates: Partial<ProductFurnitureFormValue>) => void;
  onSave?: () => void;
  onPublish?: () => void;
}

const defaultCategories = [
  "All Products",
  "Acrylic System",
  "Prep & Finish",
  "Gel System",
  "Tools & Essentials",
  "Furniture",
  "Coming Soon",
];

export default function ProductFurnitureForm({
  value,
  onChange,
  onSave,
  onPublish,
}: ProductFurnitureFormProps) {
  const [newTag, setNewTag] = useState("");
  const [newBadge, setNewBadge] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newHowToUse, setNewHowToUse] = useState("");
  const [newInci, setNewInci] = useState("");
  const [newKeyIngredient, setNewKeyIngredient] = useState("");
  const [newClaim, setNewClaim] = useState("");
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantImage, setNewVariantImage] = useState("");
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [newCategory, setNewCategory] = useState("");

  function patch(updates: Partial<ProductFurnitureFormValue>) {
    onChange({ ...value, ...updates });
  }

  // Tags
  function addTag() {
    if (newTag.trim() && !(value.badges.includes(newTag.trim()) || value.badges.includes(newTag.trim()))) {
      patch({ badges: [...value.badges, newTag.trim()] });
      setNewTag("");
    }
  }

  function removeTag(tagToRemove: string) {
    patch({ badges: value.badges.filter((tag) => tag !== tagToRemove) });
  }

  // Badges
  function addBadge() {
    if (newBadge.trim() && !value.badges.includes(newBadge.trim())) {
      patch({ badges: [...value.badges, newBadge.trim()] });
      setNewBadge("");
    }
  }

  function removeBadge(badgeToRemove: string) {
    patch({ badges: value.badges.filter((badge) => badge !== badgeToRemove) });
  }

  // Features
  function addFeature() {
    if (newFeature.trim() && !value.features.includes(newFeature.trim())) {
      patch({ features: [...value.features, newFeature.trim()] });
      setNewFeature("");
    }
  }

  function removeFeature(featureToRemove: string) {
    patch({ features: value.features.filter((f) => f !== featureToRemove) });
  }

  // HowToUse
  function addHowToUse() {
    if (newHowToUse.trim() && !value.howToUse.includes(newHowToUse.trim())) {
      patch({ howToUse: [...value.howToUse, newHowToUse.trim()] });
      setNewHowToUse("");
    }
  }

  function removeHowToUse(itemToRemove: string) {
    patch({ howToUse: value.howToUse.filter((h) => h !== itemToRemove) });
  }

  // Ingredients - INCI
  function addInci() {
    if (newInci.trim() && !value.ingredients.inci.includes(newInci.trim())) {
      patch({ ingredients: { ...value.ingredients, inci: [...value.ingredients.inci, newInci.trim()] } });
      setNewInci("");
    }
  }

  function removeInci(incToRemove: string) {
    patch({ ingredients: { ...value.ingredients, inci: value.ingredients.inci.filter((i) => i !== incToRemove) } });
  }

  // Ingredients - Key
  function addKeyIngredient() {
    if (newKeyIngredient.trim() && !value.ingredients.key.includes(newKeyIngredient.trim())) {
      patch({ ingredients: { ...value.ingredients, key: [...value.ingredients.key, newKeyIngredient.trim()] } });
      setNewKeyIngredient("");
    }
  }

  function removeKeyIngredient(keyToRemove: string) {
    patch({ ingredients: { ...value.ingredients, key: value.ingredients.key.filter((k) => k !== keyToRemove) } });
  }

  // Claims
  function addClaim() {
    if (newClaim.trim() && !value.details.claims.includes(newClaim.trim())) {
      patch({ details: { ...value.details, claims: [...value.details.claims, newClaim.trim()] } });
      setNewClaim("");
    }
  }

  function removeClaim(claimToRemove: string) {
    patch({ details: { ...value.details, claims: value.details.claims.filter((c) => c !== claimToRemove) } });
  }

  // Variants
  function addVariant() {
    if (newVariantName.trim()) {
      patch({ variants: [...value.variants, { name: newVariantName.trim(), image: newVariantImage.trim() }] });
      setNewVariantName("");
      setNewVariantImage("");
    }
  }

  function removeVariant(index: number) {
    patch({ variants: value.variants.filter((_, i) => i !== index) });
  }

  // Add new category to list and select it
  function addCategory() {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      const updated = [...categories, trimmed];
      setCategories(updated);
      patch({ category: trimmed });
      setNewCategory("");
    }
  }

  return (
    <form className="space-y-6 max-w-3xl" onSubmit={(e) => e.preventDefault()}>
      {/* Basic Info */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={value.name}
          onChange={(e) => patch({ name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={value.slug}
          onChange={(e) => patch({ slug: e.target.value })}
          placeholder="auto-generated if empty"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={value.category}
          onValueChange={(val) => patch({ category: val })}
        >
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex gap-2 items-center">
        <Input
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCategory();
            }
          }}
        />
        <Button type="button" onClick={addCategory}>
          Add
        </Button>
      </div>

      {/* ... rest of the form unchanged ... */}

      {/* Furniture-specific fields */}
      {value.isFurniture && (
        <>
          {/* ... existing furniture-specific inputs ... */}
        </>
      )}

      {/* Other fields like shortDescription, overview, features, etc. */}

      {/* Save and Publish buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={(e) => { e.preventDefault(); onSave && onSave(); }} variant="outline" className="flex-1">
          💾 Save Draft
        </Button>
        <Button onClick={(e) => { e.preventDefault(); onPublish && onPublish(); }} className="flex-1">
          🚀 Publish
        </Button>
      </div>
    </form>
  );
}