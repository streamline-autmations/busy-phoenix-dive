import React, { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  shortDescription?: string;
  inStock: boolean;
  images: string[];
  badges?: string[];
}

export const ProductCard: React.FC<ProductCardProps & { className?: string }> = ({
  id,
  name,
  slug,
  price,
  compareAtPrice = null,
  shortDescription = "",
  inStock,
  images,
  badges = [],
  className = "",
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || price === -1) return;
    // Add to cart logic here
    console.log("Added to cart:", name);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleCardClick = () => {
    window.location.href = `/products/${slug}`;
  };

  const formatPrice = (price: number) => `R${price.toFixed(2)}`;

  return (
    <article
      className={`product-card group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 ${className}`}
      onClick={handleCardClick}
      aria-label={`View details for ${name}`}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-3xl">
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover rounded-3xl"
          loading="lazy"
        />

        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`inline-block text-xs font-bold px-2 py-1 rounded-full uppercase whitespace-nowrap ${
                  badge === "Bestseller"
                    ? "bg-pink-400 text-white"
                    : badge === "New"
                    ? "bg-blue-500 text-white"
                    : badge === "Sale"
                    ? "bg-red-500 text-white"
                    : "bg-pink-400 text-white"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? "fill-current text-pink-400" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-pink-500 transition-colors truncate">
          {name}
        </h3>

        {shortDescription && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{shortDescription}</p>
        )}

        {/* Price */}
        <div className="text-center mb-3">
          <span className="text-xl font-bold text-gray-900">
            {price === -1 ? "Coming Soon" : formatPrice(price)}
          </span>
          {compareAtPrice && (
            <span className="text-sm text-gray-400 line-through ml-2">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || price === -1}
          className={`w-full py-2 px-4 rounded-full font-semibold transition-all duration-200 ${
            inStock && price !== -1
              ? "bg-pink-400 text-white hover:bg-pink-500 hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          aria-disabled={!inStock || price === -1}
        >
          <ShoppingCart className="h-4 w-4 inline mr-2" />
          {price === -1 ? "Coming Soon" : inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
};