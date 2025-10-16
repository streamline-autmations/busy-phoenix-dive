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
import ProductCardTemplate from '@/templates/ProductCard';
import ProductPageTemplate from '@/templates/ProductPage';
import { postJSON } from '@/lib/api';
import { env, optionalEnv } from '@/lib/env';
import { type ProductDraft, normalizeDraft, slugify, validateDraft } from '@/lib/productSchema';

export default function NewProductPage() {
  const [draft, setDraft] = useState<Partial<ProductDraft>>({
    title: '',
    price: 0,
    currency: 'ZAR',
    status: 'draft',
    images: [],
    tags: [],
    badges: [],
  });

  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

  const updateDraft = useCallback((updates: Partial<ProductDraft>) => {
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

  const sendTestWebhook = useCallback(async () => {
    setTesting(true);
    
    try {
      const testPayload = {
        source: 'owner_portal',
        action: 'create_or_update_product',
        draft: {
          title: 'Test Product - Sample Item',
          slug: 'test-product-sample-item',
          price: 299.99,
          currency: 'ZAR' as const,
          sku: 'TEST-001',
          status: 'draft' as const,
          stock: 10,
          category: 'electronics',
          tags: ['test', 'sample', 'electronics'],
          badges: ['New', 'Featured'],
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop'
          ],
          shortDescription: 'This is a test product created to verify the webhook integration is working correctly.',
          descriptionHtml: '<p>This is a <strong>test product</strong> with HTML formatting.</p><ul><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul>',
          templateType: 'product'
        },
        meta: {
          appVersion: optionalEnv.APP_VERSION,
          submittedAt: new Date().toISOString(),
          webhookUrl: env.N8N_WEBHOOK_URL,
          testMode: true,
        },
      };

      const result = await postJSON(env.N8N_WEBHOOK_URL, testPayload);
      
      toast.success('✅ Test webhook sent successfully!');
      console.log('✅ Test webhook response:', result);
      
    } catch (error) {
      console.error('❌ Test webhook failed:', error);
      toast.error(`Test webhook failed: ${error}`);
    } finally {
      setTesting(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    const normalizedDraft = normalizeDraft(draft);
    const errors = validateDraft(normalizedDraft);

    if (errors.length > 0) {
      toast.error(`Please fix the following errors:\n${errors.join('\n')}`);
      return;
    }

    setSubmitting(true);
    
    try {
      const payload = {
        source: 'owner_portal',
        action: 'create_or_update_product',
        draft: {
          ...normalizedDraft,
          templateType: 'product'
        },
        meta: {
          appVersion: optionalEnv.APP_VERSION,
          submittedAt: new Date().toISOString(),
          webhookUrl: env.N8N_WEBHOOK_URL,
        },
      };

      const result = await postJSON(env.N8N_WEBHOOK_URL, payload);
      
      toast.success('✅ Draft sent to n8n successfully!');
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
      });
      
    } catch (error) {
      console.error('❌ Webhook submission failed:', error);
      toast.error(`Submission failed: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }, [draft]);

  const normalizedDraft = normalizeDraft(draft);
  const isUploading = Object.values(uploading).some(Boolean);
  const canSubmit = !submitting && !isUploading && validateDraft(normalizedDraft).length === 0;

  // Create preview data for the templates
  const previewProduct = {
    id: 'preview',
    title: draft.title || 'Sample Product Title',
    price: draft.price || 99,
    originalPrice: undefined,
    currency: draft.currency || 'ZAR',
    image: draft.thumbnail || draft.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    images: draft.images?.length ? draft.images : undefined,
    rating: 4.5,
    reviews: 128,
    badges: draft.badges,
    category: draft.category,
    inStock: true,
    shortDescription: draft.shortDescription,
    descriptionHtml: draft.descriptionHtml,
    sku: draft.sku,
    tags: draft.tags
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-600">Create and preview your product before submitting to n8n</p>
          
          {/* Test Webhook Button */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Test Webhook Integration</h3>
                <p className="text-sm text-blue-700">Send a sample product to verify your n8n workflow</p>
              </div>
              <Button
                onClick={sendTestWebhook}
                disabled={testing}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Send Test
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter product title"
                    value={draft.title || ''}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="product-slug"
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
                      placeholder="0.00"
                      value={draft.price || ''}
                      onChange={(e) => updateDraft({ price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={draft.stock || ''}
                      onChange={(e) => updateDraft({ stock: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Product SKU"
                      value={draft.sku || ''}
                      onChange={(e) => updateDraft({ sku: e.target.value })}
                    />
                  </div>
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
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    placeholder="Brief product description"
                    rows={2}
                    value={draft.shortDescription || ''}
                    onChange={(e) => updateDraft({ shortDescription: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionHtml">Full Description (HTML allowed)</Label>
                  <Textarea
                    id="descriptionHtml"
                    placeholder="Detailed product description with HTML formatting"
                    rows={4}
                    value={draft.descriptionHtml || ''}
                    onChange={(e) => updateDraft({ descriptionHtml: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    📸 Add image URLs for preview
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Add Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
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
                          alt={`Gallery ${i + 1}`}
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

            {/* Tags & Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Tags & Badges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button onClick={addTag} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  {draft.tags && draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {draft.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Badges</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add badge (e.g., New, Sale, Featured)"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                    />
                    <Button onClick={addBadge} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  {draft.badges && draft.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {draft.badges.map((badge, i) => (
                        <Badge key={i} className="flex items-center gap-1">
                          {badge}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeBadge(badge)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
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
                  Submit to n8n
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
                <Tabs defaultValue="card" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card">Card Preview</TabsTrigger>
                    <TabsTrigger value="page">Page Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card" className="mt-4">
                    <div 
                      className={`border rounded-lg overflow-hidden bg-gray-50 p-4 ${
                        viewport === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                      }`}
                    >
                      <ProductCardTemplate product={previewProduct} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="page" className="mt-4">
                    <div 
                      className={`border rounded-lg overflow-hidden bg-white max-h-96 overflow-y-auto ${
                        viewport === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                      }`}
                    >
                      <div className="transform scale-75 origin-top">
                        <ProductPageTemplate product={previewProduct} />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}