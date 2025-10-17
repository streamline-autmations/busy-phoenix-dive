export interface Product {
  slug: string;
  title: string;
  price: number;
  [key: string]: any;
}

export interface CompositionItem {
  productSlug: string;
  quantity: number;
  optional?: boolean;
}

export interface Pricing {
  mode: "fixed" | "percent_off" | "amount_off" | "bogo";
  fixedPrice?: number;
  percentOff?: number;
  amountOff?: number;
  bogo?: {
    buy: number;
    get: number;
  };
}

export interface Limits {
  perOrderMax?: number;
  overallCap?: number;
}

export interface Schedule {
  startsAt: Date;
  endsAt: Date;
}

export interface Bundle {
  slug: string;
  title: string;
  status: "draft" | "active" | "archived";
  thumbnail?: string;
  images?: string[];
  composition: CompositionItem[];
  pricing: Pricing;
  limits?: Limits;
  schedule?: Schedule;
  badges?: string[];
  tags?: string[];
  descriptions?: {
    short?: string;
    long?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}