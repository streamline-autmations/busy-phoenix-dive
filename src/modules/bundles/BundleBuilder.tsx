"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bundleSchema } from "./schema";
import { z } from "zod";
import CloudinaryUpload from "./CloudinaryUpload";
import Preview from "./Preview";
import { saveDraft, publishPR, sanitizeBranchName } from "./api";
import { toast } from "sonner";
import { slugify } from "@/lib/slugify";

import {
  Input,
  Label,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from "@/components/ui";

import productsIndex from "/content/products/index.json";

type Product = typeof productsIndex[number];

const defaultValues = {
  slug: "",
  title: "",
  status: "draft",
  thumbnail: "",
  images: [] as string[],
  composition: [] as { productSlug: string; quantity: number; optional: boolean }[],
  pricing: {
    mode: "fixed",
    fixedPrice: 0,
    percentOff: 0,
    amountOff: 0,
    bogo: { buy: 1, get: 1 },
  },
  limits: {
    perOrderMax: undefined,
    overallCap: undefined,
  },
  schedule: {
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  badges: [] as string[],
  tags: [] as string[],
  descriptions: {
    short: "",
    long: "",
  },
  seo: {
    title: "",
    description: "",
  },
};

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

  // Auto-generate slug from title if slug empty or matches old title slug
  useEffect(() => {
    if (!watchSlug || watchSlug === slugify(watchTitle)) {
      setValue("slug", slugify(watchTitle));
    }
  }, [watchTitle, watchSlug, setValue]);

  // Products map for quick lookup
  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of productsIndex) {
      map.set(p.slug, p);
    }
    return map;
  }, []);

  // Compute live price and savings
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
        // Simplified: no discount calculation here
        return basePrice;
      default:
        return basePrice;
    }
  }, [bundleData, productsMap]);

  // Handlers
  async function onSave(data: FormData) {
    try {
      await saveDraft({ type: "bundle", ...data });
    } catch {
      // error handled in saveDraft
    }
  }

  async function onPublish(data: FormData) {
    try {
      const branchClean = sanitizeBranchName(data.slug);
      await publishPR({ branchClean, slug: data.slug, title: data.title });
    } catch {
      // error handled in publishPR
    }
  }

  // Search products for composition select
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return productsIndex;
    const lower = searchTerm.toLowerCase();
    return productsIndex.filter(
      (p: Product) => p.slug.toLowerCase().includes(lower) || p.title.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto min-h-screen">
      {/* Left pane: form */}
      <form
        onSubmit={handleSubmit(onSave)}
        className="flex-1 max-w-lg space-y-6 overflow-auto"
        noValidate
      >
        {/* Basic */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <p className="text-red-600 text-sm">{errors.slug.message}</p>}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select {...register("status")}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}
        </div>

        {/* Badges and Tags */}
        <div>
          <Label>Badges</Label>
          <Controller
            control={control}
            name="badges"
            render={({ field }) => (
              <Input
                placeholder="Comma separated badges"
                value={field.value.join(", ")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))
                }
              />
            )}
          />
        </div>

        <div>
          <Label>Tags</Label>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <Input
                placeholder="Comma separated tags"
                value={field.value.join(", ")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))
                }
              />
            )}
          />
        </div>

        {/* Images */}
        <div>
          <Label>Thumbnail</Label>
          <Controller
            control={control}
            name="thumbnail"
            render={({ field }) => (
              <CloudinaryUpload
                value={field.value ? [field.value] : []}
                onChange={(urls: string[]) => field.onChange(urls[0] || "")}
              />
            )}
          />
          {errors.thumbnail && <p className="text-red-600 text-sm">{errors.thumbnail.message}</p>}
        </div>

        <div>
          <Label>Images</Label>
          <Controller
            control={control}
            name="images"
            render={({ field }) => (
              <CloudinaryUpload value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.images && <p className="text-red-600 text-sm">{errors.images.message}</p>}
        </div>

        {/* Composition editor */}
        <div>
          <Label>Composition</Label>
          <input
            type="text"
            placeholder="Search products by slug or title"
            className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
          <div className="space-y-2 max-h-48 overflow-auto border border-gray-200 rounded p-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <select
                  className="flex-1 border border-gray-300 rounded px-2 py-1"
                  value={field.productSlug}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setValue(`composition.${index}.productSlug`, e.target.value)}
                >
                  <option value="">Select product</option>
                  {filteredProducts.map((p: Product) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title} ({p.slug})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="w-16 border border-gray-300 rounded px-2 py-1"
                  value={field.quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(`composition.${index}.quantity`, Number(e.target.value))}
                />
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={field.optional}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(`composition.${index}.optional`, e.target.checked)}
                  />
                  Optional
                </label>
                <Button variant="destructive" size="sm" onClick={() => remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ productSlug: "", quantity: 1, optional: false })}
            >
              Add Item
            </Button>
          </div>
          {errors.composition && (
            <p className="text-red-600 text-sm">{errors.composition.message}</p>
          )}
        </div>

        {/* Pricing */}
        <div>
          <Label>Pricing Mode</Label>
          <Controller
            control={control}
            name="pricing.mode"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4">
                <label className="flex items-center gap-1">
                  <RadioGroupItem value="fixed" />
                  Fixed
                </label>
                <label className="flex items-center gap-1">
                  <RadioGroupItem value="percent_off" />
                  Percent Off
                </label>
                <label className="flex items-center gap-1">
                  <RadioGroupItem value="amount_off" />
                  Amount Off
                </label>
                <label className="flex items-center gap-1">
                  <RadioGroupItem value="bogo" />
                  BOGO
                </label>
              </RadioGroup>
            )}
          />
        </div>

        {watchPricingMode === "fixed" && (
          <div>
            <Label>Fixed Price</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              {...register("pricing.fixedPrice", { valueAsNumber: true })}
            />
          </div>
        )}

        {watchPricingMode === "percent_off" && (
          <div>
            <Label>Percent Off (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              step={0.1}
              {...register("pricing.percentOff", { valueAsNumber: true })}
            />
          </div>
        )}

        {watchPricingMode === "amount_off" && (
          <div>
            <Label>Amount Off</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              {...register("pricing.amountOff", { valueAsNumber: true })}
            />
          </div>
        )}

        {watchPricingMode === "bogo" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Buy</Label>
              <Input
                type="number"
                min={1}
                {...register("pricing.bogo.buy", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>Get</Label>
              <Input
                type="number"
                min={1}
                {...register("pricing.bogo.get", { valueAsNumber: true })}
              />
            </div>
          </div>
        )}

        {/* Limits */}
        <div>
          <Label>Per Order Max</Label>
          <Input
            type="number"
            min={1}
            {...register("limits.perOrderMax", { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label>Overall Cap</Label>
          <Input
            type="number"
            min={1}
            {...register("limits.overallCap", { valueAsNumber: true })}
          />
        </div>

        {/* Schedule */}
        <div>
          <Label>Starts At</Label>
          <Input
            type="datetime-local"
            {...register("schedule.startsAt", {
              setValueAs: (v) => new Date(v),
            })}
          />
        </div>

        <div>
          <Label>Ends At</Label>
          <Input
            type="datetime-local"
            {...register("schedule.endsAt", {
              setValueAs: (v) => new Date(v),
            })}
          />
        </div>

        {/* SEO */}
        <div>
          <Label>SEO Title</Label>
          <Input {...register("seo.title")} />
        </div>

        <div>
          <Label>SEO Description</Label>
          <Textarea {...register("seo.description")} />
        </div>

        {/* Descriptions */}
        <div>
          <Label>Short Description</Label>
          <Textarea {...register("descriptions.short")} />
        </div>

        <div>
          <Label>Long Description</Label>
          <Textarea {...register("descriptions.long")} />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Draft / Preview"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={handleSubmit(onPublish)}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>

      {/* Right pane: live preview */}
      <div className="flex-1 overflow-auto border rounded p-4 bg-white shadow-sm">
        <Preview bundle={watch()} productsMap={productsMap} />
      </div>
    </div>
  );
}