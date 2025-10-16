import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ruler, Package, Clock, Heart, ShoppingCart } from "lucide-react";

interface FurnitureCardProps {
  furniture: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    currency: string;
    image: string;
    dimensions?: {
      width: number;
      height: number;
      depth: number;
      unit: string;
    };
    material?: string;
    finish?: string;
    deliveryTime?: string;
    badges?: string[];
    category?: string;
    inStock?: boolean;
  };
}

export default function FurnitureCardTemplate({ furniture }: FurnitureCardProps) {
  const discountPercentage = furniture.originalPrice 
    ? Math.round(((furniture.originalPrice - furniture.price) / furniture.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img 
          src={furniture.image} 
          alt={furniture.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          {furniture.badges?.map((badge, index) => (
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

        {/* Quick View Button */}
        <Button
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          size="sm"
          variant="secondary"
        >
          <Ruler className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        {furniture.category && (
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {furniture.category}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {furniture.title}
        </h3>

        {/* Furniture Details */}
        <div className="space-y-2 text-sm text-gray-600">
          {furniture.dimensions && (
            <div className="flex items-center gap-1">
              <Ruler className="h-3 w-3" />
              <span>
                {furniture.dimensions.width} × {furniture.dimensions.height} × {furniture.dimensions.depth} {furniture.dimensions.unit}
              </span>
            </div>
          )}
          
          {furniture.material && (
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              <span>{furniture.material}</span>
              {furniture.finish && <span>• {furniture.finish}</span>}
            </div>
          )}
          
          {furniture.deliveryTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{furniture.deliveryTime}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {furniture.currency} {furniture.price.toFixed(2)}
            </span>
            {furniture.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {furniture.currency} {furniture.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="text-xs">
            {furniture.inStock !== false ? (
              <span className="text-green-600 font-medium">Available</span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button className="w-full" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}