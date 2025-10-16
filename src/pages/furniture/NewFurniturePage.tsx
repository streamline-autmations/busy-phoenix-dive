import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Loader2, Send, TestTube, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import FurnitureCardTemplate from '@/templates/FurnitureCard';
import { postJSON } from '@/lib/api';
import { env, optionalEnv } from '@/lib/env';
import { slugify } from '@/lib/slugify';

interface FurnitureDraft {
  title: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  sku?: string;
  status: 'draft' | 'active';
  category?: string;
  tags?: string[];
  badges?: string[];
  images: string[];
  thumbnail?: string;
  shortDescription?: string;
  descriptionHtml?: string;
  
  // Furniture-specific fields
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight?: number;
  material?: string;
  finish?: string;
  color?: string;
  style?: string;
  assembly?: 'required' | 'not_required' | 'partial';
  deliveryTime?: string;
  warranty?: string;
  careInstructions?: string;
}

export default function NewFurniturePage() {
  const [draft, setDraft] = useState<FurnitureDraft>({
    title: '',
    price: 0,
    currency: 'ZAR',
    status: 'draft',
    images: [],
    tags: [],
    badges: [],
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
      unit: 'cm'
    }
  });

  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

  const updateDraft = useCallback((updates: Partial<FurnitureDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const generateSlug = useCallback(() => {
    if (draft.title) {
      updateDraft({ slug: slugify(draft.title) });
    }
  }, [draft.title, updateDraft]);

  const addTag = useCallback(() => {
    if (newTag.trim() && !draft.tags?.includes(newTag.trim())) {
      updateDraft({ tags: [...(draft.tags || []), newTag.trim()] });
      setNewTag('');
    }
  }, [newTag, draft.tags, updateDraft]);

  const removeTag = useCallback((tagToRemove: string) => {
    updateDraft({ tags: draft.tags?.filter(tag => tag !== tagToRemove) });
  }, [draft.tags, updateDraft]);

  const addBadge = useCallback(() => {
    if (newBadge.trim() && !draft.badges?.includes(newBadge.trim())) {
      updateDraft({ badges: [...(draft.badges || []), newBadge.trim()] });
      setNewBadge('');
    }
  }, [newBadge, draft.badges, updateDraft]);

  const removeBadge = useCallback((badgeToRemove: string) => {
    updateDraft({ badges: draft.badges?.filter(badge => badge !== badgeToRemove) });
  }, [draft.badges, updateDraft]);

  const handleSubmit = useCallback(async () => {
    if (!draft.title || draft.price <= 0) {
      toast.error('Please fill in required fields (title and price)');
      return;
    }

    setSubmitting(true);
    
    try {
      const payload = {
        source: 'owner_portal',
        action: 'create_or_update_furniture',
        draft: {
          ...draft,
          slug: draft.slug || slugify(draft.title),
          thumbnail: draft.thumbnail || draft.images?.[0],
          templateType: 'furniture'
        },
        meta: {
          appVersion: optionalEnv.APP_VERSION,
          submittedAt: new Date().toISOString(),
          webhookUrl: env.N8N_WEBHOOK_URL,
        },
      };

      const result = await postJSON(env.N8N_WEBHOOK_URL, payload);
      
      toast.success('✅ Furniture draft sent to n8n successfully!');
      console.log('✅ Webhook response:', result);
      
      // Reset form
      setDraft({
        title: '',
        price: 0,
        currency: 'ZAR',
        status: 'draft',
        images: [],
        tags: [],
        badges: [],
        dimensions: {
          width: 0,
          height: 0,
          depth: 0,
          unit: 'cm'
        }
      });
      
    } catch (error) {
      console.error('❌ Webhook submission failed:', error);
      toast.error(`Submission failed: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }, [draft]);

  // Create preview data for the template
  const previewFurniture = {
    id: 'preview',
    title: draft.title || 'Sample Furniture Title',
    price: draft.price || 999,
    originalPrice: draft.originalPrice,
    currency: draft.currency,
    image: draft.thumbnail || draft.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    dimensions: draft.dimensions,
    material: draft.material,
    finish: draft.finish,
    deliveryTime: draft.deliveryTime,
    badges: draft.badges,
    category: draft.category,
    inStock: true
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Furniture</h1>
          <p className="text-gray-600">Create furniture products with specialized fields and preview</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Furniture Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Modern Oak Dining Table"
                    value={draft.title}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="modern-oak-dining-table"
                      value={draft.slug || ''}
                      onChange={(e) => updateDraft({ slug: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={generateSlug} variant="outline" className="w-full">
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ZAR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={draft.price || ''}
                      onChange={(e) => updateDraft({ price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (ZAR)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={draft.originalPrice || ''}
                      onChange={(e) => updateDraft({ originalPrice: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={draft.category || ''} 
                      onValueChange={(value) => updateDraft({ category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="living-room">Living Room</SelectItem>
                        <SelectItem value="bedroom">Bedroom</SelectItem>
                        <SelectItem value="dining-room">Dining Room</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="FUR-001"
                      value={draft.sku || ''}
                      onChange={(e) => updateDraft({ sku: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle>Dimensions & Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      min="0"
                      value={draft.dimensions?.width || ''}
                      onChange={(e) => updateDraft({
                        dimensions: { ...draft.dimensions!, width: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      min="0"
                      value={draft.dimensions?.height || ''}
                      onChange={(e) => updateDraft({
                        dimensions: { ...draft.dimensions!, height: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depth">Depth</Label>
                    <Input
                      id="depth"
                      type="number"
                      min="0"
                      value={draft.dimensions?.depth || ''}
                      onChange={(e) => updateDraft({
                        dimensions: { ...draft.dimensions!, depth: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select 
                      value={draft.dimensions?.unit || 'cm'} 
                      onValueChange={(value) => updateDraft({
                        dimensions: { ...draft.dimensions!, unit: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="inches">inches</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      placeholder="e.g., Solid Oak Wood"
                      value={draft.material || ''}
                      onChange={(e) => updateDraft({ material: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finish">Finish</Label>
                    <Input
                      id="finish"
                      placeholder="e.g., Natural Oil Finish"
                      value={draft.finish || ''}
                      onChange={(e) => updateDraft({ finish: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={draft.weight || ''}
                      onChange={(e) => updateDraft({ weight: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assembly">Assembly Required</Label>
                    <Select 
                      value={draft.assembly || ''} 
                      onValueChange={(value) => updateDraft({ assembly: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_required">No Assembly Required</SelectItem>
                        <SelectItem value="partial">Partial Assembly</SelectItem>
                        <SelectItem value="required">Full Assembly Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Delivery Time</Label>
                    <Input
                      id="deliveryTime"
                      placeholder="e.g., 2-4 weeks"
                      value={draft.deliveryTime || ''}
                      onChange={(e) => updateDraft({ deliveryTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warranty">Warranty</Label>
                    <Input
                      id="warranty"
                      placeholder="e.g., 5 year warranty"
                      value={draft.warranty || ''}
                      onChange={(e) => updateDraft({ warranty: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    📸 Add furniture image URLs for preview
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Add Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/furniture-image.jpg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const url = (e.target as HTMLInputElement).value.trim();
                          if (url) {
                            updateDraft({ 
                              images: [...(draft.images || []), url],
                              thumbnail: draft.thumbnail || url
                            });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('imageUrl') as HTMLInputElement;
                        const url = input.value.trim();
                        if (url) {
                          updateDraft({ 
                            images: [...(draft.images || []), url],
                            thumbnail: draft.thumbnail || url
                          });
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {draft.images && draft.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {draft.images.map((url, i) => (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          alt={`Furniture ${i + 1}`}
                          className="w-full aspect-square object-cover rounded border"
                        />
                        <button
                          onClick={() => updateDraft({
                            images: draft.images?.filter((_, idx) => idx !== i)
                          })}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting to n8n...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Furniture to n8n
                </>
              )}
            </Button>
          </div>

          {/* Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Live Preview
                  <div className="flex gap-2">
                    <Button
                      variant={viewport === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewport('desktop')}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewport === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewport('mobile')}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className={`border rounded-lg overflow-hidden bg-gray-50 p-4 ${
                    viewport === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                  }`}
                >
                  <FurnitureCardTemplate furniture={previewFurniture} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}