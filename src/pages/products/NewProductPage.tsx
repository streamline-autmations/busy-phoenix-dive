import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import ProductForm from "@/components/ProductForm";
import ProductPreview from "@/components/ProductPreview";
import { slugify } from "@/lib/slugify";
import type { ProductCardProps } from "@/components/ProductCard";
import type { NormalProductDetailPageProps } from "@/components/NormalProductDetailPage";

export function NewProductPage() {
  const [draft, setDraft] = useState({
    title: "",
    slug: "",
    price: 0,
    currency: "ZAR",
    status: "draft",
    thumbnailId: "",
    imageIds: [],
    tags: [],
    badges: [],
    shortDescription: "",
    overview: "",
    features: [],
    howToUse: [],
    ingredients: { inci: [], key: [] },
    details: { size: "", shelfLife: "", claims: [] },
    category: "",
    variants: [],
    rating: 0,
    reviewCount: 0,
  });

  const onChange = (updates: Partial<typeof draft>) => {
    setDraft((prev: typeof draft) => ({ ...prev, ...updates }));
  };

  const onSave = () => {
    alert("Save clicked");
  };

  const onPublish = () => {
    alert("Publish clicked");
  };

  const productCardData: ProductCardProps = {
    id: "preview",
    name: draft.title || "Sample Product Title",
    slug: draft.slug || slugify(draft.title || "sample-product"),
    price: draft.price || 99,
    compareAtPrice: null,
    shortDescription: draft.shortDescription || "",
    inStock: true,
    images:
      draft.imageIds.length > 0
        ? draft.imageIds.map(
            (id) =>
              `https://res.cloudinary.com/dd89enrjz/image/upload/f_webp,q_auto:good,w_800/${id}.webp`
          )
        : ["/placeholder.svg"],
    badges: draft.badges,
  };

  const productDetailData: NormalProductDetailPageProps = {
    id: "preview",
    name: draft.title || "Sample Product Title",
    slug: draft.slug || slugify(draft.title || "sample-product"),
    category: draft.category || "Category",
    shortDescription: draft.shortDescription || "",
    overview: draft.overview || "Detailed product overview and description here...",
    price: draft.price || 99,
    compareAtPrice: null,
    stock: "In Stock",
    images:
      draft.imageIds.length > 0
        ? draft.imageIds.map(
            (id) =>
              `https://res.cloudinary.com/dd89enrjz/image/upload/f_webp,q_auto:good,w_1400/${id}.webp`
          )
        : ["/placeholder.svg"],
    features: draft.features.length > 0 ? draft.features : [],
    howToUse: draft.howToUse.length > 0 ? draft.howToUse : [],
    ingredients: draft.ingredients || { inci: [], key: [] },
    details: draft.details || { size: "", shelfLife: "", claims: [] },
    variants: draft.variants || [],
    rating: draft.rating || 4.5,
    reviewCount: draft.reviewCount || 128,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <ProductForm value={draft} onChange={onChange} onSave={onSave} onPublish={onPublish} />
          <ProductPreview productCardData={productCardData} productDetailData={productDetailData} />
        </div>
      </div>
    </div>
  );
}