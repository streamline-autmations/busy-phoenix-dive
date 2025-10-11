export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  price: number;
  currency: string;
  sku?: string;
  status: "draft" | "active" | "archived";
  stock?: number;
  category?: string;
  tags?: string[];
  badges?: string[];
  thumbnail: string;
  images: string[];
  shortDescription?: string;
  descriptionHtml?: string;
  rating?: number;
  reviews?: number;
  compareAt?: number;
  stockStatus?: string;
  seo?: { title?: string; description?: string };
  createdAt?: string;
  updatedAt?: string;
};

export type ProductDraft = Partial<Product> & {
  // required while drafting
  title: string;
  price: number;
  status: "draft" | "active";
  images: string[];
  thumbnail?: string;
};