import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { FullProductForm, FullProductFormValue } from "@/components/FullProductForm";
import ProductPreview from "@/components/ProductPreview";
import { slugify } from "@/lib/slugify";

export default function NewProductPage() {
  const [draft, setDraft] = useState<FullProductFormValue>({
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
  });

  function handleDraftChange(updates: Partial<FullProductFormValue>) {
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
      : ["/placeholder.svg"];

  // Map draft to ProductCardProps
  const productCardData = {
    id: draft.id,
    name: draft.name || "Sample Product Title",
    slug: draft.slug || slugify(draft.name || "sample-product"),
    price: draft.price,
    compareAtPrice: draft.compareAtPrice,
    shortDescription: draft.shortDescription,
    inStock: draft.inStock,
    images: imagesForPreview,
    badges: draft.badges,
  };

  // Map draft to NormalProductDetailPageProps
  const productDetailData = {
    id: draft.id,
    name: draft.name || "Sample Product Title",
    slug: draft.slug || slugify(draft.name || "sample-product"),
    category: draft.category || "Category",
    shortDescription: draft.shortDescription,
    overview: draft.overview || "Detailed product overview and description here...",
    price: draft.price,
    compareAtPrice: draft.compareAtPrice,
    stock: draft.inStock ? "In Stock" : "Out of Stock",
    images: imagesForPreview,
    features: draft.features,
    howToUse: draft.howToUse,
    ingredients: draft.ingredients,
    details: draft.details,
    variants: draft.variants,
    rating: draft.rating,
    reviewCount: draft.reviewCount,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-8 flex-1">
        <div className="flex-1 max-w-full lg:max-w-lg overflow-auto">
          <FullProductForm
            value={draft}
            onChange={handleDraftChange}
            onSave={handleSave}
            onPublish={handlePublish}
          />
        </div>
        <div className="flex-1 max-w-full overflow-auto">
          <ProductPreview
            productCardData={productCardData}
            productDetailData={productDetailData}
          />
        </div>
      </div>
    </div>
  );
}