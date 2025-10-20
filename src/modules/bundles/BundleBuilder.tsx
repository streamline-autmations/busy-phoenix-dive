"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import CloudinaryUpload from "./CloudinaryUpload";
import Preview from "./Preview";
import { toast } from "sonner";
import { slugify } from "@/lib/slugify";
import { saveDraft, publishPR, sanitizeBranchName } from "./api";
import productsIndex from "../../content/products/index.json";
import type { Bundle } from "./types";
import type { Product } from "./types";

const bundleSchema = z.object({
  id: z.string().min(1),
  type: z.literal("bundle"),
  name: z.string().min(1, "Name is required"),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  price: z.number().min(0, "Price must be 0 or greater"),
  compareAtPrice: z.number().min(0, "Compare at price must be 0 or greater"),
  shortDescription: z.string().min(1, "Short description is required"),
  description: z.string().optional(),
  images: z.array(z.string().url()).min(2, "At least 2 images are required"),
  badges: z.array(z.string()),
  includedProducts: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    quantity: z.number().int().min(1),
    price: z.number().min(0).optional(),
  })).min(1, "At least one included product is required"),
  features: z.array(z.string()).optional(),
  howToUse: z.array(z.string()).optional(),
  details: z.object({
    bundleValue: z.string(),
    bundlePrice: z.string(),
    savings: z.string(),
    totalItems: z.string(),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

type FormData = z.infer<typeof bundleSchema>;

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
    defaultValues: {
      id: "bundle-1",
      type: "bundle",
      name: "",
      slug: "",
      price: 0,
      compareAtPrice: 0,
      shortDescription: "",
      description: "",
      images: [],
      badges: [],
      includedProducts: [],
      features: [],
      howToUse: [],
      details: {
        bundleValue: "R0",
        bundlePrice: "R0",
        savings: "R0 (0% off)",
        totalItems: "0 products included",
      },
      seo: {
        title: "",
        description: "",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "includedProducts",
  });

  // Auto-generate slug from name if slug empty or matches previous slugified name
  useEffect(() => {
    const watchName = watch("name");
    const watchSlug = watch("slug");
    if (!watchSlug || watchSlug === slugify(watchName)) {
      setValue("slug", slugify(watchName));
    }
  }, [watch("name"), watch("slug"), setValue]);

  // Auto badges: "Bundle" + "Save X%"
  useEffect(() => {
    const watchPrice = watch("price");
    const watchCompareAtPrice = watch("compareAtPrice");
    if (watchPrice && watchCompareAtPrice && watchCompareAtPrice > 0) {
      const percent = Math.round(((watchCompareAtPrice - watchPrice) / watchCompareAtPrice) * 100);
      setValue("badges", ["Bundle", `Save ${percent}%`]);
    } else {
      setValue("badges", ["Bundle"]);
    }
  }, [watch("price"), watch("compareAtPrice"), setValue]);

  // Calculate details fields automatically
  useEffect(() => {
    const watchCompareAtPrice = watch("compareAtPrice");
    const watchPrice = watch("price");
    const watchIncludedProducts = watch("includedProducts");
    const savingsAmount = watchCompareAtPrice - watchPrice;
    const percent = watchCompareAtPrice > 0 ? Math.round((savingsAmount / watchCompareAtPrice) * 100) : 0;
    const totalItems = watchIncludedProducts.length;
    setValue("details", {
      bundleValue: `R${watchCompareAtPrice.toFixed(2)}`,
      bundlePrice: `R${watchPrice.toFixed(2)}`,
      savings: `R${savingsAmount.toFixed(2)} (${percent}% off)`,
      totalItems: `${totalItems} product${totalItems !== 1 ? "s" : ""} included`,
    });
  }, [watch("compareAtPrice"), watch("price"), watch("includedProducts"), setValue]);

  // Add included product from productsIndex by slug
  function addProductBySlug(slug: string) {
    const product = productsIndex.find((p: Product) => p.slug === slug);
    if (!product) {
      toast.error("Product not found");
      return;
    }
    // Check if already included
    const watchIncludedProducts = watch("includedProducts");
    if (watchIncludedProducts.some((p) => p.id === product.slug)) {
      toast.error("Product already included");
      return;
    }
    append({
      id: product.slug,
      name: product.title,
      quantity: 1,
      price: product.price,
    });
    // Update compareAtPrice sum
    const watchCompareAtPrice = watch("compareAtPrice");
    const newCompareAtPrice = watchCompareAtPrice + product.price;
    setValue("compareAtPrice", newCompareAtPrice);
  }

  // Remove included product and update compareAtPrice
  function removeProduct(index: number) {
    const watchIncludedProducts = watch("includedProducts");
    const watchCompareAtPrice = watch("compareAtPrice");
    const product = watchIncludedProducts[index];
    if (!product) return;
    remove(index);
    const newCompareAtPrice = watchCompareAtPrice - (product.price || 0);
    setValue("compareAtPrice", newCompareAtPrice);
  }

  // Handle form submit for save draft
  const onSave: SubmitHandler<FormData> = async (data) => {
    try {
      await saveDraft(data);
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
    }
  };

  // Handle form submit for publish
  const onPublish: SubmitHandler<FormData> = async (data) => {
    try {
      const branchClean = sanitizeBranchName(data.slug);
      await publishPR({ branchClean, slug: data.slug, title: data.name });
      toast.success("Publish request sent");
    } catch (error) {
      toast.error("Failed to publish");
    }
  };

  // Adapted bundle object for Preview to match Bundle type
  const formValues = getValues();

  // Map formValues to Bundle type expected by Preview
  const previewBundle: Bundle = {
    slug: formValues.slug,
    title: formValues.name,
    status: "draft", // default status
    composition: formValues.includedProducts.map((item: { id: string; quantity: number }) => ({
      productSlug: item.id,
      quantity: item.quantity,
      optional: false,
    })),
    pricing: {
      mode: "fixed",
      fixedPrice: formValues.price,
    },
    badges: formValues.badges,
    images: formValues.images,
    descriptions: {
      short: formValues.shortDescription,
      long: formValues.description,
    },
    seo: formValues.seo,
    createdAt: formValues.createdAt,
    updatedAt: formValues.updatedAt,
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto min-h-screen">
      <form
        onSubmit={handleSubmit(onSave)}
        className="flex-1 max-w-lg space-y-6 overflow-auto"
        noValidate
      >
        {/* form fields unchanged */}
        {/* ... */}
      </form>

      <div className="flex-1 bg-white border rounded-lg shadow-sm p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        <Preview bundle={previewBundle} productsMap={new Map(productsIndex.map((p: Product) => [p.slug, p]))} />
      </div>
    </div>
  );
}