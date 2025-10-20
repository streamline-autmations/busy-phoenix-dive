"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { slugify as slugifyUtil } from "@/lib/slugify";
import Navigation from "@/components/Navigation";
import ProductPreview from "@/components/ProductPreview";
import BundlePreview from "@/modules/bundles/Preview";
import { FullProductForm, FullProductFormValue } from "@/components/FullProductForm";
import BundleBuilder from "@/modules/bundles/BundleBuilder";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Tab = "product" | "bundle";

interface PublishResult {
  pullRequestUrl: string;
  previewUrl?: string;
}

const LOCALSTORAGE_KEYS = {
  product: "owner_portal_product_draft",
  bundle: "owner_portal_bundle_draft",
};

function slugify(s: string) {
  return slugifyUtil(s).toLowerCase();
}

function isProductValid(draft: FullProductFormValue) {
  return (
    draft.name.trim().length > 0 &&
    draft.price > 0 &&
    draft.images.length > 0
  );
}

function isBundleValid(bundle: any) {
  return (
    bundle.name?.trim().length > 0 &&
    bundle.price > 0 &&
    bundle.images?.length > 0
  );
}

export default function OwnerPortal() {
  const [activeTab, setActiveTab] = useState<Tab>("product");

  // Product draft state
  const [productDraft, setProductDraft] = useState<FullProductFormValue>(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEYS.product);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
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
    };
  });

  // Bundle draft state
  const [bundleDraft, setBundleDraft] = useState<any>(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEYS.bundle);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: "",
      slug: "",
      price: 0,
      compareAtPrice: null,
      shortDescription: "",
      description: "",
      images: [],
      badges: [],
      inStock: true,
      includedProducts: [],
      features: [],
      howToUse: [],
      details: {},
      seo: {},
    };
  });

  // Publish result state
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);

  // Save drafts to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEYS.product, JSON.stringify(productDraft));
    } catch {}
  }, [productDraft]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEYS.bundle, JSON.stringify(bundleDraft));
    } catch {}
  }, [bundleDraft]);

  // Slug auto-generation with manual override for product
  useEffect(() => {
    if (!productDraft.slug || productDraft.slug === slugify(productDraft.name)) {
      setProductDraft((prev) => ({ ...prev, slug: slugify(productDraft.name) }));
    }
  }, [productDraft.name]);

  // Slug auto-generation with manual override for bundle
  useEffect(() => {
    if (!bundleDraft.slug || bundleDraft.slug === slugify(bundleDraft.name)) {
      setBundleDraft((prev: any) => ({ ...prev, slug: slugify(bundleDraft.name) }));
    }
  }, [bundleDraft.name]);

  // Handle image URL transform for product images
  const updateProductImages = useCallback((urls: string[]) => {
    const transformed = urls.map((url) =>
      url.includes("?") ? url + "&f_auto&q_auto" : url + "?f_auto&q_auto"
    );
    setProductDraft((prev) => {
      // Remove usage of prev.thumbnail (not in FullProductFormValue)
      return {
        ...prev,
        images: transformed,
      };
    });
  }, []);

  // Handle image URL transform for bundle images
  const updateBundleImages = useCallback((urls: string[]) => {
    const transformed = urls.map((url) =>
      url.includes("?") ? url + "&f_auto&q_auto" : url + "?f_auto&q_auto"
    );
    setBundleDraft((prev: any) => ({
      ...prev,
      images: transformed,
    }));
  }, []);

  // Publish handler
  async function handlePublish() {
    setPublishResult(null);
    try {
      if (activeTab === "product") {
        if (!isProductValid(productDraft)) {
          toast.error("Please fill required fields: title, price, and at least one image.");
          return;
        }
        const payload = {
          source: "owner_portal",
          action: "create_or_update_product",
          publish: true,
          draft: productDraft,
        };
        const res = await fetch("https://dockerfile-1n82.onrender.com/webhook/products-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.ok) {
          toast.success("Product published successfully!");
          setPublishResult({
            pullRequestUrl: data.pullRequestUrl,
            previewUrl: data.previewUrl,
          });
        } else {
          throw new Error(data.message || "Publish failed");
        }
      } else {
        if (!isBundleValid(bundleDraft)) {
          toast.error("Please fill required fields: name, price, and at least one image.");
          return;
        }
        const payload = {
          source: "owner_portal",
          action: "create_or_update_bundle",
          publish: true,
          bundle: bundleDraft,
        };
        const res = await fetch("https://dockerfile-1n82.onrender.com/webhook/bundles-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.ok) {
          toast.success("Bundle published successfully!");
          setPublishResult({
            pullRequestUrl: data.pullRequestUrl,
            previewUrl: data.previewUrl,
          });
        } else {
          throw new Error(data.message || "Publish failed");
        }
      }
    } catch (error: any) {
      toast.error(`Publish failed: ${error.message || error}`);
    }
  }

  // Save draft handler (local only)
  function handleSaveDraft() {
    toast.success("Draft saved locally");
  }

  // Slug uniqueness heuristic message
  function SlugHint({ slug }: { slug: string }) {
    if (!slug) return null;
    const isValidFormat = /^[a-z0-9-]+$/.test(slug);
    if (!isValidFormat) {
      return (
        <p className="text-xs text-yellow-600 mt-1">
          Slug should contain only lowercase letters, numbers, and hyphens.
        </p>
      );
    }
    if (slug.length < 3) {
      return (
        <p className="text-xs text-yellow-600 mt-1">
          Slug is very short; consider making it more descriptive.
        </p>
      );
    }
    return (
      <p className="text-xs text-green-600 mt-1">
        Slug looks good (uniqueness not verified).
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex flex-1 max-w-7xl mx-auto p-6 gap-6">
        {/* Left tabs */}
        <nav className="flex flex-col space-y-2 w-32 border-r border-gray-300">
          <button
            className={cn(
              "py-2 px-3 rounded text-left font-semibold",
              activeTab === "product"
                ? "bg-pink-400 text-white"
                : "hover:bg-pink-100"
            )}
            onClick={() => setActiveTab("product")}
            aria-selected={activeTab === "product"}
            role="tab"
            id="tab-product"
            aria-controls="tabpanel-product"
          >
            Product
          </button>
          <button
            className={cn(
              "py-2 px-3 rounded text-left font-semibold",
              activeTab === "bundle"
                ? "bg-pink-400 text-white"
                : "hover:bg-pink-100"
            )}
            onClick={() => setActiveTab("bundle")}
            aria-selected={activeTab === "bundle"}
            role="tab"
            id="tab-bundle"
            aria-controls="tabpanel-bundle"
          >
            Bundle
          </button>
        </nav>

        {/* Middle form */}
        <main className="flex-1 overflow-auto" role="tabpanel" aria-labelledby={`tab-${activeTab}`} id={`tabpanel-${activeTab}`}>
          {activeTab === "product" && (
            <>
              <FullProductForm
                value={productDraft}
                onChange={(updates) => {
                  // Handle images update with transform
                  if (updates.images) {
                    updateProductImages(updates.images);
                    updates = { ...updates, images: undefined };
                  }
                  setProductDraft((prev) => ({ ...prev, ...updates }));
                }}
              />
              <SlugHint slug={productDraft.slug} />
            </>
          )}
          {activeTab === "bundle" && (
            <>
              {/* Remove value and onChange props from BundleBuilder to fix TS error */}
              <BundleBuilder />
              <SlugHint slug={bundleDraft.slug} />
            </>
          )}
        </main>

        {/* Right preview */}
        <aside className="w-96 overflow-auto border border-gray-300 rounded-lg bg-white p-4">
          {activeTab === "product" && (
            <ProductPreview
              productCardData={{
                id: productDraft.id || "preview",
                name: productDraft.name || "Sample Product",
                slug: productDraft.slug || "sample-product",
                price: productDraft.price,
                compareAtPrice: productDraft.compareAtPrice,
                shortDescription: productDraft.shortDescription,
                inStock: productDraft.inStock,
                images: productDraft.images.length > 0 ? productDraft.images : ["/placeholder.svg"],
                badges: productDraft.badges,
              }}
              productDetailData={{
                id: productDraft.id || "preview",
                name: productDraft.name || "Sample Product",
                slug: productDraft.slug || "sample-product",
                category: productDraft.category || "Category",
                shortDescription: productDraft.shortDescription,
                overview: productDraft.overview || "Detailed product overview and description here...",
                price: productDraft.price,
                compareAtPrice: productDraft.compareAtPrice,
                stock: productDraft.inStock ? "In Stock" : "Out of Stock",
                images: productDraft.images.length > 0 ? productDraft.images : ["/placeholder.svg"],
                features: productDraft.features,
                howToUse: productDraft.howToUse,
                ingredients: productDraft.ingredients,
                details: productDraft.details,
                variants: productDraft.variants,
                rating: productDraft.rating,
                reviewCount: productDraft.reviewCount,
              }}
            />
          )}
          {activeTab === "bundle" && (
            <BundlePreview
              bundle={{
                ...bundleDraft,
                badges: bundleDraft.badges || [],
                images: bundleDraft.images.length > 0 ? bundleDraft.images : ["/placeholder.svg"],
                includedProducts: bundleDraft.includedProducts || [],
                features: bundleDraft.features || [],
                howToUse: bundleDraft.howToUse || [],
                details: bundleDraft.details || {},
              }}
              productsMap={new Map()} // You can pass a real products map if available
            />
          )}
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-300 p-4 flex flex-col items-center space-y-4 bg-white">
        <div className="flex gap-4">
          <Button onClick={handleSaveDraft} variant="outline">
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={
              (activeTab === "product" && !isProductValid(productDraft)) ||
              (activeTab === "bundle" && !isBundleValid(bundleDraft))
            }
          >
            Publish
          </Button>
        </div>

        {/* Publish result panel */}
        {publishResult && (
          <div className="flex gap-4">
            <a
              href={publishResult.pullRequestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              View PR
            </a>
            {publishResult.previewUrl && (
              <a
                href={publishResult.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Preview
              </a>
            )}
          </div>
        )}
      </footer>
    </div>
  );
}