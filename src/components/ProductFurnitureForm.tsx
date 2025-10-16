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

      {/* Furniture-specific fields */}
      {value.isFurniture && (
        <>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">Original Price (ZAR)</Label>
            <Input
              id="originalPrice"
              type="number"
              min={0}
              step={0.01}
              value={value.originalPrice ?? ""}
              onChange={(e) => patch({ originalPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={value.sku ?? ""}
              onChange={(e) => patch({ sku: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                min={0}
                value={value.dimensions?.width ?? ""}
                onChange={(e) =>
                  patch({
                    dimensions: {
                      ...value.dimensions,
                      width: Number(e.target.value),
                      height: value.dimensions?.height ?? 0,
                      depth: value.dimensions?.depth ?? 0,
                      unit: value.dimensions?.unit ?? "cm",
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                min={0}
                value={value.dimensions?.height ?? ""}
                onChange={(e) =>
                  patch({
                    dimensions: {
                      ...value.dimensions,
                      height: Number(e.target.value),
                      width: value.dimensions?.width ?? 0,
                      depth: value.dimensions?.depth ?? 0,
                      unit: value.dimensions?.unit ?? "cm",
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth">Depth</Label>
              <Input
                id="depth"
                type="number"
                min={0}
                value={value.dimensions?.depth ?? ""}
                onChange={(e) =>
                  patch({
                    dimensions: {
                      ...value.dimensions,
                      depth: Number(e.target.value),
                      width: value.dimensions?.width ?? 0,
                      height: value.dimensions?.height ?? 0,
                      unit: value.dimensions?.unit ?? "cm",
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={value.dimensions?.unit ?? "cm"}
                onValueChange={(val) =>
                  patch({
                    dimensions: {
                      ...value.dimensions,
                      unit: val,
                      width: value.dimensions?.width ?? 0,
                      height: value.dimensions?.height ?? 0,
                      depth: value.dimensions?.depth ?? 0,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="inches">inches</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={value.material ?? ""}
                onChange={(e) => patch({ material: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finish">Finish</Label>
              <Input
                id="finish"
                value={value.finish ?? ""}
                onChange={(e) => patch({ finish: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min={0}
                step={0.1}
                value={value.weight ?? ""}
                onChange={(e) => patch({ weight: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assembly">Assembly Required</Label>
              <Select
                value={value.assembly ?? ""}
                onValueChange={(val) => patch({ assembly: val as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_required">No Assembly Required</SelectItem>
                  <SelectItem value="partial">Partial Assembly</SelectItem>
                  <SelectItem value="required">Full Assembly Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input
                id="deliveryTime"
                value={value.deliveryTime ?? ""}
                onChange={(e) => patch({ deliveryTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty</Label>
              <Input
                id="warranty"
                value={value.warranty ?? ""}
                onChange={(e) => patch({ warranty: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="careInstructions">Care Instructions</Label>
            <Textarea
              id="careInstructions"
              rows={3}
              value={value.careInstructions ?? ""}
              onChange={(e) => patch({ careInstructions: e.target.value })}
            />
          </div>
        </>
      )}

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
            {value.isFurniture ? (
              <>
                <SelectItem value="living-room">Living Room</SelectItem>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="dining-room">Dining Room</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="skincare">Skincare</SelectItem>
                <SelectItem value="makeup">Makeup</SelectItem>
                <SelectItem value="haircare">Haircare</SelectItem>
                <SelectItem value="fragrance">Fragrance</SelectItem>
                <SelectItem value="body">Body</SelectItem>
              </>
            )}
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