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

  const [newTag, setNewTag] = useState("");
  const [newBadge, setNewBadge] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);

  const updateDraft = useCallback(
    (updates: Partial<Draft>) => {
      setDraft((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const generateSlug = useCallback(() => {
    if (draft.title) {
      updateDraft({ slug: slugify(draft.title) });
    }
  }, [draft.title, updateDraft]);

  const addTag = useCallback(() => {
    if (newTag.trim() && !draft.tags.includes(newTag.trim())) {
      updateDraft({ tags: [...draft.tags, newTag.trim()] });
      setNewTag("");
    }
  }, [newTag, draft.tags, updateDraft]);

  const removeTag = useCallback(
    (tagToRemove: string) => {
      updateDraft({ tags: draft.tags.filter((tag) => tag !== tagToRemove) });
    },
    [draft.tags, updateDraft]
  );

  const addBadge = useCallback(() => {
    if (newBadge.trim() && !draft.badges.includes(newBadge.trim())) {
      updateDraft({ badges: [...draft.badges, newBadge.trim()] });
      setNewBadge("");
    }
  }, [newBadge, draft.badges, updateDraft]);

  const removeBadge = useCallback(
    (badgeToRemove: string) => {
      updateDraft({ badges: draft.badges.filter((b) => b !== badgeToRemove) });
    },
    [draft.badges, updateDraft]
  );

  const sendTestWebhook = useCallback(async () => {
    setTesting(true);

    try {
      const testPayload = {
        source: "owner_portal",
        action: "create_or_update_product",
        draft: {
          title: "Test Product - Sample Item",
          slug: "test-product-sample-item",
          price: 299.99,
          currency: "ZAR" as const,
          sku: "TEST-001",
          status: "draft" as const,
          stock: 10,
          category: "electronics",
          tags: ["test", "sample", "electronics"],
          badges: ["Bestseller", "New"],
          thumbnail:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
          ],
          shortDescription:
            "This is a test product created to verify the webhook integration is working correctly.",
          overview:
            "Detailed product overview and description here...",
          features: [
            "Feature 1 - describe your product feature",
            "Feature 2 - another great feature",
            "Feature 3 - why customers love this",
            "Feature 4 - professional quality",
            "Feature 5 - easy to use",
          ],
          howToUse: [
            "Step 1 - how to use your product",
            "Step 2 - next step in the process",
            "Step 3 - final step",
            "Step 4 - additional tip",
          ],
          ingredients: {
            inci: ["INGREDIENT 1", "INGREDIENT 2", "INGREDIENT 3", "INGREDIENT 4"],
            key: [
              "Key ingredient 1 – what it does",
              "Key ingredient 2 – benefits",
              "Key ingredient 3 – why it matters",
            ],
          },
          details: {
            size: "15ml",
            shelfLife: "24 months",
            claims: ["Vegan", "Cruelty-Free", "HEMA-Free"],
          },
          variants: [
            { name: "Cotton Candy", image: "/your-product-cotton-candy.webp" },
            { name: "Vanilla", image: "/your-product-vanilla.webp" },
            { name: "Tiny Touch", image: "/your-product-tiny-touch.webp" },
          ],
          rating: 4.8,
          reviewCount: 127,
        },
        meta: {
          appVersion: optionalEnv.APP_VERSION,
          submittedAt: new Date().toISOString(),
          webhookUrl: env.N8N_WEBHOOK_URL,
          testMode: true,
        },
      };

      const result = await postJSON(env.N8N_WEBHOOK_URL, testPayload);

      toast.success("✅ Test webhook sent successfully!");
      console.log("✅ Test webhook response:", result);
    } catch (error) {
      console.error("❌ Test webhook failed:", error);
      toast.error(`Test webhook failed: ${error}`);
    } finally {
      setTesting(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!draft.title || draft.price <= 0) {
      toast.error("Please fill in required fields (title and price)");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        source: "owner_portal",
        action: "create_or_update_product",
        draft: {
          ...draft,
          slug: slugify(draft.title),
          templateType: "product",
        },
        meta: {
          appVersion: optionalEnv.APP_VERSION,
          submittedAt: new Date().toISOString(),
          webhookUrl: env.N8N_WEBHOOK_URL,
        },
      };

      const result = await postJSON(env.N8N_WEBHOOK_URL, payload);

      toast.success("✅ Draft sent to n8n successfully!");
      console.log("✅ Webhook response:", result);

      setDraft({
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
    } catch (error) {
      console.error("❌ Webhook submission failed:", error);
      toast.error(`Submission failed: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }, [draft]);

  // Define productCardData and productDetailData here to fix TS errors
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

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-600">Create and preview your product before submitting to n8n</p>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Test Webhook Integration</h3>
                <p className="text-sm text-blue-700">Send a sample product to verify your n8n workflow</p>
              </div>
              <Button
                onClick={sendTestWebhook}
                disabled={testing}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Send Test
                  </>
                )}
              </Button>
            </div>
          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            {/* ... form inputs unchanged ... */}
          </div>

          {/* Preview */}
          <div>
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
          </div>
        </div>
      </div>
    </div>
  );
}