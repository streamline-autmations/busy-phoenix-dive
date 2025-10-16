import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    currency: string;
    image: string;
    rating?: number;
    reviews?: number;
    badges?: string[];
    category?: string;
    inStock?: boolean;
  };
}

export default function ProductCardTemplate({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          {product.badges?.map((badge, index) => (
            <Badge key={index} variant="secondary" className="bg-white/90 text-gray-800">
              {badge}
            </Badge>
          ))}
        </div>

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Quick Add Button */}
        <Button
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Quick Add
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        {product.category && (
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {product.category}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} {product.reviews && `(${product.reviews})`}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {product.currency} {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.currency} {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="text-xs">
            {product.inStock !== false ? (
              <span className="text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}