import React from "react";
import FurnitureCardTemplate from "@/templates/FurnitureCard";
import FurniturePageTemplate from "@/templates/FurniturePage";
import PreviewWrapper from "./PreviewWrapper";

interface FurniturePreviewProps {
  furniture: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    currency: string;
    image: string;
    images: string[];
    dimensions?: {
      width: number;
      height: number;
      depth: number;
      unit: string;
    };
    material?: string;
    finish?: string;
    deliveryTime?: string;
    badges?: string[];
    category?: string;
    inStock?: boolean;
    shortDescription?: string;
    descriptionHtml?: string;
    sku?: string;
    weight?: number;
    assembly?: "required" | "not_required" | "partial";
    warranty?: string;
    careInstructions?: string;
  };
}

export default function FurniturePreview({ furniture }: FurniturePreviewProps) {
  return (
    <PreviewWrapper
      cardPreview={<FurnitureCardTemplate furniture={furniture} />}
      pagePreview={<FurniturePageTemplate furniture={furniture} />}
    />
  );
}