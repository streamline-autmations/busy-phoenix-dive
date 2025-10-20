import React from "react";
import { ProductCard, ProductCardProps } from "./ProductCard";
import { NormalProductDetailPage, NormalProductDetailPageProps } from "./NormalProductDetailPage";
import PreviewWrapper from "./PreviewWrapper";

interface ProductPreviewProps {
  productCardData: ProductCardProps;
  productDetailData: NormalProductDetailPageProps;
}

export default function ProductPreview({ productCardData, productDetailData }: ProductPreviewProps) {
  return (
    <PreviewWrapper
      cardPreview={<ProductCard {...productCardData} />}
      pagePreview={<NormalProductDetailPage {...productDetailData} />}
    />
  );
}