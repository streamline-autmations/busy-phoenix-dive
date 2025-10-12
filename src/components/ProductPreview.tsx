import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, ShoppingCart, Heart, Star } from 'lucide-react';
import type { ProductDraft } from '@/lib/productSchema';

interface ProductPreviewProps {
  draft: ProductDraft;
}

export default function ProductPreview({ draft }: ProductPreviewProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  
  const displayImages = draft.images.length > 0 ? draft.images : ['/placeholder.svg'];
  const displayThumbnail = draft.thumbnail || displayImages[0] || '/placeholder.svg';

  return (
    <div className="space-y-4">
      {/* Viewport Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewport === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewport('desktop')}
        >
          <Monitor className="h-4 w-4 mr-1" />
          Desktop
        </Button>
        <Button
          variant={viewport === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewport('mobile')}
        >
          <Smartphone className="h-4 w-4 mr-1" />
          Mobile
        </Button>
      </div>

      {/* Preview Container */}
      <div 
        className={`border rounded-lg overflow-hidden bg-white shadow-sm transition-all ${
          viewport === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
        }`}
      >
        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">Card Preview</TabsTrigger>
            <TabsTrigger value="page">Page Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="card" className="p-4">
            <ProductCard draft={draft} displayThumbnail={displayThumbnail} />
          </TabsContent>
          
          <TabsContent value="page" className="p-0">
            <ProductPage 
              draft={draft} 
              displayImages={displayImages}
              displayThumbnail={displayThumbnail}
              viewport={viewport}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductCard({ draft, displayThumbnail }: { 
  draft: ProductDraft; 
  displayThumbnail: string; 
}) {
  return (
    <div className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
      <div className="relative mb-3">
        <img 
          src={displayThumbnail} 
          alt={draft.title || 'Product'} 
          className="w-full aspect-square object-cover rounded-md"
        />
        {draft.status === 'draft' && (
          <Badge className="absolute top-2 right-2 bg-yellow-500">
            Draft
          </Badge>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2">
          {draft.title || 'Untitled Product'}
        </h3>
        
        {draft.shortDescription && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {draft.shortDescription}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">
            R {draft.price.toFixed(2)}
          </span>
          {draft.stock !== undefined && (
            <span className="text-xs text-gray-500">
              Stock: {draft.stock}
            </span>
          )}
        </div>
        
        {draft.badges && draft.badges.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {draft.badges.slice(0, 3).map((badge, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductPage({ 
  draft, 
  displayImages, 
  displayThumbnail, 
  viewport 
}: { 
  draft: ProductDraft; 
  displayImages: string[];
  displayThumbnail: string;
  viewport: 'desktop' | 'mobile';
}) {
  return (
    <div className={`p-4 ${viewport === 'desktop' ? 'md:p-6' : ''}`}>
      <div className={`grid gap-6 ${viewport === 'desktop' ? 'md:grid-cols-2' : ''}`}>
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative">
            <img 
              src={displayThumbnail} 
              alt={draft.title || 'Product'} 
              className="w-full aspect-square object-cover rounded-lg"
            />
            {draft.status === 'draft' && (
              <Badge className="absolute top-4 right-4 bg-yellow-500">
                Draft
              </Badge>
            )}
          </div>
          
          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {displayImages.slice(1, 5).map((img, i) => (
                <img 
                  key={i}
                  src={img} 
                  alt={`${draft.title} ${i + 2}`} 
                  className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold leading-tight">
                {draft.title || 'Untitled Product'}
              </h1>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            {draft.category && (
              <p className="text-sm text-gray-600 capitalize mb-2">
                Category: {draft.category}
              </p>
            )}
            
            {draft.sku && (
              <p className="text-sm text-gray-600 mb-2">
                SKU: {draft.sku}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold">
              R {draft.price.toFixed(2)}
            </div>
            {draft.stock !== undefined && (
              <p className="text-sm text-gray-600">
                {draft.stock > 0 ? `${draft.stock} in stock` : 'Out of stock'}
              </p>
            )}
          </div>

          {draft.badges && draft.badges.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {draft.badges.map((badge, i) => (
                <Badge key={i} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {draft.shortDescription && (
            <p className="text-gray-700 leading-relaxed">
              {draft.shortDescription}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button className="flex-1" disabled>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" disabled>
              Buy Now
            </Button>
          </div>

          {draft.tags && draft.tags.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Tags:</p>
              <div className="flex gap-2 flex-wrap">
                {draft.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {draft.descriptionHtml && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Description:</p>
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: draft.descriptionHtml }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}