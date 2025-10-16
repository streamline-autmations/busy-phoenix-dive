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
}

export function FullProductForm({ value, onChange }: FullProductFormProps) {
  // ... full form implementation as before ...
  // (omitted here for brevity, same as previous FullProductForm code)
  return (
    <form className="space-y-6 max-w-3xl">
      {/* form fields here */}
    </form>
  );
}

// Helper components ArrayInput and AddStringInput as before