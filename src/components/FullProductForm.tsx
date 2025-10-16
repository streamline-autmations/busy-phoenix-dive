import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

export interface FullProductFormValue {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string;
  inStock: boolean;
  images: string[]; // at least 2 images: [white bg, colorful]
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
}

interface FullProductFormProps {
  value: FullProductFormValue;
  onChange: (updates: Partial<FullProductFormValue>) => void;
  onSave?: () => void;
  onPublish?: () => void;
}

export function FullProductForm({ value, onChange, onSave, onPublish }: FullProductFormProps) {
  // ... form implementation omitted for brevity, keep your existing inputs ...

  // For brevity, only showing the buttons here:
  return (
    <form className="space-y-6 max-w-3xl">
      {/* Your existing form fields here */}

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