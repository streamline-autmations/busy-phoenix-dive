import { galleryImg } from "@/lib/cloudinary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart } from "lucide-react";
import type { Product } from "@/types/product";

export default function ProductPage({ p }: { p: Partial<Product> }) {
  const images = p.images?.length ? p.images : [p.thumbnail || "/placeholder.svg"];
  const hasDiscount = p.compareAt && p.price && p.compareAt > p.price;
  const discountPercent = hasDiscount 
    ? Math.round(((p.compareAt! - p.price!) / p.compareAt!) * 100)
    : 0;

  return (
    <section className="p-4 md:p-6 bg-white">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative">
            <img 
              src={galleryImg(images[0])} 
              alt={p.title || "Product"} 
              className="w-full rounded-lg object-cover aspect-square" 
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold">
                -{discountPercent}% OFF
              </div>
            )}
            {p.status === "draft" && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                Draft
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((u: string, i: number) => (
                <img 
                  key={i} 
                  src={galleryImg(u)} 
                  alt={`${p.title || "Product"} ${i + 2}`} 
                  className="w-full rounded-md object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity" 
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  {p.title || "Untitled product"}
                </h1>
                {p.subtitle && (
                  <p className="text-lg text-muted-foreground mt-1">{p.subtitle}</p>
                )}
              </div>
              <Button variant="outline" size="icon" className="ml-4">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            {p.category && (
              <div className="text-sm text-muted-foreground capitalize mb-2">
                Category: {p.category}
              </div>
            )}
            
            {(p.rating || p.reviews) && (
              <div className="flex items-center gap-2 mb-3">
                {p.rating && (
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(p.rating!) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{p.rating.toFixed(1)}</span>
                  </div>
                )}
                {p.reviews && (
                  <span className="text-sm text-muted-foreground">
                    ({p.reviews} reviews)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            {typeof p.price === "number" && (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">R {p.price.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    R {p.compareAt!.toFixed(2)}
                  </span>
                )}
              </div>
            )}
            {p.sku && (
              <div className="text-sm text-muted-foreground">
                SKU: {p.sku}
              </div>
            )}
          </div>

          {/* Badges */}
          {!!p.badges?.length && (
            <div className="flex gap-2 flex-wrap">
              {p.badges.map((b: string) => (
                <Badge key={b} variant="secondary">
                  {b}
                </Badge>
              ))}
            </div>
          )}

          {/* Short Description */}
          {p.shortDescription && (
            <div className="text-gray-700 leading-relaxed">
              {p.shortDescription}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" size="lg">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              Buy Now
            </Button>
          </div>

          {/* Tags */}
          {!!p.tags?.length && (
            <div className="pt-4 border-t">
              <div className="text-sm font-medium mb-2">Tags:</div>
              <div className="flex gap-2 flex-wrap">
                {p.tags.map((tag: string) => (
                  <span 
                    key={tag} 
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Full Description */}
          {p.descriptionHtml && (
            <div className="pt-4 border-t">
              <div className="text-sm font-medium mb-3">Description:</div>
              <div 
                className="prose prose-sm max-w-none text-gray-700" 
                dangerouslySetInnerHTML={{ __html: p.descriptionHtml }} 
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}