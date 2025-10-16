import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";

interface ProductPageProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    currency: string;
    image: string;
    images?: string[];
    rating?: number;
    reviews?: number;
    badges?: string[];
    category?: string;
    inStock?: boolean;
    shortDescription?: string;
    descriptionHtml?: string;
    sku?: string;
    tags?: string[];
  };
}

export default function ProductPageTemplate({ product }: ProductPageProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const allImages = product.images?.length ? product.images : [product.image];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
              <img 
                src={allImages[0]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1">
                    -{discountPercentage}% OFF
                  </Badge>
                </div>
              )}
              {product.badges?.map((badge, index) => (
                <div key={index} className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {badge}
                  </Badge>
                </div>
              ))}
            </div>
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.slice(1, 5).map((img, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-md bg-gray-50 cursor-pointer hover:opacity-75">
                    <img 
                      src={img} 
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              {product.category && (
                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">
                  {product.category}
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              {product.sku && (
                <div className="text-sm text-gray-500">
                  SKU: {product.sku}
                </div>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {product.currency} {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.currency} {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-sm">
                {product.inStock !== false ? (
                  <span className="text-green-600 font-medium">✓ In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">✗ Out of Stock</span>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div className="text-gray-700 leading-relaxed">
                {product.shortDescription}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  size="lg"
                  disabled={product.inStock === false}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" className="w-full" size="lg">
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">Free Shipping</div>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">2 Year Warranty</div>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">30 Day Returns</div>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900">Tags:</div>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                {product.descriptionHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                ) : (
                  <p className="text-gray-600">
                    {product.shortDescription || "No description available."}
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium">Product Details</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {product.sku && <div>SKU: {product.sku}</div>}
                    {product.category && <div>Category: {product.category}</div>}
                    <div>Price: {product.currency} {product.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="text-center py-8 text-gray-500">
                <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <div className="text-lg font-medium mb-2">No reviews yet</div>
                <div className="text-sm">Be the first to review this product</div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}