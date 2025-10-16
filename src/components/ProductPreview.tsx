import React, { useState } from "react";
import { ProductCard, ProductCardProps } from "./ProductCard";
import { NormalProductDetailPage, NormalProductDetailPageProps } from "./NormalProductDetailPage";

interface ProductPreviewProps {
  productCardData: ProductCardProps;
  productDetailData: NormalProductDetailPageProps;
}

export default function ProductPreview({ productCardData, productDetailData }: ProductPreviewProps) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [tab, setTab] = useState<"card" | "page">("card");

  return (
    <div className="space-y-4">
      {/* Viewport Toggle */}
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded ${
            viewport === "desktop" ? "bg-pink-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => setViewport("desktop")}
          aria-pressed={viewport === "desktop"}
        >
          Desktop
        </button>
        <button
          className={`px-3 py-1 rounded ${
            viewport === "mobile" ? "bg-pink-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => setViewport("mobile")}
          aria-pressed={viewport === "mobile"}
        >
          Mobile
        </button>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded ${
            tab === "card" ? "bg-pink-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("card")}
          aria-pressed={tab === "card"}
        >
          Card Preview
        </button>
        <button
          className={`px-3 py-1 rounded ${
            tab === "page" ? "bg-pink-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("page")}
          aria-pressed={tab === "page"}
        >
          Page Preview
        </button>
      </div>

      {/* Preview Container */}
      <div
        className={`border rounded-lg overflow-hidden bg-white shadow-sm transition-all ${
          viewport === "mobile" ? "max-w-sm mx-auto" : "w-full"
        }`}
        style={{ minHeight: "600px" }}
      >
        {tab === "card" ? (
          <div className="p-4">
            <ProductCard {...productCardData} />
          </div>
        ) : (
          <div className="p-4 overflow-auto" style={{ maxHeight: "600px" }}>
            <NormalProductDetailPage {...productDetailData} />
          </div>
        )}
      </div>
    </div>
  );
}