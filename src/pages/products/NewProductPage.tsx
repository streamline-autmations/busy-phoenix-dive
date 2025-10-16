import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { FullProductForm, FullProductFormValue } from "@/components/FullProductForm";
import ProductPreview from "@/components/ProductPreview";
import { slugify } from "@/lib/slugify";
import type { ProductCardProps } from "@/components/ProductCard";
import type { NormalProductDetailPageProps } from "@/components/NormalProductDetailPage";

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

  // Map draft to ProductCardProps
  const productCardData: ProductCardProps = {
    id: draft.id,
    name: draft.name || "Sample Product Title",
    slug: draft.slug || slugify(draft.name || "sample-product"),
    price: draft.price,
    compareAtPrice: draft.compareAtPrice,
    shortDescription: draft.shortDescription,
    inStock: draft.inStock,
    images:
      draft.images.length > 0
        ? draft.images
        : ["/placeholder.svg", "/placeholder.svg"],
    badges: draft.badges,
  };

  // Map draft to NormalProductDetailPageProps
  const productDetailData: NormalProductDetailPageProps = {
    id: draft.id,
    name: draft.name || "Sample Product Title",
    slug: draft.slug || slugify(draft.name || "sample-product"),
    category: draft.category || "Category",
    shortDescription: draft.shortDescription,
    overview: draft.overview || "Detailed product overview and description here...",
    price: draft.price,
    compareAtPrice: draft.compareAtPrice,
    stock: draft.inStock ? "In Stock" : "Out of Stock",
    images:
      draft.images.length > 0
        ? draft.images
        : ["/placeholder.svg", "/placeholder.svg"],
    features: draft.features,
    howToUse: draft.howToUse,
    ingredients: {
      inci: draft.ingredients.inci,
      key: draft.ingredients.key,
    },
    details: {
      size: draft.details.size,
      shelfLife: draft.details.shelfLife,
      claims: draft.details.claims,
    },
    variants: draft.variants,
    rating: draft.rating,
    reviewCount: draft.reviewCount,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <FullProductForm value={draft} onChange={setDraft} />
          <ProductPreview productCardData={productCardData} productDetailData={productDetailData} />
        </div>
      </div>
    </div>
  );
}