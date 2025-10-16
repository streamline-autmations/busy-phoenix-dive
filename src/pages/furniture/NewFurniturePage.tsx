import React, { useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import ProductFurnitureForm, { ProductFurnitureFormValue } from "@/components/ProductFurnitureForm";
import FurnitureCardTemplate from "@/templates/FurnitureCard";
import FurniturePageTemplate from "@/templates/FurniturePage";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Minimize } from "lucide-react";
import { toast } from "sonner";
import { postJSON } from "@/lib/api";
import { env, optionalEnv } from "@/lib/env";
import { slugify } from "@/lib/slugify";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

export default function NewFurniturePage() {
  const [draft, setDraft] = useState<ProductFurnitureFormValue>({
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
    isFurniture: true,
    originalPrice: undefined,
    sku: undefined,
    dimensions: { width: 0, height: 0, depth: 0, unit: "cm" },
    weight: undefined,
    material: undefined,
    finish: undefined,
    assembly: undefined,
    deliveryTime: undefined,
    warranty: undefined,
    careInstructions: undefined,
  });

  const [submitting, setSubmitting] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [previewFullscreen, setPreviewFullscreen] = useState(false);

  const updateDraft = useCallback((updates: Partial<ProductFurnitureFormValue>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  const generateSlug = useCallback(() => {
    if (draft.name) {
      updateDraft({ slug: slugify(draft.name) });
    }
  }, [draft.name, updateDraft]);

  const handleSubmit = useCallback(async () => {
    if (!draft.name || draft.price <= 0) {
      toast.error("Please fill in required fields (name and price)");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        source: "owner_portal",
        action: "create_or_update_furniture",
        draft: {
          ...draft,
          slug: draft.slug || slugify(draft.name),
          thumbnail: draft.images?.[0],
          templateType: "furniture",
        },
        meta: {
          appVersion: optionalEnv.APP_VERSION,
          submittedAt: new Date().toISOString(),
          webhookUrl: env.N8N_WEBHOOK_URL,
        },
      };

      const result = await postJSON(env.N8N_WEBHOOK_URL, payload);

      toast.success("✅ Furniture draft sent to n8n successfully!");
      console.log("✅ Webhook response:", result);

      // Reset form
      setDraft({
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
        isFurniture: true,
        originalPrice: undefined,
        sku: undefined,
        dimensions: { width: 0, height: 0, depth: 0, unit: "cm" },
        weight: undefined,
        material: undefined,
        finish: undefined,
        assembly: undefined,
        deliveryTime: undefined,
        warranty: undefined,
        careInstructions: undefined,
      });
    } catch (error) {
      console.error("❌ Webhook submission failed:", error);
      toast.error(`Submission failed: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }, [draft]);

  // Ensure images array always has at least one valid URL
  const imagesForPreview =
    draft.images && draft.images.length > 0
      ? draft.images.filter((url) => url && url.trim() !== "")
      : [];

  if (imagesForPreview.length === 0) {
    imagesForPreview.push(PLACEHOLDER_IMAGE);
  }

  // Create preview data for the templates
  const previewFurniture = {
    id: draft.id,
    title: draft.name || "Sample Furniture Title",
    price: draft.price || 999,
    originalPrice: draft.originalPrice,
    currency: "ZAR",
    image:
      draft.images && draft.images.length > 0 && draft.images[0].trim() !== ""
        ? draft.images[0]
        : PLACEHOLDER_IMAGE,
    images: imagesForPreview,
    dimensions: draft.dimensions,
    material: draft.material,
    finish: draft.finish,
    deliveryTime: draft.deliveryTime,
    badges: draft.badges,
    category: draft.category,
    inStock: draft.inStock,
    shortDescription: draft.shortDescription,
    descriptionHtml: draft.details.claims.join(", "),
    sku: draft.sku,
    weight: draft.weight,
    assembly: draft.assembly,
    warranty: draft.warranty,
    careInstructions: draft.careInstructions,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <div className="container mx-auto p-6 flex flex-col flex-1">
        <h1 className="text-3xl font-bold mb-6">Add New Furniture</h1>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Form */}
          <div className="flex-1 max-w-full lg:max-w-lg overflow-auto">
            <ProductFurnitureForm
              value={draft}
              onChange={updateDraft}
              onSave={handleSubmit}
              onPublish={handleSubmit}
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
              <div className="flex gap-2">
                <Button
                  variant={viewport === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewport("desktop")}
                  aria-pressed={viewport === "desktop"}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewport === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewport("mobile")}
                  aria-pressed={viewport === "mobile"}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewFullscreen(!previewFullscreen)}
                  aria-label={
                    previewFullscreen ? "Exit fullscreen preview" : "Enter fullscreen preview"
                  }
                >
                  {previewFullscreen ? <Minimize className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <div
                className={`border rounded-lg overflow-hidden bg-gray-50 p-4 ${
                  viewport === "mobile" ? "max-w-sm mx-auto" : "w-full"
                }`}
              >
                <FurnitureCardTemplate furniture={previewFurniture} />
              </div>
              <div
                className={`border rounded-lg overflow-hidden bg-white max-h-96 overflow-y-auto mt-6 ${
                  viewport === "mobile" ? "max-w-sm mx-auto" : "w-full"
                }`}
              >
                <div className="transform scale-75 origin-top">
                  <FurniturePageTemplate furniture={previewFurniture} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}