"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { slugify as slugifyUtil } from "@/lib/slugify";
import Navigation from "@/components/Navigation";
import ProductPreview from "@/components/ProductPreview";
import BundlePreview from "@/modules/bundles/Preview";
import { FullProductForm, FullProductFormValue } from "@/components/FullProductForm";
import BundleBuilder from "@/modules/bundles/BundleBuilder";
import DiscountForm, { DiscountFormValue } from "@/components/DiscountForm";
import SpecialForm, { SpecialFormValue } from "@/components/SpecialForm";
import DiscountPreview from "@/components/DiscountPreview";
import SpecialPreview from "@/components/SpecialPreview";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { computeFinalPrice } from "@/lib/discountUtils";

type Tab = "product" | "bundle" | "discount" | "special";

function slugify(s: string) {
  return slugifyUtil(s).toLowerCase();
}

export default function OwnerPortal() {
  const [activeTab, setActiveTab] = useState<Tab>("product");

  // Product draft state
  const [productDraft, setProductDraft] = useState<FullProductFormValue>(() => {
    try {
      const saved = localStorage.getItem("owner_portal_product_draft");
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
      const saved = localStorage.getItem("owner_portal_bundle_draft");
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

  // Discount draft state
  const [discountDraft, setDiscountDraft] = useState<DiscountFormValue>(() => {
    try {
      const saved = localStorage.getItem("owner_portal_discount_draft");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: "",
      type: "coupon",
      code: "",
      label: "",
      valueType: "percent",
      percent: undefined,
      amount: undefined,
      currency: "ZAR",
      appliesToAll: true,
      appliesToProducts: [],
      appliesToBundles: [],
      appliesToCategories: [],
      constraintsStartAt: undefined,
      constraintsEndAt: undefined,
      minSubtotal: undefined,
      maxRedemptions: undefined,
      perCustomerLimit: undefined,
      stackingExclusive: false,
      stackingPriority: 0,
      status: "active",
    };
  });

  // Special draft state
  const [specialDraft, setSpecialDraft] = useState<SpecialFormValue>(() => {
    try {
      const saved = localStorage.getItem("owner_portal_special_draft");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: "",
      title: "",
      slug: "",
      heroImage: undefined,
      shortDescription: "",
      discountId: "",
      badge: "",
      status: "active",
      startAt: undefined,
      endAt: undefined,
    };
  });

  // Save drafts to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("owner_portal_product_draft", JSON.stringify(productDraft));
    } catch {}
  }, [productDraft]);

  useEffect(() => {
    try {
      localStorage.setItem("owner_portal_bundle_draft", JSON.stringify(bundleDraft));
    } catch {}
  }, [bundleDraft]);

  useEffect(() => {
    try {
      localStorage.setItem("owner_portal_discount_draft", JSON.stringify(discountDraft));
    } catch {}
  }, [discountDraft]);

  useEffect(() => {
    try {
      localStorage.setItem("owner_portal_special_draft", JSON.stringify(specialDraft));
    } catch {}
  }, [specialDraft]);

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

  // Slug auto-generation with manual override for discount
  useEffect(() => {
    if (!discountDraft.id || discountDraft.id === slugify(discountDraft.id)) {
      setDiscountDraft((prev) => ({ ...prev, id: slugify(discountDraft.id) }));
    }
  }, [discountDraft.id]);

  // Slug auto-generation with manual override for special
  useEffect(() => {
    if (!specialDraft.slug || specialDraft.slug === slugify(specialDraft.slug)) {
      setSpecialDraft((prev) => ({ ...prev, slug: slugify(specialDraft.slug) }));
    }
  }, [specialDraft.slug]);

  // Save draft handlers
  function saveProductDraft() {
    toast.success("Product draft saved locally");
  }
  function saveBundleDraft() {
    toast.success("Bundle draft saved locally");
  }
  function saveDiscountDraft() {
    toast.success("Discount draft saved locally");
  }
  function saveSpecialDraft() {
    toast.success("Special draft saved locally");
  }

  // Publish handlers
  async function publishProduct() {
    toast.error("Publishing products not implemented here");
  }
  async function publishBundle() {
    toast.error("Publishing bundles not implemented here");
  }

  async function publishDiscount() {
    try {
      const res = await fetch(env.DISCOUNTS_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "owner_portal",
          action: "create_or_update_discount",
          publish: true,
          discount: discountDraft,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to publish discount");
      }
      const data = await res.json();
      toast.success("Discount published successfully!");
      setPublishResult({
        prUrl: data.pullRequestUrl,
        previewUrl: data.previewUrl,
      });
    } catch (error: any) {
      toast.error(`Publish failed: ${error.message || error}`);
    }
  }

  async function publishSpecial() {
    try {
      const res = await fetch(env.SPECIALS_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "owner_portal",
          action: "create_or_update_special",
          publish: true,
          special: specialDraft,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to publish special");
      }
      const data = await res.json();
      toast.success("Special published successfully!");
      setPublishResult({
        prUrl: data.pullRequestUrl,
        previewUrl: data.previewUrl,
      });
    } catch (error: any) {
      toast.error(`Publish failed: ${error.message || error}`);
    }
  }

  // Publish result state
  const [publishResult, setPublishResult] = useState<{ prUrl: string; previewUrl?: string } | null>(null);

  // Wrap setState to accept partial updates for onChange props
  const handleProductChange = useCallback(
    (updates: Partial<FullProductFormValue>) => {
      setProductDraft((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleDiscountChange = useCallback(
    (updates: Partial<DiscountFormValue>) => {
      setDiscountDraft((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleSpecialChange = useCallback(
    (updates: Partial<SpecialFormValue>) => {
      setSpecialDraft((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex flex-1 max-w-7xl mx-auto p-6 gap-6">
        {/* Left tabs */}
        <nav className="flex flex-col space-y-2 w-32 border-r border-gray-300" role="tablist" aria-orientation="vertical">
          {(["product", "bundle", "discount", "special"] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={cn(
                "py-2 px-3 rounded text-left font-semibold",
                activeTab === tab ? "bg-pink-400 text-white" : "hover:bg-pink-100"
              )}
              onClick={() => {
                setActiveTab(tab);
                setPublishResult(null);
              }}
              aria-selected={activeTab === tab}
              role="tab"
              id={`tab-${tab}`}
              aria-controls={`tabpanel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* Center form */}
        <main
          className="flex-1 overflow-auto"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          id={`tabpanel-${activeTab}`}
        >
          {activeTab === "product" && (
            <>
              <FullProductForm
                value={productDraft}
                onChange={handleProductChange}
                onSave={saveProductDraft}
                onPublish={publishProduct}
              />
            </>
          )}
          {activeTab === "bundle" && (
            <>
              <BundleBuilder />
            </>
          )}
          {activeTab === "discount" && (
            <DiscountForm
              value={discountDraft}
              onChange={handleDiscountChange}
              onSaveDraft={saveDiscountDraft}
              onPublish={publishDiscount}
            />
          )}
          {activeTab === "special" && (
            <SpecialForm
              value={specialDraft}
              onChange={handleSpecialChange}
              onSaveDraft={saveSpecialDraft}
              onPublish={publishSpecial}
            />
          )}
        </main>

        {/* Right preview */}
        <aside className="w-96 overflow-auto border border-gray-300 rounded-lg bg-white p-4">
          {activeTab === "product" && productDraft && (
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
          {activeTab === "discount" && (
            <DiscountPreview discount={discountDraft} />
          )}
          {activeTab === "special" && (
            <SpecialPreview special={specialDraft} />
          )}
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-300 p-4 flex flex-col items-center space-y-4 bg-white">
        <div className="flex gap-4">
          <Button
            onClick={() => {
              if (activeTab === "product") saveProductDraft();
              else if (activeTab === "bundle") saveBundleDraft();
              else if (activeTab === "discount") saveDiscountDraft();
              else if (activeTab === "special") saveSpecialDraft();
            }}
          >
            Save Draft
          </Button>
          <Button
            onClick={() => {
              if (activeTab === "product") publishProduct();
              else if (activeTab === "bundle") publishBundle();
              else if (activeTab === "discount") publishDiscount();
              else if (activeTab === "special") publishSpecial();
            }}
          >
            Publish
          </Button>
        </div>

        {publishResult && (
          <div className="flex gap-4">
            <a
              href={publishResult.prUrl}
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