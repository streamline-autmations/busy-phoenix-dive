import { galleryImg } from "@/lib/cloudinary";
import type { Product } from "@/types/product";

export default function ProductPage({ p }: { p: Partial<Product> }) {
  const images = p.images?.length ? p.images : [p.thumbnail || "/placeholder.svg"];
  
  return (
    <section className="p-4 md:p-6 bg-white">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {images.map((u: string, i: number) => (
            <img 
              key={i} 
              src={galleryImg(u)} 
              alt={`${p.title || "Product"} ${i + 1}`} 
              className="w-full rounded-lg object-cover" 
            />
          ))}
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{p.title || "Untitled product"}</h1>
          {p.subtitle && <p className="text-muted-foreground">{p.subtitle}</p>}
          {typeof p.price === "number" && (
            <div className="text-xl font-semibold">R {p.price.toFixed(2)}</div>
          )}
          {p.shortDescription && (
            <p className="text-gray-600">{p.shortDescription}</p>
          )}
          {p.descriptionHtml && (
            <div 
              className="prose max-w-none text-sm" 
              dangerouslySetInnerHTML={{ __html: p.descriptionHtml }} 
            />
          )}
        </div>
      </div>
    </section>
  );
}