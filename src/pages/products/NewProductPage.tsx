/* ... rest of imports and code unchanged ... */

import ProductPreview from "@/components/ProductPreview";
import type { ProductCardProps } from "@/components/ProductCard";
import type { NormalProductDetailPageProps } from "@/components/NormalProductDetailPage";

/* ... inside component ... */

// Replace this incorrect usage:
{/* <ProductPreview draft={normalizedDraft} /> */}

// With correct usage:
<ProductPreview
  productCardData={productCardData}
  productDetailData={productDetailData}
/>

/* ... rest of code unchanged ... */