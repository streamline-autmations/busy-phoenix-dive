import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Loader2, Send, Monitor, Smartphone, Minimize } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import FurnitureCardTemplate from '@/templates/FurnitureCard';
import FurniturePageTemplate from '@/templates/FurniturePage';
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

  const [submitting, setSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [previewFullscreen, setPreviewFullscreen] = useState(false);

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

  // Create preview data for the templates
  const previewFurniture = {
    id: 'preview',
    title: draft.title || 'Sample Furniture Title',
    price: draft.price || 999,
    originalPrice: draft.originalPrice,
    currency: draft.currency,
    image: draft.thumbnail || draft.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    images: draft.images?.length ? draft.images : undefined,
    dimensions: draft.dimensions,
    material: draft.material,
    finish: draft.finish,
    deliveryTime: draft.deliveryTime,
    badges: draft.badges,
    category: draft.category,
    inStock: true,
    shortDescription: draft.shortDescription,
    descriptionHtml: draft.descriptionHtml,
    sku: draft.sku,
    weight: draft.weight,
    assembly: draft.assembly,
    warranty: draft.warranty,
    careInstructions: draft.careInstructions
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <div className="container mx-auto p-6 flex flex-col flex-1">
        <h1 className="text-3xl font-bold mb-6">Add New Furniture</h1>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Form */}
          <div className="flex-1 max-w-full lg:max-w-lg overflow-auto">
            {/* Form content same as before */}
            <form className="space-y-6 max-w-full" onSubmit={(e) => e.preventDefault()}>
              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="title">Furniture Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Modern Oak Dining Table"
                  value={draft.title}
                  onChange={(e) => updateDraft({ title: e.target.value })}
                  required
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
                    required
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

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Brief furniture description"
                  rows={2}
                  value={draft.shortDescription || ''}
                  onChange={(e) => updateDraft({ shortDescription: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionHtml">Full Description (HTML allowed)</Label>
                <Textarea
                  id="descriptionHtml"
                  placeholder="Detailed furniture description with HTML formatting"
                  rows={4}
                  value={draft.descriptionHtml || ''}
                  onChange={(e) => updateDraft({ descriptionHtml: e.target.value })}
                />
              </div>

              {/* Dimensions */}
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

              {/* Images */}
              <div className="space-y-2">
                <Label>Images</Label>
                <div className="flex flex-wrap gap-2">
                  {draft.images?.map((url, i) => (
                    <div key={i} className="relative w-24 h-24">
                      <img
                        src={url}
                        alt={`Furniture ${i + 1}`}
                        className="w-full h-full object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => updateDraft({
                          images: draft.images?.filter((_, idx) => idx !== i)
                        })}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <Input
                  type="url"
                  placeholder="Add image URL and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const url = (e.target as HTMLInputElement).value.trim();
                      if (url) {
                        updateDraft({
                          images: [...(draft.images || []), url],
                          thumbnail: draft.thumbnail || url,
                        });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>

              {/* Tags & Badges */}
              <div className="space-y-4">
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button onClick={addTag} variant="outline">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {draft.tags?.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Badges</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add badge (e.g., New, Sale, Featured)"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                    />
                    <Button onClick={addBadge} variant="outline">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {draft.badges?.map((badge, i) => (
                      <Badge key={i} className="flex items-center gap-1">
                        {badge}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeBadge(badge)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

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
            </form>
          </div>

          {/* Preview */}
          <div
            className={`relative flex-1 bg-white border rounded-lg shadow-sm flex flex-col ${
              previewFullscreen ? "fixed inset-0 z-50 m-4 p-6 overflow-auto" : "max-h-[80vh]"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Live Preview</h2>
              <div className="flex gap-2">
                <Button
                  variant={viewport === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewport('desktop')}
                  aria-pressed={viewport === 'desktop'}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewport === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewport('mobile')}
                  aria-pressed={viewport === 'mobile'}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewFullscreen(!previewFullscreen)}
                  aria-label={previewFullscreen ? "Exit fullscreen preview" : "Enter fullscreen preview"}
                >
                  {previewFullscreen ? <Minimize className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <div 
                className={`border rounded-lg overflow-hidden bg-gray-50 p-4 ${
                  viewport === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                }`}
              >
                <FurnitureCardTemplate furniture={previewFurniture} />
              </div>
              <div 
                className={`border rounded-lg overflow-hidden bg-white max-h-96 overflow-y-auto mt-6 ${
                  viewport === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                }`}
              >
                <div className="transform scale-75 origin-top">
                  <FurniturePageTemplate furniture={previewFurniture} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}