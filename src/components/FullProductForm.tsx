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

export interface FullProductFormValue {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string;
  inStock: boolean;
  images: string[]; // at least 2 images: [white bg, colorful]
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
}

interface FullProductFormProps {
  value: FullProductFormValue;
  onChange: (updates: Partial<FullProductFormValue>) => void;
  onSave?: () => void;
  onPublish?: () => void;
}

export function FullProductForm({ value, onChange, onSave, onPublish }: FullProductFormProps) {
  const [newTag, setNewTag] = useState("");
  const [newBadge, setNewBadge] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newHowToUse, setNewHowToUse] = useState("");
  const [newInci, setNewInci] = useState("");
  const [newKeyIngredient, setNewKeyIngredient] = useState("");
  const [newClaim, setNewClaim] = useState("");
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantImage, setNewVariantImage] = useState("");

  function patch(updates: Partial<FullProductFormValue>) {
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (ZAR) *</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step={0.01}
            value={value.price}
            onChange={(e) => patch({ price: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">Compare At Price</Label>
          <Input
            id="compareAtPrice"
            type="number"
            min={0}
            step={0.01}
            value={value.compareAtPrice ?? ""}
            onChange={(e) =>
              patch({ compareAtPrice: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={value.category}
          onValueChange={(val) => patch({ category: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="skincare">Skincare</SelectItem>
            <SelectItem value="makeup">Makeup</SelectItem>
            <SelectItem value="haircare">Haircare</SelectItem>
            <SelectItem value="fragrance">Fragrance</SelectItem>
            <SelectItem value="body">Body</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea
          id="shortDescription"
          rows={2}
          value={value.shortDescription}
          onChange={(e) => patch({ shortDescription: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="overview">Overview</Label>
        <Textarea
          id="overview"
          rows={3}
          value={value.overview}
          onChange={(e) => patch({ overview: e.target.value })}
        />
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add feature"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
          />
          <Button onClick={addFeature} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.features.map((feature, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1">
              {feature}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* How To Use */}
      <div className="space-y-2">
        <Label>How To Use</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add usage step"
            value={newHowToUse}
            onChange={(e) => setNewHowToUse(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHowToUse())}
          />
          <Button onClick={addHowToUse} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.howToUse.map((step, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1">
              {step}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeHowToUse(step)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <Label>Ingredients - INCI Names</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add INCI ingredient"
            value={newInci}
            onChange={(e) => setNewInci(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInci())}
          />
          <Button onClick={addInci} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.ingredients.inci.map((inci, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1">
              {inci}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeInci(inci)} />
            </Badge>
          ))}
        </div>

        <Label>Ingredients - Key Ingredients</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add key ingredient"
            value={newKeyIngredient}
            onChange={(e) => setNewKeyIngredient(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyIngredient())}
          />
          <Button onClick={addKeyIngredient} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.ingredients.key.map((key, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1">
              {key}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeKeyIngredient(key)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          value={value.details.size}
          onChange={(e) => patch({ details: { ...value.details, size: e.target.value } })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shelfLife">Shelf Life</Label>
        <Input
          id="shelfLife"
          value={value.details.shelfLife}
          onChange={(e) => patch({ details: { ...value.details, shelfLife: e.target.value } })}
        />
      </div>

      <div className="space-y-2">
        <Label>Claims</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add claim"
            value={newClaim}
            onChange={(e) => setNewClaim(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addClaim())}
          />
          <Button onClick={addClaim} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.details.claims.map((claim, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1">
              {claim}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeClaim(claim)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-2">
        <Label>Variants</Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Variant name"
            value={newVariantName}
            onChange={(e) => setNewVariantName(e.target.value)}
          />
          <Input
            placeholder="Variant image URL"
            value={newVariantImage}
            onChange={(e) => setNewVariantImage(e.target.value)}
          />
          <Button onClick={addVariant} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-col gap-2 max-h-40 overflow-auto">
          {value.variants.map((variant, i) => (
            <div
              key={i}
              className="flex items-center gap-2 border rounded p-2"
            >
              <img
                src={variant.image}
                alt={variant.name}
                className="w-12 h-12 object-cover rounded"
              />
              <span className="flex-1">{variant.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeVariant(i)}
                aria-label={`Remove variant ${variant.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Media */}
      <div className="space-y-2">
        <Label>Product Media</Label>
        <ProductMediaInput
          value={{
            thumbnailId: value.images[0] || "",
            imageIds: value.images.slice(1),
          }}
          onChange={({ thumbnailId, imageIds }) => {
            const images = [];
            if (thumbnailId) images.push(thumbnailId);
            if (imageIds) images.push(...imageIds);
            patch({ images });
          }}
          folder="products"
        />
        <div className="text-xs text-muted-foreground">
          First image becomes thumbnail. Supported: JPG, PNG, WebP, GIF (max 8MB each)
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="inStock"
          checked={value.inStock}
          onChange={(e) => patch({ inStock: e.target.checked })}
          className="cursor-pointer"
        />
        <Label htmlFor="inStock" className="cursor-pointer">
          In Stock
        </Label>
      </div>

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