import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { FullProductForm, FullProductFormValue } from "@/components/FullProductForm";
import ProductPreview from "@/components/ProductPreview";
import { slugify } from "@/lib/slugify";
import type { ProductCardProps } from "@/components/ProductCard";
import type { NormalProductDetailPageProps } from "@/components/NormalProductDetailPage";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

export default function AddProductPage() {
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

  const [previewFullscreen, setPreviewFullscreen] = useState(false);

  function handleDraftChange(updates: Partial<FullProductFormValue>) {
    setDraft((prev) => ({ ...prev, ...updates }));
  }

  async function handleSave() {
    try {
      await fetch("https://dockerfile-1n82.onrender.com/webhook/products-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "owner_portal",
          action: "create_or_update_product",
          product: draft,
        }),
      });
      alert("Draft saved — branch updated!");
    } catch (error) {
      alert(`Failed to save draft: ${error}`);
    }
  }

  async function handlePublish() {
    try {
      const response = await fetch("https://dockerfile-1n82.onrender.com/webhook/pr-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchClean: `add-${draft.slug}`,
          slug: draft.slug,
          title: draft.name,
        }),
      });
      const data = await response.json();
      alert(`Preview ready: ${data.previewUrl}`);
    } catch (error) {
      alert(`Failed to publish: ${error}`);
    }
  }

  // Ensure images array always has at least one valid URL
  const imagesForPreview = draft.images.length > 0
    ? draft.images.filter((url) => url && url.trim() !== "")
    : [];

  if (imagesForPreview.length === 0) {
    imagesForPreview.push(PLACEHOLDER_IMAGE);
  }

  // Map draft to ProductCardProps
  const productCardData: ProductCardProps = {
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
    images: imagesForPreview,
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="container mx-auto p-6 flex flex-col flex-1">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Form */}
          <div className="flex-1 max-w-full lg:max-w-lg overflow-auto">
            <FullProductForm
              value={draft}
              onChange={handleDraftChange}
              onSave={handleSave}
              onPublish={handlePublish}
            />
          </div>

          {/* Preview */}
          <div
            className={`relative flex-1 bg-white border rounded-lg shadow-sm flex flex-col ${
              previewFullscreen ? "fixed inset-0 z-50 m-4 p-6 overflow-auto" : "max-h-[80vh]"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Live Preview</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewFullscreen(!previewFullscreen)}
                aria-label={previewFullscreen ? "Exit fullscreen preview" : "Enter fullscreen preview"}
              >
                {previewFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <ProductPreview
                productCardData={productCardData}
                productDetailData={productDetailData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}