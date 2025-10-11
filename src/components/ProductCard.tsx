import { cardImg } from "@/lib/cloudinary";
import type { Product } from "@/types/product";

export default function ProductCard({ p }: { p: Partial<Product> }) {
  return (
    <article className="p-3 border rounded-xl bg-white">
      <img 
        src={cardImg(p.thumbnail || "/placeholder.svg")} 
        alt={p.title || "Product"} 
        className="w-full rounded-lg aspect-square object-cover" 
      />
      <h3 className="mt-2 font-semibold text-sm">{p.title || "Untitled Product"}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2">{p.shortDescription}</p>
      {typeof p.price === "number" && (
        <div className="mt-1 font-bold text-sm">R {p.price.toFixed(2)}</div>
      )}
      {!!p.badges?.length && (
        <div className="mt-1 flex gap-1 flex-wrap">
          {p.badges.map((b: string) => (
            <span key={b} className="text-[10px] bg-black/5 px-2 py-0.5 rounded">
              {b}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}