import React, { useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { X, Loader2, Send, TestTube } from "lucide-react";
import { postJSON } from "@/lib/api";
import { env, optionalEnv } from "@/lib/env";
import { slugify } from "@/lib/slugify";
import ProductPreview from "@/components/ProductPreview";
import type { ProductCardProps } from "@/components/ProductCard";
import type { NormalProductDetailPageProps } from "@/components/NormalProductDetailPage";

interface Draft {
  title: string;
  slug?: string;
  price: number;
  currency: string;
  status: string;
  images: string[];
  tags: string[];
  badges: string[];
  shortDescription: string;
  overview: string;
  features: string[];
  howToUse: string[];
  ingredients: {
    inci: string[];
    key: string[];
  };
  details: {
    size: string;
    shelfLife: string;
    claims: string[];
  };
  category?: string;
  variants?: { name: string; image: string }[];
  rating?: number;
  reviewCount?: number;
}

export default function NewProductPage() {
  const [draft, setDraft] = useState<Draft>({
    title: "",
    price: 0,
    currency: "ZAR",
    status: "draft",
    images: [],
    tags: [],
    badges: [],
    shortDescription: "",
    overview: "",
    features: [],
    howToUse: [],
    ingredients: { inci: [], key: [] },
    details: { size: "", shelfLife: "", claims: [] },
    category: undefined,
    variants: [],
    rating: undefined,
    reviewCount: undefined,
  });

  // ... other state and handlers ...

  // Define productCardData and productDetailData here before JSX
  const productCardData: ProductCardProps = {
    id: "preview",
    name: draft.title || "Sample Product Title",
    slug: slugify(draft.title || "sample-product"),
    price: draft.price || 99,
    compareAtPrice: null,
    shortDescription: draft.shortDescription || "",
    inStock: true,
    images: draft.images.length > 0 ? draft.images : ["/placeholder.svg"],
    badges: draft.badges,
  };

  const productDetailData: NormalProductDetailPageProps = {
    id: "preview",
    name: draft.title || "Sample Product Title",
    slug: slugify(draft.title || "sample-product"),
    category: draft.category || "Category",
    shortDescription: draft.shortDescription || "",
    overview: draft.overview || "Detailed product overview and description here...",
    price: draft.price || 99,
    compareAtPrice: null,
    stock: "In Stock",
    images: draft.images.length > 0 ? draft.images : ["/placeholder.svg"],
    features: draft.features.length > 0 ? draft.features : [
      "Feature 1 - describe your product feature",
      "Feature 2 - another great feature",
      "Feature 3 - why customers love this",
      "Feature 4 - professional quality",
      "Feature 5 - easy to use",
    ],
    howToUse: draft.howToUse.length > 0 ? draft.howToUse : [
      "Step 1 - how to use your product",
      "Step 2 - next step in the process",
      "Step 3 - final step",
      "Step 4 - additional tip",
    ],
    ingredients: draft.ingredients || { inci: [], key: [] },
    details: draft.details || { size: "", shelfLife: "", claims: [] },
    variants: draft.variants || [],
    rating: draft.rating || 4.5,
    reviewCount: draft.reviewCount || 128,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* ... rest of JSX ... */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductPreview
            productCardData={productCardData}
            productDetailData={productDetailData}
          />
        </CardContent>
      </Card>
      {/* ... rest of JSX ... */}
    </div>
  );
}