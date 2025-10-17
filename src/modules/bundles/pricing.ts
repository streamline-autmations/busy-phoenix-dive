import type { Bundle, CompositionItem, Product } from "./types";

export function computeBundlePrice(
  bundle: Bundle,
  productsMap: Map<string, Product>
): number {
  if (!bundle.composition.length) return 0;

  // Sum base price of composition items (qty * product price)
  let basePrice = 0;
  for (const item of bundle.composition) {
    const product = productsMap.get(item.productSlug);
    if (!product) continue;
    basePrice += (product.price || 0) * item.quantity;
  }

  const pricing = bundle.pricing;

  switch (pricing.mode) {
    case "fixed":
      return pricing.fixedPrice ?? basePrice;

    case "percent_off":
      if (pricing.percentOff === undefined) return basePrice;
      return basePrice * (1 - pricing.percentOff / 100);

    case "amount_off":
      if (pricing.amountOff === undefined) return basePrice;
      return Math.max(0, basePrice - pricing.amountOff);

    case "bogo":
      // For BOGO, assume buy X get Y free on the cheapest product in composition
      if (!pricing.bogo) return basePrice;
      const { buy, get } = pricing.bogo;
      // Find cheapest product price
      let cheapestPrice = Infinity;
      let totalQty = 0;
      for (const item of bundle.composition) {
        const product = productsMap.get(item.productSlug);
        if (!product) continue;
        if (product.price < cheapestPrice) cheapestPrice = product.price;
        totalQty += item.quantity;
      }
      if (cheapestPrice === Infinity) return basePrice;
      // Calculate how many free items apply
      const freeItems = Math.floor(totalQty / (buy + get)) * get;
      const discount = freeItems * cheapestPrice;
      return Math.max(0, basePrice - discount);

    default:
      return basePrice;
  }
}

export function computeSavings(
  bundle: Bundle,
  productsMap: Map<string, Product>
): number {
  const basePrice = bundle.composition.reduce((sum: number, item: CompositionItem) => {
    const product = productsMap.get(item.productSlug);
    if (!product) return sum;
    return sum + (product.price || 0) * item.quantity;
  }, 0);

  const effectivePrice = computeBundlePrice(bundle, productsMap);

  return Math.max(0, basePrice - effectivePrice);
}