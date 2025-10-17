"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bundleSchema } from "./schema";
import { z } from "zod";
import CloudinaryUpload from "./CloudinaryUpload";
import Preview from "./Preview";
import { saveDraft, publishPR, sanitizeBranchName } from "./api";
import { toast } from "sonner";
import { slugify } from "@/lib/slugify";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

// Fix 1: Import JSON with relative path and declare module for JSON in a separate d.ts file
import productsIndex from "../../content/products/index.json";

type Product = {
  slug: string;
  title: string;
  price: number;
  [key: string]: any;
};

type FormData = z.infer<typeof bundleSchema>;

const defaultValues: FormData = {
  slug: "",
  title: "",
  status: "draft",
  thumbnail: "",
  images: [],
  composition: [],
  pricing: {
    mode: "fixed",
    fixedPrice: 0,
    percentOff: 0,
    amountOff: 0,
    bogo: { buy: 1, get: 1 },
  },
  limits: {},
  schedule: {
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  badges: [],
  tags: [],
  descriptions: {
    short: "",
    long: "",
  },
  seo: {
    title: "",
    description: "",
  },
};

export default function BundleBuilder() {
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(bundleSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "composition",
  });

  const watchTitle = watch("title");
  const watchSlug = watch("slug");
  const watchPricingMode = watch("pricing.mode");

  useEffect(() => {
    if (!watchSlug || watchSlug === slugify(watchTitle)) {
      setValue("slug", slugify(watchTitle));
    }
  }, [watchTitle, watchSlug, setValue]);

  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of productsIndex) {
      map.set(p.slug, p);
    }
    return map;
  }, []);

  const bundleData = getValues();
  const price = useMemo(() => {
    if (!bundleData.composition.length) return 0;
    let basePrice = 0;
    for (const item of bundleData.composition) {
      const product = productsMap.get(item.productSlug);
      if (!product) continue;
      basePrice += product.price * item.quantity;
    }
    const pricing = bundleData.pricing;
    switch (pricing.mode) {
      case "fixed":
        return pricing.fixedPrice ?? basePrice;
      case "percent_off":
        return basePrice * (1 - (pricing.percentOff ?? 0) / 100);
      case "amount_off":
        return Math.max(0, basePrice - (pricing.amountOff ?? 0));
      case "bogo":
        return basePrice; // Simplified
      default:
        return basePrice;
    }
  }, [bundleData, productsMap]);

  const onSave: SubmitHandler<FormData> = async (data) => {
    try {
      await saveDraft({ type: "bundle", ...data });
    } catch {
      // handled in saveDraft
    }
  };

  const onPublish: SubmitHandler<FormData> = async (data) => {
    try {
      const branchClean = sanitizeBranchName(data.slug);
      await publishPR({ branchClean, slug: data.slug, title: data.title });
    } catch {
      // handled in publishPR
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  // Fix 2: Add explicit type for parameter p
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return productsIndex;
    const lower = searchTerm.toLowerCase();
    return productsIndex.filter(
      (p: Product) => p.slug.toLowerCase().includes(lower) || p.title.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto min-h-screen">
      <form
        onSubmit={handleSubmit(onSave)}
        className="flex-1 max-w-lg space-y-6 overflow-auto"
        noValidate
      >
        {/* ... form fields ... */}

        <div>
          <Label>Composition</Label>
          <input
            type="text"
            placeholder="Search products by slug or title"
            className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="space-y-2 max-h-48 overflow-auto border border-gray-200 rounded p-2">
            {/* Fix 3: Add explicit type for parameter p */}
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <select
                  className="flex-1 border border-gray-300 rounded px-2 py-1"
                  value={field.productSlug}
                  onChange={(e) => setValue(`composition.${index}.productSlug`, e.target.value)}
                >
                  <option value="">Select product</option>
                  {filteredProducts.map((p: Product) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title} ({p.slug})
                    </option>
                  ))}
                </select>
                {/* ... other inputs ... */}
              </div>
            ))}
            <button type="button" onClick={() => append({ productSlug: "", quantity: 1, optional: false })}>
              Add Item
            </button>
          </div>
        </div>

        {/* ... rest of form ... */}

      </form>

      {/* ... preview pane ... */}
    </div>
  );
}