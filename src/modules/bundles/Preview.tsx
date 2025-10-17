import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { computeBundlePrice, computeSavings } from "./pricing";
import type { Bundle, Product, CompositionItem } from "./types";

interface PreviewProps {
  bundle: Bundle;
  productsMap: Map<string, Product>;
}

export default function Preview({ bundle, productsMap }: PreviewProps) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  const price = computeBundlePrice(bundle, productsMap);
  const savings = computeSavings(bundle, productsMap);
  const hasSavings = savings > 0;

  const heroImage = bundle.thumbnail || bundle.images?.[0] || "/placeholder.svg";

  return (
    <div className="space-y-4">
      {/* Viewport toggle */}
      <div className="flex gap-2">
        <button
          className={cn(
            "px-3 py-1 rounded",
            viewport === "desktop" ? "bg-pink-400 text-white" : "bg-gray-200"
          )}
          onClick={() => setViewport("desktop")}
          aria-pressed={viewport === "desktop"}
        >
          Desktop
        </button>
        <button
          className={cn(
            "px-3 py-1 rounded",
            viewport === "mobile" ? "bg-pink-400 text-white" : "bg-gray-200"
          )}
          onClick={() => setViewport("mobile")}
          aria-pressed={viewport === "mobile"}
        >
          Mobile
        </button>
      </div>

      {/* Card preview */}
      <div
        className={cn(
          "relative rounded-lg border border-gray-300 overflow-hidden shadow-sm",
          viewport === "mobile" ? "max-w-sm mx-auto" : "max-w-3xl mx-auto"
        )}
      >
        {hasSavings && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded z-10">
            Save {Math.round((savings / (price + savings)) * 100)}%
          </div>
        )}
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
          <div className="text-lg font-semibold">
            Price: R {price.toFixed(2)}
            {hasSavings && (
              <span className="text-sm line-through text-gray-500 ml-2">
                R {(price + savings).toFixed(2)}
              </span>
            )}
          </div>
          {/* Collapsible composition */}
          <details className="mt-4">
            <summary className="cursor-pointer font-medium text-gray-700">
              What&apos;s inside ({bundle.composition.length} items)
            </summary>
            <ul className="mt-2 list-disc list-inside text-gray-600 max-h-40 overflow-auto">
              {bundle.composition.map((item: CompositionItem, i: number) => (
                <li key={i}>
                  {item.quantity} × {item.productSlug} {item.optional ? "(optional)" : ""}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}