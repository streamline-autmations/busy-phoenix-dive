import { cardImg } from "@/lib/cloudinary";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

export default function ProductCard({ p }: { p: Partial<Product> }) {
  const hasDiscount = p.compareAt && p.price && p.compareAt > p.price;
  const discountPercent = hasDiscount 
    ? Math.round(((p.compareAt! - p.price!) / p.compareAt!) * 100)
    : 0;

  return (
    <article className="p-3 border rounded-xl bg-white hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={cardImg(p.thumbnail || "/placeholder.svg")} 
          alt={p.title || "Product"} 
          className="w-full rounded-lg aspect-square object-cover" 
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}
        {p.status === "draft" && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Draft
          </div>
        )}
      </div>
      
      <div className="mt-3 space-y-2">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2">{p.title || "Untitled Product"}</h3>
          {p.subtitle && (
            <p className="text-xs text-muted-foreground line-clamp-1">{p.subtitle}</p>
          )}
        </div>
        
        {p.shortDescription && (
          <p className="text-xs text-gray-600 line-clamp-2">{p.shortDescription}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {typeof p.price === "number" && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">R {p.price.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="text-xs text-gray-500 line-through">
                    R {p.compareAt!.toFixed(2)}
                  </span>
                )}
              </div>
            )}
            {p.category && (
              <div className="text-xs text-muted-foreground capitalize">
                {p.category}
              </div>
            )}
          </div>
          
          {p.rating && (
            <div className="text-xs text-yellow-600">
              ⭐ {p.rating.toFixed(1)}
            </div>
          )}
        </div>
        
        {!!p.badges?.length && (
          <div className="flex gap-1 flex-wrap">
            {p.badges.slice(0, 3).map((b: string) => (
              <Badge key={b} variant="secondary" className="text-[10px] px-1 py-0">
                {b}
              </Badge>
            ))}
            {p.badges.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                +{p.badges.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {!!p.tags?.length && (
          <div className="flex gap-1 flex-wrap">
            {p.tags.slice(0, 2).map((tag: string) => (
              <span key={tag} className="text-[9px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                #{tag}
              </span>
            ))}
            {p.tags.length > 2 && (
              <span className="text-[9px] text-gray-500">
                +{p.tags.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}