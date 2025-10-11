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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) {
        setError("No product slug provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try fetching from n8n endpoint first
        const response = await fetch(`${N8N}/products/fetch?slug=${slug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        
        const productData = await response.json();
        
        // Transform the fetched data to match our ProductDraft type
        const transformedDraft: ProductDraft = {
          title: productData.title || "",
          price: productData.price || 0,
          subtitle: productData.subtitle || "",
          shortDescription: productData.shortDescription || "",
          descriptionHtml: productData.descriptionHtml || "",
          images: productData.images || [],
          status: productData.status || "draft",
          category: productData.category || "",
          thumbnail: productData.thumbnail,
          // Include other fields that might be present
          ...productData
        };
        
        setDraft(transformedDraft);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch product");
        
        // For development: If fetch fails, you can still use the form with empty data
        // Remove this in production once your n8n endpoint is ready
        console.warn("Using empty form data for development");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  async function onSave(p: ProductDraft) {
    const payload = {
      ...p,
      slug: slug, // Use the existing slug for updates
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
      
      alert(`Product updated successfully! ${j.prUrl ? "PR: " + j.prUrl : ""}`);
    } catch (error) {
      throw new Error(`Save failed: ${error}`);
    }
  }

  async function onPublish(productSlug: string) {
    try {
      const r = await fetch(`${N8N}/products/publish?slug=${productSlug}`, { 
        method: "POST" 
      });
      
      const j = await r.json();
      if (!j.ok) throw new Error("Publish failed");
      
      alert("Published successfully ✅");
    } catch (error) {
      throw new Error(`Publish failed: ${error}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Product</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-2">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
            <a 
              href="/admin/products/new" 
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 inline-block"
            >
              Create New Product
            </a>
          </div>
        </div>
      </div>
    );
  }

  const previewProduct = {
    ...draft,
    slug: slug || slugify(draft.title),
    currency: "ZAR",
    images: draft.images?.length ? draft.images : ["/placeholder.svg"],
    thumbnail: draft.thumbnail || draft.images?.[0] || "/placeholder.svg"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <a 
              href="/admin/products/new" 
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to Add Product
            </a>
          </div>
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