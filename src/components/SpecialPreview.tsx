import React from "react";

interface SpecialPreviewProps {
  special: any;
}

export default function SpecialPreview({ special }: SpecialPreviewProps) {
  if (!special) return null;

  return (
    <div className="p-4 bg-white border rounded shadow-sm max-w-lg">
      <h2 className="text-xl font-bold mb-2">Special Preview</h2>
      <div><strong>ID:</strong> {special.id}</div>
      <div><strong>Title:</strong> {special.title}</div>
      <div><strong>Slug:</strong> {special.slug}</div>
      {special.heroImage && (
        <img src={special.heroImage} alt="Hero" className="w-full max-w-xs rounded mb-2" />
      )}
      <div><strong>Short Description:</strong> {special.shortDescription}</div>
      <div><strong>Discount ID:</strong> {special.discountId}</div>
      <div><strong>Badge:</strong> {special.badge}</div>
      <div><strong>Status:</strong> {special.status}</div>
      <div><strong>Start At:</strong> {special.startAt}</div>
      <div><strong>End At:</strong> {special.endAt}</div>
    </div>
  );
}