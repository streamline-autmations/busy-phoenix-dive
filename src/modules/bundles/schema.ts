import { z } from "zod";

export const compositionItemSchema = z.object({
  productSlug: z.string().min(1, "Product slug is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  optional: z.boolean().optional().default(false),
});

export const pricingModes = ["fixed", "percent_off", "amount_off", "bogo"] as const;

export const pricingSchema = z.object({
  mode: z.enum(pricingModes),
  fixedPrice: z.number().min(0).optional(),
  percentOff: z.number().min(0).max(100).optional(),
  amountOff: z.number().min(0).optional(),
  bogo: z.object({
    buy: z.number().int().min(1),
    get: z.number().int().min(1),
  }).optional(),
});

export const limitsSchema = z.object({
  perOrderMax: z.number().int().min(1).optional(),
  overallCap: z.number().int().min(1).optional(),
});

export const scheduleSchema = z.object({
  startsAt: z.date(),
  endsAt: z.date(),
}).refine((data) => data.endsAt >= data.startsAt, {
  message: "endsAt must be after or equal to startsAt",
  path: ["endsAt"],
});

export const bundleSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(["draft", "active", "archived"]),
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  composition: z.array(compositionItemSchema).min(1, "At least one composition item is required"),
  pricing: pricingSchema,
  limits: limitsSchema.optional(),
  schedule: scheduleSchema.optional(),
  badges: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  descriptions: z.object({
    short: z.string().optional(),
    long: z.string().optional(),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});