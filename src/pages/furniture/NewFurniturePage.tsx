import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import ProductFurnitureForm, { ProductFurnitureFormValue } from "@/components/ProductFurnitureForm";
import FurniturePreview from "@/components/FurniturePreview";
import { slugify } from "@/lib/slugify";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

export default function NewFurniturePage() {
  const [draft, setDraft] = useState<ProductFurnitureFormValue>({
    id: "preview",
    name: "",
    slug: "",
    price: 0,
    compareAtPrice: null,
    shortDescription: "",
    inStock: true,
    images: [],
    badges: [],
    variants: [],
    category: "",
    overview: "",
    features: [],
    howToUse: [],
    ingredients: { inci: [], key: [] },
    details: { size: "", shelfLife: "", claims: [] },
    rating: 0,
    reviewCount: 0,
    isFurniture: true,
    originalPrice: undefined,
    sku: undefined,
    dimensions: { width: 0, height: 0, depth: 0, unit: "cm" },
    weight: undefined,
    material: undefined,
    finish: undefined,
    assembly: undefined,
    deliveryTime: undefined,
    warranty: undefined,
    careInstructions: undefined,
  });

  function handleDraftChange(updates: Partial<ProductFurnitureFormValue>) {
    setDraft((prev) => ({ ...prev, ...updates }));
  }

  async function handleSave() {
    alert("Save draft clicked");
  }

  async function handlePublish() {
    alert("Publish clicked");
  }

  // Ensure images array always has at least one valid URL
  const imagesForPreview =
    draft.images && draft.images.length > 0
      ? draft.images.filter((url) => url && url.trim() !== "")
      : [PLACEHOLDER_IMAGE];

  const furniturePreview = {
    id: draft.id,
    title: draft.name || "Sample Furniture Title",
    price: draft.price,
    originalPrice: draft.compareAtPrice || undefined,
    currency: "ZAR",
    image: imagesForPreview[0],
    images: imagesForPreview,
    dimensions: draft.dimensions,
    material: draft.material,
    finish: draft.finish,
    deliveryTime: draft.deliveryTime,
    badges: draft.badges,
    category: draft.category,
    inStock: draft.inStock,
    shortDescription: draft.shortDescription,
    descriptionHtml: draft.details.claims.join(", "),
    sku: draft.sku,
    weight: draft.weight,
    assembly: draft.assembly,
    warranty: draft.warranty,
    careInstructions: draft.careInstructions,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-8 flex-1">
        <div className="flex-1 max-w-full lg:max-w-lg overflow-auto">
          <ProductFurnitureForm
            value={draft}
            onChange={handleDraftChange}
            onSave={handleSave}
            onPublish={handlePublish}
          />
        </div>
        <div className="flex-1 max-w-full overflow-auto">
          <FurniturePreview furniture={furniturePreview} />
        </div>
      </div>
    </div>
  );
}