import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductForm from "@/components/ProductForm";
import PreviewFrame from "@/components/PreviewFrame";
import ProductPage from "@/components/ProductPage";
import ProductCard from "@/components/ProductCard";
import { slugify } from "@/lib/slugify";
import type { ProductDraft } from "@/types/product";

const N8N = import.meta.env.VITE_N8N_URL;

export default function EditProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [draft, setDraft] = useState<ProductDraft>({
    title: "", 
    price: 0, 
    shortDescription: "", 
    descriptionHtml: "",
    images: [], 
    status: "draft", 
    category: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch existing product data
    // fetch(`/content/products/${slug}.json`)
    //   .then(r => r.json())
    //   .then(data => setDraft(data))
    //   .finally(() => setLoading(false));
    
    // For now, just set loading to false
    setLoading(false);
  }, [slug]);

  async function onSave(p: ProductDraft) {
    const payload = {
      ...p,
      slug: slugify(p.title),
      currency: "ZAR",
      thumbnail: p.thumbnail || p.images?.[0] || "/placeholder.svg",
    };
    
    const r = await fetch(`${N8N}/products/save`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(payload)
    });
    
    const j = await r.json();
    if (!j.ok) throw new Error("Save failed");
    
    alert(`Draft updated successfully! ${j.prUrl ? "PR: " + j.prUrl : ""}`);
  }

  async function onPublish(productSlug: string) {
    const r = await fetch(`${N8N}/products/publish?slug=${productSlug}`, { 
      method: "POST" 
    });
    
    const j = await r.json();
    if (!j.ok) throw new Error("Publish failed");
    
    alert("Published successfully ✅");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading product...</div>
      </div>
    );
  }

  const previewProduct = {
    ...draft,
    slug: slugify(draft.title),
    currency: "ZAR",
    images: draft.images?.length ? draft.images : ["/placeholder.svg"],
    thumbnail: draft.thumbnail || draft.images?.[0] || "/placeholder.svg"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Product: {slug}</h1>
          <p className="text-gray-600">Update and preview your product changes</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <ProductForm 
              value={draft} 
              onChange={setDraft} 
              onSave={onSave} 
              onPublish={onPublish} 
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Page Preview</h2>
              <PreviewFrame>
                <ProductPage p={previewProduct} />
              </PreviewFrame>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Card Preview</h2>
              <PreviewFrame>
                <div className="p-4">
                  <ProductCard p={previewProduct} />
                </div>
              </PreviewFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}