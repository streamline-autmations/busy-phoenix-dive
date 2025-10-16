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
  const [newImageUrl, setNewImageUrl] = useState("");

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

  const addImageUrl = useCallback(() => {
    if (newImageUrl.trim() && !draft.images.includes(newImageUrl.trim())) {
      updateDraft({ images: [...draft.images, newImageUrl.trim()] });
      setNewImageUrl("");
    }
  }, [newImageUrl, draft.images, updateDraft]);

  const removeImage = useCallback(
    (urlToRemove: string) => {
      updateDraft({ images: draft.images.filter((url) => url !== urlToRemove) });
    },
    [draft.images, updateDraft]
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

  // Prepare data for preview components
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
          <div className="space-y-6 overflow-y-auto max-h-[80vh] pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter product title"
                    value={draft.title}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="product-slug"
                      value={draft.slug || ""}
                      onChange={(e) => updateDraft({ slug: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={generateSlug} variant="outline" className="w-full">
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ZAR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={draft.price}
                      onChange={(e) => updateDraft({ price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={draft.category || ""}
                      onValueChange={(value) => updateDraft({ category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prep-finishing">Prep & Finishing</SelectItem>
                        <SelectItem value="tools-essentials">Tools & Essentials</SelectItem>
                        <SelectItem value="acrylic-systems">Acrylic Systems</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    placeholder="Brief product description"
                    rows={2}
                    value={draft.shortDescription}
                    onChange={(e) => updateDraft({ shortDescription: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    placeholder="Detailed product overview"
                    rows={4}
                    value={draft.overview}
                    onChange={(e) => updateDraft({ overview: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features & How To Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="features">Features (comma separated)</Label>
                  <Input
                    id="features"
                    placeholder="Feature 1, Feature 2, Feature 3"
                    value={draft.features.join(", ")}
                    onChange={(e) =>
                      updateDraft({
                        features: e.target.value.split(",").map((f) => f.trim()),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="howToUse">How to Use (comma separated)</Label>
                  <Input
                    id="howToUse"
                    placeholder="Step 1, Step 2, Step 3"
                    value={draft.howToUse.join(", ")}
                    onChange={(e) =>
                      updateDraft({
                        howToUse: e.target.value.split(",").map((f) => f.trim()),
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ingredientsInci">Ingredients INCI (comma separated)</Label>
                  <Input
                    id="ingredientsInci"
                    placeholder="Ingredient 1, Ingredient 2"
                    value={draft.ingredients.inci.join(", ")}
                    onChange={(e) =>
                      updateDraft({
                        ingredients: {
                          ...draft.ingredients,
                          inci: e.target.value.split(",").map((f) => f.trim()),
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ingredientsKey">Key Ingredients (comma separated)</Label>
                  <Input
                    id="ingredientsKey"
                    placeholder="Key ingredient 1, Key ingredient 2"
                    value={draft.ingredients.key.join(", ")}
                    onChange={(e) =>
                      updateDraft({
                        ingredients: {
                          ...draft.ingredients,
                          key: e.target.value.split(",").map((f) => f.trim()),
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="detailsSize">Size</Label>
                  <Input
                    id="detailsSize"
                    placeholder="15ml"
                    value={draft.details.size}
                    onChange={(e) =>
                      updateDraft({
                        details: { ...draft.details, size: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailsShelfLife">Shelf Life</Label>
                  <Input
                    id="detailsShelfLife"
                    placeholder="24 months"
                    value={draft.details.shelfLife}
                    onChange={(e) =>
                      updateDraft({
                        details: { ...draft.details, shelfLife: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailsClaims">Claims (comma separated)</Label>
                  <Input
                    id="detailsClaims"
                    placeholder="Vegan, Cruelty-Free"
                    value={draft.details.claims.join(", ")}
                    onChange={(e) =>
                      updateDraft({
                        details: {
                          ...draft.details,
                          claims: e.target.value.split(",").map((f) => f.trim()),
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addImageUrl();
                      }
                    }}
                  />
                  <Button onClick={addImageUrl} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
                {draft.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {draft.images.map((url, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={url}
                          alt={`Product image ${i + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          onClick={() => removeImage(url)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Remove image ${i + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags & Badges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button onClick={addTag} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  {draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {draft.tags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Badges</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add badge (e.g., Bestseller, New, Sale)"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addBadge())
                      }
                    />
                    <Button onClick={addBadge} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  {draft.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {draft.badges.map((badge, i) => (
                        <Badge
                          key={i}
                          className="flex items-center gap-1"
                        >
                          {badge}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeBadge(badge)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting to n8n...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit to n8n
                </>
              )}
            </Button>
          </div>

          {/* Preview */}
          <div className="overflow-y-auto max-h-[80vh]">
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