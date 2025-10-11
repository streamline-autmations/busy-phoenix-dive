import { useState } from "react";
import ProductForm from "@/components/ProductForm";
import PreviewFrame from "@/components/PreviewFrame";
import ProductPage from "@/components/ProductPage";
import ProductCard from "@/components/ProductCard";
import { slugify } from "@/lib/slugify";
import { showSuccess, showError } from "@/utils/toast";
import type { ProductDraft } from "@/types/product";

const N8N = import.meta.env.VITE_N8N_URL;

export default function AddProductPage() {
  const [draft, setDraft] = useState<ProductDraft>({
    title: "", 
    price: 0, 
    shortDescription: "", 
    descriptionHtml: "",
    images: [], 
    status: "draft", 
    category: ""
  });
  const [lastSavedSlug, setLastSavedSlug] = useState<string | null>(null);

  async function onSave(p: ProductDraft) {
    const slug = slugify(p.title);
    const payload = {
      ...p,
      slug,
      currency: "ZAR",
      thumbnail: p.thumbnail || p.images?.[0] || "/placeholder.svg",
    };
    
    try {
      const r = await fetch(`${N8N}/products/save`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload)
      });
      
      const j = await r.json();
      if (!j.ok) throw new Error("Save failed");
      
      setLastSavedSlug(slug);
      showSuccess(`Draft saved successfully! ${j.prUrl ? "PR: " + j.prUrl : ""}`);
    } catch (error) {
      showError(`Save failed: ${error}`);
      throw error;
    }
  }

  async function onPublish(slug: string) {
    try {
      const r = await fetch(`${N8N}/products/publish?slug=${slug}`, { 
        method: "POST" 
      });
      
      const j = await r.json();
      if (!j.ok) throw new Error("Publish failed");
      
      showSuccess("Published successfully! 🎉");
      
      // Reset form after successful publish
      setTimeout(() => {
        if (confirm("Product published! Would you like to create another product?")) {
          setDraft({
            title: "", 
            price: 0, 
            shortDescription: "", 
            descriptionHtml: "",
            images: [], 
            status: "draft", 
            category: ""
          });
          setLastSavedSlug(null);
        }
      }, 1000);
    } catch (error) {
      showError(`Publish failed: ${error}`);
      throw error;
    }
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
          <h1 className="text-3xl font-bold">BLOM Add Products</h1>
          <p className="text-gray-600">Create and preview your product before publishing</p>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="text-gray-500">
              💡 Tip: After saving a draft, you can edit it at <code>/admin/products/your-slug/edit</code>
            </span>
            {lastSavedSlug && (
              <a 
                href={`/admin/products/${lastSavedSlug}/edit`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Edit "{lastSavedSlug}" →
              </a>
            )}
          </div>
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
                <div className="p-4 bg-gray-50">
                  <div className="max-w-xs">
                    <ProductCard p={previewProduct} />
                  </div>
                </div>
              </PreviewFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}