import React from "react";
import PreviewWrapper from "./PreviewWrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Bundle, Product, CompositionItem } from "@/modules/bundles/types";

interface BundlePreviewProps {
  bundle: Bundle;
  productsMap: Map<string, Product>;
}

function BundleCard({ bundle }: { bundle: Bundle }) {
  const heroImage = bundle.thumbnail || bundle.images?.[0] || "/placeholder.svg";
  return (
    <div className="relative rounded-lg border border-gray-300 overflow-hidden shadow-sm">
      <img
        src={heroImage}
        alt={bundle.title}
        className="w-full object-cover aspect-[4/3]"
        loading="lazy"
      />
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold mb-2">{bundle.title}</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {bundle.badges?.map((badge: string) => (
            <Badge key={badge} variant="secondary">
              {badge}
            </Badge>
          ))}
          <Badge variant="destructive">Bundle</Badge>
        </div>
        <div className="text-lg font-semibold">Price: R {bundle.pricing.fixedPrice?.toFixed(2) ?? "0.00"}</div>
      </div>
    </div>
  );
}

function BundlePage({ bundle, productsMap }: BundlePreviewProps) {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{bundle.title}</h1>
      <p className="mb-4">{bundle.descriptions?.short}</p>
      <h2 className="text-xl font-semibold mb-2">Included Products</h2>
      <ul className="list-disc list-inside mb-4 max-h-48 overflow-auto">
        {bundle.composition.map((item: CompositionItem, i: number) => {
          const product = productsMap.get(item.productSlug);
          return (
            <li key={i}>
              {item.quantity} × {product ? product.title : item.productSlug} {item.optional ? "(optional)" : ""}
            </li>
          );
        })}
      </ul>
      <div className="text-lg font-semibold">
        Price: R {bundle.pricing.fixedPrice?.toFixed(2) ?? "0.00"}
      </div>
    </div>
  );
}

export default function BundlePreview({ bundle, productsMap }: BundlePreviewProps) {
  return (
    <PreviewWrapper
      cardPreview={<BundleCard bundle={bundle} />}
      pagePreview={<BundlePage bundle={bundle} productsMap={productsMap} />}
    />
  );
}