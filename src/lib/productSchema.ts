export type ProductDraft = {
  title: string;
  slug: string;
  price: number;
  currency: "ZAR";
  sku?: string;
  status: "draft" | "active";
  stock?: number;
  badges?: string[];
  category?: string;
  tags?: string[];
  thumbnail?: string;
  images: string[];
  shortDescription?: string;
  descriptionHtml?: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function normalizeDraft(input: Partial<ProductDraft>): ProductDraft {
  return {
    title: String(input.title || '').trim(),
    slug: input.slug ? String(input.slug).trim() : slugify(input.title || ''),
    price: Number(input.price) || 0,
    currency: "ZAR",
    sku: input.sku ? String(input.sku).trim() : undefined,
    status: input.status === "active" ? "active" : "draft",
    stock: input.stock ? Number(input.stock) : undefined,
    badges: Array.isArray(input.badges) 
      ? input.badges.map(b => String(b).trim()).filter(Boolean)
      : undefined,
    category: input.category ? String(input.category).trim() : undefined,
    tags: Array.isArray(input.tags)
      ? input.tags.map(t => String(t).trim()).filter(Boolean)
      : undefined,
    thumbnail: input.thumbnail ? String(input.thumbnail).trim() : undefined,
    images: Array.isArray(input.images) 
      ? input.images.map(img => String(img).trim()).filter(Boolean)
      : [],
    shortDescription: input.shortDescription 
      ? String(input.shortDescription).trim() 
      : undefined,
    descriptionHtml: input.descriptionHtml 
      ? String(input.descriptionHtml).trim() 
      : undefined,
    seo: input.seo ? {
      title: input.seo.title ? String(input.seo.title).trim() : undefined,
      description: input.seo.description ? String(input.seo.description).trim() : undefined,
    } : undefined,
  };
}

export function validateDraft(draft: ProductDraft): string[] {
  const errors: string[] = [];

  if (!draft.title.trim()) {
    errors.push('Title is required');
  }

  if (draft.price < 0) {
    errors.push('Price must be 0 or greater');
  }

  if (draft.images.length === 0) {
    errors.push('At least one image is required');
  }

  return errors;
}