export interface DiscountValue {
  type: "percent" | "amount";
  percent?: number;
  amount?: number;
  currency?: string;
}

export interface DiscountConstraints {
  startAt?: string; // ISO date string
  endAt?: string;   // ISO date string
  minSubtotal?: number;
  maxRedemptions?: number;
  perCustomerLimit?: number;
}

export interface DiscountStacking {
  exclusive: boolean;
  priority: number;
}

export interface Discount {
  id: string;
  type: "coupon" | "auto";
  code?: string;
  label?: string;
  value: DiscountValue;
  appliesTo: {
    all: boolean;
    products?: string[];
    bundles?: string[];
    categories?: string[];
  };
  constraints: DiscountConstraints;
  stacking: DiscountStacking;
  status: "active" | "paused";
}

export interface Item {
  id: string;
  type: "product" | "bundle";
  price: number;
  currency: string;
  category?: string;
  slug: string;
}

export interface Context {
  couponCode?: string;
  now?: Date;
}

export function computeFinalPrice(
  item: Item,
  discounts: Discount[],
  ctx: Context = {}
): { originalPrice: number; finalPrice: number; appliedDiscount?: Discount } {
  const now = ctx.now || new Date();
  const couponCode = ctx.couponCode?.toLowerCase();

  // Filter active discounts valid now
  const activeDiscounts = discounts.filter((d) => {
    if (d.status !== "active") return false;
    if (d.constraints.startAt && new Date(d.constraints.startAt) > now) return false;
    if (d.constraints.endAt && new Date(d.constraints.endAt) < now) return false;
    return true;
  });

  // Filter discounts that apply to this item
  const applicableDiscounts = activeDiscounts.filter((d) => {
    if (d.appliesTo.all) return true;
    if (item.type === "product" && d.appliesTo.products?.includes(item.id)) return true;
    if (item.type === "bundle" && d.appliesTo.bundles?.includes(item.id)) return true;
    if (d.appliesTo.categories?.includes(item.category || "")) return true;
    return false;
  });

  // If coupon code provided, filter to coupon discounts matching code
  let discountsToApply = applicableDiscounts;
  if (couponCode) {
    discountsToApply = applicableDiscounts.filter(
      (d) => d.type === "coupon" && d.code?.toLowerCase() === couponCode
    );
  } else {
    // If no coupon code, only auto discounts apply
    discountsToApply = applicableDiscounts.filter((d) => d.type === "auto");
  }

  if (discountsToApply.length === 0) {
    return { originalPrice: item.price, finalPrice: item.price };
  }

  // Sort by stacking priority descending
  discountsToApply.sort((a, b) => b.stacking.priority - a.stacking.priority);

  // If any discount is exclusive, only apply the highest priority exclusive discount
  const exclusiveDiscount = discountsToApply.find((d) => d.stacking.exclusive);
  if (exclusiveDiscount) {
    discountsToApply = [exclusiveDiscount];
  }

  let price = item.price;
  let appliedDiscount: Discount | undefined;

  for (const discount of discountsToApply) {
    let discountAmount = 0;
    if (discount.value.type === "percent" && discount.value.percent) {
      discountAmount = (price * discount.value.percent) / 100;
    } else if (discount.value.type === "amount" && discount.value.amount) {
      discountAmount = discount.value.amount;
    }
    const newPrice = Math.max(0, price - discountAmount);
    if (newPrice < price) {
      price = newPrice;
      appliedDiscount = discount;
      // If stacking is exclusive, stop applying further discounts
      if (discount.stacking.exclusive) break;
    }
  }

  return { originalPrice: item.price, finalPrice: price, appliedDiscount };
}