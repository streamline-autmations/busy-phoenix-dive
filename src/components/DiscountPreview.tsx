import React from "react";

interface DiscountPreviewProps {
  discount: any;
}

export default function DiscountPreview({ discount }: DiscountPreviewProps) {
  if (!discount) return null;

  return (
    <div className="p-4 bg-white border rounded shadow-sm max-w-lg">
      <h2 className="text-xl font-bold mb-2">Discount Preview</h2>
      <div><strong>ID:</strong> {discount.id}</div>
      <div><strong>Type:</strong> {discount.type}</div>
      {discount.type === "coupon" && <div><strong>Code:</strong> {discount.code}</div>}
      <div><strong>Label:</strong> {discount.label}</div>
      <div><strong>Value:</strong> {discount.valueType === "percent" ? `${discount.percent}%` : `${discount.amount} ${discount.currency}`}</div>
      <div><strong>Applies To All:</strong> {discount.appliesToAll ? "Yes" : "No"}</div>
      <div><strong>Status:</strong> {discount.status}</div>
    </div>
  );
}